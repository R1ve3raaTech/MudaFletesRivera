import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import styles from './Contact.module.css';

const FORMSPREE_URL = "https://formspree.io/f/xpqjzprd";
const COOLDOWN_MS = 4 * 60 * 1000;

const services = [
    { value: "transporte", label: "🚚  Transporte de Carga" },
    { value: "materiales", label: "🧱  Materiales (Bondex, etc.)" },
];

const ContactInfo = () => (
    <div className={styles.contactInfo}>
        <motion.span 
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
        >
            Hablemos
        </motion.span>

        <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
        >
            Cotice su <span className={styles.accent}>servicio ideal</span> hoy mismo
        </motion.h2>

        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
        >
            Le respondemos en minutos. Sin complicaciones, sin cargos ocultos.
        </motion.p>

        <div className={styles.infoCards}>
            {[
                { Icon: Phone, label: "Llámenos y WhatsApp", value: "+506 7081 8306", href: "https://wa.me/50670818306" },
                { Icon: Phone, label: "Logística & Despacho",  value: "+506 7132 8432", href: "https://wa.me/50671328432" },
                { Icon: Mail, label: "Correo electrónico",    value: "info@mudafletesrivera.com", href: "mailto:info@mudafletesrivera.com" },
                { Icon: MapPin, label: "Ubicación",            value: "San José, Costa Rica" },
            ].map(({ Icon, label, value, href }, i) => (
                <motion.div
                    key={i}
                    className={styles.infoCard}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ x: 6 }}
                >
                    <div className={styles.infoIconWrap}><Icon size={20} /></div>
                    <div>
                        <span className={styles.infoLabel}>{label}</span>
                        {href
                            ? <a href={href} target="_blank" rel="noopener noreferrer" className={styles.infoValue}>{value}</a>
                            : <p className={styles.infoValue}>{value}</p>
                        }
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', service: 'transporte', acceptTerms: false });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error

    useEffect(() => {
        const saved = localStorage.getItem('contactFormData');
        if (saved) {
            try { setFormData(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        const updated = { ...formData, [name]: val };
        setFormData(updated);
        const { acceptTerms, ...toSave } = updated;
        localStorage.setItem('contactFormData', JSON.stringify(toSave));
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        handleChange({ target: { name: 'phone', value: val } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lastSub = localStorage.getItem('lastSubmissionTime');
        if (lastSub && Date.now() - parseInt(lastSub) < COOLDOWN_MS) {
            const mins = Math.ceil((COOLDOWN_MS - (Date.now() - parseInt(lastSub))) / 60000);
            Swal.fire({
                icon: 'warning',
                title: 'Espere por favor',
                text: `Solo aceptamos cotizaciones cada 4 minutos. Faltan ${mins} minuto(s) para intentarlo de nuevo.`,
                confirmButtonColor: '#0052cc',
            });
            return;
        }

        if (!formData.acceptTerms) {
            Swal.fire({
                icon: 'info',
                title: 'Atención',
                text: 'Debe aceptar las condiciones de uso para continuar.',
                confirmButtonColor: '#0052cc',
            });
            return;
        }

        setStatus('sending');
        try {
            const res = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: JSON.stringify({ name: formData.name, phone: formData.phone, service: formData.service }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                localStorage.setItem('lastSubmissionTime', Date.now().toString());
                localStorage.removeItem('contactFormData');
                setStatus('success');
                setFormData({ name: '', phone: '', service: 'transporte', acceptTerms: false });
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Cotización Enviada!',
                    text: 'Nos pondremos en contacto pronto con usted.',
                    confirmButtonColor: '#25d366',
                    timer: 3000
                });
            } else {
                setStatus('idle');
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No pudimos enviar la cotización. Puede escribirnos directo por WhatsApp.',
                    confirmButtonColor: '#d33',
                });
            }
        } catch {
            setStatus('idle');
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Verifique su internet e intente de nuevo.',
                confirmButtonColor: '#d33',
            });
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                className={styles.successState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                >
                    <CheckCircle size={72} className={styles.successIcon} />
                </motion.div>
                <h3>¡Mensaje enviado!</h3>
                <p>Nos pondremos en contacto pronto. Gracias por confiar en MudaFletesRivera.</p>
                <button className={styles.btnReset} onClick={() => setStatus('idle')}>Enviar otro</button>
            </motion.div>
        );
    }

    return (
        <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
        >
            <h3 className={styles.formTitle}>Complete su cotización</h3>

            {/* Name */}
            <div className={styles.field}>
                <label htmlFor="name">Nombre completo</label>
                <input
                    id="name" name="name" type="text" required
                    placeholder=""
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                />
            </div>

            {/* Phone */}
            <div className={styles.field}>
                <label htmlFor="phone">Teléfono</label>
                <div className={styles.phoneWrap}>
                    <span className={styles.prefix}>🇨🇷 +506</span>
                    <input
                        id="phone" name="phone" type="tel" required
                        placeholder=""
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        className={`${styles.input} ${styles.phoneInput}`}
                    />
                </div>
            </div>

            {/* Service selector */}
            <div className={styles.field}>
                <label>¿Qué servicio necesita?</label>
                <div className={styles.serviceGrid}>
                    {services.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            className={`${styles.serviceChip} ${formData.service === value ? styles.serviceChipActive : ''}`}
                            onClick={() => handleChange({ target: { name: 'service', value } })}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terms */}
            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    name="acceptTerms"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className={styles.checkbox}
                />
                <span>
                    Acepto las <Link to="/condiciones" className={styles.termsLink}>condiciones de uso</Link>
                </span>
            </label>

            <motion.button
                type="submit"
                className={styles.btnSubmit}
                disabled={status === 'sending'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                {status === 'sending' ? (
                    <span className={styles.loadingDots}>Enviando<span>.</span><span>.</span><span>.</span></span>
                ) : (
                    <><Send size={18} /> Enviar Cotización</>
                )}
            </motion.button>
        </motion.form>
    );
};

const Contact = () => {
    return (
        <section id="contacto" className={styles.contact}>
            <div className={styles.inner}>
                <ContactInfo />
                <div className={styles.divider} />
                <ContactForm />
            </div>
        </section>
    );
};

export default Contact;
