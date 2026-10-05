import { useId } from 'react';

// Small object illustrations share lighting, proportions and material colors.
export default function FurnitureIcon({ type, size = 20, className }) {
    const id = useId();
    const metal = `url(#${id}-metal)`;
    const fabric = `url(#${id}-fabric)`;
    const wood = `url(#${id}-wood)`;
    const dark = '#334155';
    const glass = '#52708a';
    let object;

    switch (type) {
        case 'cama_individual':
        case 'cama_matrimonial': {
            const double = type === 'cama_matrimonial';
            object = <>
                <rect x={double ? 7 : 14} y="7" width={double ? 50 : 36} height="30" rx="4" fill={wood} />
                <path d={double ? 'M7 48v9m50-9v9' : 'M14 48v9m36-9v9'} stroke={dark} strokeWidth="4" />
                <path d={double ? 'M10 22h44l5 24H5z' : 'M17 22h30l5 24H12z'} fill={metal} />
                <rect x={double ? 12 : 20} y="18" width={double ? 18 : 24} height="10" rx="3" fill="#fff" />
                {double && <rect x="34" y="18" width="18" height="10" rx="3" fill="#fff" />}
                <path d={double ? 'M8 31h48l3 16H5z' : 'M15 31h34l3 16H12z'} fill={fabric} />
                <rect x={double ? 5 : 12} y="45" width={double ? 54 : 40} height="8" rx="2" fill={wood} />
            </>;
            break;
        }
        case 'ropero':
            object = <>
                <path d="M12 8h37l5 5v42H12z" fill={wood} />
                <path d="M49 8v47h5V13z" fill="#94765c" />
                <rect x="14" y="10" width="33" height="43" rx="1" fill="#dfc5a5" />
                <path d="M31 10v43M16 55v3m30-3v3" />
                <path d="M27 28v8m8-8v8" stroke={dark} strokeWidth="2.5" />
            </>;
            break;
        case 'sofa':
            object = <>
                <path d="M10 44v12m44-12v12" stroke={dark} strokeWidth="4" />
                <rect x="9" y="15" width="46" height="29" rx="7" fill={fabric} />
                <path d="M32 17v22" stroke="#5c7f9f" />
                <rect x="10" y="35" width="44" height="14" rx="4" fill="#9db6ca" />
                <path d="M32 36v12" />
                <rect x="4" y="28" width="10" height="23" rx="4" fill={fabric} />
                <rect x="50" y="28" width="10" height="23" rx="4" fill={fabric} />
            </>;
            break;
        case 'comedor':
            object = <>
                <path d="M5 14h12v21H5zm42 0h12v21H47z" fill={fabric} />
                <path d="M5 36h15v5H5zm39 0h15v5H44z" fill={wood} />
                <path d="M7 41v14m11-14v14m28-14v14m11-14v14M22 30v24m20-24v24" stroke="#826b53" strokeWidth="3" />
                <path d="M17 24h30l7 10H10z" fill={wood} />
                <path d="M10 34h44v5H10z" fill="#a98865" />
            </>;
            break;
        case 'mueble_tv':
            object = <>
                <rect x="12" y="7" width="40" height="27" rx="2" fill={dark} />
                <rect x="15" y="10" width="34" height="21" rx="1" fill={glass} />
                <path d="M17 29 47 12" stroke="#93b4cd" opacity=".5" />
                <path d="M29 34v5h6v-5" fill={dark} />
                <rect x="5" y="40" width="54" height="14" rx="1" fill={wood} />
                <path d="M23 40v14m18-14v14M9 54v4m46-4v4" />
                <path d="M28 47h8" stroke="#826b53" />
            </>;
            break;
        case 'refrigerador':
            object = <>
                <path d="M17 5h28l4 4v48H17z" fill={metal} />
                <path d="M45 5v52h4V9z" fill="#94a3b8" />
                <path d="M18 25h26M20 57v2m22-2v2" />
                <path d="M22 13v7m0 12v12" stroke={dark} strokeWidth="2.5" />
            </>;
            break;
        case 'lavadora':
        case 'secadora': {
            const dryer = type === 'secadora';
            object = <>
                <rect x="11" y="7" width="42" height="49" rx="3" fill={metal} />
                <path d="M12 19h40M16 56v2m32-2v2" />
                <rect x="16" y="11" width="12" height="4" rx="1" fill="#94a3b8" stroke="none" />
                <circle cx="45" cy="13" r="2.5" fill={dark} />
                <circle cx="32" cy="37" r="14" fill="#c2cdd7" />
                <circle cx="32" cy="37" r="10" fill={glass} />
                {dryer
                    ? <><path d="M25 37q3-8 8-1t6 0" stroke="#dcc3a6" strokeWidth="4" /><path d="M18 51h28" stroke="#94a3b8" /></>
                    : <path d="M23 39q4-4 9 0t9 0v3q-9 9-18 0z" fill="#8cc4e5" stroke="none" />}
                <path d="M26 31q3-3 6-3" stroke="#c3dfef" />
            </>;
            break;
        }
        case 'estufa':
            object = <>
                <rect x="11" y="9" width="42" height="47" rx="2" fill={metal} />
                <path d="M11 20h42" />
                <ellipse cx="23" cy="14" rx="6" ry="3" fill={dark} />
                <ellipse cx="41" cy="14" rx="6" ry="3" fill={dark} />
                <path d="M19 25h0m9 0h0m9 0h0m9 0h0" stroke={dark} strokeWidth="3.5" />
                <rect x="16" y="31" width="32" height="20" rx="2" fill={glass} />
                <path d="M20 34h24" stroke="#d6e1eb" strokeWidth="2" />
                <path d="M16 56v2m32-2v2" />
            </>;
            break;
        case 'escritorio':
            object = <>
                <path d="M9 28v29m46-29v29" stroke="#826b53" strokeWidth="4" />
                <rect x="6" y="26" width="52" height="6" rx="1" fill={wood} />
                <rect x="39" y="32" width="16" height="20" fill={wood} />
                <path d="M39 42h16m-10-5h4m-4 10h4" />
                <rect x="16" y="6" width="28" height="17" rx="2" fill={dark} />
                <rect x="19" y="9" width="22" height="11" fill={glass} />
                <path d="M30 23v3" stroke={dark} strokeWidth="3" />
            </>;
            break;
        case 'cajas':
            object = <>
                <path d="m22 5 23 4 9 8-24-3z" fill="#ead0a8" />
                <path d="m22 5 8 9v20l-8-8z" fill="#b38b5f" />
                <path d="m30 14 24 3v19l-24-2z" fill={wood} />
                <path d="m36 8 7 6v8l-6-1v-8" fill="#f3e4cd" stroke="none" />
                <path d="m6 29 26-4 11 12-27 5z" fill="#ead0a8" />
                <path d="m6 29 10 13v16L6 46z" fill="#b38b5f" />
                <path d="m16 42 27-5v17l-27 4z" fill={wood} />
                <path d="m17 28 10 12v8l7-1v-8L24 27" fill="#f3e4cd" stroke="none" />
            </>;
            break;
        case 'bolsas':
            object = <>
                <path d="M24 19q-1-12 7-12t7 12" fill="none" stroke="#826b53" strokeWidth="3" />
                <path d="M19 18h27l6 37H15z" fill={wood} />
                <path d="m46 18-4 32 10 5z" fill="#a98865" />
                <path d="M14 31q-1-10 5-10t6 10" fill="none" stroke={dark} strokeWidth="2.5" />
                <path d="M9 30h23l4 28H6z" fill={fabric} />
                <path d="m32 30-4 24 8 4" fill="#5c7f9f" />
            </>;
            break;
        case 'otros_grandes':
            object = <>
                <path d="M11 23h42v32H11z" fill={wood} />
                <path d="m11 23 7-9h28l7 9z" fill="#ead0a8" />
                <path d="M27 14h10v41H27z" fill="#eee1ca" stroke="none" />
                <path d="M11 25h42" />
                <rect x="40" y="36" width="8" height="10" rx="1" fill="#fff" stroke="none" />
                <path d="M44 43v-4m-2 2 2-2 2 2" stroke="#826b53" />
            </>;
            break;
        default:
            return null;
    }

    return <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
        <defs>
            <linearGradient id={`${id}-metal`} x2="1" y2="1">
                <stop stopColor="#f8fafc" /><stop offset="1" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id={`${id}-fabric`} x2="0" y2="1">
                <stop stopColor="#bad0df" /><stop offset="1" stopColor="#6f91ad" />
            </linearGradient>
            <linearGradient id={`${id}-wood`} x2="1" y2="1">
                <stop stopColor="#ddbd95" /><stop offset="1" stopColor="#b38e67" />
            </linearGradient>
        </defs>
        <ellipse cx="32" cy="59" rx="24" ry="2" fill="#0f172a" opacity=".1" />
        <g stroke="#526173" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {object}
        </g>
    </svg>;
}
