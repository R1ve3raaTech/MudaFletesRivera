import React from 'react';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Info } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import styles from './BottomNav.module.css';

const WA_ICON = (
    <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.1 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-64.9-157.2zm-157 341.6c-33.1 0-65.6-8.9-93.7-25.7l-6.7-4-69.6 18.3 18.6-67.9-4.4-7c-18.4-29.4-28.1-63.3-28.1-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.7 184.6-184.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.4-16.5-14.7-27.6-32.8-30.8-38.3-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
);

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname + location.hash;

    return (
        <nav className={styles.bottomNav}>
            <Link to="/#inicio" className={`${styles.navItem} ${currentPath === '/#inicio' ? styles.active : ''}`}>
                <motion.div whileTap={{ scale: 0.9 }} className={styles.iconWrapper}>
                    <Home size={24} />
                </motion.div>
                <span>Inicio</span>
                {currentPath === '/#inicio' && <motion.div layoutId="bubble" className={styles.activeIndicator} />}
            </Link>

            <Link to="/mimudanza" className={`${styles.navItem} ${styles.specialBlue}`}>
                <motion.div whileTap={{ scale: 0.9 }} className={styles.iconWrapper}>
                    <MessageCircle size={24} />
                </motion.div>
                <span>Mi mudanza</span>
            </Link>

            <a
                href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.navItem} ${styles.special}`}
            >
                <motion.div whileTap={{ scale: 0.9 }} className={styles.iconWrapper}>
                    {WA_ICON}
                </motion.div>
                <span>WhatsApp</span>
            </a>

            <Link to="/condiciones" className={`${styles.navItem} ${currentPath === '/condiciones' ? styles.active : ''}`}>
                <motion.div whileTap={{ scale: 0.9 }} className={styles.iconWrapper}>
                    <Info size={24} />
                </motion.div>
                <span>Legal</span>
                {currentPath === '/condiciones' && <motion.div layoutId="bubble" className={styles.activeIndicator} />}
            </Link>
        </nav>
    );
};

export default BottomNav;
