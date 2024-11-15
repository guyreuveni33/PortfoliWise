import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../../styleMenu/homeScreen.module.css';
import TimeFilter from './TimeFilter';
import LoadingSpinner from './LoadingSpinner';

// Register necessary chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BalanceCard = ({ userToken, activeTimeFilter, onTimeFilterClick }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userToken) {
                setChartData(null);
                setLoading(false);
                return;
            }
            setLoading(true); // Start loading
            try {
                const response = await axios.get('http://localhost:3001/api/portfolio/historical_data', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        timeframe: activeTimeFilter
                    }
                });

                const { bars, holdings } = response.data;

                if (!Array.isArray(bars) || !Array.isArray(holdings)) {
                    throw new Error('Invalid data format received from API');
                }

                // Determine the oldest transaction date
                const oldestTransactionDate = holdings.reduce((oldest, holding) => {
                    if (holding.oldestTransactionDate === 'N/A') return oldest;
                    const holdingDate = new Date(holding.oldestTransactionDate);
                    return holdingDate < oldest ? holdingDate : oldest;
                }, new Date());

                console.log('Oldest Transaction Date:', oldestTransactionDate);

                // Calculate the start date for the selected timeframe
                const startDate = new Date();
                switch (activeTimeFilter) {
                    case 'week':
                        startDate.setDate(startDate.getDate() - 7);
                        break;
                    case 'month':
                        startDate.setMonth(startDate.getMonth() - 1);
                        break;
                    case 'year':
                        startDate.setFullYear(startDate.getFullYear() - 1);
                        break;
                    default:
                        startDate.setFullYear(startDate.getFullYear() - 5);
                }

                console.log('Start Date:', startDate.toISOString());

                // Filter bars to exclude data before the oldest transaction date
                const filteredBars = bars.filter(bar => new Date(bar.t) >= oldestTransactionDate);

                // Ensure there is a baseline $0 bar if no data is available before the oldest transaction
                if (filteredBars.length === 0 || new Date(filteredBars[0].t) > oldestTransactionDate) {
                    filteredBars.unshift({
                        t: oldestTransactionDate.toISOString(),
                        value: 0
                    });
                }

                // Extend the filtered bars to the start date if necessary
                const extendedBars = filteredBars.filter(bar => new Date(bar.t) >= startDate);

                // If the selected timeframe starts before the oldest transaction date, show $0 up to that point
                if (new Date(startDate) < oldestTransactionDate) {
                    extendedBars.unshift({
                        t: startDate.toISOString(),
                        value: 0
                    });
                }

                console.log('Filtered and Extended Bars:', extendedBars);

                const labels = extendedBars.map(bar => new Date(bar.t).toLocaleDateString());
                const values = extendedBars.map(bar => bar.value);

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

                setLoading(false); // End loading
            } catch (error) {
                console.error('Error fetching historical data:', error);
                setChartData(null); // Ensure chartData is null on error
                setLoading(false); // End loading on error
            }
        };

        fetchData();
    }, [activeTimeFilter, userToken]);

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
