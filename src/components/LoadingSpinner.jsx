import React from 'react';

const LoadingSpinner = ({ 
    message = "Carregando...", 
    size = "medium",
    fullScreen = false 
}) => {
    const spinnerSizes = {
        small: '30px',
        medium: '50px',
        large: '70px'
    };

    const containerStyle = fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
        zIndex: 9999,
        fontFamily: 'Martel Sans, sans-serif'
    } : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'Martel Sans, sans-serif'
    };

    const spinnerStyle = {
        width: spinnerSizes[size],
        height: spinnerSizes[size],
        border: '4px solid #ddd',
        borderTop: '4px solid #D46B0F',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            <p style={{
                fontSize: '1.1rem',
                color: '#666',
                textAlign: 'center',
                margin: 0
            }}>
                {message}
            </p>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingSpinner;