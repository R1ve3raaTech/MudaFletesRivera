import React from 'react';

// Aísla errores de render: si una sección falla, se oculta sola
// en vez de tumbar toda la aplicación.
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.error('Sección con error:', error);
    }

    render() {
        return this.state.hasError ? null : this.props.children;
    }
}

export default ErrorBoundary;
