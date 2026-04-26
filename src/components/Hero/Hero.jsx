import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, Package, ShieldCheck, MessageCircle } from 'lucide-react';
import logoImg from '../../assets/MRlogo.png';
import styles from './Hero.module.css';

const FloatingIcon = ({ icon: Icon, delay, className }) => (
    <motion.div 
        className={`${styles.floatingIcon} ${className}`}
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 4, repeat: Infinity, delay: delay, ease: "easeInOut" }}
    >
        <Icon size={40} />
    </motion.div>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 800], ['0%', '15%']);

    return (
        <header id="inicio" className={styles.hero}>
            <motion.div 
                className={styles.heroBg}
                style={{ 
                    y: backgroundY
                }}
            />
            <div className={styles.overlay}></div>
            
            <FloatingIcon icon={Truck} delay={0} className={styles.icon1} />
            <FloatingIcon icon={Package} delay={1} className={styles.icon2} />
            <FloatingIcon icon={ShieldCheck} delay={2} className={styles.icon3} />
            
            <motion.div 
                className={styles.heroContent}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.div 
                    className={styles.heroLogo}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <img src={logoImg} alt="MudaFletesRivera Logo" />
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    Mudanzas y Fletes en <span>Costa Rica</span>: Su Patrimonio en Manos de Expertos
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                >
                    Más de 20 años de liderazgo en Costa Rica. No solo movemos muebles, protegemos tu patrimonio con puntualidad experta y el equipo más confiable del país.
                </motion.p>
                
                <motion.div 
                    className={styles.btnGroup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                        <MessageCircle size={22} /> Cotizar por WhatsApp
                    </a>
                    <a href="#servicios" className={styles.btnSecondary}>Ver Servicios</a>
                </motion.div>
            </motion.div>
            
            <motion.div 
                className={styles.scrollIndicator}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
            </motion.div>
        </header>
    );
};

export default Hero;
