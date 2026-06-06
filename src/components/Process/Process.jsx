import React from 'react';
import { motion } from 'framer-motion';
import styles from './Process.module.css';

const steps = [
    { step: "01", icon: "phone_in_talk", title: "Contáctenos Hoy", description: "Escríbanos por WhatsApp o llámenos. En minutos sabremos qué necesita y cómo ayudarle." },
    { step: "02", icon: "request_quote", title: "Cotización Clara", description: "Le enviamos un precio honesto, sin letras pequeñas ni cargos escondidos. Usted decide." },
    { step: "03", icon: "local_shipping", title: "Nos Encargamos Todo", description: "Llegamos puntuales, empacamos con cuidado y cargamos sus bienes con equipo profesional." },
    { step: "04", icon: "home_pin", title: "Llega en Perfecto Estado", description: "Su hogar o negocio en el nuevo destino, tal como lo dejó. Sin estrés, sin sorpresas." }
];

const Process = () => (
    <section id="proceso" className={styles.process}>
        <div className={styles.sectionHeader}>
            <motion.span
                className={styles.eyebrow}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
                Nuestro proceso
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
                Así de Fácil es Mudarse con Nosotros
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            >
                Cuatro pasos. Sin complicaciones. Con la tranquilidad que merece.
            </motion.p>
        </div>

        <div className={styles.stepsRow}>
            {steps.map((s, i) => (
                <React.Fragment key={i}>
                    <motion.div
                        className={styles.step}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12, type: 'spring', stiffness: 90 }}
                    >
                        <div className={styles.iconWrap}>
                            <span className="material-symbols-outlined">{s.icon}</span>
                            <span className={styles.badge}>{s.step}</span>
                        </div>
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                    </motion.div>

                    {i < steps.length - 1 && (
                        <motion.div
                            className={styles.connector}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 + 0.2, duration: 0.4 }}
                            style={{ originX: 0 }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    </section>
);

export default Process;
