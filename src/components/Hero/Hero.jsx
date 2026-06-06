import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import logoImg from '../../assets/MRlogo.png';
import styles from './Hero.module.css';

const Hero = () => (
    <header id="inicio" className={styles.hero}>
        <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <img src={logoImg} alt="MudaFletesRivera" className={styles.logo} />

            <motion.p
                className={styles.eyebrow}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
                Mudanzas &amp; Logística — Costa Rica
            </motion.p>

            <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            >
                Su hogar llega <br /><span>sano y salvo.</span>
            </motion.h1>

            <motion.p
                className={styles.sub}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
                Más de 20 años protegiendo lo que más importa. Puntualidad, cuidado y precio justo, garantizados.
            </motion.p>

            <motion.div
                className={styles.actions}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            >
                <a
                    href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
                    target="_blank" rel="noopener noreferrer"
                    className={styles.btnPrimary}
                >
                    <MessageCircle size={18} /> Cotizar por WhatsApp
                </a>
                <a href="#servicios" className={styles.btnSecondary}>Ver servicios</a>
            </motion.div>
        </motion.div>
    </header>
);

export default Hero;
