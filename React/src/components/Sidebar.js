import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../components_style/sidebar.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLinkClick = (link) => {
        navigate(link);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>
                <ul className={styles.menuList}>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/home' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/home')}
                        >
                            <img className={styles.iconStyle} src="/home.png" alt="Home Icon" />
                            <span className={styles.text}>Home</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/portfolios' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/portfolios')}
                        >
                            <img className={styles.iconStyle} src="/hand.png" alt="Hand Icon" />
                            <span className={styles.text}>Portfolios</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/tax' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/tax')}
                        >
                            <img className={styles.iconStyle} src="/tax.png" alt="Tax Icon" />
                            <span className={styles.text}>Tax</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/settings' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/settings')}
                        >
                            <img className={styles.iconStyle} src="/settings.png" alt="Settings Icon" />
                            <span className={styles.text}>Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
            <a
                className={styles.logout}
                onClick={() => handleLinkClick('/login')}
            >
                <img className={styles.iconStyle} src="/exit.png" alt="Exit Icon" />
                <span className={styles.text}>Logout</span>
            </a>
        </div>
    );
};

export default Sidebar;
