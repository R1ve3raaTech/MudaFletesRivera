import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { BADGE_LOGO_URL } from '../../branding';
import scrollToSection from '../../scrollToSection';
import Reveal from '../Reveal';
import WhatsAppIcon from '../WhatsAppIcon';
import styles from './Footer.module.css';

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();
    const irASeccion = id => {
        if (location.pathname === '/') scrollToSection(id);
        else navigate('/', id === 'inicio' ? undefined : { state: { scrollTo: id } });
    };
    const homeLinks = [
        { id: 'inicio', label: 'Inicio' },
        { id: 'servicios', label: 'Servicios' },
        { id: 'nosotros', label: 'Nosotros' },
        { id: 'contacto', label: 'Contáctenos' },
    ];

    return <footer className={styles.footer}>
        <div className={styles.container}>
            <Reveal className={styles.invitation}>
                <h2>Su próxima mudanza,<br /><span>resuelta hoy.</span></h2>
                <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                    target="_blank" rel="noopener noreferrer" className={styles.cta}>
                    <WhatsAppIcon size={21} /> Escribir por WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                </a>
            </Reveal>
            <div className={styles.main}>
                <Reveal className={styles.brand}>
                    <div className={styles.logo}>
                        <img src={BADGE_LOGO_URL} alt="Logo oficial de MudaFletesRivera" />
                        <span>MudaFletesRivera</span>
                    </div>
                    <p>Transporte y mudanzas en todo Costa Rica.</p>
                    <p>Materiales de construcción: visite a nuestro socio <a href="https://aditivosrivera.com" target="_blank" rel="noopener noreferrer">aditivosrivera.com</a></p>
                </Reveal>
                <Reveal as="nav" className={styles.nav} aria-label="Navegación del pie de página" delay={.05}>
                    {homeLinks.map(({ id, label }) => <a key={id} href={id === 'inicio' ? '/' : '/#' + id}
                        onClick={e => { e.preventDefault(); irASeccion(id); }}>{label}</a>)}
                    <Link to="/mudanzas-san-jose">Mudanzas en San José</Link>
                    <Link to="/condiciones">Condiciones</Link>
                </Reveal>
                <Reveal className={styles.contacts} delay={.1}>
                    <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={17} /><span>7081-8306</span></a>
                    <a href="https://wa.me/50671350343?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer"><Phone size={17} aria-hidden="true" /><span>7135-0343</span></a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@mudafletesrivera.com" target="_blank" rel="noopener noreferrer"><Mail size={17} aria-hidden="true" /><span>info@mudafletesrivera.com</span></a>
                    <p><MapPin size={17} aria-hidden="true" /><span>San José, Costa Rica</span></p>
                </Reveal>
            </div>
            <div className={styles.bottom}>
                <p>© 2026 MudaFletesRivera. Todos los derechos reservados.</p>
                <Link to="/condiciones">Condiciones de Uso</Link>
            </div>
        </div>
    </footer>;
}
