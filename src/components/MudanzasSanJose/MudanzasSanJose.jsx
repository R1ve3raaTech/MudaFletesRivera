import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ArrowUpRight, MessageCircle, Plus } from 'lucide-react';
import SEO from '../SEO';
import zonaImg from '../../assets/mudanza2.webp';
import styles from './MudanzasSanJose.module.css';

gsap.registerPlugin(ScrollTrigger);

const CANTONES = [
    'San José centro', 'Escazú', 'Santa Ana', 'Curridabat', 'Montes de Oca',
    'Desamparados', 'Goicoechea', 'Tibás', 'Moravia', 'Alajuelita',
    'Vázquez de Coronado', 'La Unión',
];

const VENTAJAS = [
    {
        icon: 'workspace_premium',
        title: '20+ años de experiencia',
        description: 'Más de dos décadas moviendo hogares y oficinas en todo Costa Rica, con mayor volumen de trabajo en el GAM.',
    },
    {
        icon: 'request_quote',
        title: 'Cotización al instante',
        description: 'Precio estimado en línea antes de coordinar cualquier detalle, sin esperar una llamada.',
    },
    {
        icon: 'inventory_2',
        title: 'Manejo cuidadoso',
        description: 'Artículos frágiles y de valor embalados y trasladados con el mismo respeto que a lo propio.',
    },
    {
        icon: 'home_pin',
        title: 'Coordinación con edificios',
        description: 'Gestionamos horarios y ascensor de carga junto a la administración de condominios y torres.',
    },
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
        pregunta: '¿Solo hacen mudanzas dentro del GAM?',
        respuesta: 'No. El GAM es donde tenemos mayor volumen de trabajo, pero coordinamos mudanzas hacia cualquier punto de Costa Rica. Estos son los cantones del GAM en los que trabajamos con más frecuencia:',
    },
];

const MudanzasSanJose = () => {
    const heroRef = useRef(null);
    const sectionsRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const y = (v) => (reduceMotion ? 0 : v);

        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from(`.${styles.eyebrow}`, { opacity: 0, y: y(14), duration: 0.5 })
            .from(`.${styles.copy} h1`, { opacity: 0, y: y(22), duration: 0.6 }, 0.1)
            .from(`.${styles.subtitle}`, { opacity: 0, y: y(14), duration: 0.5 }, 0.28)
            .from(`.${styles.heroCtas} > *`, { opacity: 0, y: y(12), duration: 0.5, stagger: 0.08 }, 0.42)
            .from(`.${styles.visual}`, { opacity: 0, x: reduceMotion ? 0 : 36, duration: 0.8 }, 0.2)
            .from(`.${styles.badge}`, { opacity: 0, scale: reduceMotion ? 1 : 0.7, duration: 0.5, ease: 'back.out(2)' }, 0.7);
    }, { scope: heroRef });

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.utils.toArray(`.${styles.row}`).forEach((row, i) => {
            gsap.from(row, {
                opacity: 0, y: reduceMotion ? 0 : 24, duration: 0.5, delay: (i % 4) * 0.08,
                scrollTrigger: { trigger: row, start: 'top 90%', once: true },
            });
        });
        gsap.utils.toArray(`.${styles.blockHead}`).forEach((head) => {
            gsap.from(head, {
                opacity: 0, y: reduceMotion ? 0 : 18, duration: 0.5,
                scrollTrigger: { trigger: head, start: 'top 88%', once: true },
            });
        });
        gsap.from(`.${styles.tag}`, {
            opacity: 0, y: reduceMotion ? 0 : 10, duration: 0.4, stagger: 0.03,
            scrollTrigger: { trigger: `.${styles.tags}`, start: 'top 88%', once: true },
        });
        gsap.from(`.${styles.faqItem}`, {
            opacity: 0, y: reduceMotion ? 0 : 16, duration: 0.4, stagger: 0.08,
            scrollTrigger: { trigger: `.${styles.faqList}`, start: 'top 88%', once: true },
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
                <div className={styles.grid}>
                    <div className={styles.copy}>
                        <span className={styles.eyebrow}>
                            <MapPin size={14} /> San José · Gran Área Metropolitana
                        </span>
                        <h1 className={styles.title}>
                            Su mudanza en San José,<br /><span>sin sorpresas.</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Trasladamos tu hogar u oficina en San José y los cantones del Gran Área
                            Metropolitana, donde tenemos nuestro mayor volumen de trabajo, con un
                            equipo que conoce las condiciones propias de edificios, condominios y
                            tráfico de la zona. También coordinamos mudanzas hacia el resto de Costa Rica.
                        </p>
                        <div className={styles.heroCtas}>
                            <a
                                href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza%20en%20San%20Jos%C3%A9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.primaryBtn}
                            >
                                <MessageCircle size={18} /> Cotizar por WhatsApp
                            </a>
                            <Link to="/mimudanza" className={styles.secondaryBtn}>
                                Cotizar en línea <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className={styles.visual}>
                        <img
                            src={zonaImg}
                            alt="Mudanza residencial en curso dentro del Gran Área Metropolitana"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className={styles.badge}>
                            <MapPin size={18} />
                            <div>
                                <strong>{CANTONES.length}+ cantones</strong>
                                <span>cubiertos en el GAM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div ref={sectionsRef}>
                <section className={styles.block}>
                    <h2 className={styles.blockHead}>Por qué elegirnos para tu mudanza en San José</h2>
                    <div className={styles.list}>
                        {VENTAJAS.map((v, i) => (
                            <div key={v.title} className={styles.row}>
                                <div className={styles.rail}>
                                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                                    <div className={styles.iconWrap}>
                                        <span className="material-symbols-outlined">{v.icon}</span>
                                    </div>
                                </div>
                                <div className={styles.rowContent}>
                                    <h3>{v.title}</h3>
                                    <p>{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockHead}>Zonas donde damos servicio</h2>
                    <p className={styles.blockIntro}>
                        Damos servicio en toda Costa Rica. En el Gran Área Metropolitana, donde
                        tenemos mayor volumen de trabajo, cubrimos cantones como:
                    </p>
                    <div className={styles.tags}>
                        {CANTONES.map((c) => (
                            <span key={c} className={styles.tag}>
                                <MapPin size={13} /> {c}
                            </span>
                        ))}
                    </div>
                </section>

                <section className={styles.block}>
                    <h2 className={styles.blockHead}>Preguntas frecuentes</h2>
                    <div className={styles.faqList}>
                        {FAQS.map((f) => (
                            <details key={f.pregunta} className={styles.faqItem}>
                                <summary>
                                    {f.pregunta}
                                    <Plus size={18} className={styles.faqIcon} />
                                </summary>
                                <p>{f.respuesta}</p>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MudanzasSanJose;
