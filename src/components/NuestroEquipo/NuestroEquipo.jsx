import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, TruckIcon, Route, Box, ChevronLeft, ChevronRight, MessageCircle, Send } from 'lucide-react';
import './NuestroEquipo.css';
import mudanza1 from '../../assets/mudanza1.png';
import mudanza2 from '../../assets/mudanza2.png';
import mudanza3 from '../../assets/mudanza3.png';
import mudanza4 from '../../assets/mudanza4.png';
import mudanza5 from '../../assets/mudanza5.png';
import truck1 from '../../assets/truck1.png';
import truck2 from '../../assets/truck2.png';
import logoNew from '../../assets/trucklogo.png';

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
    const [[page, direction], setPage] = React.useState([0, 0]);
    const [isHovered, setIsHovered] = React.useState(false);

    const paginate = (newDirection) => {
        setPage([(page + newDirection + images.length) % images.length, newDirection]);
    };

    React.useEffect(() => {
        // Preload images
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

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            transition: { opacity: { duration: 0.2 } }
        })
    };

    return (
        <section className="truckSecContainer" id="nuestro-equipo">
            <div className="truckSecBlob"></div>
            
            <div className="truckSecWrapper">
                {/* Visual Side - CAROUSEL */}
                <motion.div 
                    className="truckSecVisual"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="truckSecCarouselContainer">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.3 }
                                }}
                                className="truckSecSlide"
                            >
                                <img 
                                    src={images[page].url} 
                                    alt={images[page].title}
                                    className="truckSecMainImg"
                                    loading={page === 0 ? "eager" : "lazy"}
                                    fetchpriority={page === 0 ? "high" : "low"}
                                    decoding="async"
                                />
                                <div className="truckSecSlideOverlay">
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="truckSecOverlayContent"
                                    >
                                        <h3>{images[page].title}</h3>
                                        <p>{images[page].subtitle}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button className="truckSecNavBtn prev" onClick={() => paginate(-1)}><ChevronLeft /></button>
                        <button className="truckSecNavBtn next" onClick={() => paginate(1)}><ChevronRight /></button>
                    </div>
                </motion.div>

                {/* Content Side */}
                <div className="truckSecContent">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
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
                    </motion.div>

                    <div className="truckSecGrid">
                        <motion.div className="truckSecFeature" whileHover={{ x: 10 }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="truckSecFeatureIcon"><ShieldCheck size={22} /></div>
                            <div>
                                <h4>Seguridad Total</h4>
                                <p>Furgones cerrados y acondicionados.</p>
                            </div>
                        </motion.div>

                        <motion.div className="truckSecFeature" whileHover={{ x: 10 }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="truckSecFeatureIcon"><Box size={22} /></div>
                            <div>
                                <h4>Interior Especializado</h4>
                                <p>Rieles y protección de madera.</p>
                            </div>
                        </motion.div>

                        <motion.div className="truckSecFeature" whileHover={{ x: 10 }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <div className="truckSecFeatureIcon"><Route size={22} /></div>
                            <div>
                                <h4>Cobertura Nacional</h4>
                                <p>Llegamos a todo Costa Rica.</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        className="truckSecActions"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <a href="#contacto" className="truckSecBtnForm">
                            <Send size={18} /> Cotizar Ahora
                        </a>
                        <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer" className="truckSecBtnWa">
                            <MessageCircle size={20} /> WhatsApp
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default NuestroEquipo;
