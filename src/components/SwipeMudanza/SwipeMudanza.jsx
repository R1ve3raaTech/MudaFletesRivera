import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SwipeMudanza.module.css';

// Gesto de borde derecho estilo iOS: arrastra desde el borde y un panel
// "Mi mudanza" sigue el dedo 1:1; al soltar, la velocidad decide si se
// abre (navega a /mimudanza) o vuelve con un resorte.

const HINT_KEY = 'swipe-mudanza-visto';

const SwipeMudanza = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const panelRef = useRef(null);
    const scrimRef = useRef(null);
    const raf = useRef(0);
    const [hintVisible, setHintVisible] = useState(false);

    useEffect(() => {
        if (pathname === '/' && !localStorage.getItem(HINT_KEY)) {
            const t = setTimeout(() => setHintVisible(true), 2500);
            return () => clearTimeout(t);
        }
        setHintVisible(false);
    }, [pathname]);

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    if (pathname === '/mimudanza') return null;

    const ancho = () => panelRef.current?.offsetWidth || 320;

    // x = desplazamiento del panel hacia la izquierda (0 = oculto, ancho() = abierto)
    const pintar = (x) => {
        const w = ancho();
        const t = Math.min(x / w, 1.15);
        if (panelRef.current) {
            panelRef.current.style.transform = `translateX(${w - x}px)`;
            panelRef.current.style.setProperty('--tirar', String(Math.min(t, 1)));
        }
        if (scrimRef.current) scrimRef.current.style.opacity = String(Math.min(t, 1) * 0.9);
    };

    // Resorte crítico-amortiguado con velocidad inicial del dedo
    const resorte = (desde, hasta, v0, alFinal) => {
        cancelAnimationFrame(raf.current);
        const rigidez = 440, amortiguacion = 2 * Math.sqrt(rigidez); // damping 1.0, response ~0.3s
        let x = desde, v = v0, prev = performance.now();
        const paso = (ahora) => {
            const dt = Math.min((ahora - prev) / 1000, 1 / 30);
            prev = ahora;
            const a = -rigidez * (x - hasta) - amortiguacion * v;
            v += a * dt;
            x += v * dt;
            if (Math.abs(x - hasta) < 2 && Math.abs(v) < 60) {
                pintar(hasta);
                alFinal?.();
                return;
            }
            pintar(x);
            raf.current = requestAnimationFrame(paso);
        };
        raf.current = requestAnimationFrame(paso);
    };

    const abrir = (desde, v0) => {
        // El compromiso es inmediato: háptica + navegación ya, y el panel
        // termina de abrirse y se retira por donde vino (cortina).
        navigator.vibrate?.(12);
        localStorage.setItem(HINT_KEY, '1');
        setHintVisible(false);
        navigate('/mimudanza');
        resorte(desde, ancho(), v0, () => {
            const panel = panelRef.current, scrim = scrimRef.current;
            if (!panel) return;
            panel.style.transition = 'transform 0.35s cubic-bezier(0.32, 0, 0.67, 0)';
            panel.style.transform = 'translateX(100%)';
            if (scrim) { scrim.style.transition = 'opacity 0.3s ease'; scrim.style.opacity = '0'; }
            setTimeout(() => {
                panel.style.transition = '';
                if (scrim) scrim.style.transition = '';
                pintar(0);
            }, 380);
        });
    };

    const cerrar = (desde, v0) => resorte(desde, 0, v0, null);

    const alPointerDown = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Sin gesto elástico: un toque en la zona/pestaña abre directamente
            return;
        }
        cancelAnimationFrame(raf.current);
        const zona = e.currentTarget;
        zona.setPointerCapture(e.pointerId);
        const x0 = e.clientX;
        let historia = [{ x: e.clientX, t: e.timeStamp }];
        let activo = false;

        const mover = (ev) => {
            const dx = x0 - ev.clientX; // >0 al arrastrar hacia la izquierda
            if (!activo && dx > 8) activo = true; // histéresis
            if (!activo) return;
            historia.push({ x: ev.clientX, t: ev.timeStamp });
            if (historia.length > 6) historia.shift();
            const w = ancho();
            // rubber-band al pasarse del ancho del panel
            const x = dx <= w ? Math.max(dx, 0) : w + (dx - w) * 0.25;
            pintar(x);
        };

        const soltar = (ev) => {
            zona.removeEventListener('pointermove', mover);
            zona.removeEventListener('pointerup', soltar);
            zona.removeEventListener('pointercancel', soltar);
            if (!activo) return;
            const dx = Math.max(x0 - ev.clientX, 0);
            const w = ancho();
            const x = Math.min(dx, w);
            // velocidad (px/s) con signo: >0 = abriendo
            const a = historia[0], b = historia[historia.length - 1];
            const v = b.t > a.t ? ((a.x - b.x) / (b.t - a.t)) * 1000 : 0;
            // proyección de inercia (Apple: v/1000 * d/(1-d), d=0.998)
            const proyeccion = x + (v / 1000) * 0.998 / (1 - 0.998);
            if (proyeccion > w * 0.5) abrir(x, v);
            else cerrar(x, v);
        };

        zona.addEventListener('pointermove', mover);
        zona.addEventListener('pointerup', soltar);
        zona.addEventListener('pointercancel', soltar);
    };

    const abrirDirecto = () => {
        localStorage.setItem(HINT_KEY, '1');
        setHintVisible(false);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            navigate('/mimudanza');
        } else {
            abrir(0, 900);
        }
    };

    return (
        <>
            <div ref={scrimRef} className={styles.scrim} />
            <div ref={panelRef} className={styles.panel} aria-hidden="true">
                <span className={`material-symbols-outlined ${styles.panelIcon}`}>local_shipping</span>
                <div className={styles.panelTitle}>Mi mudanza</div>
                <div className={styles.panelText}>Cotiza en menos de 2 minutos, sin llamadas.</div>
                <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
                <div className={styles.suelta}>¡Suelta para cotizar!</div>
            </div>
            <div className={styles.zone} onPointerDown={alPointerDown} />
            {hintVisible && (
                <button className={styles.hint} onClick={abrirDirecto} onPointerDown={alPointerDown} aria-label="Abrir Mi mudanza">
                    <span className={styles.chevrons}><span>‹</span><span>‹</span><span>‹</span></span>
                    Desliza · Mi mudanza
                </button>
            )}
        </>
    );
};

export default SwipeMudanza;
