import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Timer, X, ArrowRight } from 'lucide-react';
import styles from './PromoCotizador.module.css';

const CLAVE = 'promoCotizadorVisto';
const DIAS_SILENCIO = 3;
const RETRASO_MS = 4000;

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
    const cardRef = useRef(null);

    useEffect(() => {
        if (pathname.startsWith('/mimudanza')) return;
        if (fueVistoRecientemente()) return;
        const timer = setTimeout(() => setVisible(true), RETRASO_MS);
        return () => clearTimeout(timer);
    }, [pathname]);

    useGSAP(() => {
        if (!visible || !cardRef.current) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.from(cardRef.current, {
            opacity: 0,
            y: reduceMotion ? 0 : 34,
            scale: reduceMotion ? 1 : 0.94,
            duration: 0.5,
            ease: 'back.out(1.4)',
        });
    }, { dependencies: [visible] });

    const cerrar = () => {
        marcarVisto();
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !cardRef.current) { setVisible(false); return; }
        setCerrando(true);
        gsap.to(cardRef.current, {
            opacity: 0, y: 24, scale: 0.95, duration: 0.28, ease: 'power2.in',
            onComplete: () => { setVisible(false); setCerrando(false); },
        });
    };

    if (!visible || pathname.startsWith('/mimudanza')) return null;

    return (
        <aside className={styles.card} ref={cardRef} role="complementary" aria-label="Cotización rápida">
            <button
                type="button"
                className={styles.cerrar}
                onClick={cerrar}
                disabled={cerrando}
                aria-label="Cerrar aviso"
            >
                <X size={15} />
            </button>

            <div className={styles.icono}>
                <Timer size={22} />
            </div>

            <div className={styles.texto}>
                <strong>Tu cotización en menos de 2 minutos</strong>
                <span>Responde unas preguntas y mira tu precio estimado al instante.</span>
            </div>

            <Link to="/mimudanza" className={styles.cta} onClick={marcarVisto}>
                Cotizar ahora <ArrowRight size={15} />
            </Link>
        </aside>
    );
}
