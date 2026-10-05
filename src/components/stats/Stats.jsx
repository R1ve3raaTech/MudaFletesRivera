import Reveal from '../Reveal';
import styles from './Stats.module.css';
const data = [
    { value: '20 000', label: 'viajes realizados' },
    { value: '20', label: 'años de experiencia' },
    { value: '5 000', label: 'clientes felices' },
];
export default function Stats() {
    return (
        <section className={styles.stats}>
            <div className={styles.container}>
                <Reveal className={styles.heading}>
                    <h2>La confianza se gana kilómetro a kilómetro.</h2>
                    <p>Cada número es una familia o una empresa que llegó tranquila a su destino.</p>
                </Reveal>
                <dl className={styles.row}>
                    {data.map((item, i) => (
                        <Reveal key={item.label} className={styles.statItem} delay={i * .06}>
                            <dt className={styles.label}>{item.label}</dt>
                            <dd className={styles.number}>{item.value}<span>+</span></dd>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
}
