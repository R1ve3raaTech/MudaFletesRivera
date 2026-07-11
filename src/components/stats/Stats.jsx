import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const data = [
    { icon: "route",              display: "20K", suffix: "+", label: "Viajes Realizados" },
    { icon: "history_edu",        display: "20",  suffix: "+", label: "Años de Experiencia" },
    { icon: "sentiment_satisfied",display: "5K",  suffix: "+", label: "Clientes Felices" },
];

/* Silueta de Costa Rica — coordenadas geográficas reales convertidas a SVG
   Bounding box: lon 82.55W–85.95W, lat 8.03N–11.22N
   Escala: x=(85.95-lon)*88,  y=(11.22-lat)*82
*/

const CountUp = ({ display, suffix, started }) => {
    const [shown, setShown] = useState("0");
    const target = parseInt(display.replace("K", ""));

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const duration = 1400;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            setShown(display.includes("K") ? (current >= 1000 ? `${Math.floor(current / 1000)}K` : `${current}`) : `${current}`);
            if (progress < 1) requestAnimationFrame(step);
            else setShown(display);
        };
        requestAnimationFrame(step);
    }, [started]);

    return <>{suffix}{shown}</>;
};

const StatItem = ({ icon, display, suffix, label, index }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useGSAP(() => {
        gsap.from(ref.current, {
            opacity: 0, y: 28, duration: 0.6, delay: index * 0.12, ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: ref.current, start: 'top 90%', once: true,
                onEnter: () => setInView(true),
            },
        });
    }, { scope: ref });

    return (
        <div ref={ref} className={styles.statItem}>
            <div className={styles.number}>
                <CountUp display={display} suffix={suffix} started={inView} />
            </div>
            <div className={styles.label}>{label}</div>
        </div>
    );
};

const Stats = () => (
    <section className={styles.stats}>
        <div className={styles.container}>
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <StatItem {...item} index={i} />
                    {i < data.length - 1 && <div className={styles.divider} />}
                </React.Fragment>
            ))}
        </div>
    </section>
);

export default Stats;
