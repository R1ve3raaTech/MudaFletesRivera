import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import styles from './NuestrosServicios.module.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: "local_shipping",
        num: "01",
        title: "Logística de Carga",
        description: "Soluciones logísticas de alto nivel. Su mercancía llega intacta, a tiempo y respaldada por nuestra experiencia de décadas.",
        benefits: ["Carga Protegida", "Seguimiento en Tiempo Real", "Conductores Expertos"],
    },
    {
        icon: "inventory_2",
        num: "02",
        title: "Mudanzas Profesionales",
        description: "Traslados residenciales y de oficina sin complicaciones. Empacamos y movemos su vida con el máximo respeto y seguridad.",
        benefits: ["Embalaje de Protección", "Carga y Descarga", "Desarmado de Muebles"]
    },
    {
        icon: "construction",
        num: "03",
        title: "Productos Especializados",
        description: "Calidad certificada en materiales de construcción. Le asesoramos para que su proyecto tenga los mejores cimientos.",
        benefits: ["Precios de Fábrica", "Entrega Inmediata", "Asesoría Técnica"]
    }
];

const ServiceCard = ({ icon, num, title, description, benefits, index }) => {
    const ref = useRef(null);

    useGSAP(() => {
        gsap.from(ref.current, {
            opacity: 0, y: 50, duration: 0.6, delay: index * 0.13, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        });
    }, { scope: ref });

    return (
    <div ref={ref} className={styles.row}>
        <div className={styles.rail}>
            <span className={styles.num}>{num}</span>
            <div className={styles.iconWrap}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>

        <div className={styles.content}>
            <h3>{title}</h3>
            <p className={styles.desc}>{description}</p>

            <ul className={styles.benefits}>
                {benefits.map((b, i) => (
                    <li key={i}>
                        <span className={`material-symbols-outlined ${styles.check}`}>check_circle</span>
                        {b}
                    </li>
                ))}
            </ul>
        </div>

        <a
            href={`https://wa.me/50670818306?text=Hola,%20quisiera%20cotizar%20el%20servicio%20de%20${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnService}
        >
            <MessageCircle size={16} /> Cotizar
        </a>
    </div>
    );
};

const Services = () => {
    const headerRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.sectionHeader} h2`, { opacity: 0, y: 20, duration: 0.4 })
            .from(`.${styles.sectionHeader} p`, { opacity: 0, duration: 0.4 }, 0.15);
    }, { scope: headerRef });

    return (
    <section id="servicios" className={styles.services}>
        <div className={styles.sectionHeader} ref={headerRef}>
            <h2>
                Movemos su casa,<br />su oficina y su carga.
            </h2>
            <p>
                Tres servicios, una sola promesa: todo llega completo, a tiempo y al precio acordado.
            </p>
        </div>

        <div className={styles.list}>
            {services.map((s, i) => <ServiceCard key={i} {...s} index={i} />)}
        </div>
    </section>
    );
};

export default Services;
