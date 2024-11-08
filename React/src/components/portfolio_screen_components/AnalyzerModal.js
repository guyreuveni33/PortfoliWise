import React, { useState, useEffect } from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';
import Gauge from './Gauge';
import LoadingAnimation from './LoadingAnimation';

const AnalyzerModal = ({ handleClose, isVisible, stockSymbol }) => {
    const [recommendationData, setRecommendationData] = useState(null);
    const [gaugeValue, setGaugeValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isVisible && stockSymbol) {
            const fetchRecommendation = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `http://localhost:3001/api/portfolio/recommendation/${stockSymbol}`
                    );
                    const data = await response.json();
                    setRecommendationData(data);

                    switch (data.recommendation) {
                        case "STRONG SELL":
                            setGaugeValue(0);
                            break;
                        case "SELL":
                            setGaugeValue(0.2);
                            break;
                        case "HOLD":
                            setGaugeValue(0.5);
                            break;
                        case "BUY":
                            setGaugeValue(0.8);
                            break;
                        case "STRONG BUY":
                            setGaugeValue(1);
                            break;
                        default:
                            setGaugeValue(0.5);
                            break;
                    }
                } catch (error) {
                    console.error("Error fetching recommendation:", error);
                } finally {
                    // Add a minimum loading time to prevent flashing
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                }
            };

            fetchRecommendation();
        }
    }, [isVisible, stockSymbol]);

    return (
        <div className={`${styles.modal} ${isVisible ? styles.show : ''}`}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2 className={`${styles.stockName} ${styles.boldText}`}>{stockSymbol}</h2>
                <div className={styles.borderLine}></div>

                {isLoading ? (
                    <LoadingAnimation />
                ) : recommendationData ? (
                    <div>
                        <div className={styles.svgContainer}>
                            <Gauge value={gaugeValue} />
                        </div>
                        <div style={{ padding: '0 20px' }}>
                            <p style={{
                                margin: '15px 0',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                Recommendation: {' '}
                                <span style={{ color: '#613DE4' }}>{recommendationData.recommendation}</span>
                            </p>
                            <p style={{ margin: '15px 0' }}>
                                Current Price: {' '}
                                <span style={{ fontWeight: '500' }}>${recommendationData.current_price}</span>
                            </p>
                            <p style={{ margin: '15px 0' }}>
                                Predicted Price: {' '}
                                <span style={{ fontWeight: '500' }}>${recommendationData.predicted_price}</span>
                            </p>
                            <p style={{ margin: '15px 0' }}>
                                Trend: {' '}
                                <span style={{ fontWeight: '500' }}>{recommendationData.trend}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px 0',
                        color: '#f44336'
                    }}>
                        Error loading recommendation data
                    </div>
                )}

                <p className={styles.disclaimer}>
                    This should not be seen as an investment recommendation
                </p>
            </div>
        </div>
    );
};

export default AnalyzerModal;