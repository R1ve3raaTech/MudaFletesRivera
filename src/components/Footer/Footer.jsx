import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Package, Mail, MapPin } from 'lucide-react';
import logoImg from '../../assets/trucklogo.png';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const innerRef = useRef(null);

    useGSAP(() => {
        gsap.from(`.${styles.brand}, .${styles.links}, .${styles.contact}`, {
            opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: innerRef.current, start: 'top 90%', once: true },
        });
    }, { scope: innerRef });

    return (
    <footer className={styles.footer}>
        <div className={styles.inner} ref={innerRef}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <img src={logoImg} className={styles.truckIcon} alt="MudaFletesRivera Logo" />
                    MudaFletesRivera
                </div>
                <p>Soluciones de transporte, mudanzas y materiales de construcción en todo Costa Rica.</p>
            </div>

            {/* Links */}
            <div className={styles.links}>
                <h4>Navegación</h4>
                <ul>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#nosotros">Nosotros</a></li>
                    <li><a href="#contacto">Contáctenos</a></li>
                    <li><Link to="/condiciones">Condiciones</Link></li>
                </ul>
            </div>

            {/* Contact */}
            <div className={styles.contact}>
                <h4>Contacto Directo</h4>
                <ul>
                    <li>
                        <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={18} /> WhatsApp: 7081-8306
                        </a>
                    </li>
                    <li>
                        <a href="https://wa.me/50671328432?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">
                            <Package size={18} /> Despacho: 7132-8432
                        </a>
                    </li>
                    <li>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@mudafletesrivera.com" target="_blank" rel="noopener noreferrer">
                            <Mail size={18} /> info@mudafletesrivera.com
                        </a>
                    </li>
                    <li><MapPin size={18} /> San José, Costa Rica</li>
                </ul>
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
