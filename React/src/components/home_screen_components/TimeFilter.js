import React from 'react';
import styles from '../../styleMenu/homeScreen.module.css';
import Sidebar from "../Sidebar";

const TimeFilter = ({ activeTimeFilter, onFilterClick }) => {
    return (
        <div className={`${styles.time_filters_container} ${styles.border_line_top}`}>
            {['week', 'month', 'year', 'all'].map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterClick(filter)}
                    className={`${styles.filter_button} ${activeTimeFilter === filter ? styles.filter_button_active : ''}`}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default TimeFilter;