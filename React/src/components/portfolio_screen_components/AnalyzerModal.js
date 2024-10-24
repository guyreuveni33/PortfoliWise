import React, { useEffect } from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';

function AnalyzerModal({ handleClose, isVisible }) {
    const drawGauge = (value) => {
        const svg = document.getElementById('gauge');
        svg.innerHTML = '';

        const width = 200;
        const height = 100;
        const thickness = 18;

        const describeArc = (x, y, radius, startAngle, endAngle) => {
            const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
                const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            };

            const start = polarToCartesian(x, y, radius, endAngle);
            const end = polarToCartesian(x, y, radius, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            return [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" ");
        };

        const background = document.createElementNS("http://www.w3.org/2000/svg", "path");
        background.setAttribute("d", describeArc(width / 2, height, height - thickness, 0, 180));
        background.setAttribute("fill", "transparent");
        background.setAttribute("stroke", "#444");
        background.setAttribute("stroke-width", thickness);
        svg.appendChild(background);

        const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arc.setAttribute("d", describeArc(width / 2, height, height - thickness, 0, value * 180));
        arc.setAttribute("fill", "transparent");
        arc.setAttribute("stroke", value > 0.66 ? "limegreen" : value > 0.33 ? "yellow" : "red");
        arc.setAttribute("stroke-width", thickness);
        svg.appendChild(arc);
    };

    useEffect(() => {
        drawGauge(Math.random());
    }, []);

    return (
        <div className={`${styles.modal} ${isVisible ? styles.show : ''}`}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={handleClose}>&times;</span>
                <h2 className={styles.stockName}>AMZ</h2>
                <svg id="gauge" width="200" height="100"></svg>
                <p className={styles.disclaimer}>This should not be seen as an investment recommendation</p>
            </div>
        </div>
    );
}

export default AnalyzerModal;
