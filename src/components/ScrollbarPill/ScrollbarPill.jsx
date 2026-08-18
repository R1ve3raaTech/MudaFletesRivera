import { useEffect, useRef } from 'react';
import styles from './ScrollbarPill.module.css';

// Separación arriba/abajo del viewport para que el pill nunca toque los bordes
const TRACK_INSET = 16;
// Alto mínimo del pill: aunque la página sea muy larga, siempre queda
// suficientemente grande como para agarrarlo con el dedo
const MIN_THUMB = 48;

// Scrollbar propio en forma de píldora, arrastrable con mouse o dedo.
// Reemplaza al nativo del navegador porque en Chrome/Android el nativo es
// un indicador visual, no algo que se pueda agarrar y arrastrar.
const ScrollbarPill = () => {
    const trackRef = useRef(null);
    const thumbRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        let raf = 0;
        let dragging = false;
        let drag = null;

        const trackHeight = () => window.innerHeight - TRACK_INSET * 2;

        const layout = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 4) {
                track.style.visibility = 'hidden';
                return null;
            }
            track.style.visibility = '';
            const th = trackHeight();
            const ratio = window.innerHeight / doc.scrollHeight;
            const thumbH = Math.max(th * ratio, MIN_THUMB);
            const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
            const thumbY = TRACK_INSET + progress * (th - thumbH);
            thumb.style.height = `${thumbH}px`;
            thumb.style.transform = `translateY(${thumbY}px)`;
            return { scrollable, th, thumbH };
        };

        const onScroll = () => {
            if (dragging || raf) return;
            raf = requestAnimationFrame(() => { raf = 0; layout(); });
        };

        const onResize = () => layout();

        const onPointerDown = (e) => {
            const info = layout();
            if (!info) return;
            dragging = true;
            thumb.setPointerCapture?.(e.pointerId);
            thumb.classList.add(styles.active);
            drag = {
                startClientY: e.clientY,
                startScroll: window.scrollY,
                prevBehavior: document.documentElement.style.scrollBehavior,
                ...info,
            };
            document.documentElement.style.scrollBehavior = 'auto';
            e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!dragging || !drag) return;
            const deltaPx = e.clientY - drag.startClientY;
            const deltaScroll = deltaPx * (drag.scrollable / (drag.th - drag.thumbH));
            window.scrollTo(0, Math.min(Math.max(drag.startScroll + deltaScroll, 0), drag.scrollable));
            layout();
        };

        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            thumb.classList.remove(styles.active);
            document.documentElement.style.scrollBehavior = drag?.prevBehavior || '';
            drag = null;
        };

        layout();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        thumb.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);

        // El alto de la página cambia cuando cargan las secciones lazy
        const ro = new ResizeObserver(() => layout());
        ro.observe(document.body);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            thumb.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', endDrag);
            window.removeEventListener('pointercancel', endDrag);
            ro.disconnect();
        };
    }, []);

    return (
        <div ref={trackRef} className={styles.track} aria-hidden="true">
            <div ref={thumbRef} className={styles.thumb}>
                <div className={styles.thumbVisual} />
            </div>
        </div>
    );
};

export default ScrollbarPill;
