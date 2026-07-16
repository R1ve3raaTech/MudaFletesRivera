import React, { useEffect, useRef, useState } from 'react';
import { MOUNT_SECTIONS_EVENT } from '../scrollToSection';

// Monta sus hijos cuando la sección se acerca al viewport, o tras un
// periodo de inactividad post-carga (para que los anclajes #seccion
// sigan funcionando aunque el usuario no haya hecho scroll).
const LazySection = ({ children, minHeight = 400, order = 0 }) => {
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

    return (
        <div ref={ref} style={visible ? undefined : { minHeight }}>
            {visible ? children : null}
        </div>
    );
};

export default LazySection;
