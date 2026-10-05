import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as Motion, useInView, useReducedMotion } from 'motion/react';
import { ShieldCheck, Route, Box, ChevronLeft, ChevronRight, Pause, Play, ArrowUpRight } from 'lucide-react';
import './NuestroEquipo.css';
import mudanza1 from '../../assets/mudanza1.webp';
import mudanza2 from '../../assets/mudanza2.webp';
import mudanza3 from '../../assets/mudanza3.webp';
import mudanza4 from '../../assets/mudanza4.webp';
import mudanza5 from '../../assets/mudanza5.webp';
import truck1 from '../../assets/truck1.webp';
import truck2 from '../../assets/truck2.webp';
import { LOGO_URL } from '../../branding';
import scrollToSection from '../../scrollToSection';
import Reveal from '../Reveal';
import WhatsAppIcon from '../WhatsAppIcon';

const images = [
    {
        id: 1,
        url: truck1,
        title: "Tu nuevo comienzo en las mejores manos.",
        subtitle: "Nuestra puntualidad y presencia profesional en zonas residenciales nos avalan como la opción número uno en tranquilidad.",
    },
    {
        id: 2,
        url: mudanza1,
        title: "Manos expertas, tesoros protegidos.",
        subtitle: "No solo movemos muebles, cuidamos tu patrimonio. Utilizamos técnicas de embalaje profesional con capas de protección de alta resistencia.",
    },
    {
        id: 3,
        url: truck2,
        title: "Logística de alto nivel a tu servicio.",
        subtitle: "Contamos con una flota moderna y equipada, robusta por fuera pero suave y segura por dentro para carga delicada.",
    },
    {
        id: 4,
        url: mudanza5,
        title: "Organización inteligente: La clave del éxito.",
        subtitle: "Maximizamos la seguridad separando la carga por niveles. Tu mudanza viaja organizada, facilitando una descarga rápida.",
    },
    {
        id: 5,
        url: mudanza4,
        title: "Seguridad en cada kilómetro.",
        subtitle: "Nuestras unidades cuentan con equipamiento de vanguardia para asegurar que su carga viaje protegida y llegue a tiempo.",
    },
    {
        id: 6,
        url: mudanza2,
        title: "Blindaje total para tu mobiliario.",
        subtitle: "Desde acabados en espejo hasta tapicerías finas, aplicamos un sellado hermético que protege contra polvo y humedad.",
    },
    {
        id: 7,
        url: mudanza3,
        title: "Capacidad sin límites, orden sin fallas.",
        subtitle: "Equipos de línea blanca, parrillas y muebles de exterior... no hay carga demasiado grande. Nuestro estibado evita desplazamientos.",
    }
];

const features = [
    { Icon: ShieldCheck, title: 'Seguridad Total', description: 'Furgones cerrados y acondicionados.' },
    { Icon: Box, title: 'Interior Especializado', description: 'Rieles y protección de madera.' },
    { Icon: Route, title: 'Cobertura Nacional', description: 'Llegamos a todo Costa Rica.' },
];

