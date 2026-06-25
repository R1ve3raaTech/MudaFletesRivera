/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, X, Send, ThumbsUp } from 'lucide-react';
import supabase from '../../supabaseClient';
import styles from './Resenhas.module.css';

gsap.registerPlugin(ScrollTrigger);

const NIVELES = [
    { label: 'Pésimo',    color: '#ef4444' },
    { label: 'Malo',      color: '#f97316' },
    { label: 'Regular',   color: '#eab308' },
    { label: 'Bueno',     color: '#84cc16' },
    { label: 'Muy bueno', color: '#22c55e' },
    { label: 'Excelente', color: '#16a34a' },
];

const TAGS_NEGATIVOS = [
    'Llegaron tarde', 'Hubo daños', 'Mala comunicación',
    'Precio diferente al acordado', 'Poco cuidado con los muebles',
    'Personal poco amable', 'Tardaron más de lo prometido',
];

const TAGS_POSITIVOS = [
    'Llegaron puntual', 'Sin ningún daño', 'Excelente comunicación',
    'Precio justo', 'Muy cuidadosos', 'Personal amable',
    'Rápidos y eficientes', 'Superaron mis expectativas',
];

const todayParts = () => {
    const d = new Date();
    return {
        dia: String(d.getDate()).padStart(2, '0'),
        mes: String(d.getMonth() + 1).padStart(2, '0'),
        anio: String(d.getFullYear()).slice(-2),
    };
};

const MESES = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const MESES_NOMBRES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Termómetro compacto para las cards
const MiniTermometro = ({ calificacion }) => {
    const pct = (calificacion / 6) * 100;
    const color = NIVELES[calificacion - 1]?.color ?? '#e2e8f0';
    return (
        <div className={styles.miniThermo}>
            <div className={styles.miniThermoTrack}>
                <div
                    className={styles.miniThermoFill}
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            <span className={styles.miniThermoLabel} style={{ color }}>
                {NIVELES[calificacion - 1]?.label ?? ''}
            </span>
        </div>
    );
};

// Termómetro interactivo para el formulario
const Termometro = ({ value, onChange }) => {
    const labelRef = useRef(null);

    useGSAP(() => {
        if (!value) return;
        gsap.fromTo(labelRef.current, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.25 });
    }, [value]);

    return (
        <div className={styles.thermo}>
            <div className={styles.thermoBulb} style={{ background: value ? NIVELES[value - 1].color : '#e2e8f0' }} />
            <div className={styles.thermoTrack}>
                {NIVELES.map((nivel, i) => {
                    const active = i < value;
                    return (
                        <button
                            key={i}
                            type="button"
                            className={`${styles.thermoSegment} ${active ? styles.thermoSegmentActive : ''}`}
                            style={active ? { background: nivel.color } : {}}
                            onClick={() => onChange(i + 1)}
                            aria-label={nivel.label}
                        />
                    );
                })}
            </div>
            <div className={styles.thermoLabels}>
                {NIVELES.map((nivel, i) => (
                    <span
                        key={i}
                        className={`${styles.thermoLabelItem} ${i + 1 === value ? styles.thermoLabelActive : ''}`}
                        style={i + 1 === value ? { color: nivel.color } : {}}
                        onClick={() => onChange(i + 1)}
                    >
                        {i + 1}
                    </span>
                ))}
            </div>
            {value > 0 && (
                <p ref={labelRef} className={styles.thermoSelected} style={{ color: NIVELES[value - 1].color }}>
                    {NIVELES[value - 1].label}
                </p>
            )}
        </div>
    );
};

