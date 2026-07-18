import React, { Suspense, useEffect, useRef, useState } from 'react';
import { MOUNT_SECTIONS_EVENT } from '../scrollToSection';
import ErrorBoundary from './ErrorBoundary';
import styles from './LazySection.module.css';

// Esqueleto genérico (título, subtítulo y tarjetas) que ocupa la altura
// reservada mientras el chunk de la sección descarga.
const Skeleton = ({ minHeight }) => (
    <div className={styles.skeleton} style={{ minHeight }} aria-hidden="true">
        <div className={`${styles.bar} ${styles.title}`} />
        <div className={`${styles.bar} ${styles.subtitle}`} />
        <div className={styles.cards}>
            <div className={`${styles.bar} ${styles.card}`} />
            <div className={`${styles.bar} ${styles.card}`} />
            <div className={`${styles.bar} ${styles.card}`} />
        </div>
    </div>
);

// Monta sus hijos cuando la sección se acerca al viewport, o tras un
// periodo de inactividad post-carga (para que los anclajes #seccion
// sigan funcionando aunque el usuario no haya hecho scroll).
const LazySection = ({ children, minHeight = 400, order = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    // minHeight puede ser un número o { mobile, desktop }: el espaciador debe
    // aproximar la altura real de la sección para que el footer no asome al
    // scrollear rápido antes de que la sección monte.
    const alto = typeof minHeight === 'number'
        ? minHeight
        : (window.innerWidth < 768 ? minHeight.mobile : minHeight.desktop);

    useEffect(() => {
        if (visible) return;
        const mostrar = () => setVisible(true);

        const io = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) mostrar(); },
            { rootMargin: '600px 0px' }
        );
        if (ref.current) io.observe(ref.current);

        // Un enlace de anclaje (#resenas, #servicios…) necesita la sección
        // en el DOM de inmediato para poder hacer scroll hasta ella.
        window.addEventListener(MOUNT_SECTIONS_EVENT, mostrar);

        // Montaje escalonado: cada sección entra en su propia tarea para no
        // bloquear el hilo principal con todas a la vez.
        let idle;
        const timer = setTimeout(() => {
            idle = 'requestIdleCallback' in window
                ? requestIdleCallback(mostrar, { timeout: 2000 })
                : setTimeout(mostrar, 0);
        }, 4000 + order * 1000);

        return () => {
            io.disconnect();
            window.removeEventListener(MOUNT_SECTIONS_EVENT, mostrar);
            clearTimeout(timer);
            if (idle !== undefined) {
                if ('requestIdleCallback' in window) cancelIdleCallback(idle);
                else clearTimeout(idle);
            }
        };
    }, [visible, order]);

    // Suspense propio por sección: mientras el chunk descarga, el espaciador
    // conserva la altura y el footer no salta a la vista (visible sobre todo
    // en móvil con red lenta).
    return (
        <div ref={ref}>
            {visible ? (
                <ErrorBoundary>
                    <Suspense fallback={<Skeleton minHeight={alto} />}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            ) : (
                <Skeleton minHeight={alto} />
            )}
        </div>
    );
};

export default LazySection;
