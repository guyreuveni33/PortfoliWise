// components/home_screen_components/BalanceCard.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../../styleMenu/homeScreen.module.css';
import TimeFilter from './TimeFilter';
import LoadingSpinner from './LoadingSpinner';

// Register necessary chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const BalanceCard = ({ activeTimeFilter, onTimeFilterClick }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Start loading
            try {
                const response = await axios.get('http://localhost:3001/api/portfolio/historical_data', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        timeframe: activeTimeFilter
                    }
                });

                const data = response.data.bars;

                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from API');
                }

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
                    ],
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    }
                });

                setLoading(false);  // End loading
            } catch (error) {
                console.error('Error fetching historical data:', error);
                setChartData(null); // Ensure chartData is null on error
                setLoading(false);  // End loading on error
            }
        };

        fetchData();
    }, [activeTimeFilter]);

    // Function to format the balance
    const formatBalance = (balance) => {
        if (typeof balance !== 'number') {
            return 'No Data';
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(balance);
    };

    return (
        <div className={`${styles.balance_graph} ${styles.section_container}`}>
            <header>
                <p>Your Balance across all portfolios</p>
                {loading ? (
                    <div className={styles.loading_container}>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <h1 className={styles.balance_text}>
                        {chartData ? formatBalance(chartData.datasets[0].data.slice(-1)[0]) : 'N/A'}
                    </h1>
                )}
            </header>

            {/* Display line chart and time filter only when not loading */}
            {!loading && chartData && (
                <>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartData.options} />
                    </div>
                    <TimeFilter
                        activeTimeFilter={activeTimeFilter}
                        onFilterClick={onTimeFilterClick}
                    />
                </>
            )}
        </div>
    );
};

export default BalanceCard;
