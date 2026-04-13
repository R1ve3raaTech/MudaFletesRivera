import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Conditions.module.css';

const Conditions = () => {
    return (
        <div className={styles.termsContainer}>
            <div className={styles.termsCard}>
                <h1>Condiciones de Uso</h1>

                <div className={styles.termsSection}>
                    <h2>1. Introducción</h2>
                    <p>
                        Bienvenido a MudaFletesRivera. Al utilizar nuestros servicios de transporte, mudanzas y los acabados 
                        de adhesivos especializados, usted acepta cumplir con los siguientes términos y condiciones.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>2. Servicios de Transporte y Mudanza</h2>
                    <p>
                        Nos comprometemos a manejar sus pertenencias con el mayor cuidado. Sin embargo, el cliente es 
                        responsable de declarar objetos de valor excepcional o fragilidad extrema antes de iniciar el 
                        servicio. No nos hace responsable de daños en artículos no embalados adecuadamente por el cliente. 
                        NO transportamos: arena, grava, arcilla, escombros, y ninguno de sus variantes.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>3. Venta de Materiales</h2>
                    <p>
                        Los adhesivos y pegamentos especializados (tipo Bondex) deben utilizarse siguiendo estrictamente las 
                        instrucciones del fabricante. MudaFletesRivera solamente transporta el producto, no lo fabrica ni lo 
                        empaca, mucho menos se responsabiliza por aplicaciones incorrectas e indebido de los productos.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>4. Cotizaciones y Pagos</h2>
                    <p>
                        Todas las cotizaciones tienen una validez de 7 días naturales. Los precios pueden variar si las 
                        condiciones del servicio (Carga, Kilómetros, accesibilidad de carga y descargada, etc) cambian 
                        respecto a lo declarado inicialmente.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>5. Privacidad</h2>
                    <p>
                        Sus datos personales proporcionados a través del formulario serán utilizados exclusivamente 
                        para fines de contacto y mejora del servicio, no le daremos sus datos a terceros.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/" className={styles.btnPrimary}>Volver al Inicio</Link>
                </div>
            </div>
        </div>
    );
};

export default Conditions;
