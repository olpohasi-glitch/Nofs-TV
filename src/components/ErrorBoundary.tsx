import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { NOFS_TV_LOGO_URL } from '../types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (window.location.hash) {
        window.location.hash = '';
      }
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      if (window.location.hash) {
        window.location.hash = '';
      }
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <img
              src={NOFS_TV_LOGO_URL}
              alt="NOFS TV"
              className="h-12 w-auto mx-auto mb-6 object-contain"
            />
            <div className="w-14 h-14 bg-red-950/80 border border-red-800 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              সাময়িক ত্রুটি ঘটেছে
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              পৃষ্ঠাটি লোড হতে সমস্যা হয়েছে। নিচের বোতামে ক্লিক করে আবার মূল ওয়েবসাইটে ফিরে যান।
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>মূল পাতায় যান</span>
              </button>
              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>রিলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
