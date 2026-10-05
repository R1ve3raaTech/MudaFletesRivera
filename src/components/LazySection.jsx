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
            <div className={styles.serviceGrid}>
                {[0, 1].map((i) => (
                    <div key={i} className={styles.servicePreview}>
                        <Bar cls={styles.servicePhoto} />
                        <Bar cls={styles.lineWide} />
                        <Bar cls={styles.lineMid} />
                        <Bar cls={styles.lineShort} />
                        <Bar cls={styles.serviceBtn} />
                    </div>
                ))}
            </div>
            <Bar cls={styles.partnerPreview} />
        </>
    ),
    process: (
        <>
            <Bar cls={styles.title} />
            <Bar cls={styles.subtitle} />
            <div className={styles.assuranceSplit}>
                <Bar cls={styles.assurancePhoto} />
                <div className={styles.serviceLines}>
                    <Bar cls={styles.lineWide} />
                    <Bar cls={styles.lineMid} />
                    <Bar cls={styles.lineShort} />
                    <Bar cls={styles.assuranceText} />
                </div>
            </div>
        </>
    ),
    whyus: (
        <>
            <div className={styles.editorialIntro}>
                <div className={styles.serviceLines}><Bar cls={styles.title} /><Bar cls={styles.lineMid} /><Bar cls={styles.lineShort} /></div>
                <div className={styles.serviceLines}><Bar cls={styles.title} /><Bar cls={styles.lineMid} /><Bar cls={styles.lineShort} /><Bar cls={styles.serviceBtn} /></div>
            </div>
            <div className={styles.valuePreviews}>{[0, 1, 2].map(i => <Bar key={i} cls={styles.valuePreview} />)}</div>
        </>
    ),
    team: (
        <>
            <div className={styles.editorialIntro}>
                <div className={styles.serviceLines}><Bar cls={styles.title} /><Bar cls={styles.lineMid} /></div>
                <div className={styles.serviceLines}><Bar cls={styles.lineMid} /><Bar cls={styles.lineShort} /></div>
            </div>
            <Bar cls={styles.galleryPreview} />
            <Bar cls={styles.lineWide} /><Bar cls={styles.lineMid} />
            <div className={styles.valuePreviews}>{[0, 1, 2].map(i => <Bar key={i} cls={styles.valuePreview} />)}</div>
            <div className={styles.teamBtns}><Bar cls={styles.teamBtn} /><Bar cls={styles.teamBtn} /></div>
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
        <div className={styles.editorialIntro}>
            <div className={styles.serviceLines}>
                <Bar cls={styles.title} /><Bar cls={styles.lineMid} />
                <Bar cls={styles.lineShort} /><Bar cls={styles.teamBtn} />
            </div>
            <div className={styles.channelPreviews}>
                {[0, 1, 2, 3].map(i => <Bar key={i} cls={styles.channelPreview} />)}
            </div>
        </div>
    ),
};

// Secciones con el encabezado centrado (Servicios lo lleva a la izquierda).
const CENTRADAS = new Set();

const Skeleton = ({ minHeight, variant }) => (
    <div className={variant === 'reviews' ? styles.reviewsBg : variant === 'process' ? styles.assuranceBg : undefined} aria-hidden="true">
        <div
            className={`${styles.skeleton} ${CENTRADAS.has(variant) ? styles.centered : ''}`}
            style={typeof minHeight === 'number' ? { minHeight } : {
                '--skeleton-mobile': `${minHeight.mobile}px`,
                '--skeleton-tablet': `${minHeight.tablet ?? minHeight.desktop}px`,
                '--skeleton-desktop': `${minHeight.desktop}px`,
            }}
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
                    <Suspense fallback={<Skeleton minHeight={minHeight} variant={variant} />}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            ) : (
                <Skeleton minHeight={minHeight} variant={variant} />
            )}
        </div>
    );
};

export default LazySection;
