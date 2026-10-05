import Reveal from '../Reveal';
import movingImg from '../../assets/mudanza3.webp';
import styles from './Process.module.css';

export default function Process() {
    return <section id="proceso" className={styles.process}>
        <div className={styles.inner}>
            <Reveal className={styles.heading}>
                <h2>Mudarse con nosotros es así de simple</h2>
                <p>Sin complicaciones. Con la tranquilidad que merece.</p>
            </Reveal>
            <div className={styles.content}>
                <Reveal className={styles.visual}>
                    <img src={movingImg} alt="Muebles embalados con protección para una mudanza"
                        loading="lazy" decoding="async" />
                </Reveal>
                <Reveal className={styles.copy} delay={.08}>
                    <div className={styles.assurance}>
                        <h3>Cotización Clara</h3>
                        <p>Le enviamos un precio honesto, sin letras pequeñas ni cargos escondidos. Usted decide.</p>
                        <p>Escríbanos por WhatsApp o llámenos. En minutos sabremos qué necesita y cómo ayudarle.</p>
                    </div>
                    <div className={styles.care}>
                        <h3>Su hogar o negocio en el nuevo destino, tal como lo dejó.</h3>
                        <p>Llegamos puntuales, empacamos con cuidado y cargamos sus bienes con equipo profesional.</p>
                        <p className={styles.closing}>Sin estrés, sin sorpresas.</p>
                    </div>
                </Reveal>
            </div>
        </div>
    </section>;
}
