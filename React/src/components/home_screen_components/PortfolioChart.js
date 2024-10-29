import React, { useEffect, useRef, useMemo } from 'react';
import { Chart } from 'chart.js';
import styles from '../../styleMenu/homeScreen.module.css';

const PortfolioChart = ({ portfolioData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Calculate total portfolio balance for percentage calculations
    const totalBalance = useMemo(() =>
            portfolioData.reduce((total, item) => total + (parseFloat(item.balance) || 0), 0),
        [portfolioData]
    );

    // Prepare chart data and configuration
    const chartData = useMemo(() => {
        const colors = [
            'rgb(138,43,226)', 'rgb(255,182,193)', 'rgb(255,165,0)',
            'rgb(60,179,113)', 'rgb(70,130,180)', 'rgb(173,216,230)',
            'rgb(210,48,48)', 'rgb(112,128,144)', 'rgb(173,255,47)', 'rgb(64,224,208)'
        ];

        const labels = portfolioData.slice(0, 10).map(item => {
            const balance = parseFloat(item.balance) || 0;
            const percentage = totalBalance ? ((balance / totalBalance) * 100).toFixed(2) : '0.00';
            return `${item.name} (${percentage}%)`;
        });

        return {
            labels,
            datasets: [{
                label: 'Portfolio Distribution',
                data: portfolioData.slice(0, 10).map(item => parseFloat(item.balance) || 0),
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                borderWidth: 1,
            }]
        };
    }, [portfolioData, totalBalance]);

    // Initialize chart on component mount/update
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Clean up previous chart instance to prevent memory leaks
        if (chartInstance.current) chartInstance.current.destroy();

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
                            color: '#ffffff', // Match legend text color to theme
                            font: { weight: 'bold' },
                            padding: 10,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw.toFixed(2)} USD`,
                        },
                        backgroundColor: '#333',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                    },
                },
                cutout: '70%', // Adjusts doughnut hole size for a sleeker look
                animation: {
                    animateScale: true,
                    animateRotate: true,
                }
            },
        });

        // Clean up on component unmount
        return () => chartInstance.current.destroy();
    }, [chartData]);

    return (
        <div className={`${styles.circle_chart_container} ${styles.section_container}`}>
            <canvas id="portfolioChart" ref={chartRef} className={styles.portfolio_chart}></canvas>
        </div>
    );
};

export default PortfolioChart;
