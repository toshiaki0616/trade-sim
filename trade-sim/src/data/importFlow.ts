import type { Step } from '../types'

export const importFlow: Step[] = [
  {
    id: 'import-01',
    stepNumber: 1,
    title: '到着通知（Arrival Notice）の受領',
    description:
      '船会社・フォワーダーから到着通知（Arrival Notice）が届きました。貨物がX港に到着予定です。最初に何をすべきでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '到着通知の内容（B/L番号・品名・数量）を確認し、取引先の発注内容と照合する',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'すぐに税関へ輸入申告を行う',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '倉庫に貨物の引取りを依頼する',
        isCorrect: false,
      },
    ],
    explanation:
      '到着通知を受けたら、まず内容（B/L番号・品名・数量・船名・到着日）を確認し、発注内容と一致しているか照合します。不一致があれば早急に取引先へ連絡が必要です。税関申告は書類一式が揃ってから行います。',
  },
  {
    id: 'import-02',
    stepNumber: 2,
    title: '輸入書類の確認',
    description:
      '以下の書類が届きました。内容に不備がないか確認してください。不備のある項目をすべて見つけてください。',
    type: 'document-check',
    documents: [
      {
        id: 'doc-invoice-date',
        label: 'Commercial Invoice - 日付',
        value: '2026年2月30日',
        hasError: true,
        errorHint: '2月30日は存在しない日付です',
      },
      {
        id: 'doc-invoice-amount',
        label: 'Commercial Invoice - 金額',
        value: 'USD 15,000.00',
        hasError: false,
      },
      {
        id: 'doc-pl-qty',
        label: 'Packing List - 数量',
        value: '100 cartons',
        hasError: false,
      },
      {
        id: 'doc-bl-consignee',
        label: 'Bill of Lading - 荷受人（Consignee）',
        value: '（空欄）',
        hasError: true,
        errorHint: 'ConsigneeはB/Lの必須記載事項です',
      },
      {
        id: 'doc-co-country',
        label: '原産地証明書 - 原産国',
        value: 'Made in Vietnam',
        hasError: false,
      },
    ],
    explanation:
      '不備は2点です。①Commercial Invoice の日付「2月30日」は存在しない日付のため無効です。②Bill of LadingのConsignee（荷受人）が空欄では貨物の引取りができません。発行元に訂正・再発行を依頼してください。',
  },
  {
    id: 'import-03',
    stepNumber: 3,
    title: 'HSコードと関税率の確認',
    description:
      '輸入する商品は「綿製のTシャツ（メンズ用）」です。関税率を調べる際、正しい手順はどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '税関のWebサイト（実行関税率表）でHSコードを調べ、適用税率を確認する',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '前回輸入した時の関税率をそのまま使う',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '関税はかからないので確認不要',
        isCorrect: false,
      },
    ],
    explanation:
      '綿製メンズTシャツのHSコードは 6109.10（HS6桁）です。関税率は実行関税率表で確認します。税率は変更されることがあるため、毎回最新情報を確認することが重要です。EPAや特恵関税が適用できる場合は原産地証明書を活用して税率を下げられます。',
  },
  {
    id: 'import-04',
    stepNumber: 4,
    title: '関税・消費税の計算',
    description:
      'CIF価格 USD 15,000、適用為替レート 1USD = 150円、関税率 10.9%（一般税率）として関税額を計算してください。正しい計算式はどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: 'CIF円換算額（15,000 × 150 = 2,250,000円）× 10.9% = 245,250円',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'USD 15,000 × 10.9% = USD 1,635',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '(CIF + 運賃) × 10.9%',
        isCorrect: false,
      },
    ],
    explanation:
      '関税の課税標準はCIF価格の円換算額です。USD 15,000 × 150円 = 2,250,000円。関税額 = 2,250,000 × 10.9% = 245,250円。さらに消費税は（CIF円換算 + 関税）× 10% = (2,250,000 + 245,250) × 10% = 249,525円となります。',
  },
  {
    id: 'import-05',
    stepNumber: 5,
    title: '輸入申告',
    description:
      '必要書類が揃い、輸入申告を行います。日本の輸入通関申告はどのシステムで行いますか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: 'NACCS（輸出入・港湾関連情報処理システム）',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '税務署のe-Tax',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '書面申告のみで電子申告は不可',
        isCorrect: false,
      },
    ],
    explanation:
      '日本の輸出入通関はNACCS（Nippon Automated Cargo and Port Consolidated System）を通じて電子申告します。通関業者がNACCSを使って申告書を送信し、税関が審査します。審査方式にはC（即時許可）・B（書類審査）・A（現品検査）があります。',
  },
  {
    id: 'import-06',
    stepNumber: 6,
    title: '税関審査・輸入許可',
    description:
      '税関から「B審査（書類審査）」の通知が来ました。追加で提出を求められた書類はどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '原産地証明書の原本と、インボイスの原本',
        isCorrect: true,
      },
      {
        id: 'b',
        label: '輸出者の会社登記簿謄本',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '銀行の送金明細書',
        isCorrect: false,
      },
    ],
    explanation:
      'B審査では税関審査官が申告内容を書類で確認します。特恵関税（EPA適用）を申請している場合は原産地証明書の原本提出が必須です。インボイス原本で取引内容・価格の真正性を確認します。書類に問題がなければ輸入許可（輸入許可通知書）が発行されます。',
  },
  {
    id: 'import-07',
    stepNumber: 7,
    title: '貨物の引取り',
    description:
      '輸入許可が下りました。貨物を保税地域から引き取るために必要なものはどれでしょうか？',
    type: 'decision',
    choices: [
      {
        id: 'a',
        label: '輸入許可通知書とD/O（Delivery Order：荷渡指図書）',
        isCorrect: true,
      },
      {
        id: 'b',
        label: 'パスポートと会社の印鑑',
        isCorrect: false,
      },
      {
        id: 'c',
        label: '許可通知書のみで貨物は自動的に届く',
        isCorrect: false,
      },
    ],
    explanation:
      '貨物引取りには①輸入許可通知書（税関から）と②D/O（Delivery Order：船会社から発行される荷渡指図書）の両方が必要です。D/Oと引き換えに保税地域の倉庫から貨物を受け取ります。B/L原本を持参するか、元地B/Lの場合はL/G（保証状）が必要な場合もあります。',
  },
]
