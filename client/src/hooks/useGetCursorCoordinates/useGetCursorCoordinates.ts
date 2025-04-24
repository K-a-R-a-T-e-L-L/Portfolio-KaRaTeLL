import { useEffect, useState } from "react"

export const useGetCursorCoordinates = () => {
    const [X, setX] = useState<number>(-100);
    const [Y, setY] = useState<number>(-100);

    useEffect(() => {
        const handleCoordinates = (e: MouseEvent) => {
            setX(e.pageX);
            setY(e.pageY);
        };

        window.addEventListener('mousemove', handleCoordinates);

        return () => window.removeEventListener('mousemove', handleCoordinates);

    }, []);

    return [X, Y] as const;
};