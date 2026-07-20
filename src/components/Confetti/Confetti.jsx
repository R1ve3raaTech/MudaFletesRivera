import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const COLORES = ['#0052cc', '#0ea5e9', '#93c5fd', '#f59e0b', '#16a34a', '#ffffff'];
const DURACION = 2600;

// Ráfaga de confeti en canvas propio (sin librerías): dos cañones desde las
// esquinas inferiores que lanzan hacia el centro, con gravedad, arrastre y
// rotación 3D simulada. Se desmonta sola al terminar.
export default function Confetti() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const rand = (a, b) => a + Math.random() * (b - a);
        const particulas = [];
        const canon = (x, y, angulo) => {
            for (let i = 0; i < 70; i++) {
                const a = angulo + rand(-0.55, 0.55);
                const v = rand(9, 21);
                particulas.push({
                    x, y,
                    vx: Math.cos(a) * v,
                    vy: Math.sin(a) * v,
                    w: rand(6, 11),
                    h: rand(4, 7),
                    color: COLORES[(Math.random() * COLORES.length) | 0],
                    rot: rand(0, Math.PI * 2),
                    vrot: rand(-0.25, 0.25),
                    fase: rand(0, Math.PI * 2),
                });
            }
        };
        canon(-10, H * 0.85, -Math.PI / 3.1);
        canon(W + 10, H * 0.85, -Math.PI + Math.PI / 3.1);

        let raf;
        const inicio = performance.now();
        let prev = inicio;
        const tick = (t) => {
            // Física escalada por tiempo real: igual de rápida a 30, 60 o 120fps
            const dt = Math.min((t - prev) / 16.67, 4);
            prev = t;
            const p = (t - inicio) / DURACION;
            ctx.clearRect(0, 0, W, H);
            if (p >= 1) return;
            const fade = p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1;
            const drag = Math.pow(0.985, dt);
            for (const c of particulas) {
                c.vy += 0.42 * dt;
                c.vx *= drag;
                c.vy *= drag;
                c.x += c.vx * dt;
                c.y += c.vy * dt;
                c.rot += c.vrot * dt;
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.rot);
                // La escala vertical oscila para simular el papelito volteándose
                ctx.scale(1, Math.sin(c.fase + t / 90));
                ctx.globalAlpha = fade;
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                ctx.restore();
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        if (navigator.vibrate) navigator.vibrate([18, 40, 24]);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Portal al body: un ancestro con transform (p. ej. animado por GSAP)
    // convertiría el position:fixed en relativo a la tarjeta
    return createPortal(
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />,
        document.body
    );
}
