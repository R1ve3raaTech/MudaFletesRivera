import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, TruckIcon, Route, Box, ChevronLeft, ChevronRight, MessageCircle, Send } from 'lucide-react';
import './NuestroEquipo.css';
import mudanza1 from '../../assets/mudanza1.webp';
import mudanza2 from '../../assets/mudanza2.webp';
import mudanza3 from '../../assets/mudanza3.webp';
import mudanza4 from '../../assets/mudanza4.webp';
import mudanza5 from '../../assets/mudanza5.webp';
import truck1 from '../../assets/truck1.webp';
import truck2 from '../../assets/truck2.webp';
import logoNew from '../../assets/trucklogo.png';

gsap.registerPlugin(ScrollTrigger);

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

const NuestroEquipo = () => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [displayPage, setDisplayPage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const slideRef = useRef(null);
    const overlayRef = useRef(null);
    const visualRef = useRef(null);
    const contentRef = useRef(null);

    const paginate = (newDirection) => {
        setPage(([p]) => [(p + newDirection + images.length) % images.length, newDirection]);
    };

    useEffect(() => {
        images.forEach(image => {
            const img = new Image();
            img.src = image.url;
        });

        if (isHovered) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [page, isHovered]);

    useGSAP(() => {
        gsap.from(visualRef.current, {
            opacity: 0, x: -50, duration: 0.7,
            scrollTrigger: { trigger: visualRef.current, start: 'top 80%', once: true },
        });
        gsap.from(contentRef.current.children, {
            opacity: 0, y: 20, duration: 0.5, stagger: 0.1,
            scrollTrigger: { trigger: contentRef.current, start: 'top 80%', once: true },
        });
    }, { scope: contentRef });

    // Exit animation when target page changes
    useGSAP(() => {
        if (page === displayPage) return;
        gsap.to(slideRef.current, {
            x: direction > 0 ? '-15%' : '15%',
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => setDisplayPage(page),
        });
    }, [page]);

    // Enter animation once the displayed slide content updates
    useGSAP(() => {
        gsap.fromTo(slideRef.current,
            { x: direction > 0 ? '15%' : '-15%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        gsap.fromTo(overlayRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, delay: 0.15, ease: 'power2.out' }
        );
    }, [displayPage]);

    return (
        <section className="truckSecContainer" id="nuestro-equipo">
            <div className="truckSecBlob"></div>

            <div className="truckSecWrapper">
                {/* Visual Side - CAROUSEL */}
                <div
                    className="truckSecVisual"
                    ref={visualRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="truckSecCarouselContainer">
                        <div ref={slideRef} className="truckSecSlide">
                            <img
                                src={images[displayPage].url}
                                alt={images[displayPage].title}
                                className="truckSecMainImg"
                                loading={displayPage === 0 ? "eager" : "lazy"}
                                fetchPriority={displayPage === 0 ? "high" : "low"}
                                decoding="async"
                            />
                            <div className="truckSecSlideOverlay">
                                <div ref={overlayRef} className="truckSecOverlayContent">
                                    <h3>{images[displayPage].title}</h3>
                                    <p>{images[displayPage].subtitle}</p>
                                </div>
                            </div>
                        </div>

                        <button className="truckSecNavBtn prev" onClick={() => paginate(-1)}><ChevronLeft /></button>
                        <button className="truckSecNavBtn next" onClick={() => paginate(1)}><ChevronRight /></button>
                    </div>
                </div>

                {/* Content Side */}
                <div className="truckSecContent" ref={contentRef}>
                    <div>
                        <div className="truckSecSubtitle">
                            <img src={logoNew} alt="Logo" className="truckSecSubLogo" />
                            Elite & Profesional
                        </div>
                        <h2 className="truckSecTitle">
                            Mudanzas Profesionales en <span>Toda Costa Rica</span>
                        </h2>
                        <p className="truckSecDesc">
                            Combinamos la mejor tecnología en transporte con un equipo humano excepcional. Cada mudanza es tratada con precisión logística para garantizar la integridad absoluta de sus bienes.
                        </p>
                    </div>

                    <div className="truckSecGrid">
                        <div className="truckSecFeature">
                            <div className="truckSecFeatureIcon"><ShieldCheck size={22} /></div>
                            <div>
                                <h4>Seguridad Total</h4>
                                <p>Furgones cerrados y acondicionados.</p>
                            </div>
                        </div>

                        <div className="truckSecFeature">
                            <div className="truckSecFeatureIcon"><Box size={22} /></div>
                            <div>
                                <h4>Interior Especializado</h4>
                                <p>Rieles y protección de madera.</p>
                            </div>
                        </div>

                        <div className="truckSecFeature">
                            <div className="truckSecFeatureIcon"><Route size={22} /></div>
                            <div>
                                <h4>Cobertura Nacional</h4>
                                <p>Llegamos a todo Costa Rica.</p>
                            </div>
                        </div>
                    </div>

                    <div className="truckSecActions">
                        <a href="#contacto" className="truckSecBtnForm">
                            <Send size={18} /> Cotizar Ahora
                        </a>
                        <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer" className="truckSecBtnWa">
                            <MessageCircle size={20} /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NuestroEquipo;
