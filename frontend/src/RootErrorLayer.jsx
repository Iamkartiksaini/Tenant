import React, { Component } from 'react';
import { Button } from './components/ui/button';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <FallbackRender error={this.state.error && this.state.error.toString()} />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

export function FallbackRender({
    error = "",
    resetErrorBoundary,
}) {
    return (
        <div
            role="alert"
            className="min-h-[calc(100vh-100px)] bg-gray-50 flex items-center justify-center p-4"
        >
            <div className="w-full max-w-2xl flex flex-col items-center bg-white rounded-xl shadow-lg p-6 space-y-4">
                {/* Header */}
                <h2 className="text-4xl  font-semibold text-gray-800">
                    Something went wrong
                </h2>

                {/* Error message */}
                <pre className="whitespace-pre-wrap text-2xl   text-red-600 break-words">
                    {error ?? "Unknown error"}
                </pre>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Reload page
                    </button>
                </div>
            </div>
        </div>
    );
}

