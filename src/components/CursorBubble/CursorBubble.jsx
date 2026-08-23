import { useEffect, useRef } from 'react';
import styles from './CursorBubble.module.css';

// Máximo de burbujas simultáneas (soporta multitouch sin descontrol)
const MAX_BUBBLES = 6;
// Suavizado del seguimiento: más bajo = la burbuja "arrastra" más al moverse
const LERP = 0.25;
// Cuántas gotitas salen disparadas al soltar (efecto salpicadura)
const SALPICADURA_MIN = 3;
const SALPICADURA_MAX = 5;

// Burbujita de agua que sigue al cursor/dedo mientras se mantiene presionado,
// se deforma como una gota real según la velocidad del arrastre (tensión
// superficial) y salpica en gotitas pequeñas al soltar. Puramente decorativo:
// no bloquea clicks (pointer-events: none) y se desactiva entero con
// reduced-motion, ya que el seguimiento/deformación es el efecto en sí.
const CursorBubble = () => {
    const containerRef = useRef(null);
    const bubblesRef = useRef(new Map());

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const container = containerRef.current;
        const bubbles = bubblesRef.current;

        const setTransform = (state, scaleX, scaleY, angle) => {
            state.el.style.transform =
                `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        };

        const tick = (id) => {
            const state = bubbles.get(id);
            if (!state) return;

            state.x += (state.targetX - state.x) * LERP;
            state.y += (state.targetY - state.y) * LERP;

            // Velocidad instantánea del arrastre: define cuánto se "estira" la
            // gota en la dirección del movimiento, como tensión superficial
            // real. Se suaviza con la velocidad anterior para que no tiemble.
            const vx = state.x - state.prevX;
            const vy = state.y - state.prevY;
            state.prevX = state.x;
            state.prevY = state.y;
            const velocidad = Math.hypot(vx, vy);
            state.vel += (velocidad - state.vel) * 0.35;

            const estiro = Math.min(state.vel / 14, 0.85);
            const angulo = estiro > 0.04 ? Math.atan2(vy, vx) * (180 / Math.PI) : state.angulo;
            state.angulo = angulo;

            setTransform(state, 1 + estiro, 1 - estiro * 0.45, angulo);
            state.raf = requestAnimationFrame(() => tick(id));
        };

        const spawnBubble = (id, x, y) => {
            if (bubbles.size >= MAX_BUBBLES) return;
            const el = document.createElement('div');
            el.className = styles.bubble;
            container.appendChild(el);

            const state = {
                el, x, y, targetX: x, targetY: y,
                prevX: x, prevY: y, vel: 0, angulo: 0, raf: 0,
            };
            setTransform(state, 0.4, 0.4, 0);
            bubbles.set(id, state);

            requestAnimationFrame(() => {
                el.style.opacity = '1';
                setTransform(state, 1, 1, 0);
            });
            state.raf = requestAnimationFrame(() => tick(id));
        };

        const salpicar = (x, y) => {
            const n = SALPICADURA_MIN + Math.floor(Math.random() * (SALPICADURA_MAX - SALPICADURA_MIN + 1));
            for (let i = 0; i < n; i++) {
                const gota = document.createElement('div');
                gota.className = styles.gotita;
                const angulo = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.8;
                const distancia = 14 + Math.random() * 22;
                const tam = 5 + Math.random() * 6;
                gota.style.setProperty('--dx', `${Math.cos(angulo) * distancia}px`);
                gota.style.setProperty('--dy', `${Math.sin(angulo) * distancia}px`);
                gota.style.setProperty('--tam', `${tam}px`);
                gota.style.left = `${x}px`;
                gota.style.top = `${y}px`;
                container.appendChild(gota);
                gota.addEventListener('animationend', () => gota.remove());
            }
        };

        const onPointerDown = (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            spawnBubble(e.pointerId, e.clientX, e.clientY);
        };

        const onPointerMove = (e) => {
            const state = bubbles.get(e.pointerId);
            if (!state) return;
            state.targetX = e.clientX;
            state.targetY = e.clientY;
        };

        const release = (e) => {
            const state = bubbles.get(e.pointerId);
            if (!state) return;
            cancelAnimationFrame(state.raf);
            state.el.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease';
            setTransform(state, 1.5, 1.5, 0);
            state.el.style.opacity = '0';
            bubbles.delete(e.pointerId);
            salpicar(state.x, state.y);
            setTimeout(() => state.el.remove(), 320);
        };

        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', release, { passive: true });
        window.addEventListener('pointercancel', release, { passive: true });

        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', release);
            window.removeEventListener('pointercancel', release);
            bubbles.forEach((state) => {
                cancelAnimationFrame(state.raf);
                state.el.remove();
            });
            bubbles.clear();
        };
    }, []);

    return <div ref={containerRef} className={styles.layer} aria-hidden="true" />;
};

export default CursorBubble;
