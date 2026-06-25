import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Package, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import logoImg from '../../assets/trucklogo.png';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const ctaRef = useRef(null);
    const innerRef = useRef(null);

    useGSAP(() => {
        gsap.from(`.${styles.ctaHeading}, .${styles.ctaBtn}`, {
            opacity: 0, y: 24, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true },
        });
    }, { scope: ctaRef });

    useGSAP(() => {
        gsap.from(`.${styles.brandCol}, .${styles.navCol}, .${styles.contactCol}`, {
            opacity: 0, y: 16, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: innerRef.current, start: 'top 90%', once: true },
        });
    }, { scope: innerRef });

    return (
    <footer className={styles.footer}>
        <div className={styles.ctaBand} ref={ctaRef}>
            <h2 className={styles.ctaHeading}>
                Su próxima mudanza, <span>resuelta hoy.</span>
            </h2>
            <a
                href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
            >
                Escribir por WhatsApp <ArrowUpRight size={18} />
            </a>
        </div>

        <div className={styles.inner} ref={innerRef}>
            <div className={styles.brandCol}>
                <div className={styles.logo}>
                    <img src={logoImg} className={styles.truckIcon} alt="MudaFletesRivera Logo" />
                    MudaFletesRivera
                </div>
                <p>Transporte, mudanzas y materiales de construcción en todo Costa Rica.</p>
            </div>

            <div className={styles.divider} />

            <nav className={styles.navCol} aria-label="Navegación">
                <a href="#inicio">Inicio</a>
                <a href="#servicios">Servicios</a>
                <a href="#nosotros">Nosotros</a>
                <a href="#contacto">Contáctenos</a>
                <Link to="/condiciones">Condiciones</Link>
            </nav>

            <div className={styles.divider} />

            <div className={styles.contactCol}>
                <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} /> 7081-8306
                </a>
                <a href="https://wa.me/50671328432?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                    <Package size={16} /> 7132-8432
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@mudafletesrivera.com" target="_blank" rel="noopener noreferrer">
                    <Mail size={16} /> info@mudafletesrivera.com
                </a>
                <span><MapPin size={16} /> San José, Costa Rica</span>
            </div>
        </div>

        <div className={styles.bottom}>
            <p>© 2026 MudaFletesRivera. Todos los derechos reservados.</p>
            <Link to="/condiciones" className={styles.bottomLink}>Condiciones de Uso</Link>
        </div>
    </footer>
    );
};

export default Footer;
