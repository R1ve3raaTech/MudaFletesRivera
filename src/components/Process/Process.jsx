import React from 'react';
import { motion } from 'framer-motion';
import styles from './Process.module.css';

const StepItem = ({ step, title, description, index }) => {
    return (
        <motion.div 
            className={styles.stepItem}
            initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
        >
            <motion.div className={styles.stepCircle} whileHover={{ scale: 1.1, backgroundColor: 'var(--accent-color)', color: 'white' }}>{step}</motion.div>
            <div className={styles.line}></div>
            <div className={styles.stepContent}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </motion.div>
    );
};

const Process = () => {
    const steps = [
        { step: "01", title: "Cotice en Segundos", description: "Envíe un WhatsApp o llene el formulario detallando la carga y destino." },
        { step: "02", title: "Reciba un Precio Justo", description: "Le daremos una cotización honesta y clara sin tarifas ocultas." },
        { step: "03", title: "Recolección Segura", description: "Llegamos puntualmente para cargar sus bienes con el mayor cuidado." },
        { step: "04", title: "Entrega Puntual", description: "Llevamos su carga intacta a cualquier rincón de Costa Rica." }
    ];

    return (
        <section id="proceso" className={styles.process}>
            <div className={styles.sectionHeader}>
                <h2>Su Mudanza Paso a Paso</h2>
                <p>Simplificamos el transporte para que su mente esté tranquila.</p>
            </div>
            <div className={styles.container}>
                {steps.map((s, i) => (
                    <StepItem key={i} {...s} index={i} />
                ))}
            </div>
        </section>
    );
};

export default Process;
