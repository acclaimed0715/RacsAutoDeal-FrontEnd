/**
 * Distinct colors for dashboard charts. Vehicle types use palette order from
 * Manage Inventory → Vehicle categories when possible so colors stay consistent across sessions.
 */

export const CHART_PALETTE = [
    'rgba(225, 29, 72, 0.88)',
    'rgba(59, 130, 246, 0.88)',
    'rgba(16, 185, 129, 0.88)',
    'rgba(245, 158, 11, 0.88)',
    'rgba(168, 85, 247, 0.88)',
    'rgba(236, 72, 153, 0.88)',
    'rgba(14, 165, 233, 0.88)',
    'rgba(34, 197, 94, 0.88)',
    'rgba(234, 179, 8, 0.88)',
    'rgba(249, 115, 22, 0.88)',
    'rgba(99, 102, 241, 0.88)',
    'rgba(20, 184, 166, 0.88)',
    'rgba(244, 63, 94, 0.88)',
    'rgba(56, 189, 248, 0.88)',
    'rgba(163, 230, 53, 0.88)',
];

function hslaFromString(seed: string, s = 68, l = 54): string {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (h << 5) - h + seed.charCodeAt(i);
        h |= 0;
    }
    const hue = Math.abs(h) % 360;
    return `hsla(${hue}, ${s}%, ${l}%, 0.88)`;
}

/** Stable color per vehicle type; prefers order from settings.vehicleTypes. */
export function getVehicleTypeColor(typeLabel: string, preferredOrder: string[]): string {
    const idx = preferredOrder.indexOf(typeLabel);
    if (idx !== -1) {
        return CHART_PALETTE[idx % CHART_PALETTE.length];
    }
    return hslaFromString(`vt:${typeLabel}`);
}

/** Distinct color per brand (many possible values — hash-based hue). */
export function getBrandColor(brandLabel: string): string {
    return hslaFromString(`brand:${brandLabel}`, 65, 52);
}

/** Sort type keys: settings order first, then remaining A–Z. */
export function sortTypeLabels(labels: string[], preferredOrder: string[]): string[] {
    const order = preferredOrder || [];
    return [...labels].sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });
}
