import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';
import { PartyPopper, Check, MessageCircle, Info, RotateCcw } from 'lucide-react';
import Confetti from '../Confetti/Confetti';
import styles from './CotizadorForm.module.css';
import motionStyles from './SuccessConfirmation.module.css';

const sparks = Array.from({ length: 8 }, (_, index) => ({
    x: Math.cos(index * Math.PI / 4) * 64,
    y: Math.sin(index * Math.PI / 4) * 64,
}));

export default function SuccessConfirmation({ name, onShare, onRestart }) {
    const reduced = useReducedMotion();
    const group = {
        hidden: {},
        visible: { transition: { delayChildren: reduced ? 0 : .08, staggerChildren: reduced ? 0 : .09 } },
    };
    const item = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .4, ease: [.22, 1, .36, 1] } },
    };
    return <LazyMotion features={domAnimation}>
        <Motion.div className={styles.exito} variants={group} initial={reduced ? false : "hidden"} animate="visible">
            <Confetti />
            <Motion.div className={`${styles.exitoIcon} ${motionStyles.badge}`} style={{ animation: 'none' }}
                initial={reduced ? false : { opacity: 0, scale: .55, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}>
                {!reduced && <>
                    <Motion.span className={motionStyles.halo} aria-hidden="true"
                        initial={{ scale: .7, opacity: 0 }}
                        animate={{ scale: [ .7, 1.35, 1.5 ], opacity: [0, .65, 0] }}
                        transition={{ duration: .85, delay: .12 }} />
                    {sparks.map((spark, index) => <Motion.span key={index} aria-hidden="true"
                        className={motionStyles.spark}
                        style={{ background: index % 2 ? '#2563eb' : '#16a34a' }}
                        initial={{ x: 0, y: 0, opacity: 0, scale: .5 }}
                        animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0], scale: [.5, 1, .6] }}
                        transition={{ duration: .75, delay: .16 }} />)}
                </>}

                <PartyPopper size={34} />
            </Motion.div>
            <Motion.h3 variants={item} aria-live="polite">¡Listo, {name}!</Motion.h3>
            <Motion.p variants={item}>
                Tu PDF se descargó y se abrió WhatsApp. Adjunta el PDF en el chat
                y en minutos te confirmamos el precio de tu mudanza.
            </Motion.p>
            <Motion.div className={styles.exitoPasos} variants={item}>
                <span><Check size={15} /> PDF generado con tus datos</span>
                <span><Check size={15} /> Solicitud registrada</span>
                <span><MessageCircle size={15} /> Solo falta adjuntarlo en WhatsApp</span>
            </Motion.div>
            <Motion.div className={styles.exitoAviso} variants={item} style={{ animation: 'none' }}>
                <Info size={16} className={styles.exitoAvisoIcon} />
                <p>
                    El precio mostrado es <strong>solamente un estimado</strong> calculado
                    según el kilometraje, el acceso, los pisos y los artículos.
                    El <strong>precio final se aclara por WhatsApp</strong>.
                </p>
            </Motion.div>
            <Motion.div className={styles.exitoAcciones} variants={item}>
                <button type="button" className={styles.btnWa} onClick={onShare}>
                    <MessageCircle size={18} /> Enviar PDF por WhatsApp
                </button>
                <button type="button" className={styles.btnBack} onClick={onRestart}>
                    <RotateCcw size={15} /> Hacer otra cotización
                </button>
            </Motion.div>
        </Motion.div>
    </LazyMotion>;
}
