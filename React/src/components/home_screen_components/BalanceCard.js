import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../../styleMenu/homeScreen.module.css';
import TimeFilter from './TimeFilter';

// Register necessary chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BalanceCard = ({ activeTimeFilter, onTimeFilterClick }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/alpaca/portfolio/historical_data', {
                    params: {
                        timeframe: activeTimeFilter
                    }
                });

                const data = response.data.bars;
                const labels = data.map(bar => new Date(bar.t).toLocaleDateString());
                const values = data.map(bar => bar.value);

                // Prepare the data for chart.js
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Portfolio Value',
                            data: values,
                            fill: false,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1,
                        }
                    ]
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching historical data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTimeFilter]);

    return (
        <div className={`${styles.balance_graph} ${styles.section_container}`}>
            <header>
                <p>Your Balance</p>
                {loading ? (
                    <h1>Loading...</h1>
                ) : (
                    <h1 className={styles.balance_text}>
                        {chartData ? chartData.datasets[0].data.slice(-1)[0] : 'N/A'}
                    </h1>
                )}
            </header>

            {/* Display line chart */}
            {!loading && chartData && (
                <Line data={chartData} />
            )}

            <TimeFilter
                activeTimeFilter={activeTimeFilter}
                onFilterClick={onTimeFilterClick}
            />
        </div>
    );
};

export default BalanceCard;
