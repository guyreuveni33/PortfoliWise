import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../../styleMenu/taxScreen.module.css';

const PortfolioCard = ({portfolioId, index}) => {
    const [profit, setProfit] = useState(null);

    const fetchProfitData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/portfolio/annual-tax/${portfolioId}`, {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            });
            const {netGain} = response.data;
            setProfit(netGain);
        } catch (error) {
            console.error('Error fetching profit data:', error);
            setProfit(null);
        }
    };

    useEffect(() => {
        fetchProfitData();
    }, [portfolioId]);

    const formatNumber = (number) => number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className={`${styles.portfolio_card} ${styles.section}`}>
            <div className={styles.portfolio_header}>
                <div className={styles.header_content}>
                    <h1>Portfolio {index + 1}</h1>
                    <div className={styles.right_header_container}>
                        <button onClick={fetchProfitData} className={styles.refresh_button}
                                aria-label="Refresh Profit Data">
                            <img src="/rotate-right.png" className={styles.icon_style_arrow} alt="Refresh Icon"/>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <span className={styles.profit}>Total Profit: </span>
                <span className={`${styles.profit} ${profit >= 0 ? styles.positive : styles.negative}`}>
                    {profit !== null ? `$${formatNumber(profit)}` : 'Loading...'}
                </span>
            </div>
        </div>
    );
};

export default PortfolioCard;
