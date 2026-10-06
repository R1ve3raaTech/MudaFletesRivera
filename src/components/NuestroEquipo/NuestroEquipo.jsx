import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as Motion, useInView, useReducedMotion } from 'motion/react';
import { ShieldCheck, Route, Box, ChevronLeft, ChevronRight, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import './NuestroEquipo.css';
import truckNueva from '../../assets/camion-carga-comercial.webp';
import truck2 from '../../assets/truck2.webp';
import truck1 from '../../assets/truck1.webp';
import mudanza3 from '../../assets/mudanza3.webp';
import mudanza2 from '../../assets/mudanza2.webp';
import mudanza1 from '../../assets/mudanza1.webp';
import mudanza4 from '../../assets/mudanza4.webp';
import mudanza5 from '../../assets/mudanza5.webp';
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
    },
    {
        id: 8,
        url: truckNueva,
        position: 'center 5%',
        title: "Transporte para tu hogar y tu negocio.",
        subtitle: "Nuestro equipo y nuestro camión, listos para tu próxima mudanza.",
    }
];

const features = [
    { Icon: ShieldCheck, title: 'Seguridad Total', description: 'Furgones cerrados y acondicionados.' },
    { Icon: Box, title: 'Interior Especializado', description: 'Rieles y protección de madera.' },
    { Icon: Route, title: 'Cobertura Nacional', description: 'Llegamos a todo Costa Rica.' },
];

const photoMotion = {
    enter: direction => ({ x: `${direction * 100}%`, opacity: 1 }),
    visible: { x: '0%', opacity: 1 },
    exit: direction => ({ x: `${direction * -100}%`, opacity: 1 }),
};

export default function NuestroEquipo() {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [interacted, setInteracted] = useState(false);
    const gestureRef = useRef(null);
    const galleryRef = useRef(null);
    const inView = useInView(galleryRef, { amount: .2, once: true });
    const reduced = useReducedMotion();

    const paginate = (direction) => {
        setInteracted(true);
        setDirection(direction);
        setPage(current => (current + direction + images.length) % images.length);
    };

    const startGesture = (event) => {
        if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;
        gestureRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishGesture = (event) => {
        const gesture = gestureRef.current;
        gestureRef.current = null;
        if (!gesture || gesture.id !== event.pointerId) return;
        const deltaX = event.clientX - gesture.x;
        const deltaY = event.clientY - gesture.y;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
            paginate(deltaX < 0 ? 1 : -1);
        }
    };

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
                        tabIndex={0}
                        onKeyDown={e => {
                            if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
                            if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
                        }}>
                        <div className={`truckSecPhotoFrame${images[page].id === 8 ? ' truckSecPhotoFrameTruck' : ''}`}
                            onPointerDown={startGesture} onPointerUp={finishGesture}
                            onPointerCancel={() => { gestureRef.current = null; }}>
                            <AnimatePresence initial={false} custom={direction}>
                                <Motion.img key={page} src={images[page].url} alt={images[page].title}
                                    className="truckSecMainImg" loading="lazy" decoding="async" draggable={false}
                                    style={{ objectPosition: images[page].position }}
                                    custom={direction} variants={photoMotion}
                                    initial={reduced ? false : 'enter'}
                                    animate="visible" exit={reduced ? undefined : 'exit'}
                                    transition={{ duration: reduced ? 0 : .34, ease: [.22, 1, .36, 1] }} />
                            </AnimatePresence>
                            <div className="truckSecControls">
                                <button type="button" onClick={() => paginate(-1)} aria-label="Foto anterior">
                                    <ChevronLeft size={23} aria-hidden="true" />
                                </button>
                                <button type="button" onClick={() => paginate(1)} aria-label="Foto siguiente">
                                    <ChevronRight size={23} aria-hidden="true" />
                                </button>
                            </div>
                            <Motion.div className="truckSecGalleryHint" aria-hidden="true"
                                initial={false} animate={{ opacity: interacted ? 0 : 1 }}>
                                <Motion.span initial={false}
                                    animate={inView && !interacted && !reduced ? { x: [0, 5, -5, 0] } : { x: 0 }}
                                    transition={{ duration: 1, delay: .5, repeat: 1, repeatDelay: .3 }}>
                                    <ArrowLeftRight size={16} />
                                </Motion.span>
                                <span className="truckSecHintTouch">Desliza para ver más fotos</span>
                                <span className="truckSecHintMouse">Arrastra o usa las flechas</span>
                            </Motion.div>
                        </div>
                        <div className="truckSecGalleryBar">
                            <div className="truckSecCaption" aria-live="polite" aria-atomic="true">
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
