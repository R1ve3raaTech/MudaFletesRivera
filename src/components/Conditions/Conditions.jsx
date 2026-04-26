import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Conditions.module.css';

const Conditions = () => {
    return (
        <motion.div 
            className={styles.termsContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div 
                className={styles.termsCard}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1>Condiciones de Uso</h1>

                <motion.div 
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <h2>1. Introducción</h2>
                    <p>
                        Bienvenido a MudaFletesRivera. Al utilizar nuestros servicios de transporte, mudanzas y logística 
                        especializada, usted acepta cumplir con los siguientes términos y condiciones establecidos para 
                        garantizar la seguridad de su patrimonio.
                    </p>
                </motion.div>

                <motion.div 
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>2. Servicios de Transporte y Mudanza</h2>
                    <p>
                        Nos comprometemos a manejar sus pertenencias con el mayor cuidado. Sin embargo, el cliente es 
                        responsable de declarar objetos de valor excepcional o fragilidad extrema antes de iniciar el 
                        servicio. No nos hace responsable de daños en artículos no embalados adecuadamente por el cliente. 
                        NO transportamos: arena, grava, arcilla, escombros, y ninguno de sus variantes.
                    </p>
                </motion.div>

                <motion.div 
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <h2>3. Puntualidad y Compromiso</h2>
                    <p>
                        Nuestro compromiso es la puntualidad. El cliente debe asegurar que los accesos estén despejados 
                        y listos para la carga en la hora acordada para evitar retrasos en la logística nacional.
                    </p>
                </motion.div>

                <motion.div 
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <h2>4. Cotizaciones y Pagos</h2>
                    <p>
                        Todas las cotizaciones tienen una validez de 7 días naturales. Los precios pueden variar si las 
                        condiciones del servicio (Carga, Kilómetros, accesibilidad de carga y descargada, etc) cambian 
                        respecto a lo declarado inicialmente.
                    </p>
                </motion.div>

                <motion.div 
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <h2>5. Privacidad</h2>
                    <p>
                        Sus datos personales proporcionados a través del formulario serán utilizados exclusivamente 
                        para fines de contacto y mejora del servicio, no le daremos sus datos a terceros.
                    </p>
                </motion.div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/" className={styles.btnPrimary}>Volver al Inicio</Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Conditions;
