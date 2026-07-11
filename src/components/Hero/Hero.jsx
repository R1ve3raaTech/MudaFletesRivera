import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MessageCircle } from 'lucide-react';
import logoImg from '../../assets/MRlogo.png';
import styles from './Hero.module.css';

const Hero = () => {
    const contentRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const y = reduceMotion ? 0 : 24;

        gsap.timeline()
            .from(`.${styles.content}`, { opacity: 0, y, duration: 0.7, ease: 'power2.out' })
            .from(`.${styles.logo}`, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '<')
            .from(`.${styles.eyebrow}`, { opacity: 0, duration: 0.4 }, 0.3)
            .from(`.${styles.hero} h1`, { opacity: 0, y: reduceMotion ? 0 : 16, duration: 0.4 }, 0.45)
            .from(`.${styles.sub}`, { opacity: 0, duration: 0.4 }, 0.6)
            .from(`.${styles.actions}`, { opacity: 0, y: reduceMotion ? 0 : 12, duration: 0.4 }, 0.75);
    }, { scope: contentRef });

    return (
        <header id="inicio" className={styles.hero} ref={contentRef}>
            <div className={styles.content}>
                <img src={logoImg} alt="MudaFletesRivera" className={styles.logo} />

                <p className={styles.eyebrow}>
                    Mudanzas &amp; Logística — Costa Rica
                </p>

                <h1>
                    Su hogar llega <br /><span>sano y salvo.</span>
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
        </header>
    );
};

export default Hero;
