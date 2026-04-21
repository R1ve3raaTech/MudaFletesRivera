import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Package, Mail, MapPin } from 'lucide-react';
import logoImg from '../../assets/trucklogo.png';
import styles from './Footer.module.css';

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.inner}>
            {/* Brand */}
            <motion.div
                className={styles.brand}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
                <div className={styles.logo}>
                    <img src={logoImg} className={styles.truckIcon} alt="MudaFletesRivera Logo" />
                    MudaFletesRivera
                </div>
                <p>Soluciones de transporte, mudanzas y materiales de construcción en todo Costa Rica.</p>
            </motion.div>

            {/* Links */}
            <motion.div
                className={styles.links}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
                <h4>Navegación</h4>
                <ul>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#nosotros">Nosotros</a></li>
                    <li><a href="#contacto">Contáctenos</a></li>
                    <li><Link to="/condiciones">Condiciones</Link></li>
                </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
                className={styles.contact}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            >
                <h4>Contacto Directo</h4>
                <ul>
                    <li>
                        <a href="https://wa.me/50670818306" target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={18} /> WhatsApp: 7081-8306
                        </a>
                    </li>
                    <li>
                        <a href="https://wa.me/50671328432" target="_blank" rel="noopener noreferrer">
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
            </motion.div>
        </div>

        <div className={styles.bottom}>
            <p>© 2026 MudaFletesRivera. Todos los derechos reservados.</p>
            <Link to="/condiciones" className={styles.bottomLink}>Condiciones de Uso</Link>
        </div>
    </footer>
);

export default Footer;
