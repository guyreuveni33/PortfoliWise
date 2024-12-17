import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './AuthTransition.module.css';

const AuthTransitionWrapper = ({ children }) => {
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const pageVariants = {
        initial: { opacity: 0, scale: 0.9 },
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 1.1 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    const handleSmoothNavigation = (path) => {
        setIsExiting(true);
        setTimeout(() => {
            navigate(path);
        }, 500);
    };

    return (
        <div className={styles.authContainer}>
            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        {React.cloneElement(children, {
                            onSmoothNavigation: handleSmoothNavigation
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthTransitionWrapper;