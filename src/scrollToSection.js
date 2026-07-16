// Scroll a una sección de la portada por id. Las secciones bajo el pliegue
// se montan de forma diferida (LazySection), así que primero se fuerza su
// montaje y se reintenta hasta que el elemento exista en el DOM.
export const MOUNT_SECTIONS_EVENT = 'lazy-sections:mount';

export default function scrollToSection(id) {
    if (id === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    window.dispatchEvent(new Event(MOUNT_SECTIONS_EVENT));

    // El montaje de las secciones desplaza el layout durante unos cientos de
    // ms; un scroll suave lanzado en medio se cancela. Se espera a que la
    // posición del destino se estabilice antes de hacer el scroll.
    let intentos = 0;
    let ultimaPos = -1;
    let estable = 0;
    const intentar = () => {
        const el = document.getElementById(id);
        if (el) {
            const pos = el.getBoundingClientRect().top + window.scrollY;
            if (Math.abs(pos - ultimaPos) < 2) {
                if (++estable >= 2) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            } else {
                estable = 0;
                ultimaPos = pos;
            }
        }
        if (intentos++ < 50) setTimeout(intentar, 100);
    };
    intentar();
}
