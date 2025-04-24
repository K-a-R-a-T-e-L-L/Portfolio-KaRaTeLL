import { useCallback, useEffect, useState } from "react";

const useCookie = <T>(key: string, initialValue: T, path: string, lifeSpan: number) => {
    const [TokenCookie, setTokenCookie] = useState<T>(initialValue);

    useEffect(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${key}=`))
            ?.split("=")[1];
        if (cookieValue) {
            setTokenCookie(JSON.parse(cookieValue));
        }
    }, [key]);

    const recordCookie = useCallback((value: T) => {
        if (typeof window !== "undefined") {
            const stringValue = JSON.stringify(value);
            document.cookie = `${key}=${stringValue}; path=${path}; max-age=${lifeSpan}; secure; samesite=strict;`;
        };
    }, [key, lifeSpan, path]);

    const removeCookie = useCallback(() => {
        if (typeof window !== "undefined") {
            document.cookie = `${key}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        };
    }, [key, path]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (TokenCookie !== null && TokenCookie !== undefined && TokenCookie !== '') {
                recordCookie(TokenCookie);
            } else {
                removeCookie();
            }
        }
    }, [TokenCookie, key, path, lifeSpan, recordCookie, removeCookie]);

    const updateTokenCookie = (newValue: T) => {
        setTokenCookie(newValue);
    };

    const deleteTokenCookie = () => {
        setTokenCookie(null as T);
        removeCookie();
    };

    return {TokenCookie, updateTokenCookie, deleteTokenCookie};
};

export default useCookie;