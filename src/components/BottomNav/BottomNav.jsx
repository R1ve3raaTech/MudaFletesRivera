import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Phone } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const [active, setActive] = useState('cotizar');

    return (
        <nav className={styles.bottomNav}>
            <Link 
                to="/condiciones" 
                className={`${styles.navItem} ${active === 'terminos' ? styles.active : ''}`}
                onClick={() => setActive('terminos')}
            >
                <span className={styles.navIcon}><FileText size={20} /></span>
                <span className={styles.navText}>Términos</span>
            </Link>
            <a 
                href="https://wa.me/50670818306" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.navItem} ${styles.whatsappNav}`}
            >
                <span className={styles.navIcon}><MessageCircle size={24} /></span>
                <span className={styles.navText}>Escribir</span>
            </a>
            <Link 
                to="/#contacto" 
                className={`${styles.navItem} ${active === 'cotizar' ? styles.active : ''}`}
                onClick={() => setActive('cotizar')}
            >
                <span className={styles.navIcon}><Phone size={20} /></span>
                <span className={styles.navText}>Cotizar</span>
            </Link>
        </nav>
    );
};

export default BottomNav;
