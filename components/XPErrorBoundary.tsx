import React from "react";
import { errorWithFile } from "@/utils/logger";

interface XPErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface XPErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class XPErrorBoundary extends React.Component<
  XPErrorBoundaryProps,
  XPErrorBoundaryState
> {
  constructor(props: XPErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    errorWithFile(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900">
          <div className="text-sm text-red-600 dark:text-red-200">
            Failed to load or update XP data
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 text-xs text-red-500 dark:text-red-300 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
