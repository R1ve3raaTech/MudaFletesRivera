import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsappFloat.module.css';

const WhatsappFloat = () => {
    return (
        <motion.a
            href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.floatButton}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <MessageCircle size={32} />
            <span className={styles.tooltip}>¡Hablemos!</span>
        </motion.a>
    );
};

export default WhatsappFloat;
