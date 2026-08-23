import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageCircle, Package, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import logoImg from '../../assets/trucklogo.png';
import scrollToSection from '../../scrollToSection';
import styles from './Footer.module.css';

const Footer = () => {
    const ctaRef = useRef(null);
    const innerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Igual que en BottomNav: el footer es persistente entre rutas, así que
    // un <a href="#servicios"> no funciona fuera del inicio (solo cambia el
    // hash de la URL actual sin navegar) ni con las secciones lazy-loaded.
    const irASeccion = (id) => {
        if (location.pathname === '/') {
            scrollToSection(id);
        } else {
            navigate('/', id === 'inicio' ? undefined : { state: { scrollTo: id } });
        }
    };

    // El footer es persistente entre rutas: un ScrollTrigger calcularía sus
    // posiciones con el alto de la página inicial y en rutas más cortas
    // (/mimudanza) jamás se dispararía, dejando el contenido en opacity 0.
    // IntersectionObserver no depende del layout, así que nunca se desfasa.
    const animarAlVerse = (ref, selector, y) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !ref.current) return undefined;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            gsap.from(selector, { opacity: 0, y, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
        }, { rootMargin: '0px 0px -10% 0px' });
        io.observe(ref.current);
        return () => io.disconnect();
    };

    useGSAP(() => animarAlVerse(ctaRef, `.${styles.ctaHeading}, .${styles.ctaBtn}`, 24), { scope: ctaRef });

    useGSAP(() => animarAlVerse(innerRef, `.${styles.brandCol}, .${styles.navCol}, .${styles.contactCol}`, 16), { scope: innerRef });

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
                <p>Transporte y mudanzas en todo Costa Rica.</p>
                <p>
                    Materiales de construcción: visite a nuestro socio{' '}
                    <a href="https://aditivosrivera.com" target="_blank" rel="noopener noreferrer">
                        aditivosrivera.com
                    </a>
                </p>
            </div>

            <div className={styles.divider} />

            <nav className={styles.navCol} aria-label="Navegación">
                <a href="/" onClick={(e) => { e.preventDefault(); irASeccion('inicio'); }}>Inicio</a>
                <a href="/#servicios" onClick={(e) => { e.preventDefault(); irASeccion('servicios'); }}>Servicios</a>
                <a href="/#nosotros" onClick={(e) => { e.preventDefault(); irASeccion('nosotros'); }}>Nosotros</a>
                <a href="/#contacto" onClick={(e) => { e.preventDefault(); irASeccion('contacto'); }}>Contáctenos</a>
                <Link to="/mudanzas-san-jose">Mudanzas en San José</Link>
                <Link to="/condiciones">Condiciones</Link>
            </nav>

            <div className={styles.divider} />

            <div className={styles.contactCol}>
                <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} /> 7081-8306
                </a>
                <a href="https://wa.me/50671350343?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                    <Package size={16} /> 7135-0343
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
