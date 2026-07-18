import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Timer, X, ArrowRight, Truck } from 'lucide-react';
import styles from './PromoCotizador.module.css';

const CLAVE = 'promoCotizadorVisto';
const DIAS_SILENCIO = 3;
const RETRASO_MS = 2500;

const fueVistoRecientemente = () => {
    try {
        const ts = Number(localStorage.getItem(CLAVE) || 0);
        return Date.now() - ts < DIAS_SILENCIO * 86400000;
    } catch { return false; }
};

const marcarVisto = () => {
    try { localStorage.setItem(CLAVE, String(Date.now())); } catch { /* sin storage */ }
};

export default function PromoCotizador() {
    const { pathname } = useLocation();
    const [visible, setVisible] = useState(false);
    const [cerrando, setCerrando] = useState(false);
    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (pathname.startsWith('/mimudanza')) return;
        if (fueVistoRecientemente()) return;
        const timer = setTimeout(() => setVisible(true), RETRASO_MS);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Bloquea el scroll de fondo mientras el modal está abierto
    useEffect(() => {
        if (!visible) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [visible]);

    useGSAP(() => {
        if (!visible || !cardRef.current) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.from(overlayRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' });
        gsap.from(cardRef.current, {
            opacity: 0,
            y: reduceMotion ? 0 : 46,
            scale: reduceMotion ? 1 : 0.9,
            duration: 0.55,
            ease: 'back.out(1.5)',
            delay: 0.05,
        });
    }, { dependencies: [visible] });

    const cerrar = () => {
        marcarVisto();
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !cardRef.current) { setVisible(false); return; }
        setCerrando(true);
        gsap.to(cardRef.current, { opacity: 0, y: 30, scale: 0.93, duration: 0.25, ease: 'power2.in' });
        gsap.to(overlayRef.current, {
            opacity: 0, duration: 0.3, ease: 'power1.in',
            onComplete: () => { setVisible(false); setCerrando(false); },
        });
    };

    useEffect(() => {
        if (!visible) return;
        const onKey = (e) => { if (e.key === 'Escape') cerrar(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    if (!visible || pathname.startsWith('/mimudanza')) return null;

    return (
        <div
            className={styles.overlay}
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cotiza tu mudanza en menos de 2 minutos"
            onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}
        >
            <div className={styles.card} ref={cardRef}>
                <button
                    type="button"
                    className={styles.cerrar}
                    onClick={cerrar}
                    disabled={cerrando}
                    aria-label="Cerrar aviso"
                >
                    <X size={18} />
                </button>

                <div className={styles.icono}>
                    <Timer size={34} />
                </div>

                <span className={styles.badge}>
                    <Truck size={14} /> Cotización express
                </span>

                <h3 className={styles.titulo}>
                    Cotiza tu mudanza en <em>menos de 2 minutos</em>
                </h3>

                <p className={styles.sub}>
                    Responde unas preguntas rápidas y mira tu precio estimado al instante,
                    sin llamadas ni esperas.
                </p>

                <Link to="/mimudanza" className={styles.cta} onClick={marcarVisto}>
                    Cotizar ahora <ArrowRight size={18} />
                </Link>

                <button type="button" className={styles.despues} onClick={cerrar} disabled={cerrando}>
                    Quizás después
                </button>

                <p className={styles.tipSwipe}>
                    <span aria-hidden="true">👈</span> Tip: desliza el dedo hacia la
                    izquierda en cualquier momento para cotizar
                </p>
            </div>
        </div>
    );
}
