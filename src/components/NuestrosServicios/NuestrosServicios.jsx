import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, HardHat, ShieldCheck, Clock, MapPin, MessageCircle } from 'lucide-react';
import styles from './NuestrosServicios.module.css';

const ServiceCard = ({ icon: Icon, title, description, benefits, index }) => {
    return (
        <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -15, scale: 1.02 }}
            transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
        >
            <div className={styles.iconContainer}>
                <Icon size={48} className={styles.icon} />
            </div>
            <h3>{title}</h3>
            <p className={styles.desc}>{description}</p>
            <ul className={styles.benefits}>
                {benefits.map((b, i) => (
                    <li key={i}>✨ {b}</li>
                ))}
            </ul>
            <div className={styles.cardActions}>
                <a 
                    href={`https://wa.me/50670818306?text=Hola,%20quisiera%20cotizar%20el%20servicio%20de%20${encodeURIComponent(title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.btnService}
                >
                    <MessageCircle size={18} /> Cotizar este servicio
                </a>
            </div>
            <div className={styles.cardAccent}></div>
        </motion.div>
    );
};

const Services = () => {
    const services = [
        {
            icon: Truck,
            title: "Logística de Carga",
            description: "Soluciones logísticas de alto nivel. Su mercancía llega intacta, a tiempo y respaldada por nuestra experiencia de décadas.",
            benefits: ["Carga Asegurada", "Seguimiento en Tiempo Real", "Conductores Expertos"]
        },
        {
            icon: Package,
            title: "Mudanzas Profesionales",
            description: "Traslados residenciales y de oficina sin complicaciones. Empacamos y movemos su vida con el máximo respeto y seguridad.",
            benefits: ["Embalaje de Protección", "Carga y Descarga", "Desarmado de Muebles"]
        },
        {
            icon: HardHat,
            title: "Productos Especializados",
            description: "Calidad certificada en materiales de construcción. Le asesoramos para que su proyecto tenga los mejores cimientos.",
            benefits: ["Precios de Fábrica", "Entrega Inmediata", "Asesoría Técnica"]
        }
    ];

    return (
        <section id="servicios" className={styles.services}>
            <div className={styles.sectionHeader}>
                <motion.span 
                    className={styles.topLabel}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    Nuestros Servicios
                </motion.span>
                <h2>Servicios que Resuelven su Vida</h2>
                <div className={styles.headerLine}></div>
                <p>Nuestra misión es su tranquilidad. Ofrecemos soluciones de transporte personalizadas con garantía real de cumplimiento.</p>
            </div>

            <div className={styles.cardsGrid}>
                {services.map((service, index) => (
                    <ServiceCard key={index} {...service} index={index} />
                ))}
            </div>
        </section>
    );
};

export default Services;
