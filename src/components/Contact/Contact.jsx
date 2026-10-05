import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import WhatsAppIcon from '../WhatsAppIcon';
import styles from './Contact.module.css';

const WA_URL = 'https://wa.me/50670818306?text=' + encodeURIComponent('Hola, deseo cotizar un servicio de mudanza.');
const channels = [
    { Icon: Phone, label: 'Llámenos o WhatsApp', value: '+506 7081 8306', href: WA_URL },
    { Icon: Phone, label: 'Logística & Despacho', value: '+506 7135 0343', href: 'https://wa.me/50671350343?text=Hola,%20deseo%20cotizar%20una%20mudanza' },
    { Icon: Mail, label: 'Correo electrónico', value: 'info@mudafletesrivera.com', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=info@mudafletesrivera.com' },
    { Icon: MapPin, label: 'Ubicación', value: 'San José, Costa Rica' },
];

export default function Contact() {
    return <section id="contacto" className={styles.contact}>
        <div className={styles.inner}>
            <Reveal className={styles.copy}>
                <h2>Cotice su <span>servicio ideal</span> hoy mismo</h2>
                <p className={styles.sub}>Le respondemos en minutos. Sin complicaciones, sin cargos ocultos.</p>
                <div className={styles.invitation}>
                    <p>¿Listo para su mudanza? Escríbanos ahora y reciba su cotización en minutos.</p>
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={styles.btnWa}>
                        <WhatsAppIcon size={21} /> Escribir por WhatsApp
                    </a>
                </div>
            </Reveal>
            <div className={styles.channels}>
                {channels.map((channel, i) => {
                    const { Icon, label, value, href } = channel;
                    return <Reveal key={label} className={styles.channel} delay={i * .05}>
                        <Icon size={21} className={styles.icon} aria-hidden="true" />
                        <div className={styles.details}>
                            <span className={styles.label}>{label}</span>
                            {href ? <a href={href} target="_blank" rel="noopener noreferrer" className={styles.value}>
                                {value} <ArrowUpRight size={17} aria-hidden="true" />
                            </a> : <p className={styles.value}>{value}</p>}
                        </div>
                    </Reveal>;
                })}
            </div>
        </div>
    </section>;
}
