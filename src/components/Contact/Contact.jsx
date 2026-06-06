import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import styles from './Contact.module.css';

const WA_NUMBER = "50670818306";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola, deseo cotizar un servicio de mudanza.")}`;

const cards = [
    {
        Icon: Phone,
        label: "Llámenos o WhatsApp",
        value: "+506 7081 8306",
        href: WA_URL,
        cta: true,
    },
    {
        Icon: Phone,
        label: "Logística & Despacho",
        value: "+506 7132 8432",
        href: "https://wa.me/50671328432?text=Hola,%20deseo%20cotizar%20una%20mudanza",
    },
    {
        Icon: Mail,
        label: "Correo electrónico",
        value: "info@mudafletesrivera.com",
        href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@mudafletesrivera.com",
    },
    {
        Icon: MapPin,
        label: "Ubicación",
        value: "San José, Costa Rica",
    },
];

const Contact = () => (
    <section id="contacto" className={styles.contact}>
        <div className={styles.inner}>

            {/* Header */}
            <div className={styles.header}>
                <motion.span
                    className={styles.badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    Hablemos
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Cotice su <span className={styles.accent}>servicio ideal</span> hoy mismo
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Le respondemos en minutos. Sin complicaciones, sin cargos ocultos.
                </motion.p>
            </div>

            {/* Cards grid */}
            <div className={styles.grid}>
                {cards.map(({ Icon, label, value, href, cta }, i) => (
                    <motion.div
                        key={i}
                        className={`${styles.card} ${cta ? styles.cardCta : ''}`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 90, damping: 16 }}
                        whileHover={{ y: -6 }}
                    >
                        <div className={`${styles.iconWrap} ${cta ? styles.iconWrapCta : ''}`}>
                            <Icon size={22} />
                        </div>
                        <span className={styles.cardLabel}>{label}</span>
                        {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles.cardValue} ${cta ? styles.cardValueCta : ''}`}>
                                {value}
                            </a>
                        ) : (
                            <span className={styles.cardValue}>{value}</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Big WhatsApp CTA */}
            <motion.div
                className={styles.ctaBlock}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
            >
                <p>¿Listo para su mudanza? Escríbanos ahora y reciba su cotización en minutos.</p>
                <motion.a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnWa}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <MessageCircle size={20} />
                    Escribir por WhatsApp
                </motion.a>
            </motion.div>

        </div>
    </section>
);

export default Contact;
