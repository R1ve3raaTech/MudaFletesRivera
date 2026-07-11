// Utilidades de geocodificación compartidas (Photon + Nominatim, sin API keys)

export const CR_BBOX = '-86.1,7.9,-82.5,11.3';
export const CR_LAT = 9.93;
export const CR_LON = -84.08;
export const CENTRO_CR = [-84.08, 9.93]; // [lon, lat]

// Nombre corto y legible a partir de las propiedades de Photon
export const etiquetaPhoton = (p) => {
    const partes = [
        p.name,
        p.street && p.housenumber ? `${p.street} ${p.housenumber}` : p.street,
        p.district,
        p.city || p.town || p.village,
        p.county,
        p.state,
    ].filter(Boolean);
    return [...new Set(partes)].slice(0, 4).join(', ');
};

// Photon (komoot): tolera errores de escritura y busca por prefijo.
// Si no devuelve nada, se intenta con Nominatim como respaldo.
export const buscarDirecciones = async (q) => {
    try {
        const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lat=${CR_LAT}&lon=${CR_LON}&bbox=${CR_BBOX}`
        );
        const data = await res.json();
        const vistos = new Set();
        const items = (data.features || [])
            .filter(f => (f.properties.countrycode || '').toUpperCase() === 'CR')
            .map(f => ({
                label: etiquetaPhoton(f.properties),
                lat: f.geometry.coordinates[1],
                lon: f.geometry.coordinates[0],
            }))
            .filter(s => s.label && !vistos.has(s.label) && vistos.add(s.label))
            .slice(0, 6);
        if (items.length > 0) return items;
    } catch { /* cae al respaldo */ }

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=cr&limit=5`,
            { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();
        return data.map(d => ({
            label: d.display_name.split(',').slice(0, 4).join(','),
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
        }));
    } catch { return []; }
};

// Texto -> [lat, lon] (primera coincidencia)
export const geocodificar = async (q) => {
    const items = await buscarDirecciones(q);
    return items[0] ? [items[0].lat, items[0].lon] : null;
};

// [lat, lon] -> nombre corto del lugar
export const reverseGeocodificar = async (lat, lon) => {
    try {
        const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const p = data.features?.[0]?.properties;
        if (p) {
            const label = etiquetaPhoton(p);
            if (label) return label;
        }
    } catch { /* cae al respaldo */ }

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();
        if (data.display_name) return data.display_name.split(',').slice(0, 4).join(',');
    } catch { /* sin nombre */ }

    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
};
