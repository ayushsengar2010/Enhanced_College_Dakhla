import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center max-w-md space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-black text-navy">Something went wrong</h2>
            <p className="text-sm text-slate-500">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.props.fallback ? (
              this.props.fallback
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="bg-amber hover:bg-amber-hover text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                Refresh Page
              </button>
            )}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mt-4">
                <summary className="text-xs text-slate-400 cursor-pointer font-bold">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-slate-50 rounded-lg text-xs text-red-600 overflow-auto max-h-40 border border-slate-200">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
