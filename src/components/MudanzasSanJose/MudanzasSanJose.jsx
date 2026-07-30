import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ArrowUpRight, CheckCircle2, MessageCircle } from 'lucide-react';
import SEO from '../SEO';
import styles from './MudanzasSanJose.module.css';

gsap.registerPlugin(ScrollTrigger);

const CANTONES = [
    'San José centro', 'Escazú', 'Santa Ana', 'Curridabat', 'Montes de Oca',
    'Desamparados', 'Goicoechea', 'Tibás', 'Moravia', 'Alajuelita',
    'Vázquez de Coronado', 'La Unión',
];

const VENTAJAS = [
    'Equipo con más de 20 años de experiencia en mudanzas del GAM',
    'Cotización en línea con precio estimado al instante',
    'Manejo cuidadoso de artículos frágiles y de valor',
    'Coordinación con administraciones de condominios y edificios',
];

const FAQS = [
    {
        pregunta: '¿Hacen mudanzas en edificios y condominios con ascensor?',
        respuesta: 'Sí. Trabajamos habitualmente en torres residenciales y condominios del GAM. Te recomendamos avisar a la administración con anticipación, ya que algunos edificios piden reservar el ascensor de carga o el horario de servicio.',
    },
    {
        pregunta: '¿Cuánto se tarda una mudanza dentro de San José?',
        respuesta: 'Depende de la distancia, el tráfico y el volumen a trasladar. Al cotizar en línea te damos un estimado según tu ruta específica dentro del GAM.',
    },
    {
        pregunta: '¿Cubren cantones fuera de San José centro?',
        respuesta: 'Sí, damos servicio en todo el Gran Área Metropolitana, incluyendo los cantones que mencionamos abajo.',
    },
];

const MudanzasSanJose = () => {
    const heroRef = useRef(null);
    const sectionsRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(`.${styles.eyebrow}`, { opacity: 0, duration: 0.4 })
            .from(`.${styles.title}`, { opacity: 0, y: reduceMotion ? 0 : 20, duration: 0.5 }, 0.1)
            .from(`.${styles.subtitle}`, { opacity: 0, y: reduceMotion ? 0 : 16, duration: 0.5 }, 0.2)
            .from(`.${styles.heroCtas} > *`, { opacity: 0, y: reduceMotion ? 0 : 12, duration: 0.4, stagger: 0.08 }, 0.3);
    }, { scope: heroRef });

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.utils.toArray(`.${styles.block}`).forEach((block) => {
            gsap.from(block, {
                opacity: 0, y: reduceMotion ? 0 : 24, duration: 0.5,
                scrollTrigger: { trigger: block, start: 'top 88%', once: true },
            });
        });
    }, { scope: sectionsRef });

    return (
        <div className={styles.page}>
            <SEO
                title="Mudanzas en San José y el GAM — MudaFletesRivera"
                description="Servicio de mudanzas en San José y el Gran Área Metropolitana. Cotiza en línea al instante y coordina tu mudanza con un equipo experimentado."
                path="/mudanzas-san-jose"
            />

            <section className={styles.hero} ref={heroRef}>
                <span className={styles.eyebrow}>
                    <MapPin size={14} /> San José · Gran Área Metropolitana
                </span>
                <h1 className={styles.title}>Mudanzas en San José y el GAM</h1>
                <p className={styles.subtitle}>
                    Trasladamos tu hogar u oficina dentro de San José y los cantones del Gran
                    Área Metropolitana, con un equipo que conoce las condiciones propias de
                    edificios, condominios y tráfico de la zona.
                </p>
                <div className={styles.heroCtas}>
                    <Link to="/mimudanza" className={styles.primaryBtn}>
                        Cotizar mi mudanza <ArrowUpRight size={18} />
                    </Link>
                    <a
                        href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza%20en%20San%20Jos%C3%A9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryBtn}
                    >
                        <MessageCircle size={18} /> Escribir por WhatsApp
                    </a>
                </div>
            </section>

            <div ref={sectionsRef}>
                <section className={styles.block}>
                    <h2>Por qué elegirnos para tu mudanza en San José</h2>
                    <ul className={styles.checkList}>
                        {VENTAJAS.map((v) => (
                            <li key={v}>
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                <span>{v}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.block}>
                    <h2>Zonas donde damos servicio</h2>
                    <p className={styles.blockIntro}>
                        Cubrimos San José y los cantones del GAM, incluyendo:
                    </p>
                    <div className={styles.tags}>
                        {CANTONES.map((c) => (
                            <span key={c} className={styles.tag}>{c}</span>
                        ))}
                    </div>
                </section>

                <section className={styles.block}>
                    <h2>Preguntas frecuentes</h2>
                    <div className={styles.faqList}>
                        {FAQS.map((f) => (
                            <div key={f.pregunta} className={styles.faqItem}>
                                <h3>{f.pregunta}</h3>
                                <p>{f.respuesta}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MudanzasSanJose;
