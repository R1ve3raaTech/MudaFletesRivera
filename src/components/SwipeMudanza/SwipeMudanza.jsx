import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SwipeMudanza.module.css';

// Gesto táctil global bidireccional:
//  - En cualquier página (salvo /mimudanza): deslizar hacia la IZQUIERDA
//    desde la zona central arrastra el panel "Mi mudanza".
//  - En /mimudanza: deslizar hacia la DERECHA arrastra el panel "Inicio".
// El panel sigue el dedo 1:1 y aparece debajo del punto de toque para que
// el dedo no lo tape. Para confirmar hay que MANTENER el panel abierto un
// instante: una carga se llena (~550ms) con ticks hápticos y al
// completarse navega; si se suelta antes, vuelve con resorte.

const HINT_KEY = 'swipe-mudanza-visto';
const UMBRAL_CARGA = 0.7; // fracción del panel abierta para empezar a cargar
const MS_CARGA = 550;

const SwipeMudanza = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const panelRef = useRef(null);
    const scrimRef = useRef(null);
    const raf = useRef(0);
    const rafCarga = useRef(0);
    const [hintVisible, setHintVisible] = useState(false);

    // La variante del panel se congela durante la cortina de salida: si se
    // recalculara con la ruta nueva, tras navegar se vería un destello del
    // panel contrario mientras se retira.
    const esVolverRuta = pathname === '/mimudanza';
    const [esVolver, setEsVolver] = useState(esVolverRuta);
    const enSalida = useRef(false);
    useEffect(() => {
        if (!enSalida.current) setEsVolver(esVolverRuta);
    }, [esVolverRuta]);
    const lado = esVolver ? -1 : 1; // 1: panel a la derecha; -1: a la izquierda

    useEffect(() => {
        if (pathname === '/' && !localStorage.getItem(HINT_KEY)) {
            const t = setTimeout(() => setHintVisible(true), 2500);
            return () => clearTimeout(t);
        }
        setHintVisible(false);
    }, [pathname]);

    const ancho = () => panelRef.current?.offsetWidth || 230;

    const refs = useRef({ lado });
    refs.current.lado = lado;

    // x = apertura del panel (0 = oculto, ancho() = abierto)
    const pintar = (x) => {
        const w = ancho();
        const t = Math.min(x / w, 1.15);
        if (panelRef.current) {
            const s = refs.current.lado;
            panelRef.current.style.transform = `translateY(-50%) translateX(${s * (w - x)}px)`;
            panelRef.current.style.setProperty('--tirar', String(Math.min(t, 1)));
        }
        if (scrimRef.current) scrimRef.current.style.opacity = String(Math.min(t, 1) * 0.9);
    };

    const ponerCarga = (c) => panelRef.current?.style.setProperty('--carga', String(c));

    // Resorte crítico-amortiguado con velocidad inicial del dedo
    const resorte = (desde, hasta, v0, alFinal) => {
        cancelAnimationFrame(raf.current);
        const rigidez = 440, amortiguacion = 2 * Math.sqrt(rigidez);
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

    const confirmar = (desde) => {
        const destino = refs.current.lado === -1 ? '/' : '/mimudanza';
        enSalida.current = true;
        navigator.vibrate?.([14, 40, 18]);
        localStorage.setItem(HINT_KEY, '1');
        setHintVisible(false);
        navigate(destino);
        resorte(desde, ancho(), 300, () => {
            const panel = panelRef.current, scrim = scrimRef.current;
            if (!panel) return;
            panel.style.transition = 'transform 0.35s cubic-bezier(0.32, 0, 0.67, 0)';
            panel.style.transform = `translateY(-50%) translateX(${refs.current.lado * 100}%)`;
            if (scrim) { scrim.style.transition = 'opacity 0.3s ease'; scrim.style.opacity = '0'; }
            setTimeout(() => {
                panel.style.transition = '';
                if (scrim) scrim.style.transition = '';
                ponerCarga(0);
                pintar(0);
                enSalida.current = false;
                setEsVolver(rutaRef.current === '/mimudanza');
            }, 380);
        });
    };

    const cerrar = (desde, v0) => { ponerCarga(0); resorte(desde, 0, v0, null); };

    // Gesto global (solo puntero táctil)
    const rutaRef = useRef(pathname);
    rutaRef.current = pathname;
    useEffect(() => {
        const alPointerDown = (e) => {
            if (e.pointerType === 'mouse') return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const vw = window.innerWidth, vh = window.innerHeight;
            const volver = rutaRef.current === '/mimudanza';
            const s = volver ? -1 : 1;
            // zona de arranque: mitad central, lejos de los bordes del sistema
            if (volver) {
                if (e.clientX > vw * 0.75 || e.clientX < 24) return;
            } else {
                if (e.clientX < vw * 0.25 || e.clientX > vw - 24) return;
            }
            if (e.target.closest('input, select, textarea, [data-no-swipe]')) return;

            cancelAnimationFrame(raf.current);
            cancelAnimationFrame(rafCarga.current);
            const x0 = e.clientX, y0 = e.clientY;
            let activo = false, descartado = false, cerrado = false;
            let carga = 0, cargando = false;
            let ultimaX = 0;

            // colocar el panel debajo del dedo (sin taparlo), dentro de la vista
            if (panelRef.current) {
                const alto = panelRef.current.offsetHeight || 220;
                const top = Math.min(Math.max(y0 + 90 + alto / 2, alto / 2 + 80), vh - alto / 2 - 96);
                panelRef.current.style.top = `${top}px`;
            }

            const bloquearScroll = (ev) => { if (activo) ev.preventDefault(); };

            const limpiar = () => {
                window.removeEventListener('pointermove', mover);
                window.removeEventListener('pointerup', soltar);
                window.removeEventListener('pointercancel', soltar);
                window.removeEventListener('touchmove', bloquearScroll);
            };

            const cicloCarga = (prev) => {
                rafCarga.current = requestAnimationFrame((ahora) => {
                    const dt = ahora - prev;
                    if (cerrado) return;
                    if (cargando) carga = Math.min(carga + dt / MS_CARGA, 1);
                    else carga = Math.max(carga - dt / (MS_CARGA * 0.5), 0);
                    ponerCarga(carga);
                    if (carga >= 1) {
                        cerrado = true;
                        limpiar();
                        confirmar(ultimaX);
                        return;
                    }
                    if (carga > 0 || cargando) cicloCarga(ahora);
                });
            };

            const mover = (ev) => {
                if (descartado || cerrado) return;
                const dx = (x0 - ev.clientX) * s; // >0 en la dirección del gesto
                const dy = Math.abs(ev.clientY - y0);
                if (!activo) {
                    if (dy > 14 && dy > dx) { descartado = true; limpiar(); return; }
                    if (dx > 6 && dx > dy * 1.2) activo = true;
                    if (!activo) return;
                }
                const w = ancho();
                const x = dx <= w ? Math.max(dx, 0) : w + (dx - w) * 0.25;
                ultimaX = Math.min(x, w);
                pintar(x);
                const antes = cargando;
                cargando = x >= w * UMBRAL_CARGA;
                if (cargando && !antes) {
                    navigator.vibrate?.(6);
                    cancelAnimationFrame(rafCarga.current);
                    cicloCarga(performance.now());
                }
            };

            const soltar = (ev) => {
                limpiar();
                cargando = false;
                if (cerrado || !activo) return;
                cerrado = true;
                cancelAnimationFrame(rafCarga.current);
                const dx = Math.max((x0 - ev.clientX) * s, 0);
                cerrar(Math.min(dx, ancho()), 0);
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
            cancelAnimationFrame(rafCarga.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const abrirDirecto = () => {
        localStorage.setItem(HINT_KEY, '1');
        setHintVisible(false);
        navigate('/mimudanza');
    };

    return (
        <>
            <div ref={scrimRef} className={styles.scrim} />
            <div
                ref={panelRef}
                className={`${styles.panel} ${esVolver ? styles.panelIzq : ''}`}
                aria-hidden="true"
            >
                <span className={`material-symbols-outlined ${styles.panelIcon}`}>
                    {esVolver ? 'home_pin' : 'local_shipping'}
                </span>
                <div className={styles.panelTitle}>{esVolver ? 'Volver al inicio' : 'Mi mudanza'}</div>
                <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
                <div className={styles.suelta}>¡Mantén para {esVolver ? 'volver' : 'cotizar'}!</div>
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
