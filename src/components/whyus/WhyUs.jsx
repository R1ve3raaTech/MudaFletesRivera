import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import styles from './WhyUs.module.css';

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        icon: "schedule",
        title: "Llegamos a Tiempo",
        description: "Respetamos su agenda. Si decimos una hora, cumplimos esa hora, siempre.",
    },
    {
        icon: "verified_user",
        title: "Bienes Protegidos",
        description: "Embalamos, cargamos y transportamos sus cosas como si fueran nuestras. Con cuidado real.",
    },
    {
        icon: "workspace_premium",
        title: "Experiencia Comprobada",
        description: "Más de 20 años movilizando hogares y empresas en Costa Rica. Sabemos lo que hacemos.",
    },
    {
        icon: "payments",
        title: "Precio Sin Sorpresas",
        description: "La cotización que recibe es el precio que paga. Sin extras de último momento.",
        highlight: true
    }
];

const ValueCard = ({ icon, title, description, highlight }) => (
    <div className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
        <div className={styles.iconBg}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        {highlight && (
            <div className={styles.actions}>
                <Link to="/condiciones" className={styles.linkSecondary}>Ver condiciones</Link>
                <a href="#contacto" className={styles.btnCta}>Cotizar ahora</a>
            </div>
        )}
    </div>
);

const WhyUs = () => {
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.eyebrow}`, { opacity: 0, duration: 0.4 })
            .from(`.${styles.header} h2`, { opacity: 0, y: 30, duration: 0.4 }, 0.1)
            .from(`.${styles.header} p`, { opacity: 0, duration: 0.4 }, 0.2);
    }, { scope: headerRef });

    useGSAP(() => {
        gsap.from(`.${styles.card}`, {
            opacity: 0, y: 40, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        });
    }, { scope: gridRef });

    return (
        <section id="nosotros" className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.header} ref={headerRef}>
                    <span className={styles.eyebrow}>
                        Por qué confiar en nosotros
                    </span>
                    <h2>
                        ¿Por qué elegirnos?
                    </h2>
                    <div className={styles.rule} />
                    <p>
                        Con más de 20 años y 20,000 viajes realizados, sabemos cómo hacer que su mudanza sea tranquila, puntual y sin contratiempos.
                    </p>
                </div>

                <div className={styles.grid} ref={gridRef}>
                    {values.map((v, i) => <ValueCard key={i} {...v} />)}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
