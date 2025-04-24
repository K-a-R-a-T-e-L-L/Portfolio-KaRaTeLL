import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") {
            return defaultValue;
        }

        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
        } catch (error) {
            console.error("Error getting data from localStorage:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                if (state === null || state === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(state));
                }
            } catch (error) {
                console.error("Error setting data to localStorage:", error);
            }
        }
    }, [state, key]);

    return [state, setState] as const;
};
