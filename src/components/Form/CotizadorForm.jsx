import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { jsPDF } from 'jspdf';
import logoTruck from '../../assets/trucklogo.png';
import supabase from '../../supabaseClient';
import {
    MessageCircle, MapPin, Package, Settings, Calendar,
    AlertTriangle, Info, Zap, CheckCircle, ArrowRight, ArrowLeft,
    BedSingle, BedDouble, Shirt, Armchair, UtensilsCrossed, Tv, Refrigerator,
    WashingMachine, Drum, Flame, Laptop, Boxes, ShoppingBag, Package2, Plus, Minus, Check,
    PartyPopper, RotateCcw
} from 'lucide-react';
import RutaMapa from './RutaMapa';
import SelectorRuta from './SelectorRuta';
import styles from './CotizadorForm.module.css';

const WA_NUMBER = '50670818306';
const EMAIL_AVISOS = 'thecamil999@gmail.com';

const MUEBLES = [
    { id: 'cama_individual',  Icon: BedSingle,       label: 'Cama individual' },
    { id: 'cama_matrimonial', Icon: BedDouble,       label: 'Cama matrimonial / king' },
    { id: 'ropero',           Icon: Shirt,           label: 'Ropero / closet' },
    { id: 'sofa',             Icon: Armchair,        label: 'Sofá / sillón' },
    { id: 'comedor',          Icon: UtensilsCrossed, label: 'Comedor (mesa + sillas)' },
    { id: 'mueble_tv',        Icon: Tv,              label: 'Mueble de TV' },
    { id: 'refrigerador',     Icon: Refrigerator,    label: 'Refrigerador' },
    { id: 'lavadora',         Icon: WashingMachine,  label: 'Lavadora' },
    { id: 'secadora',         Icon: Drum,            label: 'Secadora' },
    { id: 'estufa',           Icon: Flame,           label: 'Estufa' },
    { id: 'escritorio',       Icon: Laptop,          label: 'Escritorio' },
    { id: 'cajas',            Icon: Boxes,           label: 'Cajas (aprox.)' },
    { id: 'bolsas',           Icon: ShoppingBag,     label: 'Bolsas (aprox.)' },
    { id: 'otros_grandes',    Icon: Package2,        label: 'Otros objetos grandes' },
];