export default function NuestroEquipo() {
    const [page, setPage] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [tabVisible, setTabVisible] = useState(true);
    const galleryRef = useRef(null);
    const inView = useInView(galleryRef, { amount: .2 });
    const reduced = useReducedMotion();
    const automatic = playing && !reduced;

    const paginate = (direction) => {
        setPlaying(false);
        setPage(current => (current + direction + images.length) % images.length);
    };

    useEffect(() => {
        const update = () => setTabVisible(!document.hidden);
        document.addEventListener('visibilitychange', update);
        return () => document.removeEventListener('visibilitychange', update);
    }, []);

    useEffect(() => {
        if (!automatic || hovered || focused || !inView || !tabVisible) return;
        const timer = setInterval(() => setPage(current => (current + 1) % images.length), 6000);
        return () => clearInterval(timer);
    }, [automatic, hovered, focused, inView, tabVisible, page]);

    useEffect(() => {
        if (!inView) return;
        const next = new Image();
        next.src = images[(page + 1) % images.length].url;
    }, [page, inView]);

    return <LazyMotion features={domAnimation}>
        <section className="truckSecContainer" id="nuestro-equipo">
            <div className="truckSecWrapper">
                <Reveal className="truckSecHeader">
                    <div>
                        <div className="truckSecSubtitle">
                            <img src={LOGO_URL} alt="Logo oficial de MudaFletesRivera" className="truckSecSubLogo" />
                            <span>Elite &amp; Profesional</span>
                        </div>
                        <h2 className="truckSecTitle">Mudanzas Profesionales en <span>Toda Costa Rica</span></h2>
                    </div>
                    <p className="truckSecDesc">
                        Combinamos la mejor tecnología en transporte con un equipo humano excepcional. Cada mudanza es tratada con precisión logística para garantizar la integridad absoluta de sus bienes.
                    </p>
                </Reveal>

                <Reveal className="truckSecGallery">
                    <div ref={galleryRef} className="truckSecGalleryRegion" role="region"
                        aria-roledescription="carrusel" aria-label="Galería de nuestras mudanzas"
                        onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(true); }}
                        onPointerLeave={() => setHovered(false)}
                        onFocusCapture={() => setFocused(true)}
                        onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
                        onKeyDown={e => {
                            if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
                            if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
                        }}>
                        <div className="truckSecPhotoFrame">
                            <AnimatePresence initial={false} mode="wait">
                                <Motion.img key={page} src={images[page].url} alt={images[page].title}
                                    className="truckSecMainImg" loading="lazy" decoding="async"
                                    initial={reduced ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }} exit={{ opacity: reduced ? 1 : 0 }}
                                    transition={{ duration: reduced ? 0 : .25 }} />
                            </AnimatePresence>
                        </div>
                        <div className="truckSecGalleryBar">
                            <div className="truckSecCaption" aria-live={automatic ? 'off' : 'polite'} aria-atomic="true">
                                <AnimatePresence initial={false} mode="wait">
                                    <Motion.div key={page}
                                        initial={reduced ? false : { opacity: 0 }}
                                        animate={{ opacity: 1 }} exit={{ opacity: reduced ? 1 : 0 }}
                                        transition={{ duration: reduced ? 0 : .15 }}>
                                        <h3>{images[page].title}</h3>
                                        <p>{images[page].subtitle}</p>
                                    </Motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="truckSecControls">
                                <button type="button" onClick={() => paginate(-1)} aria-label="Foto anterior">
                                    <ChevronLeft size={21} aria-hidden="true" />
                                </button>
                                <button type="button" onClick={() => paginate(1)} aria-label="Foto siguiente">
                                    <ChevronRight size={21} aria-hidden="true" />
                                </button>
                                {!reduced && <button type="button" onClick={() => setPlaying(value => !value)}
                                    aria-label={playing ? 'Pausar galería' : 'Reanudar galería'}>
                                    {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
                                </button>}
                            </div>
                        </div>
                    </div>
                </Reveal>

                <div className="truckSecFeatures">
                    {features.map((feature, i) => {
                        const { Icon, title, description } = feature;
                        return <Reveal as="article" key={title} className="truckSecFeature" delay={i * .06}>
                            <Icon size={23} aria-hidden="true" />
                            <div><h3>{title}</h3><p>{description}</p></div>
                        </Reveal>;
                    })}
                </div>
                <Reveal className="truckSecActions">
                    <a href="/#contacto" className="truckSecBtnForm"
                        onClick={e => { e.preventDefault(); scrollToSection('contacto'); }}>
                        Cotizar Ahora <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                        target="_blank" rel="noopener noreferrer" className="truckSecBtnWa">
                        <WhatsAppIcon size={20} /> WhatsApp
                    </a>
                </Reveal>
            </div>
        </section>
    </LazyMotion>;
}
