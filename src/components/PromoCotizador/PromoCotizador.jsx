import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';
import { Timer, X, ArrowRight, Truck } from 'lucide-react';
import { DARK_LOGO_URL } from '../../branding';
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
    const { pathname, search } = useLocation();
    const preview = import.meta.env.DEV && new URLSearchParams(search).get('preview') === 'cotizador';
    const [visible, setVisible] = useState(false);
    const cardRef = useRef(null);
    const overlayRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const abierto = visible && !pathname.startsWith('/mimudanza');

    useEffect(() => {
        if (pathname.startsWith('/mimudanza') || (!preview && fueVistoRecientemente())) return;
        const timer = setTimeout(() => setVisible(true), RETRASO_MS);
        return () => clearTimeout(timer);
    }, [pathname, preview]);

    const cerrar = useCallback(() => {
        marcarVisto();
        setVisible(false);
    }, []);

    useEffect(() => {
        if (!abierto) return undefined;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const siblings = [...(overlayRef.current?.parentElement?.children || [])]
            .filter((element) => element !== overlayRef.current)
            .map((element) => [element, element.inert]);
        siblings.forEach(([element]) => { element.inert = true; });
        cardRef.current?.focus({ preventScroll: true });

        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                cerrar();
            }
            if (event.key !== 'Tab') return;
            const focusable = [...cardRef.current.querySelectorAll('a[href], button:not(:disabled)')];
            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && (document.activeElement === first || document.activeElement === cardRef.current)) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
            siblings.forEach(([element, inert]) => { element.inert = inert; });
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
                previousFocus.focus({ preventScroll: true });
            }
        };
    }, [abierto, cerrar]);

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence>
                {abierto && (
                    <Motion.div
                        key="promo-cotizador"
                        className={styles.overlay}
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        onClick={(event) => { if (event.target === event.currentTarget) cerrar(); }}
                    >
                        <Motion.div
                            className={styles.card}
                            ref={cardRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="promo-cotizador-title"
                            aria-describedby="promo-cotizador-description"
                            tabIndex={-1}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <button type="button" className={styles.cerrar} onClick={cerrar} disabled={!visible} aria-label="Cerrar aviso">
                                <X size={20} />
                            </button>

                            <div className={styles.visual} aria-hidden="true">
                                <img src={DARK_LOGO_URL} alt="" className={styles.brandLogo} width="72" height="35" />
                                <Motion.div
                                    className={styles.clock}
                                    initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.08 }}
                                >
                                    <Timer strokeWidth={1.4} />
                                </Motion.div>
                                <span className={styles.orbit} />
                            </div>

                            <div className={styles.content}>
                                <span className={styles.badge}>
                                    <Truck size={16} /> Cotización express
                                </span>
                                <h3 className={styles.titulo} id="promo-cotizador-title">
                                    Cotiza tu mudanza en <em>menos de 2 minutos</em>
                                </h3>
                                <p className={styles.sub} id="promo-cotizador-description">
                                    Responde unas preguntas rápidas y mira tu precio estimado al instante,
                                    sin llamadas ni esperas.
                                </p>
                                <div className={styles.actions}>
                                    <Link to="/mimudanza" className={styles.cta} onClick={cerrar}>
                                        Cotizar ahora <span aria-hidden="true"><ArrowRight size={20} /></span>
                                    </Link>
                                    <button type="button" className={styles.despues} onClick={cerrar} disabled={!visible}>
                                        Quizás después
                                    </button>
                                </div>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
}
