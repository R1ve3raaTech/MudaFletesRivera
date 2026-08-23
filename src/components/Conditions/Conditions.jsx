import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Conditions.module.css';

gsap.registerPlugin(ScrollTrigger);

const Conditions = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(containerRef.current, { opacity: 0, duration: 0.4 });
        gsap.from(`.${styles.termsCard}`, { opacity: 0, y: 30, scale: 0.98, duration: 0.5, ease: 'power2.out' });

        gsap.utils.toArray(`.${styles.termsSection}`).forEach((section) => {
            gsap.from(section, {
                opacity: 0, y: 15, duration: 0.4,
                scrollTrigger: { trigger: section, start: 'top 90%', once: true },
            });
        });
    }, { scope: containerRef });

    return (
        <div className={styles.termsContainer} ref={containerRef}>
            <div className={styles.termsCard}>
                <h1>Condiciones de Uso</h1>
                <p className={styles.lastUpdated}>Última actualización: 15 de julio de 2026</p>

                <div className={styles.termsSection}>
                    <h2>1. Introducción</h2>
                    <p>
                        Bienvenido a MudaFletesRivera. Al utilizar nuestros servicios de transporte, mudanzas y logística
                        especializada en Costa Rica, usted acepta cumplir con los siguientes términos y condiciones,
                        establecidos para garantizar la seguridad de su patrimonio y una experiencia de servicio transparente.
                    </p>
                    <p>
                        MudaFletesRivera se reserva el derecho de actualizar o modificar estas condiciones en cualquier
                        momento. La versión vigente será siempre la publicada en este sitio web.
                    </p>
                </div>

                <div className={styles.termsSection}>
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
                </div>

                <div className={styles.termsSection}>
                    <h2>3. Obligaciones del Cliente</h2>
                    <p>
                        Para garantizar un servicio seguro, el cliente se compromete a:
                    </p>
                    <ul>
                        <li>Estar presente, personalmente o mediante un representante autorizado, durante la carga y la descarga.</li>
                        <li>Declarar con veracidad los artículos, la accesibilidad y las condiciones del origen y destino.</li>
                        <li>No solicitar el transporte de artículos ilegales, peligrosos, inflamables, explosivos ni perecederos.</li>
                        <li>Embalar adecuadamente los objetos frágiles o de valor, salvo que contrate el servicio de embalaje.</li>
                    </ul>
                    <p>
                        MudaFletesRivera podrá rechazar el transporte de cualquier artículo que represente un riesgo
                        para la seguridad de las personas o de la carga.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>4. Cotizador y Solicitudes</h2>
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
                </div>

                <div className={styles.termsSection}>
                    <h2>5. Servicios Adicionales</h2>
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
                </div>

                <div className={styles.termsSection}>
                    <h2>6. Formas y Condiciones de Pago</h2>
                    <p>
                        El pago total del servicio se realiza <strong>al finalizar la mudanza</strong>, una vez
                        completada la descarga, salvo que se acuerde algo distinto por WhatsApp. Los medios de pago
                        aceptados se confirman con el cliente al coordinar el servicio.
                    </p>
                    <p>
                        El monto a pagar corresponde al precio final confirmado por WhatsApp, más cualquier cargo
                        adicional por servicios extra o por diferencias entre las condiciones declaradas y las reales.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>7. Mudanzas Urgentes</h2>
                    <p>
                        Las solicitudes con menos de <strong>3 días de anticipación</strong> a la fecha deseada se
                        consideran urgentes y aplica un cargo adicional. Este cargo será informado y confirmado
                        por WhatsApp antes de concretar el servicio.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>8. Puntualidad y Acceso</h2>
                    <p>
                        Nuestro compromiso es la puntualidad. El cliente debe asegurar que los accesos al origen y
                        destino estén despejados y listos para la carga en la hora acordada. Si el lugar no cuenta
                        con espacio para parquear un camión grande en la vía pública, el cliente debe informarlo
                        con anticipación para coordinar la logística.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>9. Cotizaciones y Validez</h2>
                    <p>
                        Todas las cotizaciones confirmadas tienen una validez de <strong>3 días naturales</strong>.
                        Pasado ese plazo, los precios pueden estar sujetos a cambios según disponibilidad y
                        condiciones del servicio.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>10. Cancelaciones y Reprogramaciones</h2>
                    <p>
                        El cliente puede cancelar o reprogramar su mudanza sin costo alguno avisando por WhatsApp
                        con al menos <strong>48 horas de anticipación</strong> a la fecha y hora acordadas.
                        Las cancelaciones o cambios con menos de 48 horas de aviso pueden estar sujetos a un cargo,
                        que será informado por WhatsApp según el caso.
                    </p>
                    <p>
                        La reprogramación queda sujeta a la disponibilidad de fechas de nuestro equipo.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>11. Límite de Responsabilidad y Seguro</h2>
                    <p>
                        MudaFletesRivera no se hace responsable por retrasos o incumplimientos causados por
                        situaciones de fuerza mayor o caso fortuito, tales como condiciones climáticas severas,
                        cierres de vías, bloqueos, accidentes de tránsito ajenos a la empresa o disposiciones de
                        autoridades públicas. En estos casos, se coordinará con el cliente una nueva fecha u
                        horario sin costo adicional.
                    </p>
                    <p>
                        La responsabilidad por daños se limita a los artículos declarados y embalados
                        adecuadamente, conforme a la sección 2 de estas condiciones.
                    </p>
                    <p>
                        <strong>Seguro de carga:</strong> por el momento, el servicio no cuenta con una póliza de
                        seguro que cubra la mercancía transportada. En caso de daño atribuible a nuestro equipo sobre
                        un artículo declarado y correctamente embalado, la solución se coordinará directamente con el
                        cliente conforme a la sección 12.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>12. Reclamos por Daños</h2>
                    <p>
                        Cualquier daño atribuible al servicio debe ser reportado por WhatsApp dentro de las
                        <strong> 48 horas siguientes</strong> a la finalización de la mudanza, adjuntando fotografías
                        del artículo afectado. Los reclamos presentados fuera de este plazo no podrán ser considerados.
                    </p>
                    <p>
                        Una vez recibido el reclamo, nuestro equipo lo revisará y coordinará con el cliente una
                        solución razonable, siempre que el artículo haya sido declarado y embalado adecuadamente.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>13. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido de este sitio web —incluyendo el nombre MudaFletesRivera, el logotipo,
                        los textos, las imágenes, el diseño y el cotizador— es propiedad de MudaFletesRivera y
                        está protegido por la legislación de derechos de autor. Queda prohibida su reproducción,
                        distribución o uso comercial sin autorización previa y por escrito.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>14. Privacidad y Datos</h2>
                    <p>
                        Los datos personales ingresados en el cotizador (nombre, dirección de origen y destino,
                        artículos y servicios solicitados) son almacenados de forma segura y utilizados
                        exclusivamente para procesar su solicitud de cotización y mejorar nuestro servicio.
                        No compartimos sus datos con terceros. El tratamiento de datos se realiza conforme a la
                        <strong> Ley N.º 8968 de Protección de la Persona frente al Tratamiento de sus Datos
                        Personales</strong> de Costa Rica.
                    </p>
                    <p>
                        <strong>Conservación:</strong> los datos y el PDF generado se conservan únicamente durante el
                        tiempo necesario para gestionar la solicitud y por un período razonable de referencia interna.
                        El cliente puede solicitar su eliminación en cualquier momento por WhatsApp.
                    </p>
                    <p>
                        <strong>Almacenamiento:</strong> la información se aloja en servidores de nuestro proveedor
                        tecnológico (Supabase), que pueden encontrarse fuera de Costa Rica, aplicando medidas de
                        seguridad para proteger los datos.
                    </p>
                </div>

                <div className={styles.termsSection}>
                    <h2>15. Ley Aplicable y Contacto</h2>
                    <p>
                        Estas condiciones se rigen por las leyes de la República de <strong>Costa Rica</strong>.
                        Cualquier controversia derivada de los servicios será resuelta ante los tribunales
                        costarricenses competentes.
                    </p>
                    <p>
                        Para consultas sobre estas condiciones, puede contactarnos por WhatsApp al
                        <strong> +506 7081 8306</strong>.
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
