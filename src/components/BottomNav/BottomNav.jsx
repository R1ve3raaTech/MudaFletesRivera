import React from 'react';
import { motion } from 'framer-motion';
import { Home, Truck, MessageCircle, Info } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname + location.hash;

    const navItems = [
        { icon: Home, label: 'Inicio', path: '/#inicio' },
        { icon: Truck, label: 'Servicios', path: '/#servicios' },
        { icon: MessageCircle, label: 'Cotizar', path: 'https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza', external: true, isSpecial: true },
        { icon: Info, label: 'Legal', path: '/condiciones' },
    ];

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item, index) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;

                if (item.external) {
                    return (
                        <a 
                            key={index}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.navItem} ${item.isSpecial ? styles.special : ''}`}
                        >
                            <Icon size={24} />
                            <span>{item.label}</span>
                        </a>
                    );
                }

                return (
                    <Link 
                        key={index} 
                        to={item.path} 
                        className={`${styles.navItem} ${isActive ? styles.active : ''} ${item.isSpecial ? styles.special : ''}`}
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={styles.iconWrapper}
                        >
                            <Icon size={24} />
                        </motion.div>
                        <span>{item.label}</span>
                        {isActive && <motion.div layoutId="bubble" className={styles.activeIndicator} />}
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
