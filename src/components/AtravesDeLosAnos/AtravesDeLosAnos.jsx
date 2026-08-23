import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus } from 'lucide-react';
import styles from './AtravesDeLosAnos.module.css';

gsap.registerPlugin(ScrollTrigger);

// Cada hito espera una foto real (src) que reemplace el placeholder.
// Mientras no llegue, fotoSrc queda undefined y se muestra el aviso
// "Foto pendiente" en vez de fingir una imagen genérica.
const HITOS = [
    {
        year: '2015',
        title: 'Los primeros kilómetros',
        description: 'Arrancamos con un solo camión y la promesa de tratar cada mudanza como si fuera la nuestra.',
        fotoSrc: undefined,
    },
    {
        year: '2020',
        title: 'Creciendo con cada mudanza',
        description: 'Ampliamos la flota y el equipo para responder a más familias y empresas en todo el GAM.',
        fotoSrc: undefined,
    },
    {
        year: '2025',
        title: 'Más de 20 años de experiencia',
        description: 'Hoy seguimos con la misma promesa del primer día: puntualidad, cuidado y precio justo.',
        fotoSrc: undefined,
    },
];

const FotoHito = ({ year, fotoSrc, alt }) => {
    if (fotoSrc) {
        return <img src={fotoSrc} alt={alt} loading="lazy" decoding="async" className={styles.foto} />;
    }
    return (
        <div className={styles.placeholder} role="img" aria-label={`Foto pendiente de ${year}`}>
            <ImagePlus size={26} />
            <span>Foto pendiente</span>
            <strong>{year}</strong>
        </div>
    );
};

const AtravesDeLosAnos = () => {
    const headerRef = useRef(null);
    const timelineRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.sectionHeader} h2`, { opacity: 0, y: 20, duration: 0.4 })
            .from(`.${styles.sectionHeader} p`, { opacity: 0, duration: 0.4 }, 0.15);
    }, { scope: headerRef });

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            gsap.set(`.${styles.timelineLine}`, { scaleY: 1 });
        } else {
            gsap.to(`.${styles.timelineLine}`, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top 70%',
                    end: 'bottom 70%',
                    scrub: 0.6,
                },
            });
        }

        gsap.utils.toArray(`.${styles.hito}`).forEach((hito, i) => {
            const desdeX = reduceMotion ? 0 : (i % 2 === 0 ? -28 : 28);
            gsap.from(hito, {
                opacity: 0, x: desdeX, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: hito, start: 'top 85%', once: true },
            });
            gsap.from(hito.querySelector(`.${styles.marker}`), {
                scale: reduceMotion ? 1 : 0, duration: 0.4, ease: 'back.out(2)',
                scrollTrigger: { trigger: hito, start: 'top 82%', once: true },
            });
        });
    }, { scope: timelineRef });

    return (
        <section id="historia" className={styles.historia}>
            <div className={styles.sectionHeader} ref={headerRef}>
                <h2>A través de los años</h2>
                <p>
                    Dos décadas de mudanzas en Costa Rica, contadas en imágenes.
                </p>
            </div>

            <div className={styles.timeline} ref={timelineRef}>
                <div className={styles.timelineLine} aria-hidden="true" />

                {HITOS.map((h, i) => (
                    <div key={h.year} className={`${styles.hito} ${i % 2 === 1 ? styles.reverse : ''}`}>
                        <div className={styles.hitoContent}>
                            <span className={styles.hitoYear}>{h.year}</span>
                            <h3>{h.title}</h3>
                            <p>{h.description}</p>
                        </div>

                        <div className={styles.marker} aria-hidden="true" />

                        <div className={styles.hitoPhotoCol}>
                            <FotoHito year={h.year} fotoSrc={h.fotoSrc} alt={`MudaFletesRivera en ${h.year}: ${h.title}`} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AtravesDeLosAnos;
