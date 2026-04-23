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
        { step: "01", title: "Cotice con Expertos", description: "Envíe un WhatsApp ahora. Le atenderemos en minutos para entender sus necesidades." },
        { step: "02", title: "Precio sin Sorpresas", description: "Reciba una propuesta honesta, clara y competitiva. Garantizamos transparencia total." },
        { step: "03", title: "Cuidado de Élite", description: "Nuestro equipo llega puntualmente para proteger y cargar sus bienes con técnicas profesionales." },
        { step: "04", title: "Entrega Exitosa", description: "Su vida o negocio llega a su nuevo destino en perfecto estado y a tiempo." }
    ];

    return (
        <section id="proceso" className={styles.process}>
            <div className={styles.sectionHeader}>
                <h2>Así de Fácil es Mudarse con Nosotros</h2>
                <p>Nuestra metodología depurada garantiza que su única preocupación sea disfrutar su nuevo espacio.</p>
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
