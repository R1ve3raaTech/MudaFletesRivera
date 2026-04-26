import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Truck, MessageCircle, Info } from 'lucide-react';
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
                <li><Link to="/#inicio"><Home size={18} /> Inicio</Link></li>
                <li><Link to="/#servicios"><Truck size={18} /> Servicios</Link></li>
                <li><Link to="/condiciones"><Info size={18} /> Condiciones</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
