import React, { Suspense, useEffect, useRef, useState } from 'react';
import { MOUNT_SECTIONS_EVENT } from '../scrollToSection';
import ErrorBoundary from './ErrorBoundary';
import styles from './LazySection.module.css';

const Bar = ({ cls }) => <div className={`${styles.bar} ${cls}`} />;

// Silueta que imita el layout real de cada sección mientras su chunk descarga.
const VARIANTES = {
    services: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            {[0, 1, 2].map((i) => (
                <div key={i} className={styles.serviceRow}>
                    <Bar cls={`${styles.circle} ${styles.serviceIcon}`} />
                    <div className={styles.serviceLines}>
                        <Bar cls={styles.lineWide} />
                        <Bar cls={styles.lineMid} />
                        <Bar cls={styles.lineShort} />
                    </div>
                    <Bar cls={styles.serviceBtn} />
                </div>
            ))}
        </>
    ),
    process: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <div className={styles.steps}>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={styles.step}>
                        <Bar cls={`${styles.circle} ${styles.stepCircle}`} />
                        <Bar cls={styles.stepTitle} />
                        <Bar cls={styles.stepLine} />
                        <Bar cls={styles.stepLine} />
                    </div>
                ))}
            </div>
        </>
    ),
    whyus: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <div className={styles.whySplit}>
                <Bar cls={styles.whyBig} />
                <div className={styles.whyStack}>
                    <Bar cls={styles.whySmall} />
                    <Bar cls={styles.whySmall} />
                    <Bar cls={styles.whySmall} />
                </div>
            </div>
        </>
    ),
    team: (
        <div className={styles.teamSplit}>
            <Bar cls={styles.teamImage} />
            <div className={styles.teamCol}>
                <Bar cls={styles.teamTitle} />
                <Bar cls={styles.lineMid} />
                <Bar cls={styles.lineShort} />
                <div className={styles.teamCards}>
                    <Bar cls={styles.teamCard} />
                    <Bar cls={styles.teamCard} />
                </div>
                <div className={styles.teamBtns}>
                    <Bar cls={styles.teamBtn} />
                    <Bar cls={styles.teamBtn} />
                </div>
            </div>
        </div>
    ),
    historia: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <div className={styles.historiaList}>
                {[0, 1, 2].map((i) => (
                    <div key={i} className={styles.historiaRow}>
                        <Bar cls={`${styles.circle} ${styles.historiaDot}`} />
                        <div className={styles.historiaLines}>
                            <Bar cls={styles.lineShort} />
                            <Bar cls={styles.lineMid} />
                        </div>
                        <Bar cls={styles.historiaPhoto} />
                    </div>
                ))}
            </div>
        </>
    ),
    reviews: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <Bar cls={styles.pill} />
            <div className={styles.reviewCards}>
                <Bar cls={styles.reviewCard} />
                <Bar cls={styles.reviewCard} />
                <Bar cls={styles.reviewCard} />
            </div>
        </>
    ),
    contact: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <div className={styles.contactCards}>
                {[0, 1, 2, 3].map((i) => <Bar key={i} cls={styles.contactCard} />)}
            </div>
            <Bar cls={styles.contactWide} />
        </>
    ),
};

// Secciones con el encabezado centrado (Servicios lo lleva a la izquierda).
const CENTRADAS = new Set(['process', 'whyus', 'reviews', 'contact']);

const Skeleton = ({ minHeight, variant }) => (
    <div className={variant === 'reviews' ? styles.reviewsBg : undefined} aria-hidden="true">
        <div
            className={`${styles.skeleton} ${CENTRADAS.has(variant) ? styles.centered : ''}`}
            style={{ minHeight }}
        >
            {VARIANTES[variant] || VARIANTES.services}
        </div>
    </div>
);

// Monta sus hijos cuando la sección se acerca al viewport, o tras un
// periodo de inactividad post-carga (para que los anclajes #seccion
// sigan funcionando aunque el usuario no haya hecho scroll).
const LazySection = ({ children, minHeight = 400, order = 0, variant = 'services' }) => {
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
                    <Suspense fallback={<Skeleton minHeight={alto} variant={variant} />}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            ) : (
                <Skeleton minHeight={alto} variant={variant} />
            )}
        </div>
    );
};

export default LazySection;
