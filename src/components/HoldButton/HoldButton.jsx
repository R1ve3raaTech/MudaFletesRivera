import React, { useRef, useState } from 'react';
import styles from './HoldButton.module.css';

// Botón de "mantener para confirmar": al presionar, una carga llena el
// botón (~900ms) con ticks hápticos; al completarse dispara onComplete
// con un pop de éxito. Soltar antes drena la carga y muestra una pista.
// Teclado y prefers-reduced-motion disparan directo (accesibilidad).

const HoldButton = ({ onComplete, disabled, className = '', holdMs = 900, children }) => {
    const btnRef = useRef(null);
    const raf = useRef(0);
    const carga = useRef(0);
    const completado = useRef(false);
    const [pista, setPista] = useState(false);

    const pintar = () => {
        btnRef.current?.style.setProperty('--carga', String(carga.current));
    };

    const detener = () => cancelAnimationFrame(raf.current);

    const drenar = () => {
        detener();
        let prev = performance.now();
        const paso = (ahora) => {
            const dt = ahora - prev; prev = ahora;
            carga.current = Math.max(carga.current - dt / (holdMs * 0.45), 0);
            pintar();
            if (carga.current > 0) raf.current = requestAnimationFrame(paso);
        };
        raf.current = requestAnimationFrame(paso);
    };

    const alPointerDown = (e) => {
        if (disabled || completado.current) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // el click normal dispara
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setPista(false);
        navigator.vibrate?.(5);
        detener();
        let prev = performance.now();
        const paso = (ahora) => {
            const dt = ahora - prev; prev = ahora;
            carga.current = Math.min(carga.current + dt / holdMs, 1);
            pintar();
            if (carga.current >= 1) {
                completado.current = true;
                navigator.vibrate?.([14, 40, 18]);
                btnRef.current?.classList.add(styles.exito);
                setTimeout(() => {
                    btnRef.current?.classList.remove(styles.exito);
                    carga.current = 0; pintar();
                    completado.current = false;
                    onComplete?.();
                }, 260);
                return;
            }
            raf.current = requestAnimationFrame(paso);
        };
        raf.current = requestAnimationFrame(paso);
    };

    const alSoltar = () => {
        if (completado.current) return;
        if (carga.current > 0.05 && carga.current < 1) setPista(true);
        drenar();
    };

    const alClick = (e) => {
        // Con reduced-motion (o teclado: detail === 0) el click dispara directo
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || e.detail === 0) { onComplete?.(); return; }
        e.preventDefault();
    };

    return (
        <span className={styles.wrap}>
            <button
                type="button"
                ref={btnRef}
                className={`${styles.hold} ${className}`}
                disabled={disabled}
                onPointerDown={alPointerDown}
                onPointerUp={alSoltar}
                onPointerCancel={alSoltar}
                onClick={alClick}
            >
                <span className={styles.relleno} aria-hidden="true" />
                <span className={styles.contenido}>{children}</span>
            </button>
            <span className={`${styles.pista} ${pista ? styles.pistaVisible : ''}`} aria-live="polite">
                Mantén presionado para enviar
            </span>
        </span>
    );
};

export default HoldButton;
