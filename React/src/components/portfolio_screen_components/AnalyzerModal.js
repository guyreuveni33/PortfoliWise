import React, { useState, useEffect } from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';
import Gauge from './Gauge';
import LoadingAnimation from './LoadingAnimation';
const API_URL = process.env.REACT_APP_API_URL; // Fetch the base URL from the .env file

const AnalyzerModal = ({ handleClose, isVisible, stockSymbol }) => {
    const [recommendationData, setRecommendationData] = useState(null);
    const [gaugeValue, setGaugeValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getRecommendationClass = (recommendation) => {
        switch (recommendation?.trim().toUpperCase()) {
            case 'STRONG BUY':
                return styles.strongBuy;
            case 'BUY':
                return styles.buy;
            case 'HOLD':
                return styles.hold;
            case 'SELL':
                return styles.sell;
            case 'STRONG SELL':
                return styles.strongSell;
            default:
                return '';
        }
    };

    useEffect(() => {
        if (isVisible && stockSymbol) {
            const fetchRecommendation = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${API_URL}/api/portfolio/recommendation/${stockSymbol}`
                    );
                    const data = await response.json();
                    setRecommendationData(data);

                    // Normalize recommendation and update gauge value
                    const recommendation = data.recommendation?.trim().toUpperCase();
                    switch (recommendation) {
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
                    <>
                        <div className={styles.svgContainer}>
                            <Gauge value={gaugeValue} />
                        </div>

                        <div className={styles.recommendationContainer}>
                            <div className={styles.recommendationText}>
                                Recommendation:
                                <span className={`${styles.recommendationValue} ${getRecommendationClass(recommendationData.recommendation)}`}>
                                    {recommendationData.recommendation}
                                </span>
                            </div>

                            <div className={styles.priceInfo}>
                                <div className={styles.priceBlock}>
                                    <div className={styles.priceLabel}>Current Price</div>
                                    <div className={styles.priceValue}>
                                        ${recommendationData.current_price}
                                    </div>
                                </div>
                                <div className={styles.priceBlock}>
                                    <div className={styles.priceLabel}>Predicted Price</div>
                                    <div className={styles.priceValue}>
                                        ${recommendationData.predicted_price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.errorMessage}>
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