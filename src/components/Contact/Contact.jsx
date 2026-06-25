import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

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

const Contact = () => {
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    const ctaRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.badge}`, { opacity: 0, scale: 0.8, duration: 0.4 })
            .from(`.${styles.header} h2`, { opacity: 0, y: 30, duration: 0.4 }, 0.1)
            .from(`.${styles.header} p`, { opacity: 0, duration: 0.4 }, 0.2);
    }, { scope: headerRef });

    useGSAP(() => {
        gsap.from(`.${styles.card}`, {
            opacity: 0, y: 40, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        });
    }, { scope: gridRef });

    useGSAP(() => {
        gsap.from(ctaRef.current, {
            opacity: 0, y: 30, duration: 0.5, delay: 0.1,
            scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true },
        });
    }, { scope: ctaRef });

    return (
    <section id="contacto" className={styles.contact}>
        <div className={styles.inner}>

            {/* Header */}
            <div className={styles.header} ref={headerRef}>
                <span className={styles.badge}>
                    Hablemos
                </span>

                <h2>
                    Cotice su <span className={styles.accent}>servicio ideal</span> hoy mismo
                </h2>

                <p>
                    Le respondemos en minutos. Sin complicaciones, sin cargos ocultos.
                </p>
            </div>

            {/* Cards grid */}
            <div className={styles.grid} ref={gridRef}>
                {cards.map(({ Icon, label, value, href, cta }, i) => (
                    <div
                        key={i}
                        className={`${styles.card} ${cta ? styles.cardCta : ''}`}
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
                    </div>
                ))}
            </div>

            {/* Big WhatsApp CTA */}
            <div className={styles.ctaBlock} ref={ctaRef}>
                <p>¿Listo para su mudanza? Escríbanos ahora y reciba su cotización en minutos.</p>
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnWa}
                >
                    <MessageCircle size={20} />
                    Escribir por WhatsApp
                </a>
            </div>

        </div>
    </section>
    );
};

export default Contact;