const STEP_LABELS = ['Ubicación', 'Lo que movés', 'Extras', 'Fecha'];

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
        mascotas: '',
        fecha: '',
        infoAdicional: '',
    });
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [ruta, setRuta] = useState(null);
    const [coordsOrigen, setCoordsOrigen] = useState(null);
    const [coordsDestino, setCoordsDestino] = useState(null);
    const [selectorAbierto, setSelectorAbierto] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(false);
    const [pdfListo, setPdfListo] = useState(null); // { blob, filename, url }
    const cardRef = useRef(null);
    const stepRef = useRef(null);
    const primeraCarga = useRef(true);

    // Animación de entrada al cambiar de paso + scroll al inicio de la tarjeta
    useGSAP(() => {
        if (primeraCarga.current) { primeraCarga.current = false; return; }
        if (!stepRef.current) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.fromTo(stepRef.current,
            { opacity: 0, x: reduceMotion ? 0 : 26 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
        cardRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, { dependencies: [paso, enviado], scope: cardRef });

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

    const reiniciar = () => {
        setEnviado(false);
        setErrorEnvio(false);
        setPdfListo(null);
        setRuta(null);
        setCoordsOrigen(null);
        setCoordsDestino(null);
        setPaso(1);
        setForm({
            nombre: '', origen: '', destino: '', escalerasOrigen: '', escalerasDestino: '',
            caminata: '', parqueo: '', muebles: {}, otrosDetalle: '',
            fragiles: '', desmontaje: '', embalaje: '', ayudantes: 0,
            mascotas: '', fecha: '', infoAdicional: '',
        });
    };

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
        form.fragiles && form.desmontaje && form.embalaje && form.mascotas,
        form.fecha,
    ];

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
        const H  = 297;
        const ML = 16;
        const MR = W - 16;
        const ancho = MR - ML;

        const AZUL   = [30, 64, 175];
        const AZUL2  = [37, 99, 235];
        const CELESTE= [191, 219, 254];
        const INK    = [27, 36, 55];
        const GRIS   = [78, 90, 112];
        const LGRIS  = [222, 216, 205];
        const CREMA  = [250, 247, 241];
        const VERDE  = [22, 163, 74];
        const AMBAR  = [180, 83, 9];
        const AMBARBG= [254, 243, 199];

        const escStr = (val) => {
            if (val === 'no')  return 'Sin escaleras';
            if (val === '1')   return '1 piso de escaleras';
            if (val === '2+')  return '2+ pisos de escaleras';
            return '-';
        };

        // ── CABECERA: banda azul ─────────────────────────────────
        doc.setFillColor(...AZUL);
        doc.rect(0, 0, W, 40, 'F');

        if (b64Truck) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(ML, 8, 24, 24, 3.5, 3.5, 'F');
            doc.addImage(b64Truck, 'PNG', ML + 2, 10, 20, 20);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(17);
        doc.setFont('helvetica', 'bold');
        doc.text('MudaFletesRivera', ML + 30, 19);

        doc.setTextColor(...CELESTE);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Transportes y Mudanzas · Costa Rica', ML + 30, 25);

        const fechaHoy = new Date().toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        doc.setFontSize(7.5);
        doc.text('SOLICITUD DE COTIZACIÓN', MR, 16, { align: 'right' });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.text(fechaHoy, MR, 22, { align: 'right' });

        let y = 50;

        // ── CLIENTE + FECHA DE MUDANZA ───────────────────────────
        doc.setTextColor(...GRIS);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE', ML, y);
        doc.text('FECHA DESEADA', MR, y, { align: 'right' });
        y += 5.5;
        doc.setTextColor(...INK);
        doc.setFontSize(12);
        doc.text(form.nombre, ML, y);
        doc.text(form.fecha, MR, y, { align: 'right' });
        y += 9;

        // ── TARJETA DE RUTA (cargar / descargar) ─────────────────
        const dirW = ancho - 30;
        doc.setFontSize(9.5);
        const linsA = doc.splitTextToSize(form.origen, dirW);
        const linsB = doc.splitTextToSize(form.destino, dirW);
        const altoA = linsA.length * 4.6;
        const altoB = linsB.length * 4.6;
        const linkA = coordsOrigen ? 4.5 : 0;
        const linkB = coordsDestino ? 4.5 : 0;
        const cardH = 12 + altoA + linkA + 8 + altoB + linkB + (ruta ? 10 : 6);

        doc.setFillColor(...CREMA);
        doc.roundedRect(ML, y, ancho, cardH, 4, 4, 'F');

        let ry = y + 9;
        // Punto A
        doc.setFillColor(...VERDE);
        doc.circle(ML + 8, ry - 1, 1.9, 'F');
        doc.setTextColor(...GRIS);
        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'bold');
        doc.text('CARGAR EN', ML + 14, ry - 2.4);
        doc.setTextColor(...INK);
        doc.setFontSize(9.5);
        doc.text(linsA, ML + 14, ry + 2);
        ry += 2 + altoA;
        if (coordsOrigen) {
            doc.setTextColor(...AZUL2);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.textWithLink('Ver en Google Maps', ML + 14, ry + 1.5, { url: `https://www.google.com/maps?q=${coordsOrigen[0]},${coordsOrigen[1]}` });
            ry += linkA;
        }

        // Conector
        doc.setDrawColor(...LGRIS);
        doc.setLineWidth(0.5);
        doc.line(ML + 8, ry - altoA - linkA + 2, ML + 8, ry + 3.5);
        ry += 8;

        // Punto B
        doc.setFillColor(...AZUL2);
        doc.rect(ML + 6.3, ry - 2.7, 3.4, 3.4, 'F');
        doc.setTextColor(...GRIS);
        doc.setFontSize(6.8);
        doc.setFont('helvetica', 'bold');
        doc.text('DESCARGAR EN', ML + 14, ry - 2.4);
        doc.setTextColor(...INK);
        doc.setFontSize(9.5);
        doc.text(linsB, ML + 14, ry + 2);
        ry += 2 + altoB;
        if (coordsDestino) {
            doc.setTextColor(...AZUL2);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.textWithLink('Ver en Google Maps', ML + 14, ry + 1.5, { url: `https://www.google.com/maps?q=${coordsDestino[0]},${coordsDestino[1]}` });
            ry += linkB;
        }

        if (ruta) {
            doc.setTextColor(...AZUL);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(`Distancia aproximada: ${ruta.km} km  ·  ~${ruta.min} min en camión`, ML + 6, y + cardH - 4.5);
        }

        y += cardH + 9;

        // ── HELPERS de secciones ─────────────────────────────────
        const salto = (necesario = 10) => {
            if (y + necesario > H - 30) { doc.addPage(); y = 20; }
        };

        const seccion = (label) => {
            salto(14);
            doc.setTextColor(...AZUL2);
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'bold');
            doc.text(label.toUpperCase(), ML, y);
            doc.setDrawColor(...LGRIS);
            doc.setLineWidth(0.3);
            const tw = doc.getTextWidth(label.toUpperCase());
            doc.line(ML + tw + 4, y - 1, MR, y - 1);
            y += 6;
        };

        let zebra = false;
        const fila = (label, valor) => {
            salto(8);
            if (zebra) {
                doc.setFillColor(...CREMA);
                doc.rect(ML, y - 4, ancho, 6.5, 'F');
            }
            zebra = !zebra;
            doc.setTextColor(...GRIS);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text(label, ML + 2, y);
            doc.setTextColor(...INK);
            doc.setFont('helvetica', 'bold');
            const lineas = doc.splitTextToSize(String(valor), 95);
            doc.text(lineas, MR - 2, y, { align: 'right' });
            y += Math.max(6.5, lineas.length * 5);
        };

        // ── ACCESO ───────────────────────────────────────────────
        seccion('Acceso');
        zebra = false;
        fila('Escaleras en origen', escStr(form.escalerasOrigen));
        fila('Escaleras en destino', escStr(form.escalerasDestino));
        fila('Caminata mayor a 20 m', form.caminata === 'si' ? 'Sí' : 'No');
        fila('Parqueo para camión grande', form.parqueo === 'si' ? 'Sí' : form.parqueo === 'no' ? 'No' : 'No sabe');
        y += 5;

        // ── ARTÍCULOS ────────────────────────────────────────────
        seccion('Artículos a mover');
        zebra = false;
        const mueblesList = MUEBLES.filter(m => (form.muebles[m.id] || 0) > 0);
        if (mueblesList.length === 0) {
            fila('Artículos', 'No especificado');
        } else {
            mueblesList.forEach(m => fila(m.label, `x${form.muebles[m.id]}`));
        }
        if (form.otrosDetalle.trim()) fila('Detalle adicional', form.otrosDetalle.trim());
        y += 5;

        // ── SERVICIOS ────────────────────────────────────────────
        seccion('Servicios adicionales');
        zebra = false;
        fila('Artículos frágiles o especiales', form.fragiles === 'si' ? 'Sí' : 'No');
        fila('Desmontaje y armado', form.desmontaje === 'si' ? 'Sí  (+costo)' : 'No');
        fila('Embalaje', form.embalaje === 'si' ? 'Sí  (+costo)' : 'No');
        fila('Ayudantes adicionales', form.ayudantes > 0 ? `${form.ayudantes}  (+costo)` : 'Ninguno');
        fila('Mascotas', form.mascotas === 'si'
            ? 'Sí'
            : 'No');
        y += 4;

        // ── INFORMACIÓN ADICIONAL ────────────────────────────────
        if (form.infoAdicional.trim()) {
            seccion('Información adicional');
            salto(16);
            doc.setTextColor(...INK);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            const infoLineas = doc.splitTextToSize(form.infoAdicional.trim(), ancho - 4);
            doc.text(infoLineas, ML + 2, y);
            y += infoLineas.length * 4.4 + 4;
        }

        // ── AVISO DE URGENCIA ────────────────────────────────────
        if (esUrgente) {
            salto(14);
            doc.setFillColor(...AMBARBG);
            doc.roundedRect(ML, y, ancho, 11, 3, 3, 'F');
            doc.setTextColor(...AMBAR);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Atención: menos de 3 días de anticipación · aplica cargo adicional', ML + 6, y + 7);
            y += 16;
        }

        // ── PIE DE PÁGINA ────────────────────────────────────────
        const fy = H - 24;
        doc.setDrawColor(...AZUL2);
        doc.setLineWidth(0.6);
        doc.line(ML, fy, MR, fy);
        doc.setTextColor(...GRIS);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Adjunta este PDF en WhatsApp para recibir tu cotización:', ML, fy + 6);
        doc.setTextColor(...AZUL2);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('7081-8306', ML, fy + 12);
        doc.setTextColor(...GRIS);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.text('Este documento es una solicitud de cotización. El precio final será confirmado por WhatsApp.', W / 2, fy + 18, { align: 'center' });

        return doc;
    };

    const construirMensajeWa = () =>
        `Hola! Soy ${form.nombre.trim()}. Adjunto el PDF con los detalles de mi mudanza para cotizar.`;

    // En móvil, comparte el PDF como archivo adjunto real (menú nativo del sistema)
    const compartirPdf = async () => {
        if (!pdfListo) return;
        const file = new File([pdfListo.blob], pdfListo.filename, { type: 'application/pdf' });
        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    text: construirMensajeWa(),
                });
                return;
            } catch { /* usuario canceló o falló: cae al enlace */ }
        }
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(construirMensajeWa())}`, '_blank');
    };

    const enviarWhatsapp = async () => {
        setEnviando(true);
        setErrorEnvio(false);
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
                    mascotas: form.mascotas === 'si',
                    info_adicional: form.infoAdicional.trim() || null,
                },
                acceso: {
                    escaleras_origen: form.escalerasOrigen,
                    escaleras_destino: form.escalerasDestino,
                    caminata: form.caminata === 'si',
                    parqueo: form.parqueo,
                    distancia_km: ruta?.km ?? null,
                    duracion_min: ruta?.min ?? null,
                },
                pdf_url: pdfUrl,
            });

            // Aviso por correo con ubicaciones y enlace al PDF (FormSubmit, sin backend).
            // No bloquea el flujo si falla.
            try {
                const mapLink = (c) => (c ? `https://www.google.com/maps?q=${c[0]},${c[1]}` : 'Sin coordenadas');
                await fetch(`https://formsubmit.co/ajax/${EMAIL_AVISOS}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        _subject: `Nueva solicitud de mudanza: ${form.nombre.trim()} (${form.fecha})${esUrgente ? ' [URGENTE]' : ''}`,
                        _template: 'table',
                        Cliente: form.nombre.trim(),
                        'Cargar en (origen)': form.origen.trim(),
                        'Mapa de carga': mapLink(coordsOrigen),
                        'Descargar en (destino)': form.destino.trim(),
                        'Mapa de descarga': mapLink(coordsDestino),
                        Distancia: ruta ? `${ruta.km} km (~${ruta.min} min en camión)` : 'No calculada',
                        'Fecha de mudanza': form.fecha + (esUrgente ? ' (URGENTE, menos de 3 dias)' : ''),
                        'Total de articulos': totalMuebles,
                        Mascotas: form.mascotas === 'si'
                            ? 'Si' : 'No',
                        'Informacion adicional': form.infoAdicional.trim() || 'Ninguna',
                        'PDF con la informacion completa': pdfUrl || 'No se pudo subir el PDF',
                    }),
                });
            } catch (e) {
                console.error('No se pudo enviar el aviso por correo:', e);
            }

            // Descargar PDF localmente
            const filename2 = `cotizacion-${form.nombre.trim()}.pdf`;
            doc.save(filename2);
            setPdfListo({ blob, filename: filename2, url: pdfUrl });

            // Abrir WhatsApp
            setTimeout(() => {
                window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(construirMensajeWa())}`, '_blank');
            }, 600);

            setEnviado(true);
        } catch (err) {
            console.error('Error al enviar:', err);
            setErrorEnvio(true);
        } finally {
            setEnviando(false);
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

                <div className={styles.card} ref={cardRef}>
                    {enviado ? (
                        <div className={styles.exito} ref={stepRef}>
                            <div className={styles.exitoIcon}>
                                <PartyPopper size={34} />
                            </div>
                            <h3>¡Listo, {form.nombre.trim().split(' ')[0]}!</h3>
                            <p>
                                Tu PDF se descargó y se abrió WhatsApp. Adjunta el PDF en el chat
                                y en minutos te confirmamos el precio de tu mudanza.
                            </p>
                            <div className={styles.exitoPasos}>
                                <span><Check size={15} /> PDF generado con tus datos</span>
                                <span><Check size={15} /> Solicitud registrada</span>
                                <span><MessageCircle size={15} /> Solo falta adjuntarlo en WhatsApp</span>
                            </div>
                            <div className={styles.exitoAcciones}>
                                <button type="button" className={styles.btnWa} onClick={compartirPdf}>
                                    <MessageCircle size={18} /> Enviar PDF por WhatsApp
                                </button>
                                <button type="button" className={styles.btnBack} onClick={reiniciar}>
                                    <RotateCcw size={15} /> Hacer otra cotización
                                </button>
                            </div>
                        </div>
                    ) : (
                    <>
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

                    <div ref={stepRef}>
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
                                <label>Ruta de tu mudanza</label>
                                <button
                                    type="button"
                                    className={styles.rutaSelector}
                                    onClick={() => setSelectorAbierto(true)}
                                >
                                    <span className={styles.rutaRail}>
                                        <span className={styles.rutaDotA} />
                                        <span className={styles.rutaLinea} />
                                        <span className={styles.rutaDotB} />
                                    </span>
                                    <span className={styles.rutaTextos}>
                                        <span className={form.origen ? styles.rutaValor : styles.rutaPlaceholder}>
                                            {form.origen || '¿De dónde salimos?'}
                                        </span>
                                        <span className={form.destino ? styles.rutaValor : styles.rutaPlaceholder}>
                                            {form.destino || '¿A dónde llegamos?'}
                                        </span>
                                    </span>
                                    <span className={styles.rutaEditar}>
                                        {form.origen || form.destino ? 'Editar' : 'Elegir en el mapa'}
                                    </span>
                                </button>

                                {form.origen && form.destino && (
                                    <RutaMapa
                                        origen={form.origen}
                                        destino={form.destino}
                                        coordsOrigen={coordsOrigen}
                                        coordsDestino={coordsDestino}
                                        onRuta={setRuta}
                                    />
                                )}
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
                                {totalMuebles > 0 && (
                                    <span className={styles.countChip}>{totalMuebles} {totalMuebles === 1 ? 'artículo' : 'artículos'}</span>
                                )}
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
                                <label>Llevas mascotas en la mudanza?</label>
                                <div className={styles.opciones}>
                                    <OpcionBtn value="no" selected={form.mascotas === 'no'} onClick={set('mascotas')}>No</OpcionBtn>
                                    <OpcionBtn value="si" selected={form.mascotas === 'si'} onClick={set('mascotas')}>Si, llevo mascotas</OpcionBtn>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Cuantos ayudantes adicionales necesitas?</label>
                                <select
                                    value={form.ayudantes}
                                    onChange={e => set('ayudantes')(parseInt(e.target.value))}
                                    className={styles.selectInput}
                                >
                                    <option value={0}>Ninguno</option>
                                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'ayudante' : 'ayudantes'}</option>
                                    ))}
                                </select>
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

                            <div className={styles.field}>
                                <label>Informacion adicional <span className={styles.sub}>(opcional)</span></label>
                                <textarea
                                    placeholder="Cualquier detalle extra que debamos saber: horarios, indicaciones para llegar, condiciones especiales..."
                                    value={form.infoAdicional}
                                    onChange={e => set('infoAdicional')(e.target.value)}
                                    rows={3}
                                    className={styles.textarea}
                                />
                            </div>

                            {form.fecha && (
                                <div className={styles.resumen}>
                                    <h4>Resumen de tu solicitud</h4>
                                    <div className={styles.resumenItem}><span>Origen</span><strong>{form.origen}</strong></div>
                                    <div className={styles.resumenItem}><span>Destino</span><strong>{form.destino}</strong></div>
                                    {ruta && <div className={styles.resumenItem}><span>Distancia</span><strong>{ruta.km} km aprox.</strong></div>}
                                    <div className={styles.resumenItem}><span>Articulos</span><strong>{totalMuebles} item(s)</strong></div>
                                    <div className={styles.resumenItem}><span>Fecha</span><strong>{form.fecha}</strong></div>
                                    {form.mascotas === 'si' && <div className={styles.resumenItem}><span>Mascotas</span><strong>Si</strong></div>}
                                    {form.desmontaje === 'si' && <div className={styles.resumenItem}><span>Desmontaje</span><strong>Si (+costo)</strong></div>}
                                    {form.embalaje === 'si' && <div className={styles.resumenItem}><span>Embalaje</span><strong>Si (+costo)</strong></div>}
                                    {form.ayudantes > 0 && <div className={styles.resumenItem}><span>Ayudantes extra</span><strong>{form.ayudantes} (+costo)</strong></div>}
                                </div>
                            )}
                        </div>
                    )}

                    </div>

                    {/* Nota PDF - solo en paso 4 con fecha */}
                    {paso === 4 && form.fecha && (
                        <div className={styles.pdfNota}>
                            <Info size={15} />
                            Se descargara un PDF con tu informacion. Adjuntalo en WhatsApp para que podamos darte el precio.
                        </div>
                    )}

                    {errorEnvio && (
                        <div className={styles.errorNota}>
                            <AlertTriangle size={15} />
                            Algo falló al enviar. Tus respuestas siguen aquí, intenta de nuevo.
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
                    </>
                    )}
                </div>
            </div>

            <SelectorRuta
                abierto={selectorAbierto}
                inicial={{ origen: form.origen, destino: form.destino, coordsOrigen, coordsDestino }}
                onConfirmar={({ origen, destino, coordsOrigen: cO, coordsDestino: cD }) => {
                    setForm(f => ({ ...f, origen, destino }));
                    setCoordsOrigen(cO);
                    setCoordsDestino(cD);
                }}
                onCerrar={() => setSelectorAbierto(false)}
            />
        </section>
    );
}
