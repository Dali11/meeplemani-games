import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "mm-saved-events";
const listeners = new Set<() => void>();

function readRaw(): string {
    try {
        return localStorage.getItem(KEY) ?? "[]";
    } catch {
        return "[]";
    }
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    window.addEventListener("storage", callback);
    return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", callback);
    };
}

/** Which events the visitor has saved with the heart. Remembered in this browser only. */
export function useSavedEvents() {
    const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");

    const saved = useMemo<string[]>(() => {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [raw]);

    const toggle = useCallback(
        (slug: string) => {
            const next = saved.includes(slug)
                ? saved.filter((s) => s !== slug)
                : [...saved, slug];
            try {
                localStorage.setItem(KEY, JSON.stringify(next));
            } catch {
                // storage can be blocked; the heart just will not be remembered
            }
            listeners.forEach((l) => l());
        },
        [saved],
    );

    return { saved, toggle };
}

/** Whole days from now until an ISO date, or null on the server and for undated events */
export function useDaysUntil(iso: string | null) {
    return useSyncExternalStore(
        () => () => { },
        () =>
            iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000) : null,
        () => null,
    );
}