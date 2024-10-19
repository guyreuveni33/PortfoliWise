import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './sidebar.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route

    // Function to handle navigation and link click
    const handleLinkClick = (link) => {
        navigate(link); // Navigate to the specified route
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>
                <ul className={styles.menuList}>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/home' ? styles.active : ''}`} // Make Home active if current route is /home
                            onClick={() => handleLinkClick('/home')}
                        >
                            <img className={styles.iconStyle} src="/home.png" alt="Home Icon" />
                            <span className={styles.text}>Home</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/portfolios' ? styles.active : ''}`} // Make Portfolios active if current route is /portfolios
                            onClick={() => handleLinkClick('/portfolios')}
                        >
                            <img className={styles.iconStyle} src="/hand.png" alt="Hand Icon" />
                            <span className={styles.text}>Portfolios</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/tax' ? styles.active : ''}`} // Make Tax active if current route is /tax
                            onClick={() => handleLinkClick('/tax')}
                        >
                            <img className={styles.iconStyle} src="/tax.png" alt="Tax Icon" />
                            <span className={styles.text}>Tax</span>
                        </a>
                    </li>
                    <li className={styles.menuListItem}>
                        <a
                            className={`${location.pathname === '/settings' ? styles.active : ''}`} // Settings route, will redirect to /home
                            onClick={() => handleLinkClick('/home')}
                        >
                            <img className={styles.iconStyle} src="/settings.png" alt="Settings Icon" />
                            <span className={styles.text}>Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
            <a
                className={styles.logout}
                onClick={() => handleLinkClick('/login')} // Navigate to /login on Logout click
            >
                <img className={styles.iconStyle} src="/exit.png" alt="Exit Icon" />
                <span className={styles.text}>Logout</span>
            </a>
        </div>
    );
};

export default Sidebar;
