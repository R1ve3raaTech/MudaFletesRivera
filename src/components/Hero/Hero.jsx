import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ShieldCheck } from 'lucide-react';
import truckImg from '../../assets/truck1.webp';
import scrollToSection from '../../scrollToSection';
import WhatsAppIcon from '../WhatsAppIcon';
import styles from './Hero.module.css';

export default function Hero() {
    const reduced = useReducedMotion();
    const entrance = (delay = 0) => ({
        initial: reduced ? false : { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    });
    return (
        <LazyMotion features={domAnimation}>
            <header id="inicio" className={styles.hero}>
                <div className={styles.inner}>
                    <div className={styles.scene}>
                        <img className={styles.photo} src={truckImg}
                            alt="Camión de MudaFletesRivera durante una mudanza residencial en Costa Rica"
                            fetchPriority="high" decoding="async" />
                        <div className={styles.copy}>
                            <Motion.h1 {...entrance(0.08)}>
                                Su hogar llega<br /><span>sano y salvo.</span>
                            </Motion.h1>
                            <Motion.p className={styles.sub} {...entrance(0.18)}>
                                Más de 20 años protegiendo lo que más importa. Puntualidad, cuidado y precio justo, garantizados.
                            </Motion.p>
                        </div>
                        <Motion.div className={styles.experience} {...entrance(0.25)}>
                            <ShieldCheck size={19} aria-hidden="true" />
                            <span><strong>20+ años</strong> de experiencia real</span>
                        </Motion.div>
                    </div>
                    <Motion.div className={styles.bottom} {...entrance(0.28)}>
                        <p className={styles.coverage}>Mudanzas y logística<br />en toda Costa Rica</p>
                        <div className={styles.actions}>
                            <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                                target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                                <WhatsAppIcon size={21} /> Cotizar por WhatsApp
                            </a>
                            <a href="/#servicios" className={styles.btnSecondary}
                                onClick={(e) => { e.preventDefault(); scrollToSection('servicios'); }}>
                                Ver servicios <ArrowDown size={17} aria-hidden="true" />
                            </a>
                        </div>
                    </Motion.div>
                </div>
            </header>
        </LazyMotion>
    );
}
