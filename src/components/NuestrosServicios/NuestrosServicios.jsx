import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './NuestrosServicios.module.css';

const services = [
    {
        icon: "local_shipping",
        num: "01",
        title: "Logística de Carga",
        description: "Soluciones logísticas de alto nivel. Su mercancía llega intacta, a tiempo y respaldada por nuestra experiencia de décadas.",
        benefits: ["Carga Asegurada", "Seguimiento en Tiempo Real", "Conductores Expertos"],
    },
    {
        icon: "inventory_2",
        num: "02",
        title: "Mudanzas Profesionales",
        description: "Traslados residenciales y de oficina sin complicaciones. Empacamos y movemos su vida con el máximo respeto y seguridad.",
        benefits: ["Embalaje de Protección", "Carga y Descarga", "Desarmado de Muebles"]
    },
    {
        icon: "construction",
        num: "03",
        title: "Productos Especializados",
        description: "Calidad certificada en materiales de construcción. Le asesoramos para que su proyecto tenga los mejores cimientos.",
        benefits: ["Precios de Fábrica", "Entrega Inmediata", "Asesoría Técnica"]
    }
];

const ServiceCard = ({ icon, num, title, description, benefits, index }) => (
    <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: index * 0.13, type: 'spring', stiffness: 80, damping: 16 }}
    >
        <div className={styles.cardInner}>
            <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className={styles.num}>{num}</span>
            </div>

            <h3>{title}</h3>
            <p className={styles.desc}>{description}</p>

            <ul className={styles.benefits}>
                {benefits.map((b, i) => (
                    <li key={i}>
                        <span className={`material-symbols-outlined ${styles.check}`}>check_circle</span>
                        {b}
                    </li>
                ))}
            </ul>

            <div className={styles.cardActions}>
                <a
                    href={`https://wa.me/50670818306?text=Hola,%20quisiera%20cotizar%20el%20servicio%20de%20${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnService}
                >
                    <MessageCircle size={16} /> Cotizar este servicio
                </a>
            </div>
        </div>

        <div className={styles.borderAccent} />
    </motion.div>
);

const Services = () => (
    <section id="servicios" className={styles.services}>
        <div className={styles.sectionHeader}>
            <motion.span
                className={styles.topLabel}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
                Nuestros Servicios
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
                Servicios que Resuelven su Vida
            </motion.h2>
            <div className={styles.headerLine} />
            <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            >
                Nuestra misión es su tranquilidad. Ofrecemos soluciones de transporte personalizadas con garantía real de cumplimiento.
            </motion.p>
        </div>

        <div className={styles.cardsGrid}>
            {services.map((s, i) => <ServiceCard key={i} {...s} index={i} />)}
        </div>
    </section>
);

export default Services;
