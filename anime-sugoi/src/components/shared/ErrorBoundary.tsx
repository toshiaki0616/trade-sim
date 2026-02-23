import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

// React の ErrorBoundary はクラスコンポーネントでしか実装できない
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 本番では外部ログサービスに送る想定（今はコンソールのみ）
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary">
          <div className="error-boundary-inner">
            <div className="error-code">// ERROR</div>
            <h2 className="error-title">予期しないエラーが発生しました</h2>
            <p className="error-message">{this.state.message}</p>
            <button className="error-reset-btn" onClick={this.handleReset}>
              トップへ戻る
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
