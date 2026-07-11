import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const data = [
    { target: 20000, format: true,  suffix: "+", label: "viajes realizados" },
    { target: 20,    format: false, suffix: "+", label: "años de experiencia" },
    { target: 5000,  format: true,  suffix: "+", label: "clientes felices" },
];

const fmt = (n, format) => (format ? n.toLocaleString('es-CR') : String(n));

const CountUp = ({ target, format, suffix, started }) => {
    const [shown, setShown] = useState("0");

    useEffect(() => {
        if (!started) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(fmt(target, format));
            return;
        }
        let start = 0;
        const duration = 1600;
        let raf;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(2, -10 * progress); // easeOutExpo
            setShown(fmt(Math.round(eased * target), format));
            if (progress < 1) raf = requestAnimationFrame(step);
            else setShown(fmt(target, format));
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [started, target, format]);

    return <>{shown}<em>{suffix}</em></>;
};

const Stats = () => {
    const rootRef = useRef(null);
    const [inView, setInView] = useState(false);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        gsap.timeline({
            scrollTrigger: {
                trigger: rootRef.current, start: 'top 78%', once: true,
                onEnter: () => setInView(true),
            },
            defaults: { ease: 'power3.out' },
        })
            .from(`.${styles.heading}`, { opacity: 0, y: reduceMotion ? 0 : 22, duration: 0.55 })
            .from(`.${styles.statItem}`, { opacity: 0, y: reduceMotion ? 0 : 26, duration: 0.55, stagger: 0.12 }, 0.15);
    }, { scope: rootRef });

    return (
        <section className={styles.stats} ref={rootRef}>
            <div className={styles.container}>
                <div className={styles.heading}>
                    <h2>La confianza se gana kilómetro a kilómetro.</h2>
                    <p>Cada número es una familia o una empresa que llegó tranquila a su destino.</p>
                </div>

                <div className={styles.row}>
                    {data.map((item, i) => (
                        <div key={i} className={styles.statItem}>
                            <div className={styles.number}>
                                <CountUp {...item} started={inView} />
                            </div>
                            <div className={styles.label}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
