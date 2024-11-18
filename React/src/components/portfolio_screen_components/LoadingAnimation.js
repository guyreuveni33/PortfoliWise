import React from 'react';

const LoadingAnimation = () => {
    const styles = {
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            minHeight: '400px'
        },
        spinnerContainer: {
            position: 'relative',
            width: '120px',
            height: '120px'
        },
        spinner: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '4px solid #1a2642',
            borderTop: '4px solid #613DE4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        innerSpinner: {
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            border: '4px solid #1a2642',
            borderTop: '4px solid #613DE4',
            borderRadius: '50%',
            animation: 'spinReverse 1.2s linear infinite'
        },
        loadingText: {
            marginTop: '30px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '500',
            opacity: '0.9',
            animation: 'pulse 1.5s ease-in-out infinite'
        },
        pulsingDots: {
            display: 'flex',
            gap: '6px',
            marginTop: '15px',
            justifyContent: 'center'
        },
        dot: {
            width: '8px',
            height: '8px',
            backgroundColor: '#613DE4',
            borderRadius: '50%'
        }
    };

    return (
        <>
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes spinReverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          @keyframes dotPulse {
            0%, 100% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
          }

          .loading-dot {
            animation: dotPulse 1.5s ease-in-out infinite;
          }

          .loading-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .loading-dot:nth-child(3) {
            animation-delay: 0.4s;
          }
        `}
            </style>
            <div style={styles.loadingContainer}>
                <div style={styles.spinnerContainer}>
                    <div style={styles.spinner} />
                    <div style={styles.innerSpinner} />
                </div>
                <div style={styles.loadingText}>
                    Analyzing
                </div>
                <div style={styles.pulsingDots}>
                    <div className="loading-dot" style={styles.dot} />
                    <div className="loading-dot" style={styles.dot} />
                    <div className="loading-dot" style={styles.dot} />
                </div>
            </div>
        </>
    );
};

export default LoadingAnimation;