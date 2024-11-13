// ProfileIcon.js

import React from 'react';
import styles from '../components_style/ProfileIcon.module.css';

const ProfileIcon = ({ nickname }) => {
    return (
        <div className={styles.profile_icon}>
            <img src="/User-profile-pic.png" alt="User Profile" className={styles.profile_image} />
            <span className={styles.tooltip}>Happy Trading, {nickname}!</span>
        </div>
    );
};

export default ProfileIcon;
