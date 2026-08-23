import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus, ArrowUpRight } from 'lucide-react';
import styles from './HistoriaTeaser.module.css';

gsap.registerPlugin(ScrollTrigger);

const AÑOS = ['2010', '2014', '2018', '2022', '2026'];

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
                    <span className={styles.eyebrow}>Nuestra trayectoria</span>
                    <h2>A través de los años</h2>
                    <p>
                        De 2010 a hoy: así hemos crecido junto a cada familia y empresa
                        que confió su mudanza en nosotros.
                    </p>
                    <Link to="/historia" className={styles.cta}>
                        Ver nuestra historia completa <ArrowUpRight size={18} />
                    </Link>
                </div>

                <div className={styles.strip}>
                    {AÑOS.map((año) => (
                        <Link to="/historia" key={año} className={styles.chip}>
                            <ImagePlus size={20} />
                            <span>{año}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HistoriaTeaser;
