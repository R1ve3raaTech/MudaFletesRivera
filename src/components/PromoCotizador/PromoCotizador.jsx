import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { LOGO_URL } from '../../branding';
import movingPhoto from '../../assets/mudanza1.webp';
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
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const lockedPath = window.location.pathname;
        const body = document.body;
        const html = document.documentElement;
        const scrollbarWidth = window.innerWidth - html.clientWidth;
        const paddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
        const savedStyles = [
            [body, ['position', 'top', 'left', 'right', 'width', 'overflow', 'padding-right']],
            [html, ['overflow', 'overscroll-behavior', 'scroll-behavior']],
        ].map(([element, properties]) => [element, properties.map((property) => [
            property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property),
        ])]);

        // Fijar el cuerpo evita que Safari móvil desplace la página detrás del aviso.
        html.style.overflow = 'hidden';
        html.style.overscrollBehavior = 'none';
        html.style.scrollBehavior = 'auto';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
        const siblings = [...(overlayRef.current?.parentElement?.children || [])]
            .filter((element) => element !== overlayRef.current)
            .map((element) => [element, element.inert]);
        siblings.forEach(([element]) => { element.inert = true; });
        cardRef.current?.focus({ preventScroll: true });

        const overlay = overlayRef.current;
        let touchY = 0;
        const canScrollCard = (target, delta) => {
            const card = cardRef.current;
            if (!card?.contains(target)) return false;
            if (delta < 0) return card.scrollTop > 0;
            if (delta > 0) return card.scrollTop + card.clientHeight < card.scrollHeight - 1;
            return true;
        };
        const onTouchStart = (event) => { touchY = event.touches[0]?.clientY ?? 0; };
        const onTouchMove = (event) => {
            if (event.touches.length !== 1) return;
            const nextY = event.touches[0].clientY;
            const delta = touchY - nextY;
            touchY = nextY;
            if (!canScrollCard(event.target, delta)) event.preventDefault();
        };
        const onWheel = (event) => {
            if (!canScrollCard(event.target, event.deltaY)) event.preventDefault();
        };
        overlay?.addEventListener('touchstart', onTouchStart, { passive: true });
        overlay?.addEventListener('touchmove', onTouchMove, { passive: false });
        overlay?.addEventListener('wheel', onWheel, { passive: false });

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
            overlay?.removeEventListener('touchstart', onTouchStart);
            overlay?.removeEventListener('touchmove', onTouchMove);
            overlay?.removeEventListener('wheel', onWheel);
            savedStyles.forEach(([element, properties]) => properties.forEach(([property, value, priority]) => {
                if (value) element.style.setProperty(property, value, priority);
                else element.style.removeProperty(property);
            }));
            window.scrollTo({
                left: window.location.pathname === lockedPath ? scrollX : 0,
                top: window.location.pathname === lockedPath ? scrollY : 0,
                behavior: 'instant',
            });
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
                                <img src={movingPhoto} alt="" className={styles.photo} width="1600" height="1200" decoding="async" />
                            </div>

                            <div className={styles.content}>
                                <img src={LOGO_URL} alt="MudaFletesRivera" className={styles.brandLogo} width="108" height="60" />
                                <h3 className={styles.titulo} id="promo-cotizador-title">
                                    Tu mudanza empieza con un precio claro.
                                </h3>
                                <p className={styles.sub} id="promo-cotizador-description">
                                    Cuéntanos qué llevas y a dónde vas. Obtén un precio estimado al instante,
                                    sin llamadas ni esperas.
                                </p>
                                <div className={styles.actions}>
                                    <Link to="/mimudanza" className={styles.cta} onClick={cerrar}>
                                        Cotizar mi mudanza <ArrowRight size={20} aria-hidden="true" />
                                    </Link>
                                    <p className={styles.reassurance}>Gratis y sin compromiso.</p>
                                    <button type="button" className={styles.despues} onClick={cerrar} disabled={!visible}>
                                        Seguir explorando
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
