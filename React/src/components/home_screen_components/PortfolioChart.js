// Components/PortfolioChart.js
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioChart = ({ chartData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Get the canvas context
        const ctx = document.getElementById('portfolioChart').getContext('2d');

        // Destroy the previous chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                        },
                    },
                },
            },
        });

        // Cleanup function to destroy chart when component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData]); // Re-run effect when chartData changes

    return (
        <div className={`${styles.circle_chart_container} ${styles.section_container}`}>
            <canvas id="portfolioChart" ref={chartRef} className={styles.portfolio_chart}></canvas>
        </div>
    );
};

export default PortfolioChart;