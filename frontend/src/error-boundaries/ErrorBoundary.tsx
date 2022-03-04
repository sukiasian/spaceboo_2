import { Component, ErrorInfo } from 'react';

export default class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // TODO Sentry
        console.log(error);
    }

    render() {
        return this.state.hasError ? <div className="error-boundary"> Произошла ошибка </div> : this.props.children;
    }
}
