import { useEffect, useState } from "react";

export const useSessionStorage = <T>(Key: string, DefaultValue: T) => {
    const [State, setState] = useState<T>(DefaultValue);

    useEffect(() => {
        const getValueFromSessionStorage = (): T => {
            try {
                const storedValue = window.sessionStorage.getItem(Key);
                return storedValue ? JSON.parse(storedValue) : DefaultValue;
            }
            catch (error) {
                console.log(error);
                return DefaultValue;
            };
        };

        setState(() => getValueFromSessionStorage());

        return () => {
            try {
                window.sessionStorage.setItem(Key, JSON.stringify(State));
            } 
            catch (error) {
                console.log(error);
            };
        };
    }, [Key, DefaultValue, State]);

    useEffect(() => {
        try {
            window.sessionStorage.setItem(Key, JSON.stringify(State));
        } 
        catch (error) {
            console.log(error);
        };
    }, [State, Key]);

    return [State, setState] as const;
};