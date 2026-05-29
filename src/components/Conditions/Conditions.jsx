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
                        especializada en Costa Rica, usted acepta cumplir con los siguientes términos y condiciones,
                        establecidos para garantizar la seguridad de su patrimonio y una experiencia de servicio transparente.
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
                        Nos comprometemos a manejar sus pertenencias con el mayor cuidado posible. El cliente es
                        responsable de declarar todos los artículos frágiles, de valor excepcional o de manejo especial
                        antes de iniciar el servicio. No nos hacemos responsables de daños en artículos que no hayan
                        sido embalados adecuadamente por el cliente o que no hayan sido declarados previamente.
                    </p>
                    <p>
                        <strong>No transportamos:</strong> arena, grava, arcilla, escombros ni ninguna de sus variantes.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <h2>3. Cotizador y Solicitudes</h2>
                    <p>
                        El cotizador disponible en nuestro sitio web genera una <strong>solicitud de cotización</strong>,
                        no un precio definitivo. Al completar el formulario, se descarga un PDF con los detalles
                        declarados por el cliente, el cual debe adjuntarse en WhatsApp para recibir el precio final
                        confirmado por nuestro equipo.
                    </p>
                    <p>
                        El precio final puede variar si las condiciones declaradas en la solicitud (artículos,
                        accesibilidad, distancia, escaleras, entre otros) difieren de las condiciones reales al
                        momento del servicio.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                >
                    <h2>4. Servicios Adicionales</h2>
                    <p>
                        Los siguientes servicios tienen un costo adicional al flete base y deben ser solicitados
                        con anticipación:
                    </p>
                    <ul>
                        <li><strong>Desmontaje y armado de muebles</strong> (camas, closets, etc.)</li>
                        <li><strong>Embalaje</strong> (cajas, plástico burbuja, materiales de empaque)</li>
                        <li><strong>Ayudantes adicionales</strong> según la cantidad solicitada</li>
                        <li><strong>Artículos frágiles o especiales</strong> que requieran manejo especial</li>
                    </ul>
                    <p>
                        El cobro por escaleras aplica cuando el origen o destino tiene uno o más pisos de escaleras
                        que dificulten la carga y descarga.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <h2>5. Mudanzas Urgentes</h2>
                    <p>
                        Las solicitudes con menos de <strong>3 días de anticipación</strong> a la fecha deseada se
                        consideran urgentes y aplica un cargo adicional. Este cargo será informado y confirmado
                        por WhatsApp antes de concretar el servicio.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 }}
                >
                    <h2>6. Puntualidad y Acceso</h2>
                    <p>
                        Nuestro compromiso es la puntualidad. El cliente debe asegurar que los accesos al origen y
                        destino estén despejados y listos para la carga en la hora acordada. Si el lugar no cuenta
                        con espacio para parquear un camión grande en la vía pública, el cliente debe informarlo
                        con anticipación para coordinar la logística.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <h2>7. Cotizaciones y Validez</h2>
                    <p>
                        Todas las cotizaciones confirmadas tienen una validez de <strong>7 días naturales</strong>.
                        Pasado ese plazo, los precios pueden estar sujetos a cambios según disponibilidad y
                        condiciones del servicio.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.termsSection}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 }}
                >
                    <h2>8. Privacidad y Datos</h2>
                    <p>
                        Los datos personales ingresados en el cotizador (nombre, dirección de origen y destino,
                        artículos y servicios solicitados) son almacenados de forma segura y utilizados
                        exclusivamente para procesar su solicitud de cotización y mejorar nuestro servicio.
                        No compartimos sus datos con terceros.
                    </p>
                    <p>
                        El PDF generado por el cotizador también se guarda en nuestro sistema para referencia
                        interna del equipo. Si desea que sus datos sean eliminados, puede solicitarlo por WhatsApp.
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
