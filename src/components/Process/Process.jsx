import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { step: "01", icon: "phone_in_talk", title: "Contáctenos Hoy", description: "Escríbanos por WhatsApp o llámenos. En minutos sabremos qué necesita y cómo ayudarle." },
    { step: "02", icon: "request_quote", title: "Cotización Clara", description: "Le enviamos un precio honesto, sin letras pequeñas ni cargos escondidos. Usted decide." },
    { step: "03", icon: "local_shipping", title: "Nos Encargamos Todo", description: "Llegamos puntuales, empacamos con cuidado y cargamos sus bienes con equipo profesional." },
    { step: "04", icon: "home_pin", title: "Llega en Perfecto Estado", description: "Su hogar o negocio en el nuevo destino, tal como lo dejó. Sin estrés, sin sorpresas." }
];

const Process = () => {
    const headerRef = useRef(null);
    const stepsRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.sectionHeader} h2`, { opacity: 0, y: 20, duration: 0.4 })
            .from(`.${styles.sectionHeader} p`, { opacity: 0, duration: 0.4 }, 0.15);
    }, { scope: headerRef });

    useGSAP(() => {
        gsap.from(`.${styles.step}`, {
            opacity: 0, y: 30, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: stepsRef.current, start: 'top 85%', once: true },
        });
        gsap.from(`.${styles.connector}`, {
            scaleX: 0, transformOrigin: 'left center', duration: 0.4, stagger: 0.12, delay: 0.2,
            scrollTrigger: { trigger: stepsRef.current, start: 'top 85%', once: true },
        });
    }, { scope: stepsRef });

    return (
        <section id="proceso" className={styles.process}>
            <div className={styles.sectionHeader} ref={headerRef}>
                <h2>
                    Mudarse con nosotros es así de simple
                </h2>
                <p>
                    Cuatro pasos. Sin complicaciones. Con la tranquilidad que merece.
                </p>
            </div>

            <div className={styles.stepsRow} ref={stepsRef}>
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className={styles.step}>
                            <div className={styles.iconWrap}>
                                <span className="material-symbols-outlined">{s.icon}</span>
                                <span className={styles.badge}>{s.step}</span>
                            </div>
                            <h3>{s.title}</h3>
                            <p>{s.description}</p>
                        </div>

                        {i < steps.length - 1 && (
                            <div className={styles.connector} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default Process;
