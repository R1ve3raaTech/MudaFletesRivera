import { Link } from 'react-router-dom';
import { Clock3, ShieldCheck, BadgeCheck, ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';
import scrollToSection from '../../scrollToSection';
import styles from './WhyUs.module.css';

const values = [
    {
        title: "Llegamos a tiempo",
        description: "Respetamos su agenda. Si decimos una hora, cumplimos esa hora, siempre.",
    },
    {
        title: "Bienes protegidos",
        description: "Embalamos, cargamos y transportamos sus cosas como si fueran nuestras.",
    },
    {
        title: "Experiencia comprobada",
        description: "Más de 20 años movilizando hogares y empresas en Costa Rica.",
    },
];

const icons = [Clock3, ShieldCheck, BadgeCheck];

export default function WhyUs() {
    return <section id="nosotros" className={styles.section}>
        <div className={styles.inner}>
            <div className={styles.intro}>
                <Reveal className={styles.heading}>
                    <h2>¿Por qué elegirnos?</h2>
                    <p>Con más de 20 años y 20,000 viajes realizados, sabemos cómo hacer que su mudanza sea tranquila, puntual y sin contratiempos.</p>
                </Reveal>
                <Reveal className={styles.price} delay={.08}>
                    <h3>Precio sin sorpresas</h3>
                    <p>La cotización que recibe es el precio que paga. Sin extras de último momento, sin letra pequeña, sin cargos escondidos al bajar el último mueble.</p>
                    <div className={styles.actions}>
                        <a href="/#contacto" className={styles.quote}
                            onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>
                            Cotizar ahora <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                        <Link to="/condiciones" className={styles.conditions}>Ver condiciones</Link>
                    </div>
                </Reveal>
            </div>
            <div className={styles.values}>
                {values.map((value, i) => {
                    const Icon = icons[i];
                    return <Reveal as="article" className={styles.value} key={value.title} delay={i * .06}>
                        <Icon size={23} className={styles.icon} aria-hidden="true" />
                        <div>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </div>
                    </Reveal>;
                })}
            </div>
        </div>
    </section>;
}
