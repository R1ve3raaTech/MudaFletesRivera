import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImagePlus, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import SEO from '../SEO';
import foto2014 from '../../assets/historia-2014.webp';
import foto2026 from '../../assets/historia-2026.webp';
import foto3 from '../../assets/historia-3.webp';
import foto4 from '../../assets/historia-4.webp';
import styles from './Historia.module.css';

gsap.registerPlugin(ScrollTrigger);

// Cada foto espera una imagen real (fotoSrc) y el lugar donde se tomó
// (ubicacion). Mientras falten, se muestra un aviso honesto en vez de
// inventar una imagen o un lugar.
const FOTOS = [
    { fotoSrc: foto3, ubicacion: undefined },
    { fotoSrc: foto2014, ubicacion: undefined },
    { fotoSrc: foto4, ubicacion: 'Parrita, Puntarenas' },
    { fotoSrc: undefined, ubicacion: undefined },
    { fotoSrc: foto2026, ubicacion: undefined },
];

const TarjetaFoto = ({ fotoSrc, ubicacion }) => (
    <div className={styles.card}>
        {fotoSrc ? (
            <img
                src={fotoSrc}
                alt={ubicacion ? `Mudanza de MudaFletesRivera en ${ubicacion}` : 'Mudanza de MudaFletesRivera'}
                loading="lazy"
                decoding="async"
                className={styles.foto}
            />
        ) : (
            <div className={styles.placeholder} role="img" aria-label="Foto pendiente">
                <ImagePlus size={26} />
                <span>Foto pendiente</span>
            </div>
        )}
        <div className={styles.caption}>
            <MapPin size={14} />
            <span>{ubicacion || 'Ubicación pendiente'}</span>
        </div>
    </div>
);

const Historia = () => {
    const headerRef = useRef(null);
    const galleryRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(`.${styles.eyebrow}`, { opacity: 0, y: 14, duration: 0.5 })
            .from(`.${styles.title}`, { opacity: 0, y: 22, duration: 0.6 }, 0.1)
            .from(`.${styles.subtitle}`, { opacity: 0, y: 14, duration: 0.5 }, 0.25);
    }, { scope: headerRef });

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.from(`.${styles.card}`, {
            opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.97, duration: 0.5, stagger: 0.08,
            scrollTrigger: { trigger: galleryRef.current, start: 'top 85%', once: true },
        });
    }, { scope: galleryRef });

    return (
        <div className={styles.page}>
            <SEO
                title="Galería de viajes — MudaFletesRivera"
                description="Fotos reales de mudanzas y viajes de MudaFletesRivera por Costa Rica."
                path="/historia"
            />

            <header className={styles.hero} ref={headerRef}>
                <span className={styles.eyebrow}>Nuestros viajes</span>
                <h1 className={styles.title}>Galería de viajes</h1>
                <p className={styles.subtitle}>
                    Un vistazo a las rutas y mudanzas que hemos hecho por Costa Rica.
                </p>
            </header>

            <div className={styles.gallery} ref={galleryRef}>
                {FOTOS.map((f, i) => (
                    <TarjetaFoto key={i} fotoSrc={f.fotoSrc} ubicacion={f.ubicacion} />
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
