import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import logoImg from '../../assets/trucklogo.png';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navMain}>
                <div className={styles.logo}>
                    <img src={logoImg} className={styles.truckIcon} alt="MudaFletesRivera Logo" />
                    <span>MudaFletesRivera</span>
                </div>
            </div>

            <ul className={styles.navLinks}>
                <li><Link to="/#contacto">Contacto</Link></li>
                <li><Link to="/condiciones">Condiciones</Link></li>
                <li className={styles.navWhatsappItem}>
                    <a href="https://wa.me/50670818306" target="_blank" rel="noopener noreferrer" className={styles.navWhatsappLink}>
                        <MessageCircle size={22} /> WhatsApp
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
