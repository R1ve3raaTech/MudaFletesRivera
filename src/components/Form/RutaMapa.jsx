import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, LoaderCircle, MapPinOff } from 'lucide-react';
import styles from './RutaMapa.module.css';

const CENTRO_CR = [9.7489, -83.7534];

const geocodificar = async (q) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=cr&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
    );
    const data = await res.json();
    if (!data[0]) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
};

const pin = (color, letra) => L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:#fff;font-weight:800;font-size:13px;font-family:sans-serif;">${letra}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

const formatearDuracion = (min) => {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
};

export default function RutaMapa({ origen, destino, coordsOrigen, coordsDestino, onRuta }) {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const capaRef = useRef(null);
    const [info, setInfo] = useState(null);
    const [estado, setEstado] = useState('idle');

    useEffect(() => {
        if (!mapDivRef.current || mapRef.current) return;
        const map = L.map(mapDivRef.current, {
            center: CENTRO_CR,
            zoom: 8,
            scrollWheelZoom: false,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        capaRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        return () => { map.remove(); mapRef.current = null; };
    }, []);

    useEffect(() => {
        const o = origen?.trim();
        const d = destino?.trim();
        if (!o || !d || o.length < 4 || d.length < 4) {
            setEstado('idle');
            setInfo(null);
            capaRef.current?.clearLayers();
            onRuta?.(null);
            return;
        }

        let cancelado = false;
        setEstado('cargando');

        // Con coordenadas exactas (sugerencia elegida) la ruta sale casi al instante;
        // solo se geocodifica el texto cuando se escribió a mano.
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

                const coords = ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
                const capa = capaRef.current;
                capa.clearLayers();
                L.marker(pA, { icon: pin('#16a34a', 'A') }).addTo(capa);
                L.marker(pB, { icon: pin('#2563EB', 'B') }).addTo(capa);
                const linea = L.polyline(coords, { color: '#2563EB', weight: 5, opacity: 0.85 }).addTo(capa);
                mapRef.current?.fitBounds(linea.getBounds(), { padding: [40, 40] });

                const km = Math.round((ruta.distance / 1000) * 10) / 10;
                const min = Math.round(ruta.duration / 60);
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
                    <span><Clock size={15} /> {formatearDuracion(info.min)} aprox.</span>
                </div>
            )}
        </div>
    );
}
