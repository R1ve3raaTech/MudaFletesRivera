import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import logoTruck from '../../assets/trucklogo.png';
import supabase from '../../supabaseClient';
import {
    MessageCircle, MapPin, Package, Settings, Calendar,
    AlertTriangle, Info, Zap, CheckCircle, ArrowRight, ArrowLeft,
    Bed, DoorOpen, Sofa, UtensilsCrossed, Tv, Refrigerator,
    WashingMachine, Wind, CookingPot, Monitor, Box, Truck, Plus, Minus, Check
} from 'lucide-react';
import styles from './CotizadorForm.module.css';

const WA_NUMBER = '50670818306';

const MUEBLES = [
    { id: 'cama_individual',  Icon: Bed,             label: 'Cama individual' },
    { id: 'cama_matrimonial', Icon: Bed,             label: 'Cama matrimonial / king' },
    { id: 'ropero',           Icon: DoorOpen,        label: 'Ropero / closet' },
    { id: 'sofa',             Icon: Sofa,            label: 'Sofá / sillón' },
    { id: 'comedor',          Icon: UtensilsCrossed, label: 'Comedor (mesa + sillas)' },
    { id: 'mueble_tv',        Icon: Tv,              label: 'Mueble de TV' },
    { id: 'refrigerador',     Icon: Refrigerator,    label: 'Refrigerador' },
    { id: 'lavadora',         Icon: WashingMachine,  label: 'Lavadora' },
    { id: 'secadora',         Icon: Wind,            label: 'Secadora' },
    { id: 'estufa',           Icon: CookingPot,      label: 'Estufa' },
    { id: 'escritorio',       Icon: Monitor,         label: 'Escritorio' },
    { id: 'cajas',            Icon: Box,             label: 'Cajas (aprox.)' },
    { id: 'otros_grandes',    Icon: Truck,           label: 'Otros objetos grandes' },
];

const STEP_LABELS = ['Ubicación', 'Lo que movés', 'Extras', 'Fecha'];

