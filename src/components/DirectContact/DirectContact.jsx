import React from 'react';
import styles from './DirectContact.module.css';

const DirectContact = () => {
    return (
        <section className={styles.directContact}>
            <div className={styles.sectionHeader}>
                <h2>Llámenos Directamente</h2>
                <p>Atención inmediata para sus servicios de transporte y mudanza.</p>
            </div>
            <div className={styles.numbersGrid}>
                <div className={styles.numberItem}>
                    <span className={styles.numberLabel}>Atención Principal</span>
                    <div className={styles.phoneLinks}>
                        <a href="https://wa.me/50670818306?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">7081-8306</a>
                        <a href="https://wa.me/50670332874?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">7033-2874</a>
                    </div>
                </div>
                <div className={styles.numberItem}>
                    <span className={styles.numberLabel}>Logística y Despacho</span>
                    <div className={styles.phoneLinks}>
                        <a href="https://wa.me/50671328432?text=Hola,%20deseo%20cotizar%20una%20mudanza" target="_blank" rel="noopener noreferrer">7132-8432</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DirectContact;
