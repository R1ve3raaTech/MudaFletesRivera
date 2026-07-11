// ═══════════════════════════════════════════════════════════════
//  TARIFAS DE ESTIMACIÓN — AJUSTAR AQUÍ LOS PRECIOS (en colones)
//  Estos valores son de arranque: cámbialos con los precios reales
//  del negocio. La estimación siempre se muestra como un rango y
//  con la aclaración de que el precio final se confirma por WhatsApp.
// ═══════════════════════════════════════════════════════════════
export const TARIFAS = {
    base: 50000,              // salida del camión, incluye distancias cortas
    porKm: 800,               // por kilómetro de ruta
    escaleras1piso: 8000,     // por lugar con 1 piso de escaleras
    escaleras2pisos: 15000,   // por lugar con 2+ pisos de escaleras
    caminataLarga: 8000,      // caminata de más de 20 m al camión
    articulosIncluidos: 10,   // artículos cubiertos por la tarifa base
    porArticuloExtra: 1200,   // cada artículo por encima de los incluidos
    ayudante: 12000,          // por ayudante adicional
    desmontaje: 15000,        // desmontaje y armado de muebles
    embalaje: 25000,          // servicio de embalaje
    fragiles: 10000,          // manejo de artículos frágiles/especiales
    urgenciaPct: 0.15,        // recargo % por menos de 3 días de anticipación
    margenRango: 0.15,        // ± % para construir el rango mostrado
};

export const calcularEstimacion = ({ form, km, totalMuebles, esUrgente }) => {
    if (!km || km <= 0) return null;

    const escaleras = (v) =>
        v === '1' ? TARIFAS.escaleras1piso : v === '2+' ? TARIFAS.escaleras2pisos : 0;

    let total = TARIFAS.base + km * TARIFAS.porKm;
    total += escaleras(form.escalerasOrigen) + escaleras(form.escalerasDestino);
    if (form.caminata === 'si') total += TARIFAS.caminataLarga;
    total += Math.max(0, totalMuebles - TARIFAS.articulosIncluidos) * TARIFAS.porArticuloExtra;
    total += (form.ayudantes || 0) * TARIFAS.ayudante;
    if (form.desmontaje === 'si') total += TARIFAS.desmontaje;
    if (form.embalaje === 'si') total += TARIFAS.embalaje;
    if (form.fragiles === 'si') total += TARIFAS.fragiles;
    if (esUrgente) total *= 1 + TARIFAS.urgenciaPct;

    const redondear = (n) => Math.round(n / 1000) * 1000;
    return {
        min: redondear(total * (1 - TARIFAS.margenRango)),
        max: redondear(total * (1 + TARIFAS.margenRango)),
    };
};

export const fmtCRC = (n) => '₡' + n.toLocaleString('es-CR');