const ReseñaCard = ({ nombre, calificacion, texto, fecha, aspectos, index }) => {
    const tags = aspectos ? aspectos.split(',').map(t => t.trim()).filter(Boolean) : [];
    const color = NIVELES[calificacion - 1]?.color ?? '#0052cc';
    const ref = useRef(null);

    useGSAP(() => {
        gsap.from(ref.current, {
            opacity: 0, y: 40, duration: 0.5, delay: index * 0.1,
            scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        });
    }, { scope: ref });

    return (
        <div ref={ref} className={styles.card}>
            <Quote size={28} className={styles.quoteIcon} />
            <p className={styles.texto}>{texto}</p>
            {tags.length > 0 && (
                <div className={styles.cardTags}>
                    {tags.map((tag) => (
                        <span key={tag} className={styles.cardTag} style={{ borderColor: color, color }}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <MiniTermometro calificacion={calificacion} />
            <div className={styles.autor}>
                <div>
                    <p className={styles.nombre}>{nombre}</p>
                    <p className={styles.meta}>{fecha}</p>
                </div>
            </div>
        </div>
    );
};

const Modal = ({ onClose }) => {
    const overlayRef = useRef(null);
    const modalRef = useRef(null);
    const tagsFieldRef = useRef(null);

    useGSAP(() => {
        gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
        gsap.from(modalRef.current, { opacity: 0, scale: 0.92, y: 30, duration: 0.4, ease: 'back.out(1.4)' });
    }, { scope: overlayRef });

    const closeAnimated = (recargar) => {
        gsap.to(modalRef.current, { opacity: 0, scale: 0.92, y: 30, duration: 0.25, ease: 'power2.in' });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, delay: 0.05, onComplete: () => onClose(recargar) });
    };

    const [form, setForm] = useState({
        nombre: '',
        dia: todayParts().dia,
        mes: todayParts().mes,
        anio: todayParts().anio,
        calificacion: 0,
        comentario: '',
    });
    const [tagsSeleccionados, setTagsSeleccionados] = useState([]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    const toggleTag = (tag) =>
        setTagsSeleccionados((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );

    const cambiarCalificacion = (v) => {
        setForm((prev) => ({ ...prev, calificacion: v }));
        setErrors((prev) => ({ ...prev, calificacion: undefined }));
        setTagsSeleccionados([]);
    };

    useGSAP(() => {
        if (!tagsFieldRef.current) return;
        gsap.fromTo(tagsFieldRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2 });
    }, [form.calificacion <= 3]);

    const fechaFormateada = `${form.dia}/${form.mes}/${form.anio}`;

    const validate = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
        if (!form.dia || !form.mes || !form.anio) e.fecha = 'La fecha es obligatoria.';
        if (form.calificacion === 0) e.calificacion = 'Seleccioná un nivel de alivio.';
        if (!form.comentario.trim()) e.comentario = 'El comentario es obligatorio.';
        else if (form.comentario.trim().length < 20) e.comentario = 'El comentario debe tener al menos 20 caracteres.';
        else if (form.comentario.trim().length > 150) e.comentario = 'El comentario no puede superar los 150 caracteres.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length > 0) { setErrors(e2); return; }
        setStatus('sending');
        const { error } = await supabase.from('mudafletesrivera').insert({
            nombre: form.nombre,
            fecha_mudanza: fechaFormateada,
            calificacion: form.calificacion,
            aspectos: tagsSeleccionados.length > 0 ? tagsSeleccionados.join(', ') : null,
            comentario: form.comentario,
        });
        if (error) setStatus('error');
        else setStatus('success');
    };

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    return (
        <div
            ref={overlayRef}
            className={styles.overlay}
            onClick={(e) => e.target === e.currentTarget && closeAnimated()}
        >
            <div ref={modalRef} className={styles.modal}>
                <button className={styles.closeBtn} onClick={() => closeAnimated()} aria-label="Cerrar">
                    <X size={20} />
                </button>

                {status === 'success' ? (
                    <div className={styles.successMsg}>
                        <ThumbsUp size={48} style={{ color: '#16a34a' }} />
                        <h3>¡Gracias por tu reseña!</h3>
                        <p>Ya aparece en la página.</p>
                        <button className={styles.submitBtn} onClick={() => closeAnimated(true)}>Cerrar</button>
                    </div>
                ) : (
                    <>
                        <h3 className={styles.modalTitle}>Dejá tu reseña</h3>
                        <p className={styles.modalSub}>Todos los campos son obligatorios.</p>

                        <form onSubmit={handleSubmit} noValidate className={styles.form}>
                            <div className={styles.field}>
                                <label>Nombre completo</label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={set('nombre')}
                                    placeholder="Tu nombre"
                                    className={errors.nombre ? styles.inputError : ''}
                                />
                                {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
                            </div>

                            <div className={styles.field}>
                                <label>Fecha de la mudanza</label>
                                <div className={styles.fechaRow}>
                                    <select
                                        value={form.dia}
                                        onChange={(e) => { setForm(p => ({ ...p, dia: e.target.value })); setErrors(p => ({ ...p, fecha: undefined })); }}
                                        className={errors.fecha ? styles.inputError : ''}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={form.mes}
                                        onChange={(e) => { setForm(p => ({ ...p, mes: e.target.value })); setErrors(p => ({ ...p, fecha: undefined })); }}
                                        className={errors.fecha ? styles.inputError : ''}
                                    >
                                        {MESES.map((m, i) => (
                                            <option key={m} value={m}>{MESES_NOMBRES[i]}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={form.anio}
                                        onChange={(e) => { setForm(p => ({ ...p, anio: e.target.value })); setErrors(p => ({ ...p, fecha: undefined })); }}
                                        className={errors.fecha ? styles.inputError : ''}
                                    >
                                        {Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i).slice(-2)).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.fecha && <span className={styles.error}>{errors.fecha}</span>}
                            </div>

                            <div className={styles.field}>
                                <label>Nivel de alivio con la mudanza</label>
                                <Termometro
                                    value={form.calificacion}
                                    onChange={cambiarCalificacion}
                                />
                                {errors.calificacion && <span className={styles.error}>{errors.calificacion}</span>}
                            </div>

                            {form.calificacion > 0 && (
                                    <div
                                        ref={tagsFieldRef}
                                        key={form.calificacion <= 3 ? 'neg' : 'pos'}
                                        className={styles.tagsField}
                                    >
                                        <p className={styles.tagsHint}>
                                            {form.calificacion <= 3
                                                ? '¿Qué falló? (opcional)'
                                                : '¿Qué destacás? (opcional)'}
                                        </p>
                                        <div className={styles.tagsList}>
                                            {(form.calificacion <= 3 ? TAGS_NEGATIVOS : TAGS_POSITIVOS).map((tag) => {
                                                const activo = tagsSeleccionados.includes(tag);
                                                const color = form.calificacion <= 3 ? '#ef4444' : '#16a34a';
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        className={`${styles.tag} ${activo ? styles.tagActivo : ''}`}
                                                        style={activo ? { borderColor: color, color, background: `${color}18` } : {}}
                                                        onClick={() => toggleTag(tag)}
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                            )}

                            <div className={styles.field}>
                                <label>Comentario <span className={styles.charHint}>({form.comentario.length} / 150)</span></label>
                                <textarea
                                    value={form.comentario}
                                    onChange={(e) => { if (e.target.value.length <= 150) set('comentario')(e); }}
                                    placeholder="Contanos tu experiencia..."
                                    rows={4}
                                    maxLength={150}
                                    className={errors.comentario ? styles.inputError : ''}
                                />
                                {errors.comentario && <span className={styles.error}>{errors.comentario}</span>}
                            </div>

                            {status === 'error' && (
                                <p className={styles.error}>Hubo un error al enviar. Intentá de nuevo.</p>
                            )}

                            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                                {status === 'sending' ? 'Enviando...' : <><Send size={16} /> Enviar reseña</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

const POR_PAGINA = 6;

const Reseñas = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [reseñas, setReseñas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [pagina, setPagina] = useState(1);

    const cargarReseñas = () => {
        supabase
            .from('mudafletesrivera')
            .select('*')
            .then(({ data }) => {
                setReseñas(data ?? []);
                setCargando(false);
            });
    };

    useEffect(() => { cargarReseñas(); }, []);

    const totalPaginas = Math.ceil(reseñas.length / POR_PAGINA);
    const reseñasPagina = reseñas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    const irPagina = (n) => {
        setPagina(n);
        document.getElementById('resenas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const headerRef = useRef(null);
    const emptyRef = useRef(null);

    useGSAP(() => {
        gsap.timeline({ scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } })
            .from(`.${styles.eyebrow}`, { opacity: 0, duration: 0.4 })
            .from(`.${styles.sectionHeader} h2`, { opacity: 0, y: 20, duration: 0.4 }, 0.1)
            .from(`.${styles.sectionHeader} p`, { opacity: 0, duration: 0.4 }, 0.2)
            .from(`.${styles.ctaBtn}`, { opacity: 0, y: 10, duration: 0.4 }, 0.3);
    }, { scope: headerRef });

    useGSAP(() => {
        if (!cargando && reseñas.length === 0) {
            gsap.from(emptyRef.current, { opacity: 0, y: 20, duration: 0.5 });
        }
    }, [cargando, reseñas.length]);

    return (
        <section id="resenas" className={styles.section}>
            <div className={styles.sectionHeader} ref={headerRef}>
                <span className={styles.eyebrow}>
                    Lo que dicen nuestros clientes
                </span>
                <h2>
                    Reseñas y Testimonios
                </h2>
                <div className={styles.rule} />
                <p>
                    Más de 20 años generando confianza en Costa Rica. Aquí están las experiencias de quienes ya confiaron en nosotros.
                </p>
                <button
                    className={styles.ctaBtn}
                    onClick={() => setModalOpen(true)}
                >
                    Dejá tu reseña
                </button>
            </div>

            <div className={styles.grid}>
                {cargando ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptySub}>Cargando reseñas...</p>
                    </div>
                ) : reseñas.length === 0 ? (
                    <div ref={emptyRef} className={styles.emptyState}>
                        <span className={styles.emptyIcon}>⭐</span>
                        <p className={styles.emptyTitle}>¡Muy pronto más reseñas!</p>
                        <p className={styles.emptySub}>Sé el primero en compartir tu experiencia con nosotros.</p>
                    </div>
                ) : reseñasPagina.map((r, i) => (
                    <ReseñaCard key={r.id ?? i} {...r} texto={r.comentario} fecha={r.fecha_mudanza} index={i} />
                ))}
            </div>

            {totalPaginas > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => irPagina(pagina - 1)}
                        disabled={pagina === 1}
                    >
                        ← Anterior
                    </button>
                    <span className={styles.pageInfo}>{pagina} / {totalPaginas}</span>
                    <button
                        className={styles.pageBtn}
                        onClick={() => irPagina(pagina + 1)}
                        disabled={pagina === totalPaginas}
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            {modalOpen && <Modal onClose={(recargar) => {
                setModalOpen(false);
                if (recargar) {
                    setPagina(1);
                    cargarReseñas();
                }
            }} />}
        </section>
    );
};

export default Reseñas;
