import { useSyncExternalStore } from "react";

/** True when a CSS media query matches, e.g. useMedia("(pointer: fine)") */
export function useMedia(query: string) {
    return useSyncExternalStore(
        (onChange) => {
            const mq = window.matchMedia(query);
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

/** True when the visitor turned on their browser's data saver */
export function useSaveData() {
    return useSyncExternalStore(
        () => () => { },
        () => {
            const nav = navigator as Navigator & {
                connection?: { saveData?: boolean };
            };
            return nav.connection?.saveData === true;
        },
        () => false,
    );
}