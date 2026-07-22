import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { X, MapPin, LocateFixed, LoaderCircle, Check, Search } from 'lucide-react';
import { buscarDirecciones, reverseGeocodificar, CENTRO_CR } from './geo';
import styles from './SelectorRuta.module.css';

const ESTILO = 'https://tiles.openfreemap.org/styles/positron';

export default function SelectorRuta({ abierto, inicial, onConfirmar, onCerrar }) {
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [coordsOrigen, setCoordsOrigen] = useState(null);
    const [coordsDestino, setCoordsDestino] = useState(null);
    const [campoActivo, setCampoActivo] = useState('destino');
    const [sugerencias, setSugerencias] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [ubicando, setUbicando] = useState(false);
    const [pinLabel, setPinLabel] = useState('');
    const [pinCoords, setPinCoords] = useState(null);
    const [pinCargando, setPinCargando] = useState(false);

    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const timeoutRef = useRef(null);
    const inputOrigenRef = useRef(null);
    const inputDestinoRef = useRef(null);

    const setCampo = (campo, texto, coords) => {
        if (campo === 'origen') { setOrigen(texto); setCoordsOrigen(coords); }
        else { setDestino(texto); setCoordsDestino(coords); }
    };

    const usarMiUbicacion = () => {
        if (!navigator.geolocation) return;
        setUbicando(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                const label = await reverseGeocodificar(lat, lon);
                setCampo('origen', label, [lat, lon]);
                setUbicando(false);
                mapRef.current?.flyTo({ center: [lon, lat], zoom: 15, duration: 900 });
                setCampoActivo('destino');
            },
            () => setUbicando(false),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    // Sincroniza con los valores existentes al abrir y bloquea el scroll del
    // fondo. setState síncrono a propósito: es la inicialización del modal
    // según sus props al momento de abrirse, no un derivado de otro estado.
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!abierto) return;
        setOrigen(inicial?.origen || '');
        setDestino(inicial?.destino || '');
        setCoordsOrigen(inicial?.coordsOrigen || null);
        setCoordsDestino(inicial?.coordsDestino || null);
        setSugerencias([]);
        setCampoActivo(inicial?.origen ? 'destino' : 'origen');
        document.body.style.overflow = 'hidden';

        // Si no hay origen, intenta usar la ubicación actual de una vez
        if (!inicial?.origen) usarMiUbicacion();

        return () => { document.body.style.overflow = ''; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abierto]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Mapa con pin central fijo (se mueve el mapa, no el pin)
    useEffect(() => {
        if (!abierto || !mapDivRef.current || mapRef.current) return;
        const map = new maplibregl.Map({
            container: mapDivRef.current,
            style: ESTILO,
            center: CENTRO_CR,
            zoom: 8,
            attributionControl: { compact: true },
            pitchWithRotate: false,
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        let timerReverse = null;
        map.on('moveend', () => {
            const c = map.getCenter();
            setPinCoords([c.lat, c.lng]);
            setPinCargando(true);
            clearTimeout(timerReverse);
            timerReverse = setTimeout(async () => {
                const label = await reverseGeocodificar(c.lat, c.lng);
                setPinLabel(label);
                setPinCargando(false);
            }, 350);
        });

        mapRef.current = map;
        return () => { clearTimeout(timerReverse); map.remove(); mapRef.current = null; };
    }, [abierto]);

    if (!abierto) return null;

    const handleTexto = (campo, texto) => {
        setCampo(campo, texto, null);
        setCampoActivo(campo);
        clearTimeout(timeoutRef.current);
        if (texto.length < 3) { setSugerencias([]); setBuscando(false); return; }
        setBuscando(true);
        timeoutRef.current = setTimeout(async () => {
            const items = await buscarDirecciones(texto);
            setSugerencias(items);
            setBuscando(false);
        }, 300);
    };

    const elegirSugerencia = (s) => {
        setCampo(campoActivo, s.label, [s.lat, s.lon]);
        setSugerencias([]);
        mapRef.current?.flyTo({ center: [s.lon, s.lat], zoom: 15, duration: 900 });
        if (campoActivo === 'origen' && !destino) {
            setCampoActivo('destino');
            inputDestinoRef.current?.focus();
        }
    };

    const fijarPin = () => {
        if (!pinCoords || !pinLabel) return;
        setCampo(campoActivo, pinLabel, pinCoords);
        setSugerencias([]);
        if (campoActivo === 'origen' && !destino) setCampoActivo('destino');
    };

    const listo = origen.trim() && destino.trim();

    const confirmar = () => {
        if (!listo) return;
        onConfirmar({ origen: origen.trim(), destino: destino.trim(), coordsOrigen, coordsDestino });
        onCerrar();
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Elegir ruta de la mudanza">
            <div className={styles.panel}>
                <div className={styles.top}>
                    <h3>¿De dónde a dónde?</h3>
                    <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.campos}>
                    <div className={styles.rail}>
                        <span className={styles.dotA} />
                        <span className={styles.railLinea} />
                        <span className={styles.dotB} />
                    </div>

                    <div className={styles.inputs}>
                        <div className={`${styles.inputRow} ${campoActivo === 'origen' ? styles.inputActivo : ''}`}>
                            <input
                                ref={inputOrigenRef}
                                type="text"
                                placeholder="Punto A: ¿de dónde salimos?"
                                value={origen}
                                onChange={(e) => handleTexto('origen', e.target.value)}
                                onFocus={() => setCampoActivo('origen')}
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                className={styles.gpsBtn}
                                onClick={usarMiUbicacion}
                                title="Usar mi ubicación actual"
                                aria-label="Usar mi ubicación actual"
                            >
                                {ubicando ? <LoaderCircle size={17} className={styles.spinner} /> : <LocateFixed size={17} />}
                            </button>
                        </div>

                        <div className={`${styles.inputRow} ${campoActivo === 'destino' ? styles.inputActivo : ''}`}>
                            <input
                                ref={inputDestinoRef}
                                type="text"
                                placeholder="Punto B: ¿a dónde llegamos?"
                                value={destino}
                                onChange={(e) => handleTexto('destino', e.target.value)}
                                onFocus={() => setCampoActivo('destino')}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>

                {(sugerencias.length > 0 || buscando) && (
                    <ul className={styles.sugerencias}>
                        {buscando && (
                            <li className={styles.sugCargando}>
                                <LoaderCircle size={14} className={styles.spinner} /> Buscando...
                            </li>
                        )}
                        {sugerencias.map((s, i) => (
                            <li key={i} onMouseDown={() => elegirSugerencia(s)}>
                                <Search size={14} className={styles.sugIcon} />
                                <span>{s.label}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className={styles.mapaWrap}>
                    <div ref={mapDivRef} className={styles.mapa} />

                    {/* Pin central fijo, estilo Uber */}
                    <div className={styles.pinCentro} aria-hidden="true">
                        <MapPin size={38} strokeWidth={2.2} />
                        <span className={styles.pinSombra} />
                    </div>

                    <div className={styles.pinBar}>
                        <span className={styles.pinTexto}>
                            {pinCargando
                                ? 'Buscando el nombre del lugar...'
                                : (pinLabel || 'Mueve el mapa para colocar el pin')}
                        </span>
                        <button
                            type="button"
                            className={styles.pinBtn}
                            onClick={fijarPin}
                            disabled={!pinLabel || pinCargando}
                        >
                            Fijar como {campoActivo === 'origen' ? 'punto A' : 'punto B'}
                        </button>
                    </div>
                </div>

                <button type="button" className={styles.confirmar} onClick={confirmar} disabled={!listo}>
                    <Check size={18} /> Confirmar ruta
                </button>
            </div>
        </div>
    );
}
