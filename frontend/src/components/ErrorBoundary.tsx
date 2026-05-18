/**
 * @file Error boundary global. Captura qualquer erro de renderização que
 * normalmente quebraria toda a árvore React e exibe a mensagem em tela.
 * @author lukasnascimento1
 */
import React from "react";

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary capturou:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", color: "#fff", background: "#1a1a1a", minHeight: "100vh" }}>
          <h1 style={{ color: "#f87171", fontSize: 20, marginBottom: 16 }}>Erro de renderização</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#fca5a5" }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.7, marginTop: 16 }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
