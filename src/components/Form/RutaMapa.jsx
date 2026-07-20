import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Navigation, Clock, LoaderCircle, MapPinOff } from 'lucide-react';
import { geocodificar, CENTRO_CR } from './geo';
import styles from './RutaMapa.module.css';

const ESTILO = 'https://tiles.openfreemap.org/styles/positron';

// Marcadores estilo app de transporte: origen = punto verde, destino = pin azul
const crearMarcador = (tipo) => {
    const el = document.createElement('div');
    if (tipo === 'origen') {
        el.innerHTML = `<div style="width:18px;height:18px;border-radius:50%;background:#16a34a;border:3.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);"></div>`;
    } else {
        el.innerHTML = `<div style="width:16px;height:16px;background:#2563EB;border:3.5px solid #fff;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.35);"></div>`;
    }
    return el;
};

const formatearDuracion = (min) => {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
};

export default function RutaMapa({ origen, destino, coordsOrigen, coordsDestino, onRuta }) {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const listoRef = useRef(false);
    const marcadoresRef = useRef([]);
    const animRef = useRef(null);
    const [info, setInfo] = useState(null);
    const [estado, setEstado] = useState('idle');

    useEffect(() => {
        if (!mapDivRef.current || mapRef.current) return;
        const map = new maplibregl.Map({
            container: mapDivRef.current,
            style: ESTILO,
            center: CENTRO_CR,
            zoom: 7,
            attributionControl: { compact: true },
            scrollZoom: false,
            pitchWithRotate: false,
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        map.on('load', () => {
            map.addSource('ruta', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } });
            // Borde blanco debajo + línea azul encima, puntas redondeadas (look Uber/DiDi)
            map.addLayer({
                id: 'ruta-borde', type: 'line', source: 'ruta',
                layout: { 'line-cap': 'round', 'line-join': 'round' },
                paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.9 },
            });
            map.addLayer({
                id: 'ruta-linea', type: 'line', source: 'ruta',
                layout: { 'line-cap': 'round', 'line-join': 'round' },
                paint: { 'line-color': '#2563EB', 'line-width': 5 },
            });
            listoRef.current = true;
        });

        mapRef.current = map;
        return () => {
            cancelAnimationFrame(animRef.current);
            map.remove();
            mapRef.current = null;
            listoRef.current = false;
        };
    }, []);

    const limpiar = () => {
        cancelAnimationFrame(animRef.current);
        marcadoresRef.current.forEach(m => m.remove());
        marcadoresRef.current = [];
        if (listoRef.current) {
            mapRef.current?.getSource('ruta')?.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
        }
    };

    // Dibuja la ruta progresivamente, como el trazado animado de las apps de transporte
    const animarRuta = (coords) => {
        const src = mapRef.current?.getSource('ruta');
        if (!src) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || coords.length < 2) {
            src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords } });
            return;
        }
        const duracion = 900;
        let inicio = null;
        const paso = (t) => {
            if (!inicio) inicio = t;
            const p = Math.min((t - inicio) / duracion, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const n = Math.max(2, Math.round(eased * coords.length));
            src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, n) } });
            if (p < 1) animRef.current = requestAnimationFrame(paso);
        };
        animRef.current = requestAnimationFrame(paso);
    };

    useEffect(() => {
        const o = origen?.trim();
        const d = destino?.trim();
        if (!o || !d || o.length < 4 || d.length < 4) {
            setEstado('idle');
            setInfo(null);
            limpiar();
            onRuta?.(null);
            return;
        }

        let cancelado = false;
        setEstado('cargando');

        const espera = (coordsOrigen && coordsDestino) ? 150 : 900;
        const timer = setTimeout(async () => {
            try {
                const [pA, pB] = await Promise.all([
                    coordsOrigen ?? geocodificar(o),
                    coordsDestino ?? geocodificar(d),
                ]);
                if (cancelado) return;
                if (!pA || !pB) { setEstado('error'); setInfo(null); onRuta?.(null); return; }

                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pA[1]},${pA[0]};${pB[1]},${pB[0]}?overview=full&geometries=geojson`
                );
                const data = await res.json();
                if (cancelado) return;

                const ruta = data.routes?.[0];
                if (!ruta) { setEstado('error'); setInfo(null); onRuta?.(null); return; }

                // Espera a que el estilo del mapa termine de cargar
                const dibujar = () => {
                    if (cancelado) return;
                    if (!listoRef.current) { setTimeout(dibujar, 120); return; }
                    const map = mapRef.current;
                    limpiar();

                    marcadoresRef.current = [
                        new maplibregl.Marker({ element: crearMarcador('origen') }).setLngLat([pA[1], pA[0]]).addTo(map),
                        new maplibregl.Marker({ element: crearMarcador('destino') }).setLngLat([pB[1], pB[0]]).addTo(map),
                    ];

                    // Los marcadores caen con un pop escalonado (origen primero)
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        marcadoresRef.current.forEach((m, i) => {
                            m.getElement().firstElementChild?.animate(
                                [
                                    { transform: 'scale(0) translateY(-10px)', opacity: 0 },
                                    { transform: 'scale(1.25) translateY(0)', opacity: 1, offset: 0.7 },
                                    { transform: 'scale(1)', opacity: 1 },
                                ],
                                { duration: 420, delay: i * 220, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
                            );
                        });
                    }

                    const coords = ruta.geometry.coordinates; // [lon, lat]
                    const bounds = coords.reduce(
                        (b, c) => b.extend(c),
                        new maplibregl.LngLatBounds(coords[0], coords[0])
                    );
                    map.fitBounds(bounds, { padding: 52, duration: 800 });
                    animarRuta(coords);
                };
                dibujar();

                const km = Math.round((ruta.distance / 1000) * 10) / 10;
                // OSRM calcula tiempos de carro; un camión de mudanzas va más lento
                const FACTOR_CAMION = 1.35;
                const min = Math.round((ruta.duration / 60) * FACTOR_CAMION);
                setInfo({ km, min });
                setEstado('ok');
                onRuta?.({ km, min });
            } catch {
                if (!cancelado) { setEstado('error'); setInfo(null); onRuta?.(null); }
            }
        }, espera);

        return () => { cancelado = true; clearTimeout(timer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [origen, destino, coordsOrigen, coordsDestino]);

    return (
        <div className={styles.wrap}>
            <div ref={mapDivRef} className={styles.mapa} aria-label="Mapa con la ruta de la mudanza" />

            {estado === 'idle' && (
                <div className={styles.velo}>
                    <Navigation size={20} />
                    <span>Escribe origen y destino para ver la ruta</span>
                </div>
            )}

            {estado === 'cargando' && (
                <div className={styles.chip}>
                    <LoaderCircle size={15} className={styles.spinner} />
                    Calculando ruta...
                </div>
            )}

            {estado === 'error' && (
                <div className={styles.chip}>
                    <MapPinOff size={15} />
                    No encontramos la ruta, revisa las direcciones
                </div>
            )}

            {estado === 'ok' && info && (
                <div className={styles.infoBar}>
                    <span><Navigation size={15} /> {info.km.toLocaleString('es-CR')} km</span>
                    <span className={styles.sep} />
                    <span><Clock size={15} /> {formatearDuracion(info.min)} en camión</span>
                </div>
            )}
        </div>
    );
}