function AutocompleteInput({ value, onChange, placeholder }) {
    const [sugerencias, setSugerencias] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const timeoutRef = useRef(null);
    const wrapRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleChange = (e) => {
        const q = e.target.value;
        onChange(q);
        clearTimeout(timeoutRef.current);
        if (q.length < 3) { setSugerencias([]); setAbierto(false); return; }
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=cr&limit=5&addressdetails=1`,
                    { headers: { 'Accept-Language': 'es' } }
                );
                const data = await res.json();
                setSugerencias(data.map(d => d.display_name));
                setAbierto(data.length > 0);
            } catch { setSugerencias([]); }
        }, 400);
    };

    const seleccionar = (s) => {
        onChange(s);
        setSugerencias([]);
        setAbierto(false);
    };

    return (
        <div ref={wrapRef} className={styles.autocompleteWrap}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onFocus={() => sugerencias.length > 0 && setAbierto(true)}
                autoComplete="off"
            />
            {abierto && (
                <ul className={styles.sugerencias}>
                    {sugerencias.map((s, i) => (
                        <li key={i} onMouseDown={() => seleccionar(s)}>
                            <MapPin size={13} className={styles.sugIcon} />
                            <span>{s}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
const STEP_ICONS  = [MapPin, Package, Settings, Calendar];

const OpcionBtn = ({ value, selected, onClick, children }) => (
    <button
        type="button"
        className={`${styles.opcion} ${selected ? styles.opcionActiva : ''}`}
        onClick={() => onClick(value)}
    >
        {children}
    </button>
);

export default function CotizadorForm() {
    const [paso, setPaso] = useState(1);
    const [form, setForm] = useState({
        nombre: '',
        origen: '',
        destino: '',
        escalerasOrigen: '',
        escalerasDestino: '',
        caminata: '',
        parqueo: '',
        muebles: {},
        otrosDetalle: '',
        fragiles: '',
        desmontaje: '',
        embalaje: '',
        ayudantes: 0,
        fecha: '',
    });
    const [enviando, setEnviando] = useState(false);

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

    const setMueble = (id, delta) => setForm(f => {
        const prev = f.muebles[id] || 0;
        const next = Math.max(0, prev + delta);
        const updated = { ...f.muebles };
        if (next === 0) delete updated[id];
        else updated[id] = next;
        return { ...f, muebles: updated };
    });

    const hoyStr = new Date().toISOString().split('T')[0];
    const fechaObj = form.fecha ? new Date(form.fecha + 'T12:00:00') : null;
    const hoyObj = new Date();
    hoyObj.setHours(0, 0, 0, 0);
    const tresDias = new Date(hoyObj);
    tresDias.setDate(hoyObj.getDate() + 3);
    const esUrgente = fechaObj && fechaObj < tresDias;

    const totalMuebles = Object.values(form.muebles).reduce((a, b) => a + b, 0);

    const pasoValido = [
        false,
        form.nombre.trim() && form.origen.trim() && form.destino.trim() && form.escalerasOrigen && form.escalerasDestino && form.caminata && form.parqueo,
        totalMuebles > 0,
        form.fragiles && form.desmontaje && form.embalaje,
        form.fecha,
    ];

    const construirMensaje = () => {
        const escStr = (lugar, val) => {
            if (val === 'no')  return `${lugar}: Sin escaleras`;
            if (val === '1')   return `${lugar}: 1 piso de escaleras`;
            if (val === '2+')  return `${lugar}: 2+ pisos de escaleras`;
            return '';
        };
        const mueblesList = MUEBLES
            .filter(m => (form.muebles[m.id] || 0) > 0)
            .map(m => `  - ${m.label}: ${form.muebles[m.id]}`)
            .join('\n');

        const extras = form.otrosDetalle.trim() ? `\n  - Detalle adicional: ${form.otrosDetalle.trim()}` : '';

        return (
`Hola, quiero cotizar una mudanza.

*Origen:* ${form.origen}
*Destino:* ${form.destino}

*Acceso:*
  - ${escStr('Origen', form.escalerasOrigen)}
  - ${escStr('Destino', form.escalerasDestino)}
  - Caminata larga (+20 m) al camion: ${form.caminata === 'si' ? 'Si' : 'No'}
  - Parqueo para camion grande: ${form.parqueo === 'si' ? 'Si' : form.parqueo === 'no' ? 'No' : 'No se'}

*Lo que voy a mover:*
${mueblesList || '  (no especificado)'}${extras}

*Articulos fragiles o especiales:* ${form.fragiles === 'si' ? 'Si' : 'No'}
*Desmontaje / armado de muebles:* ${form.desmontaje === 'si' ? 'Si (cobro adicional)' : 'No'}
*Embalaje:* ${form.embalaje === 'si' ? 'Si (cobro adicional)' : 'No'}
*Ayudantes adicionales:* ${form.ayudantes}

*Fecha deseada:* ${form.fecha}${esUrgente ? ' (menos de 3 dias - aplica cargo adicional)' : ''}`
        );
    };

    const cargarImagen = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });

    const generarPDF = async () => {
        const b64Truck = await cargarImagen(logoTruck);

        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const W  = 210;
        const ML = 22;   // margen izquierdo
        const MR = 188;  // margen derecho
        const cx = W / 2;

        const C_AZUL  = [37, 99, 235];
        const C_NEGRO = [17, 24, 39];
        const C_GRIS  = [107, 114, 128];
        const C_LGRIS = [209, 213, 219];

        const escStr = (val) => {
            if (val === 'no')  return 'Sin escaleras';
            if (val === '1')   return '1 piso de escaleras';
            if (val === '2+')  return '2+ pisos de escaleras';
            return '-';
        };

        let y = 22;

        // ── CABECERA ─────────────────────────────────────────────
        // Logo alineado a la izquierda
        if (b64Truck) {
            doc.addImage(b64Truck, 'PNG', ML, y - 4, 22, 22);
        }

        // Nombre empresa junto al logo
        doc.setTextColor(...C_AZUL);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('MudaFletesRivera', ML + 26, y + 6);

        doc.setTextColor(...C_GRIS);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Transportes y Mudanzas — Costa Rica', ML + 26, y + 12);

        // Fecha alineada a la derecha
        const fechaHoy = new Date().toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        doc.setTextColor(...C_GRIS);
        doc.setFontSize(8);
        doc.text(fechaHoy, MR, y + 6, { align: 'right' });

        y += 26;

        // Línea separadora gruesa
        doc.setDrawColor(...C_AZUL);
        doc.setLineWidth(0.6);
        doc.line(ML, y, MR, y);
        y += 8;

        // Título del documento
        doc.setTextColor(...C_NEGRO);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Solicitud de cotizacion', ML, y);
        y += 14;

        // ── HELPERS ─────────────────────────────────────────────
        const lineaFina = () => {
            doc.setDrawColor(...C_LGRIS);
            doc.setLineWidth(0.2);
            doc.line(ML, y, MR, y);
            y += 5;
        };

        const seccion = (label) => {
            doc.setTextColor(...C_AZUL);
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.text(label.toUpperCase(), ML, y);
            y += 3;
            doc.setDrawColor(...C_AZUL);
            doc.setLineWidth(0.3);
            doc.line(ML, y, MR, y);
            y += 5;
        };

        const fila = (label, valor) => {
            if (y > 265) { doc.addPage(); y = 22; }
            doc.setTextColor(...C_GRIS);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text(label, ML, y);
            doc.setTextColor(...C_NEGRO);
            doc.setFont('helvetica', 'bold');
            const lineas = doc.splitTextToSize(String(valor), 90);
            doc.text(lineas, MR, y, { align: 'right' });
            y += lineas.length * 5.5;
        };

        // ── CLIENTE ──────────────────────────────────────────────
        seccion('Cliente');
        fila('Nombre', form.nombre);
        y += 4; lineaFina();

        // ── UBICACION ────────────────────────────────────────────
        seccion('Ubicacion');
        fila('Origen', form.origen);
        fila('Destino', form.destino);
        fila('Escaleras en origen', escStr(form.escalerasOrigen));
        fila('Escaleras en destino', escStr(form.escalerasDestino));
        fila('Caminata mayor a 20 m', form.caminata === 'si' ? 'Si' : 'No');
        fila('Parqueo para camion grande', form.parqueo === 'si' ? 'Si' : form.parqueo === 'no' ? 'No' : 'No se');
        y += 4; lineaFina();

        // ── ARTICULOS ────────────────────────────────────────────
        seccion('Articulos a mover');
        const mueblesList = MUEBLES.filter(m => (form.muebles[m.id] || 0) > 0);
        if (mueblesList.length === 0) {
            fila('Articulos', 'No especificado');
        } else {
            mueblesList.forEach(m => fila(m.label, `x${form.muebles[m.id]}`));
        }
        if (form.otrosDetalle.trim()) fila('Detalle adicional', form.otrosDetalle.trim());
        y += 4; lineaFina();

        // ── SERVICIOS ────────────────────────────────────────────
        seccion('Servicios adicionales');
        fila('Articulos fragiles o especiales', form.fragiles === 'si' ? 'Si' : 'No');
        fila('Desmontaje y armado', form.desmontaje === 'si' ? 'Si  (+costo)' : 'No');
        fila('Embalaje', form.embalaje === 'si' ? 'Si  (+costo)' : 'No');
        fila('Ayudantes adicionales', form.ayudantes > 0 ? `${form.ayudantes}  (+costo)` : 'Ninguno');
        y += 4; lineaFina();

        // ── FECHA ────────────────────────────────────────────────
        seccion('Fecha deseada');
        fila('Fecha de la mudanza', form.fecha);
        if (esUrgente) {
            y += 2;
            doc.setTextColor(180, 60, 10);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Atencion: menos de 3 dias de anticipacion — aplica cargo adicional', ML, y);
            y += 6;
        }
        y += 6;

        // ── LÍNEA FINAL + NOTA ───────────────────────────────────
        doc.setDrawColor(...C_AZUL);
        doc.setLineWidth(0.6);
        doc.line(ML, y, MR, y);
        y += 6;

        doc.setTextColor(...C_GRIS);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Adjunta este PDF en WhatsApp para recibir tu cotizacion:', ML, y);
        y += 5;
        doc.setTextColor(...C_AZUL);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('7081-8306', ML, y);
        y += 10;

        doc.setTextColor(...C_LGRIS);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Este documento es una solicitud de cotizacion. El precio final sera confirmado por WhatsApp.', cx, y, { align: 'center' });

        return doc;
    };

    const enviarWhatsapp = async () => {
        setEnviando(true);
        try {
            const doc = await generarPDF();
            const blob = doc.output('blob');
            const filename = `${Date.now()}-${form.nombre.trim().replace(/\s+/g, '_')}.pdf`;

            // Subir PDF a Supabase Storage
            let pdfUrl = null;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('cotizaciones')
                .upload(filename, blob, { contentType: 'application/pdf' });

            if (!uploadError && uploadData) {
                const { data: urlData } = supabase.storage
                    .from('cotizaciones')
                    .getPublicUrl(filename);
                pdfUrl = urlData?.publicUrl ?? null;
            }

            // Guardar datos en la tabla
            await supabase.from('cotizaciones').insert({
                nombre: form.nombre.trim(),
                origen: form.origen.trim(),
                destino: form.destino.trim(),
                fecha_mudanza: form.fecha,
                urgente: esUrgente,
                articulos: {
                    muebles: Object.fromEntries(
                        MUEBLES.filter(m => (form.muebles[m.id] || 0) > 0)
                               .map(m => [m.label, form.muebles[m.id]])
                    ),
                    detalle: form.otrosDetalle.trim(),
                },
                servicios: {
                    fragiles: form.fragiles === 'si',
                    desmontaje: form.desmontaje === 'si',
                    embalaje: form.embalaje === 'si',
                    ayudantes: form.ayudantes,
                },
                acceso: {
                    escaleras_origen: form.escalerasOrigen,
                    escaleras_destino: form.escalerasDestino,
                    caminata: form.caminata === 'si',
                    parqueo: form.parqueo,
                },
                pdf_url: pdfUrl,
            });

            // Descargar PDF localmente
            doc.save(`cotizacion-${form.nombre.trim()}.pdf`);

            // Abrir WhatsApp
            const msg = `Hola! Mi nombre es ${form.nombre.trim()}. Acabo de llenar el formulario de cotizacion en su pagina web. Les adjunto el PDF con todos los detalles de mi mudanza.`;
            setTimeout(() => {
                window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
            }, 600);

        } catch (err) {
            console.error('Error al enviar:', err);
        } finally {
            setEnviando(false);
            setPaso(1);
            setForm({
                nombre: '', origen: '', destino: '', escalerasOrigen: '', escalerasDestino: '',
                caminata: '', parqueo: '', muebles: {}, otrosDetalle: '',
                fragiles: '', desmontaje: '', embalaje: '', ayudantes: 0, fecha: '',
            });
        }
    };

    return (
        <section className={styles.section} id="cotizador">
            <div className={styles.inner}>
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Cotizador</span>
                    <h2>Cuanto cuesta tu mudanza?</h2>
                    <div className={styles.rule}></div>
                    <p>Responde estas preguntas y recibe una cotizacion personalizada por WhatsApp en minutos.</p>
                </div>

                <div className={styles.card}>
                    {/* Progreso */}
                    <div className={styles.progress}>
                        {STEP_LABELS.map((label, i) => {
                            const n = i + 1;
                            const StepIcon = STEP_ICONS[i];
                            return (
                                <div key={n} className={`${styles.progressItem} ${paso > n ? styles.done : ''} ${paso === n ? styles.active : ''}`}>
                                    <div className={styles.progressDot}>
                                        {paso > n ? <Check size={16} /> : <StepIcon size={16} />}
                                    </div>
                                    <span className={styles.progressLabel}>{label}</span>
                                    {n < 4 && <div className={styles.progressLine}></div>}
                                </div>
                            );
                        })}
                    </div>

                    {/* PASO 1: Ubicacion */}
                    {paso === 1 && (
                        <div className={styles.step}>
                            <h3 className={styles.stepTitle}>
                                <MapPin size={22} className={styles.titleIcon} />
                                De donde a donde es la mudanza?
                            </h3>

                            <div className={styles.field}>
                                <label>Tu nombre completo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Perez"
                                    value={form.nombre}
                                    onChange={e => set('nombre')(e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Direccion de origen</label>
                                <AutocompleteInput
                                    value={form.origen}
                                    onChange={v => set('origen')(v)}
                                    placeholder="Ej: San Jose, Barrio Amon"
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Direccion de destino</label>
                                <AutocompleteInput
                                    value={form.destino}
                                    onChange={v => set('destino')(v)}
                                    placeholder="Ej: Alajuela, La Guacima"
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Hay escaleras en el lugar de <strong>origen</strong>?</label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no"  selected={form.escalerasOrigen === 'no'}  onClick={set('escalerasOrigen')}>Sin escaleras</OpcionBtn>
                                    <OpcionBtn value="1"   selected={form.escalerasOrigen === '1'}   onClick={set('escalerasOrigen')}>1 piso</OpcionBtn>
                                    <OpcionBtn value="2+"  selected={form.escalerasOrigen === '2+'}  onClick={set('escalerasOrigen')}>2+ pisos</OpcionBtn>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Hay escaleras en el lugar de <strong>destino</strong>?</label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no"  selected={form.escalerasDestino === 'no'}  onClick={set('escalerasDestino')}>Sin escaleras</OpcionBtn>
                                    <OpcionBtn value="1"   selected={form.escalerasDestino === '1'}   onClick={set('escalerasDestino')}>1 piso</OpcionBtn>
                                    <OpcionBtn value="2+"  selected={form.escalerasDestino === '2+'}  onClick={set('escalerasDestino')}>2+ pisos</OpcionBtn>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Hay que caminar mas de 20 metros para llegar al camion?</label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no" selected={form.caminata === 'no'} onClick={set('caminata')}>No</OpcionBtn>
                                    <OpcionBtn value="si" selected={form.caminata === 'si'} onClick={set('caminata')}>Si</OpcionBtn>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Puede parquear un camion grande en la calle?</label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="si"   selected={form.parqueo === 'si'}   onClick={set('parqueo')}>Si</OpcionBtn>
                                    <OpcionBtn value="no"   selected={form.parqueo === 'no'}   onClick={set('parqueo')}>No</OpcionBtn>
                                    <OpcionBtn value="nose" selected={form.parqueo === 'nose'} onClick={set('parqueo')}>No se</OpcionBtn>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASO 2: Muebles */}
                    {paso === 2 && (
                        <div className={styles.step}>
                            <h3 className={styles.stepTitle}>
                                <Package size={22} className={styles.titleIcon} />
                                Que vas a mover?
                            </h3>
                            <p className={styles.stepSub}>Agrega todos los articulos que llevas. Esto ayuda a calcular el precio correctamente.</p>
                            <div className={styles.mueblesGrid}>
                                {MUEBLES.map(m => {
                                    const qty = form.muebles[m.id] || 0;
                                    return (
                                        <div key={m.id} className={`${styles.muebleCard} ${qty > 0 ? styles.muebleActivo : ''}`}>
                                            <m.Icon size={20} className={styles.muebleIcon} />
                                            <span className={styles.muebleLabel}>{m.label}</span>
                                            <div className={styles.counter}>
                                                <button type="button" onClick={() => setMueble(m.id, -1)} disabled={qty === 0}>
                                                    <Minus size={12} />
                                                </button>
                                                <span>{qty}</span>
                                                <button type="button" onClick={() => setMueble(m.id, +1)}>
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.field}>
                                <label>Algo especifico que quieras agregar? <span className={styles.sub}>(opcional)</span></label>
                                <textarea
                                    placeholder="Ej: piano de cola, cuadros grandes, acuario, herramientas de garaje..."
                                    value={form.otrosDetalle}
                                    onChange={e => set('otrosDetalle')(e.target.value)}
                                    rows={3}
                                    className={styles.textarea}
                                />
                            </div>

                            {totalMuebles === 0 && (
                                <p className={styles.hint}>Agrega al menos un articulo para continuar.</p>
                            )}
                        </div>
                    )}

                    {/* PASO 3: Extras */}
                    {paso === 3 && (
                        <div className={styles.step}>
                            <h3 className={styles.stepTitle}>
                                <Settings size={22} className={styles.titleIcon} />
                                Servicios adicionales
                            </h3>

                            <div className={styles.field}>
                                <label>Tenes articulos fragiles o especiales? <span className={styles.sub}>(piano, acuario, obras de arte, electronicos delicados)</span></label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no" selected={form.fragiles === 'no'} onClick={set('fragiles')}>No</OpcionBtn>
                                    <OpcionBtn value="si" selected={form.fragiles === 'si'} onClick={set('fragiles')}>Si, los tengo</OpcionBtn>
                                </div>
                                {form.fragiles === 'si' && (
                                    <div className={styles.notice}>
                                        <AlertTriangle size={15} />
                                        Es responsabilidad del cliente avisar todos los articulos fragiles con anticipacion.
                                    </div>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label>Necesitas desmontaje y armado de muebles? <span className={styles.sub}>(camas, closets, etc.)</span></label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no" selected={form.desmontaje === 'no'} onClick={set('desmontaje')}>No</OpcionBtn>
                                    <OpcionBtn value="si" selected={form.desmontaje === 'si'} onClick={set('desmontaje')}>Si</OpcionBtn>
                                </div>
                                {form.desmontaje === 'si' && (
                                    <div className={styles.notice}>
                                        <Info size={15} />
                                        El desmontaje y armado tiene un costo adicional.
                                    </div>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label>Necesitas servicio de embalaje? <span className={styles.sub}>(cajas, plastico burbuja, etc.)</span></label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no" selected={form.embalaje === 'no'} onClick={set('embalaje')}>No, yo empaco</OpcionBtn>
                                    <OpcionBtn value="si" selected={form.embalaje === 'si'} onClick={set('embalaje')}>Si, necesito ayuda</OpcionBtn>
                                </div>
                                {form.embalaje === 'si' && (
                                    <div className={styles.notice}>
                                        <Info size={15} />
                                        El embalaje tiene un costo adicional.
                                    </div>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label>Cuantos ayudantes adicionales necesitas?</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    value={form.ayudantes}
                                    onChange={e => set('ayudantes')(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                                    className={styles.numberInput}
                                />
                                {form.ayudantes > 0 && (
                                    <div className={styles.notice}>
                                        <Info size={15} />
                                        Los ayudantes adicionales tienen un costo extra.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PASO 4: Fecha */}
                    {paso === 4 && (
                        <div className={styles.step}>
                            <h3 className={styles.stepTitle}>
                                <Calendar size={22} className={styles.titleIcon} />
                                Para cuando necesitas la mudanza?
                            </h3>
                            <p className={styles.stepSub}>Selecciona la fecha deseada.</p>

                            <div className={styles.field}>
                                <label>Fecha de la mudanza</label>
                                <input
                                    type="date"
                                    min={hoyStr}
                                    value={form.fecha}
                                    onChange={e => set('fecha')(e.target.value)}
                                    className={styles.dateInput}
                                />
                            </div>

                            {esUrgente && (
                                <div className={styles.urgente}>
                                    <Zap size={22} className={styles.urgenteIcon} />
                                    <div>
                                        <strong>Mudanza con menos de 3 dias de anticipacion</strong>
                                        <p>Este tipo de solicitudes tienen un cargo adicional. Te lo confirmaremos por WhatsApp.</p>
                                    </div>
                                </div>
                            )}

                            {form.fecha && !esUrgente && (
                                <div className={styles.fechaOk}>
                                    <CheckCircle size={18} />
                                    Perfecto! Tu solicitud tiene suficiente anticipacion.
                                </div>
                            )}

                            {form.fecha && (
                                <div className={styles.resumen}>
                                    <h4>Resumen de tu solicitud</h4>
                                    <div className={styles.resumenItem}><span>Origen</span><strong>{form.origen}</strong></div>
                                    <div className={styles.resumenItem}><span>Destino</span><strong>{form.destino}</strong></div>
                                    <div className={styles.resumenItem}><span>Articulos</span><strong>{totalMuebles} item(s)</strong></div>
                                    <div className={styles.resumenItem}><span>Fecha</span><strong>{form.fecha}</strong></div>
                                    {form.desmontaje === 'si' && <div className={styles.resumenItem}><span>Desmontaje</span><strong>Si (+costo)</strong></div>}
                                    {form.embalaje === 'si' && <div className={styles.resumenItem}><span>Embalaje</span><strong>Si (+costo)</strong></div>}
                                    {form.ayudantes > 0 && <div className={styles.resumenItem}><span>Ayudantes extra</span><strong>{form.ayudantes} (+costo)</strong></div>}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Nota PDF - solo en paso 4 con fecha */}
                    {paso === 4 && form.fecha && (
                        <div className={styles.pdfNota}>
                            <Info size={15} />
                            Se descargara un PDF con tu informacion. Adjuntalo en WhatsApp para que podamos darte el precio.
                        </div>
                    )}

                    {/* Navegacion */}
                    <div className={styles.nav}>
                        {paso > 1 && (
                            <button type="button" className={styles.btnBack} onClick={() => setPaso(p => p - 1)}>
                                <ArrowLeft size={16} /> Anterior
                            </button>
                        )}
                        {paso < 4 && (
                            <button
                                type="button"
                                className={styles.btnNext}
                                onClick={() => setPaso(p => p + 1)}
                                disabled={!pasoValido[paso]}
                            >
                                Siguiente <ArrowRight size={16} />
                            </button>
                        )}
                        {paso === 4 && (
                            <button
                                type="button"
                                className={styles.btnWa}
                                onClick={enviarWhatsapp}
                                disabled={!pasoValido[4] || enviando}
                            >
                                <MessageCircle size={20} />
                                {enviando ? 'Generando PDF...' : 'Descargar PDF y abrir WhatsApp'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
