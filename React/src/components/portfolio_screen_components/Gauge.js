import React, { useEffect, useRef } from 'react';
import styles from '../../styleMenu/portfoliosScreen.module.css';

const Gauge = ({ value }) => {
    const gaugeRef = useRef(null);

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const drawGauge = () => {
        if (!gaugeRef.current) return;

        const svg = gaugeRef.current;
        svg.innerHTML = '';

        svg.setAttribute('viewBox', '-50 -55 500 350');

        const width = 400;
        const centerX = width / 2;
        const centerY = width / 2;
        const radius = width * 0.35;

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        const smoothGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        smoothGradient.setAttribute("id", "smoothGradient");
        smoothGradient.setAttribute("x1", "0%");
        smoothGradient.setAttribute("y1", "100%");
        smoothGradient.setAttribute("x2", "100%");
        smoothGradient.setAttribute("y2", "100%");

        const colorStops = [
            { offset: "0%", color: "#ff0000" },
            { offset: "50%", color: "#ffd700" },
            { offset: "100%", color: "#32CD32" }
        ];

        colorStops.forEach(({ offset, color }) => {
            const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop.setAttribute("offset", offset);
            stop.setAttribute("stop-color", color);
            smoothGradient.appendChild(stop);
        });

        defs.appendChild(smoothGradient);
        svg.appendChild(defs);

        const drawArc = (startAngle, endAngle, strokeWidth) => {
            const start = polarToCartesian(centerX, centerY, radius, endAngle);
            const end = polarToCartesian(centerX, centerY, radius, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" "));
            path.classList.add(styles.arcPath);
            path.setAttribute("stroke-width", strokeWidth);
            return path;
        };

        const arcWidth = 30;
        svg.appendChild(drawArc(-90, 90, arcWidth));

        const needleAngle = -90 + (value * 180);
        const needleLength = radius - 40;
        const needle = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const needlePoint = polarToCartesian(centerX, centerY, needleLength, needleAngle);

        needle.setAttribute("x1", centerX);
        needle.setAttribute("y1", centerY);
        needle.setAttribute("x2", needlePoint.x);
        needle.setAttribute("y2", needlePoint.y);
        needle.classList.add(styles.needle);
        svg.appendChild(needle);

        const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centerCircle.setAttribute("cx", centerX);
        centerCircle.setAttribute("cy", centerY);
        centerCircle.setAttribute("r", "8");
        centerCircle.classList.add(styles.centerCircle);
        svg.appendChild(centerCircle);

        const labels = [
            { text: "Strong Sell", angle: -90, offset: 75 },
            { text: "Sell", angle: -54, offset: 55 },
            { text: "Hold", angle: 0, offset: 35 },
            { text: "Buy", angle: 54, offset: 55 },
            { text: "Strong Buy", angle: 90, offset: 75 }
        ];

        labels.forEach(({ text, angle, offset }) => {
            const position = polarToCartesian(centerX, centerY, radius + offset, angle);
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.textContent = text;
            label.classList.add(styles.labelText);
            label.setAttribute("x", position.x);
            label.setAttribute("y", position.y);
            svg.appendChild(label);
        });
    };

    useEffect(() => {
        drawGauge();
    }, [value]);

    return <svg ref={gaugeRef} className={styles.responsiveSvg} />;
};

export default Gauge;
