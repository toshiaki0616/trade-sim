#!/usr/bin/env python3
"""smart_organizer.py — 高機能・安全設計の対話型ファイル整理ツール

PARAメソッド / Johnny.Decimal を参考にした分類体系と
ドライラン・Undo・重複チェック機能を備えたファイルオーガナイザー。

依存ライブラリ:
    pip install rich questionary
    pip install blake3      # オプション (未インストール時は MD5 を使用)
    pip install send2trash  # オプション (削除機能を使う場合)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import sys
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

# Windows で UTF-8 出力を強制 (cp932 では一部 Unicode 文字が表示できないため)
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")  # type: ignore
    except (AttributeError, OSError):
        pass

# ──────────────────────────────────────────────────────────────────
# 外部ライブラリ (インストール確認)
# ──────────────────────────────────────────────────────────────────

def _require(package: str, install_name: str | None = None) -> None:
    import importlib.util
    if importlib.util.find_spec(package) is None:
        name = install_name or package
        print(f"[ERROR] '{package}' が見つかりません。  pip install {name}  を実行してください。")
        sys.exit(1)

_require("rich")
_require("questionary")

import questionary
from questionary import Style as QStyle
from rich.console import Console
from rich.panel import Panel
from rich.progress import BarColumn, Progress, SpinnerColumn, TaskProgressColumn, TextColumn
from rich.prompt import Confirm
from rich.table import Table

# force_terminal=True で Windows レガシー API を回避し VT100/ANSI を使用
console = Console(force_terminal=True, highlight=False)

# BLAKE3 はオプション (未インストール時は MD5 を使用)
try:
    import blake3 as _blake3_mod  # type: ignore
    _USE_BLAKE3 = True
except ImportError:
    _USE_BLAKE3 = False

HASH_ALGO = "BLAKE3" if _USE_BLAKE3 else "MD5"

# send2trash はオプション (削除機能で使用)
try:
    import send2trash as _send2trash  # type: ignore
    _HAS_SEND2TRASH = True
except ImportError:
    _HAS_SEND2TRASH = False

# ──────────────────────────────────────────────────────────────────
# UI スタイル (questionary)
# ──────────────────────────────────────────────────────────────────

CUSTOM_STYLE = QStyle([
    ("qmark",       "fg:#e5c07b bold"),
    ("question",    "fg:#61afef bold"),
    ("answer",      "fg:#98c379 bold"),
    ("pointer",     "fg:#e06c75 bold"),
    ("highlighted", "fg:#e06c75 bold"),
    ("selected",    "fg:#98c379"),
    ("separator",   "fg:#5c6370"),
    ("instruction", "fg:#5c6370"),
])

# ──────────────────────────────────────────────────────────────────
# ユーザー設定変数 (ここをカスタマイズしてください)
# ──────────────────────────────────────────────────────────────────

# 除外する拡張子 (システム・プログラムファイル)
EXCLUDED_EXTENSIONS: set[str] = {
    ".py", ".pyc", ".pyo", ".pyd", ".pyw",
    ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd",
    ".exe", ".dll", ".so", ".dylib",
    ".env", ".envrc",
    ".db", ".sqlite", ".sqlite3",
    ".git",
}

# 除外するフォルダ名 (スキャン対象外)
EXCLUDED_DIR_NAMES: set[str] = {
    ".git", ".svn", ".hg", ".bzr",
    "__pycache__", ".venv", "venv", "env",
    "node_modules", ".tox", ".mypy_cache",
    # 整理トレイ自体は除外 (ループを防ぐ)
    "整理トレイ",
}

# 除外するファイル名 (完全一致)
EXCLUDED_FILENAMES: set[str] = {
    ".DS_Store", "Thumbs.db", "desktop.ini",
    ".gitignore", ".gitattributes", ".gitmodules",
    "CLAUDE.md",
}

# 分類先カテゴリ定義 (PARAメソッド + 拡張)
# キー: 選択肢ラベル, 値: (フォルダ名, 説明)
# "__DELETE__" / "__SKIP__" は特殊アクション
CATEGORIES: dict[str, tuple[str, str]] = {
    "[P] Projects  - 進行中プロジェクト":    ("Projects",   "締切のある作業・プロジェクト"),
    "[A] Areas     - 継続的責任領域":        ("Areas",      "維持管理が必要な生活・仕事領域"),
    "[R] Resources - 参考・学習資料":        ("Resources",  "将来役立つかもしれない資料"),
    "[X] Archives  - 完了・保管":            ("Archives",   "完了した・念のため保管しておくもの"),
    "[I] Media     - 画像・動画・音声":      ("Media",      "メディアファイル"),
    "[D] Documents - 文書・PDF・表計算":    ("Documents",  "オフィス系ドキュメント"),
    "[C] Data      - データ・CSV・JSON":    ("Data",       "データファイル・ログ"),
    "[T] Tools     - ツール・設定ファイル": ("Tools",      "ユーティリティ・設定ファイル"),
    "[!] 削除 (ゴミ箱へ)":                   ("__DELETE__", ""),
    "[>] スキップ (処理しない)":              ("__SKIP__",   ""),
}

# Undo ログの保存先
UNDO_LOG_DIR: Path = Path.home() / ".smart_organizer" / "undo_logs"

# ──────────────────────────────────────────────────────────────────
# データクラス
# ──────────────────────────────────────────────────────────────────

@dataclass
class FileOp:
    """1件のファイル操作計画"""
    src: Path
    dst: Path | None   # None = 削除 or スキップ
    action: str        # "move" | "delete" | "skip"
    category: str = ""
    new_name: str = ""


@dataclass
class UndoEntry:
    """Undo 用の操作記録"""
    action: str     # "moved"
    original: str   # 操作前のパス
    current: str    # 操作後のパス
    timestamp: str

# ──────────────────────────────────────────────────────────────────
# Undo ログ管理
# ──────────────────────────────────────────────────────────────────

class UndoManager:
    def __init__(self, session_id: str) -> None:
        self.session_id = session_id
        self.entries: list[UndoEntry] = []
        UNDO_LOG_DIR.mkdir(parents=True, exist_ok=True)
        self.log_path = UNDO_LOG_DIR / f"undo_{session_id}.json"

    def record(self, original: Path, current: Path) -> None:
        self.entries.append(UndoEntry(
            action="moved",
            original=str(original),
            current=str(current),
            timestamp=datetime.now().isoformat(),
        ))

    def save(self) -> None:
        data = {
            "session_id": self.session_id,
            "created_at": datetime.now().isoformat(),
            "operations": [
                {
                    "action": e.action,
                    "original": e.original,
                    "current": e.current,
                    "timestamp": e.timestamp,
                }
                for e in self.entries
            ],
        }
        self.log_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        console.print(f"\n[dim]Undo ログを保存しました: {self.log_path}[/dim]")

    @staticmethod
    def list_sessions() -> list[Path]:
        if not UNDO_LOG_DIR.exists():
            return []
        return sorted(UNDO_LOG_DIR.glob("undo_*.json"), reverse=True)

    @staticmethod
    def load_session(log_path: Path) -> dict:
        return json.loads(log_path.read_text(encoding="utf-8"))

# ──────────────────────────────────────────────────────────────────
# ハッシュ計算ユーティリティ
# ──────────────────────────────────────────────────────────────────

_CHUNK_SIZE = 65536  # 64 KB

def compute_file_hash(file_path: Path) -> str:
    """BLAKE3 優先、未インストール時は MD5 でファイルハッシュを計算"""
    if _USE_BLAKE3:
        hasher = _blake3_mod.blake3()  # type: ignore
    else:
        hasher = hashlib.md5()

    with open(file_path, "rb") as fh:
        while chunk := fh.read(_CHUNK_SIZE):
            hasher.update(chunk)

    return hasher.hexdigest()

# ──────────────────────────────────────────────────────────────────
# ファイル操作ユーティリティ
# ──────────────────────────────────────────────────────────────────

def resolve_name_conflict(dst: Path) -> Path:
    """移動先に同名ファイルが存在する場合、連番サフィックスで回避する"""
    if not dst.exists():
        return dst
    stem, suffix = dst.stem, dst.suffix
    counter = 1
    candidate = dst
    while candidate.exists():
        candidate = dst.parent / f"{stem}_{counter:02d}{suffix}"
        counter += 1
    return candidate


def atomic_move(src: Path, dst: Path) -> Path:
    """安全なアトミックファイル移動。移動後の実際のパスを返す。

    手順:
      1. os.rename を試みる (同一 FS なら真にアトミック)
      2. 失敗時 (クロスデバイス等) は
         a. 一時ファイルへ copy2
         b. ハッシュ検証
         c. 一時ファイル → dst にリネーム
         d. src を削除
    """
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst = resolve_name_conflict(dst)

    # --- 同一 FS の場合はアトミックリネーム ---
    try:
        os.rename(src, dst)
        return dst
    except OSError:
        pass

    # --- クロスデバイス移動: コピー → 検証 → リネーム → 削除 ---
    tmp_path = dst.parent / f".tmp_{os.getpid()}_{uuid.uuid4().hex[:8]}"
    try:
        shutil.copy2(src, tmp_path)

        src_hash = compute_file_hash(src)
        tmp_hash = compute_file_hash(tmp_path)
        if src_hash != tmp_hash:
            raise RuntimeError(
                f"コピー検証失敗 (ハッシュ不一致): {src} → {tmp_path}"
            )

        os.rename(tmp_path, dst)
        os.remove(src)
        return dst

    except Exception:
        if tmp_path.exists():
            tmp_path.unlink(missing_ok=True)
        raise

# ──────────────────────────────────────────────────────────────────
# ファイルスキャン
# ──────────────────────────────────────────────────────────────────

def scan_files(folder: Path) -> list[Path]:
    """除外条件に従いフォルダを再帰スキャンし、ファイルリストを返す"""
    found: list[Path] = []
    for item in folder.rglob("*"):
        if not item.is_file():
            continue
        # 除外フォルダに含まれる場合はスキップ
        relative_parts = item.relative_to(folder).parts
        if any(part in EXCLUDED_DIR_NAMES for part in relative_parts[:-1]):
            continue
        # 除外拡張子
        if item.suffix.lower() in EXCLUDED_EXTENSIONS:
            continue
        # 除外ファイル名
        if item.name in EXCLUDED_FILENAMES:
            continue
        found.append(item)
    return sorted(found)

# ──────────────────────────────────────────────────────────────────
# 重複チェック
# ──────────────────────────────────────────────────────────────────

def find_duplicates(files: list[Path]) -> dict[str, list[Path]]:
    """ハッシュ値で重複ファイルを検出。重複グループのみ返す。"""
    hash_map: dict[str, list[Path]] = {}
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console,
    ) as progress:
        task = progress.add_task(
            f"[cyan]ハッシュ計算中 ({HASH_ALGO})...", total=len(files)
        )
        for f in files:
            file_hash = compute_file_hash(f)
            hash_map.setdefault(file_hash, []).append(f)
            progress.advance(task)

    return {h: paths for h, paths in hash_map.items() if len(paths) > 1}

# ──────────────────────────────────────────────────────────────────
# ファイル日付取得
# ──────────────────────────────────────────────────────────────────

def get_file_creation_date(file_path: Path) -> str:
    """ファイルの作成日を YYYYMMDD 形式で返す"""
    stat = file_path.stat()
    # Windows: st_ctime = 作成日時 / Unix: st_birthtime or st_mtime
    if sys.platform == "win32":
        timestamp = stat.st_ctime
    else:
        timestamp = getattr(stat, "st_birthtime", stat.st_mtime)
    return datetime.fromtimestamp(timestamp).strftime("%Y%m%d")


def format_file_size(size_bytes: int) -> str:
    """バイト数を人間可読な文字列に変換"""
    for unit in ("B", "KB", "MB", "GB"):
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes //= 1024  # type: ignore
    return f"{size_bytes:.1f} TB"

# ──────────────────────────────────────────────────────────────────
# UI コンポーネント
# ──────────────────────────────────────────────────────────────────

def show_banner() -> None:
    console.print(Panel.fit(
        "[bold cyan]Smart Organizer[/bold cyan]  [dim]v1.0[/dim]\n"
        "[dim]PARAメソッド準拠 | ドライラン・Undo・重複チェック対応[/dim]",
        border_style="bright_blue",
        padding=(0, 2),
    ))
    console.print()


def show_dry_run_table(ops: list[FileOp]) -> None:
    """実行予定の操作を rich テーブルで表示する"""
    table = Table(
        title="[bold yellow]実行予定の操作 (ドライラン確認)[/bold yellow]",
        show_header=True,
        header_style="bold magenta",
        border_style="yellow",
        show_lines=True,
    )
    table.add_column("No.", style="dim", width=4, justify="right")
    table.add_column("操作",   width=8,  justify="center")
    table.add_column("移動前 (現在のパス)", style="cyan",  min_width=30)
    table.add_column("移動後 (新しいパス)", style="green", min_width=30)

    ACTION_LABEL = {
        "move":   "[green]MOVE[/green]",
        "delete": "[red]DELETE[/red]",
        "skip":   "[dim]SKIP[/dim]",
    }

    for i, op in enumerate(ops, 1):
        action_display = ACTION_LABEL.get(op.action, op.action)
        dst_display    = str(op.dst) if op.dst else "—"
        table.add_row(str(i), action_display, str(op.src), dst_display)

    console.print()
    console.print(table)

    move_count   = sum(1 for op in ops if op.action == "move")
    delete_count = sum(1 for op in ops if op.action == "delete")
    skip_count   = sum(1 for op in ops if op.action == "skip")
    console.print(
        f"\n  [bold]合計:[/bold]  "
        f"[green]移動 {move_count} 件[/green]  "
        f"[red]削除 {delete_count} 件[/red]  "
        f"[dim]スキップ {skip_count} 件[/dim]"
    )
    console.print()

# ──────────────────────────────────────────────────────────────────
# Undo 実行
# ──────────────────────────────────────────────────────────────────

def run_undo(log_file_arg: str | None) -> None:
    """指定セッション (省略時は選択) の操作を逆順で元に戻す"""
    sessions = UndoManager.list_sessions()
    if not sessions:
        console.print("[red]Undo ログが見つかりません。[/red]")
        return

    if log_file_arg and log_file_arg != "latest":
        log_path = Path(log_file_arg)
    else:
        choices = [str(s) for s in sessions[:10]]
        if len(choices) == 1:
            log_path = Path(choices[0])
        else:
            selected = questionary.select(
                "元に戻すセッションを選択してください:",
                choices=choices,
                style=CUSTOM_STYLE,
            ).ask()
            if not selected:
                return
            log_path = Path(selected)

    session_data = UndoManager.load_session(log_path)
    ops = session_data.get("operations", [])

    if not ops:
        console.print("[yellow]操作記録がありません。[/yellow]")
        return

    console.print(f"\n[bold]セッション:[/bold] {session_data['session_id']}")
    console.print(f"[bold]実行日時  :[/bold] {session_data['created_at']}")
    console.print(f"[bold]操作件数  :[/bold] {len(ops)} 件\n")

    table = Table(
        title="[yellow]元に戻す操作 (逆順)[/yellow]",
        border_style="yellow",
        show_lines=True,
    )
    table.add_column("元の場所 (復元先)", style="green")
    table.add_column("現在の場所 (移動元)", style="cyan")
    for op in reversed(ops):
        table.add_row(op["original"], op["current"])
    console.print(table)

    if not Confirm.ask("\nこれらの操作を元に戻しますか?"):
        console.print("[dim]キャンセルしました。[/dim]")
        return

    error_count = 0
    for op in reversed(ops):
        src = Path(op["current"])
        dst = Path(op["original"])
        if not src.exists():
            console.print(f"  [yellow]SKIP[/yellow] (見つからない): {src}")
            continue
        try:
            atomic_move(src, dst)
            console.print(f"  [green]RESTORED[/green] {src.name} → {dst.parent}")
        except Exception as exc:
            console.print(f"  [red]ERROR[/red] {src}: {exc}")
            error_count += 1

    if error_count == 0:
        log_path.unlink(missing_ok=True)
        console.print(f"\n[bold green]完了![/bold green] Undo ログを削除しました。")
    else:
        console.print(
            f"\n[yellow]{error_count} 件のエラーが発生しました。"
            "ログは保持されます。[/yellow]"
        )

# ──────────────────────────────────────────────────────────────────
# ワークフロー: フォルダ・出力先選択
# ──────────────────────────────────────────────────────────────────

def select_target_folder() -> Path:
    """整理したいフォルダをユーザーに入力させる"""
    console.print("[bold]整理したいフォルダのパスを入力してください。[/bold]")
    console.print("[dim](Tab キーでパス補完が使えます)[/dim]\n")

    while True:
        raw = questionary.path(
            "対象フォルダ:",
            only_directories=True,
            style=CUSTOM_STYLE,
        ).ask()

        if raw is None:
            console.print("[yellow]キャンセルされました。[/yellow]")
            sys.exit(0)

        folder = Path(raw).expanduser().resolve()
        if folder.is_dir():
            return folder

        console.print(f"[red]エラー: '{folder}' はフォルダではありません。[/red]\n")


def select_output_base(source_folder: Path) -> Path:
    """整理先ベースフォルダをユーザーに選択させる"""
    default = source_folder.parent / "整理済み"
    raw = questionary.path(
        f"整理先のベースフォルダ (Enter で {default}):",
        default=str(default),
        only_directories=False,
        style=CUSTOM_STYLE,
    ).ask()

    path = Path(raw).expanduser().resolve() if raw else default
    path.mkdir(parents=True, exist_ok=True)
    return path

# ──────────────────────────────────────────────────────────────────
# ワークフロー: 整理トレイへ集約
# ──────────────────────────────────────────────────────────────────

def stage_files(
    files: list[Path],
    source_folder: Path,
    undo_manager: UndoManager,
) -> Path:
    """ファイルを「整理トレイ_日付」へ集約し、トレイフォルダのパスを返す"""
    date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    tray_path = source_folder.parent / f"整理トレイ_{date_str}"
    tray_path.mkdir(parents=True, exist_ok=True)

    console.print(f"\n[cyan]整理トレイを作成しました:[/cyan] {tray_path}\n")

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console,
    ) as progress:
        task = progress.add_task("[cyan]整理トレイへ集約中...", total=len(files))
        for file_path in files:
            dst = tray_path / file_path.name
            actual_dst = atomic_move(file_path, dst)
            undo_manager.record(file_path, actual_dst)
            progress.advance(task)

    console.print(f"[green]{len(files)} 件を整理トレイへ集約しました。[/green]")
    return tray_path

# ──────────────────────────────────────────────────────────────────
# ワークフロー: 重複ファイル処理
# ──────────────────────────────────────────────────────────────────

def handle_duplicates(files: list[Path]) -> list[Path]:
    """重複ファイルを検出し、保持するファイルのリストを返す"""
    console.print("\n[bold cyan]重複チェックを実行中...[/bold cyan]")
    duplicates = find_duplicates(files)

    if not duplicates:
        console.print("[green]重複ファイルは見つかりませんでした。[/green]")
        return files

    console.print(
        f"\n[yellow]{len(duplicates)} グループの重複ファイルが見つかりました。[/yellow]"
    )

    to_skip: set[Path] = set()

    for hash_val, dup_paths in duplicates.items():
        console.rule(f"[dim]ハッシュ: {hash_val[:20]}...[/dim]")
        for i, p in enumerate(dup_paths):
            size = format_file_size(p.stat().st_size)
            date = get_file_creation_date(p)
            marker = "  [green]← 保持候補[/green]" if i == 0 else ""
            console.print(f"  [{i + 1}] {p.name}  ({size} / {date}){marker}")

        choices = [
            *[f"[{i + 1}] {p.name}" for i, p in enumerate(dup_paths)],
            "全て保持",
        ]
        choice = questionary.select(
            "どのファイルを保持しますか?",
            choices=choices,
            style=CUSTOM_STYLE,
        ).ask()

        if choice is None or "全て保持" in choice:
            continue

        keep_idx = int(choice[1]) - 1
        for i, p in enumerate(dup_paths):
            if i != keep_idx:
                to_skip.add(p)

    return [f for f in files if f not in to_skip]

# ──────────────────────────────────────────────────────────────────
# ワークフロー: 処理モード選択
# ──────────────────────────────────────────────────────────────────

def select_processing_mode() -> str:
    """処理モード (A/B/C) をユーザーに選択させる"""
    result = questionary.select(
        "処理モードを選択してください:",
        choices=[
            questionary.Choice(
                title="[A] 個別リネーム  — ファイルごとに名前を指定 (作成日がデフォルト)",
                value="A",
            ),
            questionary.Choice(
                title="[B] 日付一括付与  — YYYYMMDD_ を全ファイルの先頭に自動付与",
                value="B",
            ),
            questionary.Choice(
                title="[C] そのまま移動  — ファイル名変更なし",
                value="C",
            ),
        ],
        style=CUSTOM_STYLE,
    ).ask()
    return result or "C"

# ──────────────────────────────────────────────────────────────────
# ワークフロー: ファイル個別処理
# ──────────────────────────────────────────────────────────────────

def process_single_file(
    file_path: Path,
    mode: str,
    output_base: Path,
    file_index: int,
    total_files: int,
) -> FileOp | None:
    """1ファイルの処理内容を対話的に決定し FileOp を返す"""
    console.rule(
        f"[dim]ファイル {file_index} / {total_files}[/dim]"
    )
    stat = file_path.stat()
    creation_date = get_file_creation_date(file_path)
    console.print(
        f"  [bold cyan]{file_path.name}[/bold cyan]  "
        f"[dim]{format_file_size(stat.st_size)} / {creation_date}[/dim]"
    )

    # カテゴリ選択
    category_label = questionary.select(
        "  仕分け先を選択:",
        choices=list(CATEGORIES.keys()),
        style=CUSTOM_STYLE,
    ).ask()

    if category_label is None:
        return None

    folder_name, _ = CATEGORIES[category_label]

    if folder_name == "__SKIP__":
        return FileOp(src=file_path, dst=None, action="skip", category="skip")

    if folder_name == "__DELETE__":
        return FileOp(src=file_path, dst=None, action="delete", category="delete")

    # リネーム処理
    if mode == "A":
        default_name = f"{creation_date}_{file_path.name}"
        new_name = questionary.text(
            "  新しいファイル名:",
            default=default_name,
            style=CUSTOM_STYLE,
        ).ask()
        new_name = new_name.strip() if new_name else file_path.name
    elif mode == "B":
        new_name = f"{creation_date}_{file_path.name}"
        console.print(f"  [dim]→ {new_name}[/dim]")
    else:
        new_name = file_path.name

    dst = output_base / folder_name / new_name
    return FileOp(
        src=file_path,
        dst=dst,
        action="move",
        category=folder_name,
        new_name=new_name,
    )

# ──────────────────────────────────────────────────────────────────
# ワークフロー: 操作実行
# ──────────────────────────────────────────────────────────────────

def execute_operations(
    ops: list[FileOp],
    undo_manager: UndoManager,
    tray_folder: Path,
) -> None:
    """承認済みの操作を実行する"""
    move_ops   = [op for op in ops if op.action == "move"]
    delete_ops = [op for op in ops if op.action == "delete"]
    skip_ops   = [op for op in ops if op.action == "skip"]

    # ── 移動 ──
    if move_ops:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            task = progress.add_task("[green]ファイルを移動中...", total=len(move_ops))
            for op in move_ops:
                assert op.dst is not None
                actual_dst = atomic_move(op.src, op.dst)
                undo_manager.record(op.src, actual_dst)
                progress.advance(task)

    # ── 削除 ──
    if delete_ops:
        if _HAS_SEND2TRASH:
            for op in delete_ops:
                try:
                    _send2trash.send2trash(str(op.src))  # type: ignore
                    console.print(f"  [red]DELETE[/red] {op.src.name} → ゴミ箱")
                except Exception as exc:
                    console.print(f"  [red]削除エラー:[/red] {exc}")
        else:
            console.print(
                "[yellow]send2trash が未インストールのため削除をスキップしました。"
                "  pip install send2trash[/yellow]"
            )

    console.print(
        f"\n[bold green]完了![/bold green]  "
        f"移動: {len(move_ops)} 件 / "
        f"削除: {len(delete_ops)} 件 / "
        f"スキップ: {len(skip_ops)} 件"
    )

    # トレイが空になった場合は削除を提案
    remaining_files = [f for f in tray_folder.rglob("*") if f.is_file()]
    if not remaining_files and tray_folder.exists():
        if Confirm.ask(
            f"\n整理トレイ '[cyan]{tray_folder.name}[/cyan]' が空になりました。削除しますか?"
        ):
            shutil.rmtree(tray_folder)
            console.print(f"[dim]'{tray_folder.name}' を削除しました。[/dim]")

# ──────────────────────────────────────────────────────────────────
# 引数パーサー
# ──────────────────────────────────────────────────────────────────

def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="smart_organizer",
        description="PARAメソッド準拠の対話型ファイル整理ツール",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python smart_organizer.py               # 通常起動
  python smart_organizer.py --dry-run     # 実行計画だけ確認
  python smart_organizer.py --no-stage    # 整理トレイをスキップ
  python smart_organizer.py --undo        # 最新セッションを元に戻す
  python smart_organizer.py --undo undo_20240101_120000_abc123.json
""",
    )
    parser.add_argument(
        "--undo",
        nargs="?",
        const="latest",
        metavar="LOG_FILE",
        help="操作を元に戻す (省略時は最新セッションを選択)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="実際には移動せず、実行計画のみを表示する",
    )
    parser.add_argument(
        "--no-stage",
        action="store_true",
        help="整理トレイへの中間集約をスキップし、直接仕分けする",
    )
    return parser

