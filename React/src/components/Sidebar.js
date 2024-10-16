import React from 'react';
import styles from './sidebar.module.css';

const Sidebar = ({ activeLink, handleLinkClick }) => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>
                <ul className={styles.menuList}>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${activeLink === 'home' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('home')}
                        >
                            <img className={styles.iconStyle} src="/home.png" alt="Home Icon" />
                            <span className={styles.text}>Home</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${activeLink === 'portfolios' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('portfolios')}
                        >
                            <img className={styles.iconStyle} src="/hand.png" alt="Hand Icon" />
                            <span className={styles.text}>Portfolios</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${activeLink === 'tax' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('tax')}
                        >
                            <img className={styles.iconStyle} src="/tax.png" alt="Tax Icon" />
                            <span className={styles.text}>Tax</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${activeLink === 'settings' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('settings')}
                        >
                            <img className={styles.iconStyle} src="/settings.png" alt="Settings Icon" />
                            <span className={styles.text}>Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
            <a className={styles.logout}>
                <img className={styles.iconStyle} src="/exit.png" alt="Exit Icon" />
                <span className={styles.text}>Logout</span>
            </a>
        </div>
    );
};

export default Sidebar;
