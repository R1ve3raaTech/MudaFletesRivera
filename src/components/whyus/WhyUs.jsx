import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './WhyUs.module.css';

const values = [
    {
        icon: "schedule",
        title: "Llegamos a Tiempo",
        description: "Respetamos su agenda. Si decimos una hora, cumplimos esa hora, siempre.",
    },
    {
        icon: "verified_user",
        title: "Bienes Protegidos",
        description: "Embalamos, cargamos y transportamos sus cosas como si fueran nuestras. Con cuidado real.",
    },
    {
        icon: "workspace_premium",
        title: "Experiencia Comprobada",
        description: "Más de 20 años movilizando hogares y empresas en Costa Rica. Sabemos lo que hacemos.",
    },
    {
        icon: "payments",
        title: "Precio Sin Sorpresas",
        description: "La cotización que recibe es el precio que paga. Sin extras de último momento.",
        highlight: true
    }
];

const ValueCard = ({ icon, title, description, highlight, index }) => (
    <motion.div
        className={`${styles.card} ${highlight ? styles.highlight : ''}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 90, damping: 16 }}
    >
        <div className={styles.iconBg}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        {highlight && (
            <div className={styles.actions}>
                <Link to="/condiciones" className={styles.linkSecondary}>Ver condiciones</Link>
                <a href="#contacto" className={styles.btnCta}>Cotizar ahora</a>
            </div>
        )}
    </motion.div>
);

const WhyUs = () => (
    <section id="nosotros" className={styles.section}>
        <div className={styles.inner}>
            <div className={styles.header}>
                <motion.span
                    className={styles.eyebrow}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                >
                    Por qué confiar en nosotros
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                >
                    ¿Por qué elegirnos?
                </motion.h2>
                <div className={styles.rule} />
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                >
                    Con más de 20 años y 20,000 viajes realizados, sabemos cómo hacer que su mudanza sea tranquila, puntual y sin contratiempos.
                </motion.p>
            </div>

            <div className={styles.grid}>
                {values.map((v, i) => <ValueCard key={i} {...v} index={i} />)}
            </div>
        </div>
    </section>
);

export default WhyUs;
