import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import truckImg from '../../assets/truck1.webp';
import styles from './Hero.module.css';

const Hero = () => {
    const rootRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const y = (v) => (reduceMotion ? 0 : v);

        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(`.${styles.eyebrow}`, { opacity: 0, y: y(14), duration: 0.5 })
            .from(`.${styles.copy} h1`, { opacity: 0, y: y(22), duration: 0.6 }, 0.1)
            .from(`.${styles.sub}`, { opacity: 0, y: y(14), duration: 0.5 }, 0.28)
            .from(`.${styles.actions}`, { opacity: 0, y: y(12), duration: 0.5 }, 0.42)
            .from(`.${styles.visual}`, { opacity: 0, x: reduceMotion ? 0 : 36, duration: 0.8 }, 0.2)
            .from(`.${styles.badge}`, { opacity: 0, scale: reduceMotion ? 1 : 0.7, duration: 0.5, ease: 'back.out(2)' }, 0.7);
    }, { scope: rootRef });

    return (
        <header id="inicio" className={styles.hero} ref={rootRef}>
            <div className={styles.grid}>
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>Mudanzas y logística en toda Costa Rica</p>

                    <h1>
                        Su hogar llega<br /><span>sano y salvo.</span>
                    </h1>

                    <p className={styles.sub}>
                        Más de 20 años protegiendo lo que más importa. Puntualidad, cuidado y precio justo, garantizados.
                    </p>

                    <div className={styles.actions}>
                        <a
                            href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                            target="_blank" rel="noopener noreferrer"
                            className={styles.btnPrimary}
                        >
                            <MessageCircle size={18} /> Cotizar por WhatsApp
                        </a>
                        <a href="#servicios" className={styles.btnSecondary}>Ver servicios</a>
                    </div>
                </div>

                <div className={styles.visual}>
                    <img
                        src={truckImg}
                        alt="Camión de MudaFletesRivera durante una mudanza residencial en Costa Rica"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className={styles.badge}>
                        <ShieldCheck size={18} />
                        <div>
                            <strong>20+ años</strong>
                            <span>de experiencia real</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
