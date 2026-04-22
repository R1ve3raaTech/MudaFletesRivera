import React from 'react';
import { motion } from 'framer-motion';
import styles from './Stats.module.css';

const StatItem = ({ number, label, suffix = "+" }) => {
    return (
        <motion.div 
            className={styles.statItem}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
            <div className={styles.number}>{number}{suffix}</div>
            <div className={styles.label}>{label}</div>
        </motion.div>
    );
};

const Stats = () => {
    const data = [
        { number: "20K", label: "Viajes Realizados", suffix: "+" },
        { number: "20", label: "Años de Experiencia", suffix: "+" },
        { number: "5K", label: "Clientes Felices", suffix: "+" },
        { number: "7", label: "Provincias Cubiertas", suffix: "" }
    ];

    return (
        <section className={styles.stats}>
            <div className={styles.container}>
                {data.map((item, index) => (
                    <StatItem key={index} {...item} />
                ))}
            </div>
        </section>
    );
};

export default Stats;
