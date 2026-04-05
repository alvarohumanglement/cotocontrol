import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-dvh px-6 text-center"
          style={{ background: 'var(--earth-900)' }}
        >
          <span className="text-4xl mb-4">😵</span>
          <h1
            className="text-xl mb-2"
            style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}
          >
            Algo salió mal
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--earth-400)' }}>
            {this.state.error?.message ?? 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer"
            style={{ background: 'var(--green-600)', color: 'white' }}
          >
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
