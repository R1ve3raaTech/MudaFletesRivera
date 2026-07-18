import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SwipeMudanza.module.css';

// Gesto táctil global: deslizar hacia la izquierda desde la zona central de
// la pantalla (no desde el borde, que en Android es el gesto de "atrás")
// arrastra un panel "Mi mudanza" que sigue el dedo 1:1; al soltar, la
// inercia decide si navega a /mimudanza o vuelve con resorte.

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

    const ancho = () => panelRef.current?.offsetWidth || 250;

    // x = desplazamiento del panel hacia la izquierda (0 = oculto, ancho() = abierto)
    const pintar = (x) => {
        const w = ancho();
        const t = Math.min(x / w, 1.15);
        if (panelRef.current) {
            panelRef.current.style.transform = `translateY(-50%) translateX(${w - x}px)`;
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
            panel.style.transform = 'translateY(-50%) translateX(100%)';
            if (scrim) { scrim.style.transition = 'opacity 0.3s ease'; scrim.style.opacity = '0'; }
            setTimeout(() => {
                panel.style.transition = '';
                if (scrim) scrim.style.transition = '';
                pintar(0);
            }, 380);
        });
    };

    const cerrar = (desde, v0) => resorte(desde, 0, v0, null);

    // Gesto global en toda la pantalla (solo puntero táctil)
    const rutaRef = useRef(pathname);
    rutaRef.current = pathname;
    useEffect(() => {
        const alPointerDown = (e) => {
            if (rutaRef.current === '/mimudanza') return;
            if (e.pointerType === 'mouse') return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const vw = window.innerWidth;
            // zona de arranque: del 25% del ancho hacia la derecha, pero lejos
            // de los bordes (24px), que son del gesto "atrás" del sistema
            if (e.clientX < vw * 0.25 || e.clientX > vw - 24 || e.clientX < 24) return;
            if (e.target.closest('input, select, textarea, [data-no-swipe]')) return;

            cancelAnimationFrame(raf.current);
            const x0 = e.clientX, y0 = e.clientY;
            let historia = [{ x: e.clientX, t: e.timeStamp }];
            let activo = false, descartado = false;

            const bloquearScroll = (ev) => { if (activo) ev.preventDefault(); };

            const limpiar = () => {
                window.removeEventListener('pointermove', mover);
                window.removeEventListener('pointerup', soltar);
                window.removeEventListener('pointercancel', soltar);
                window.removeEventListener('touchmove', bloquearScroll);
            };

            const mover = (ev) => {
                if (descartado) return;
                const dx = x0 - ev.clientX; // >0 hacia la izquierda
                const dy = Math.abs(ev.clientY - y0);
                if (!activo) {
                    if (dy > 14 && dy > dx) { descartado = true; limpiar(); return; } // es scroll
                    if (dx > 6 && dx > dy * 1.2) activo = true; // intención horizontal
                    if (!activo) return;
                }
                historia.push({ x: ev.clientX, t: ev.timeStamp });
                if (historia.length > 6) historia.shift();
                const w = ancho();
                const x = dx <= w ? Math.max(dx, 0) : w + (dx - w) * 0.25; // rubber-band
                pintar(x);
            };

            const soltar = (ev) => {
                limpiar();
                if (!activo) return;
                const dx = Math.max(x0 - ev.clientX, 0);
                const w = ancho();
                const x = Math.min(dx, w);
                const a = historia[0], b = historia[historia.length - 1];
                const v = b.t > a.t ? ((a.x - b.x) / (b.t - a.t)) * 1000 : 0;
                // proyección de inercia (Apple: v/1000 * d/(1-d), d=0.998)
                const proyeccion = x + (v / 1000) * 0.998 / (1 - 0.998);
                if (proyeccion > w * 0.4) abrir(x, v);
                else cerrar(x, v);
            };

            window.addEventListener('pointermove', mover);
            window.addEventListener('pointerup', soltar);
            window.addEventListener('pointercancel', soltar);
            window.addEventListener('touchmove', bloquearScroll, { passive: false });
        };

        window.addEventListener('pointerdown', alPointerDown);
        return () => {
            window.removeEventListener('pointerdown', alPointerDown);
            cancelAnimationFrame(raf.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (pathname === '/mimudanza') return null;

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
                <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
                <div className={styles.suelta}>¡Suelta para cotizar!</div>
            </div>
            {hintVisible && (
                <button className={styles.hint} onClick={abrirDirecto} aria-label="Abrir Mi mudanza">
                    <span className={styles.chevrons}><span>‹</span><span>‹</span><span>‹</span></span>
                    Desliza · Mi mudanza
                </button>
            )}
        </>
    );
};

export default SwipeMudanza;
