import { Check, ExternalLink, ArrowUpRight, Hammer } from 'lucide-react';
import truckImg from '../../assets/truck2.webp';
import movingImg from '../../assets/mudanza1.webp';
import Reveal from '../Reveal';
import WhatsAppIcon from '../WhatsAppIcon';
import styles from './NuestrosServicios.module.css';

const services = [
    {
        title: "Logística de Carga",
        description: "Soluciones logísticas de alto nivel. Su mercancía llega intacta, a tiempo y respaldada por nuestra experiencia de décadas.",
        benefits: ["Carga Protegida", "Seguimiento en Tiempo Real", "Conductores Expertos"],
    },
    {
        title: "Mudanzas Profesionales",
        description: "Traslados residenciales y de oficina sin complicaciones. Empacamos y movemos su vida con el máximo respeto y seguridad.",
        benefits: ["Embalaje de Protección", "Carga y Descarga", "Desarmado de Muebles"]
    },
    {
        title: "Materiales de Construcción",
        description: "¿Necesita aditivos y materiales para su obra? Visite a nuestro socio Aditivos Rivera, especialistas en materiales de construcción.",
        benefits: ["Aditivos y Morteros", "Asesoría Especializada", "Sitio Independiente"],
        href: "https://aditivosrivera.com",
        ctaLabel: "Visitar sitio",
        external: true,
    }
];

function Benefits({ items }) {
    return <ul className={styles.benefits}>
        {items.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
    </ul>;
}

function ServiceCard({ service, photo, delay }) {
    return <Reveal as="article" className={styles.service} delay={delay}>
        <div className={styles.photoFrame}>
            <img src={photo} alt={service.title === 'Logística de Carga'
                ? 'Furgón de MudaFletesRivera para el transporte de carga'
                : 'Muebles protegidos y preparados para una mudanza'} loading="lazy" decoding="async" />
        </div>
        <div className={styles.serviceBody}>
            <h3>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>
            <Benefits items={service.benefits} />
            <a className={styles.quote}
                href={'https://wa.me/50670818306?text=Hola,%20quisiera%20cotizar%20el%20servicio%20de%20' + encodeURIComponent(service.title)}
                target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={19} /> Cotizar <ArrowUpRight size={17} aria-hidden="true" />
            </a>
        </div>
    </Reveal>;
}

export default function Services() {
    const materials = services[2];
    return <section id="servicios" className={styles.services}>
        <div className={styles.inner}>
            <Reveal className={styles.header}>
                <h2>Movemos su casa,<br />su oficina y su carga.</h2>
                <p>Tres servicios, una sola promesa: todo llega completo, a tiempo y al precio acordado.</p>
            </Reveal>
            <div className={styles.mainServices}>
                <ServiceCard service={services[0]} photo={truckImg} delay={0} />
                <ServiceCard service={services[1]} photo={movingImg} delay={.08} />
            </div>
            <Reveal as="article" className={styles.materials}>
                <Hammer size={27} className={styles.materialsIcon} aria-hidden="true" />
                <div className={styles.materialsCopy}>
                    <h3>{materials.title}</h3>
                    <p>{materials.description}</p>
                    <Benefits items={materials.benefits} />
                </div>
                <a href={materials.href} target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>
                    {materials.ctaLabel} <ExternalLink size={16} aria-hidden="true" />
                </a>
            </Reveal>
        </div>
    </section>;
}
