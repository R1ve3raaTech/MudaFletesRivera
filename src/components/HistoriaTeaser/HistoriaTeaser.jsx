import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus, ArrowUpRight } from 'lucide-react';
import foto2014 from '../../assets/historia-2014.webp';
import foto2026 from '../../assets/historia-2026.webp';
import styles from './HistoriaTeaser.module.css';

gsap.registerPlugin(ScrollTrigger);

// Mismas 5 fotos que la galería completa (/historia), en miniatura.
const FOTOS = [undefined, foto2014, undefined, undefined, foto2026];

const HistoriaTeaser = () => {
    const ref = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
            .from(`.${styles.copy} > *`, { opacity: 0, y: reduceMotion ? 0 : 16, duration: 0.5, stagger: 0.08 })
            .from(`.${styles.chip}`, { opacity: 0, y: reduceMotion ? 0 : 16, duration: 0.4, stagger: 0.07 }, 0.15);
    }, { scope: ref });

    return (
        <section id="historia" className={styles.teaser} ref={ref}>
            <div className={styles.inner}>
                <div className={styles.copy}>
                    <span className={styles.eyebrow}>Nuestros viajes</span>
                    <h2>Galería de viajes</h2>
                    <p>
                        Un vistazo a las rutas y mudanzas que hemos hecho por Costa Rica.
                    </p>
                    <Link to="/historia" className={styles.cta}>
                        Ver galería completa <ArrowUpRight size={18} />
                    </Link>
                </div>

                <div className={styles.strip}>
                    {FOTOS.map((foto, i) => (
                        <Link to="/historia" key={i} className={styles.chip}>
                            {foto
                                ? <img src={foto} alt="Mudanza de MudaFletesRivera" loading="lazy" decoding="async" />
                                : <ImagePlus size={20} />}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HistoriaTeaser;
