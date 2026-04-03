import { type Vehicle } from '../types';

const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };

function startOfLocalDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Whole calendar days between two instants (local). */
function calendarDaysBetween(earlier: Date, later: Date): number {
    const a = startOfLocalDay(earlier).getTime();
    const b = startOfLocalDay(later).getTime();
    return Math.round((b - a) / 86400000);
}

type PostedRef = { at: Date; hasTime: boolean };

function getPostedReference(v: Pick<Vehicle, 'createdAt' | 'updatedAt' | 'date'>): PostedRef | null {
    if (v.createdAt) {
        const at = new Date(v.createdAt);
        if (!Number.isNaN(at.getTime())) return { at, hasTime: true };
    }
    if (v.updatedAt) {
        const at = new Date(v.updatedAt);
        if (!Number.isNaN(at.getTime())) return { at, hasTime: true };
    }
    if (v.date && /^\d{4}-\d{2}-\d{2}$/.test(v.date)) {
        const [y, m, d] = v.date.split('-').map(Number);
        return { at: new Date(y, m - 1, d, 12, 0, 0), hasTime: false };
    }
    if (v.date) {
        const at = new Date(v.date);
        if (!Number.isNaN(at.getTime())) return { at, hasTime: true };
    }
    return null;
}

/**
 * Human-readable listing time: hour/minute when we have a real timestamp;
 * otherwise day-based (today / N days ago / date).
 */
export function formatListingPosted(v: Pick<Vehicle, 'createdAt' | 'updatedAt' | 'date' | 'posted'>): string {
    const ref = getPostedReference(v);
    if (!ref) {
        const p = v.posted?.trim();
        return p || '—';
    }

    const { at, hasTime } = ref;
    const now = new Date();

    if (at.getTime() > now.getTime()) {
        return hasTime ? 'Just now' : 'Today';
    }

    const daysDiff = calendarDaysBetween(at, now);
    const diffMs = now.getTime() - at.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (hasTime) {
        if (daysDiff === 0) {
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} min ago`;
            return `Today · ${at.toLocaleTimeString(undefined, timeOpts)}`;
        }
        if (daysDiff === 1) {
            return `Yesterday · ${at.toLocaleTimeString(undefined, timeOpts)}`;
        }
        if (daysDiff < 7) {
            return `${daysDiff} days ago`;
        }
        return at.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: at.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    return at.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: at.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}
