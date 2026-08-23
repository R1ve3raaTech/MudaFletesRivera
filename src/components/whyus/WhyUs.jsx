import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import scrollToSection from '../../scrollToSection';
import styles from './WhyUs.module.css';

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        icon: "schedule",
        title: "Llegamos a tiempo",
        description: "Respetamos su agenda. Si decimos una hora, cumplimos esa hora, siempre.",
    },
    {
        icon: "verified_user",
        title: "Bienes protegidos",
        description: "Embalamos, cargamos y transportamos sus cosas como si fueran nuestras.",
    },
    {
        icon: "workspace_premium",
        title: "Experiencia comprobada",
        description: "Más de 20 años movilizando hogares y empresas en Costa Rica.",
    },
];

const WhyUs = () => {
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.header} h2`, { opacity: 0, y: 30, duration: 0.4 })
            .from(`.${styles.header} p`, { opacity: 0, duration: 0.4 }, 0.15);
    }, { scope: headerRef });

    useGSAP(() => {
        gsap.from(`.${styles.featured}, .${styles.card}`, {
            opacity: 0, y: 40, duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
        });
    }, { scope: gridRef });

    return (
        <section id="nosotros" className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.header} ref={headerRef}>
                    <h2>¿Por qué elegirnos?</h2>
                    <p>
                        Con más de 20 años y 20,000 viajes realizados, sabemos cómo hacer que su mudanza sea tranquila, puntual y sin contratiempos.
                    </p>
                </div>

                <div className={styles.grid} ref={gridRef}>
                    <div className={styles.featured}>
                        <div className={styles.featuredIcon}>
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <h3>Precio sin sorpresas</h3>
                        <p>
                            La cotización que recibe es el precio que paga. Sin extras de último momento, sin letra pequeña, sin cargos escondidos al bajar el último mueble.
                        </p>
                        <div className={styles.actions}>
                            <a
                                href="/"
                                onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}
                                className={styles.btnCta}
                            >Cotizar ahora</a>
                            <Link to="/condiciones" className={styles.linkSecondary}>Ver condiciones</Link>
                        </div>
                    </div>

                    <div className={styles.stack}>
                        {values.map((v, i) => (
                            <div key={i} className={styles.card}>
                                <div className={styles.iconBg}>
                                    <span className="material-symbols-outlined">{v.icon}</span>
                                </div>
                                <div>
                                    <h3>{v.title}</h3>
                                    <p>{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
