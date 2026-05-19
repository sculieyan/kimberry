'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ClientErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        console.error('Error caught in boundary:', error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught in boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please try again later.</h2>;
        }
        return this.props.children;
    }
}

export default ClientErrorBoundary;