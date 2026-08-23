import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus, MessageCircle, ArrowUpRight } from 'lucide-react';
import SEO from '../SEO';
import styles from './Historia.module.css';

gsap.registerPlugin(ScrollTrigger);

// Cada hito espera una foto real (src) que reemplace el placeholder.
// Mientras no llegue, fotoSrc queda undefined y se muestra el aviso
// "Foto pendiente" en vez de fingir una imagen genérica.
const HITOS = [
    {
        year: '2010',
        title: 'Primeros años',
        description: 'Los primeros viajes, con un solo camión y la promesa de tratar cada mudanza como si fuera la nuestra.',
        fotoSrc: undefined,
    },
    {
        year: '2014',
        title: 'Primeros grandes clientes',
        description: 'Empezamos a atender mudanzas de oficina y a coordinar con administraciones de edificios y condominios.',
        fotoSrc: undefined,
    },
    {
        year: '2018',
        title: 'Ampliamos la flota',
        description: 'Sumamos más camiones y personal para cubrir todo el Gran Área Metropolitana con mayor capacidad.',
        fotoSrc: undefined,
    },
    {
        year: '2022',
        title: 'Cotizador en línea',
        description: 'Lanzamos la cotización digital para dar un precio estimado al instante, sin llamadas ni esperas.',
        fotoSrc: undefined,
    },
    {
        year: '2026',
        title: 'Hoy',
        description: 'Seguimos con la misma promesa del primer día: puntualidad, cuidado y precio justo en cada mudanza.',
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

const Historia = () => {
    const headerRef = useRef(null);
    const timelineRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(`.${styles.eyebrow}`, { opacity: 0, y: 14, duration: 0.5 })
            .from(`.${styles.title}`, { opacity: 0, y: 22, duration: 0.6 }, 0.1)
            .from(`.${styles.subtitle}`, { opacity: 0, y: 14, duration: 0.5 }, 0.25);
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
        <div className={styles.page}>
            <SEO
                title="Nuestra historia — MudaFletesRivera"
                description="Conozca la trayectoria de MudaFletesRivera: más de 15 años de mudanzas y transporte en Costa Rica, año a año."
                path="/historia"
            />

            <header className={styles.hero} ref={headerRef}>
                <span className={styles.eyebrow}>Nuestra trayectoria</span>
                <h1 className={styles.title}>A través de los años</h1>
                <p className={styles.subtitle}>
                    De un solo camión a un equipo que se mueve por todo Costa Rica.
                    Este es el camino que hemos recorrido, año a año.
                </p>
            </header>

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

            <div className={styles.ctaBlock}>
                <p>¿Quiere formar parte de nuestra próxima mudanza?</p>
                <div className={styles.ctaActions}>
                    <a
                        href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.primaryBtn}
                    >
                        <MessageCircle size={18} /> Escribir por WhatsApp
                    </a>
                    <Link to="/mimudanza" className={styles.secondaryBtn}>
                        Cotizar en línea <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Historia;
