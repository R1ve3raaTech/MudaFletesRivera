import { useEffect, useRef } from 'react';
import styles from './CursorBubble.module.css';

// Máximo de burbujas simultáneas (soporta multitouch sin descontrol)
const MAX_BUBBLES = 6;
// Suavizado del seguimiento: más bajo = la burbuja "arrastra" más al moverse
const LERP = 0.25;

// Burbujita de agua que sigue al cursor/dedo mientras se mantiene presionado
// y explota suavemente al soltar. Puramente decorativo: no bloquea clicks
// (pointer-events: none) y se desactiva entero con reduced-motion, ya que
// el seguimiento es el efecto en sí, no hay una versión "reducida" de eso.
const CursorBubble = () => {
    const containerRef = useRef(null);
    const bubblesRef = useRef(new Map());

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const container = containerRef.current;
        const bubbles = bubblesRef.current;

        const setTransform = (state, scale) => {
            state.el.style.transform =
                `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        };

        const tick = (id) => {
            const state = bubbles.get(id);
            if (!state) return;
            state.x += (state.targetX - state.x) * LERP;
            state.y += (state.targetY - state.y) * LERP;
            setTransform(state, 1);
            state.raf = requestAnimationFrame(() => tick(id));
        };

        const spawnBubble = (id, x, y) => {
            if (bubbles.size >= MAX_BUBBLES) return;
            const el = document.createElement('div');
            el.className = styles.bubble;
            container.appendChild(el);

            const state = { el, x, y, targetX: x, targetY: y, raf: 0 };
            setTransform(state, 0.5);
            bubbles.set(id, state);

            requestAnimationFrame(() => {
                el.style.opacity = '1';
                setTransform(state, 1);
            });
            state.raf = requestAnimationFrame(() => tick(id));
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
            state.el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
            setTransform(state, 1.7);
            state.el.style.opacity = '0';
            bubbles.delete(e.pointerId);
            setTimeout(() => state.el.remove(), 380);
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
