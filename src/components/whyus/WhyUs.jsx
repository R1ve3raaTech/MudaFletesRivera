import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Handshake, Shield, Gem } from 'lucide-react';
import styles from './WhyUs.module.css';

const values = [
    {
        Icon: Clock,
        title: "El Respeto al Tiempo",
        description: "La puntualidad no es opcional, es nuestra promesa. Honramos su agenda sin excusas.",
        color: "#3B82F6"
    },
    {
        Icon: Handshake,
        title: "Honestidad y Trato",
        description: "Manejamos sus pertenencias con la integridad y el respeto que merecen. Siempre.",
        color: "#10B981"
    },
    {
        Icon: Shield,
        title: "Cuidado Absoluto",
        description: "Protección rigurosa de sus bienes. Nos esforzamos para que todo llegue impecable.",
        color: "#8B5CF6"
    },
    {
        Icon: Gem,
        title: "Precio Justo",
        description: "Cotizaciones claras y honestas. Calidad premium sin cargos ocultos ni sorpresas.",
        color: "#F59E0B",
        highlight: true
    }
];

const ValueCard = ({ Icon, title, description, color, highlight, index }) => (
    <motion.div
        className={`${styles.card} ${highlight ? styles.highlight : ''}`}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, type: 'spring', stiffness: 100 }}
        whileHover={{ y: -12 }}
        style={{ '--card-color': color }}
    >
        <div className={styles.iconBg} style={{ background: `${color}15` }}>
            <Icon size={36} style={{ color }} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        {highlight && (
            <div className={styles.actions}>
                <Link to="/condiciones" className={styles.linkSecondary}>Condiciones</Link>
                <a href="#contacto" className={styles.btnCta}>Cotizar ahora</a>
            </div>
        )}
        <div className={styles.cardGlow} style={{ background: `${color}10` }} />
    </motion.div>
);

const WhyUs = () => (
    <section id="nosotros" className={styles.section}>
        <div className={styles.bg} />
        <div className={styles.inner}>
            <div className={styles.header}>
                <motion.span
                    className={styles.eyebrow}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                >
                    Nuestra Esencia
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
                    Nos esforzamos por ofrecer un servicio de excelencia basado en valores sólidos y una atención al detalle inigualable.
                </motion.p>
            </div>

            <div className={styles.grid}>
                {values.map((v, i) => <ValueCard key={i} {...v} index={i} />)}
            </div>
        </div>
    </section>
);

export default WhyUs;