# ──────────────────────────────────────────────────────────────────
# エントリポイント
# ──────────────────────────────────────────────────────────────────

def main() -> None:
    parser = build_arg_parser()
    args = parser.parse_args()

    show_banner()

    # ── Undo モード ──
    if args.undo is not None:
        run_undo(args.undo)
        return

    # セッション ID (Undo ログの識別子)
    session_id = datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:6]
    undo_manager = UndoManager(session_id)

    # ── フォルダ選択 ──
    target_folder = select_target_folder()
    console.print(f"\n[bold]対象フォルダ:[/bold] {target_folder}")

    # ── ファイルスキャン ──
    console.print("\n[cyan]ファイルをスキャン中...[/cyan]")
    files = scan_files(target_folder)
    if not files:
        console.print("[yellow]対象ファイルが見つかりませんでした。[/yellow]")
        return
    console.print(f"[green]{len(files)} 件のファイルが見つかりました。[/green]\n")

    # ── 整理トレイへ集約 ──
    if args.no_stage:
        work_folder = target_folder
        work_files  = files
    else:
        if Confirm.ask(
            f"まず {len(files)} 件を [cyan]整理トレイ[/cyan] へ集約しますか?"
            "\n  (スキップする場合は対象フォルダから直接仕分けします)"
        ):
            work_folder = stage_files(files, target_folder, undo_manager)
            work_files  = scan_files(work_folder)
        else:
            work_folder = target_folder
            work_files  = files

    # ── 重複チェック ──
    work_files = handle_duplicates(work_files)
    if not work_files:
        console.print("[yellow]処理対象ファイルがなくなりました。[/yellow]")
        return

    # ── 整理先ベースフォルダ ──
    console.print()
    output_base = select_output_base(target_folder)
    console.print(f"[bold]整理先  :[/bold] {output_base}\n")

    # ── 処理モード選択 ──
    mode = select_processing_mode()
    console.print()

    # ── 各ファイルの処理内容を対話決定 ──
    planned_ops: list[FileOp] = []
    for i, file_path in enumerate(work_files, 1):
        op = process_single_file(file_path, mode, output_base, i, len(work_files))
        if op is not None:
            planned_ops.append(op)

    if not planned_ops:
        console.print("[yellow]処理対象がありません。[/yellow]")
        return

    # ── ドライラン表示 ──
    show_dry_run_table(planned_ops)

    if args.dry_run:
        console.print(
            "[yellow]--dry-run モード: 実際の移動はスキップします。[/yellow]"
        )
        return

    # ── 最終承認 ──
    if not Confirm.ask("[bold yellow]上記の操作を実行しますか?[/bold yellow]"):
        console.print("[dim]キャンセルされました。変更はありません。[/dim]")
        return

    # ── 実行 ──
    execute_operations(planned_ops, undo_manager, work_folder)
    undo_manager.save()


if __name__ == "__main__":
    main()
