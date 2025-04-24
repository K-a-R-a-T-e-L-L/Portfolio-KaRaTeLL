import { useEffect, useState } from "react"

export const useGetSizingWindow = () => {

    const [WidthWindow, setWidthWindow] = useState<number>(0);
    const [HeightWindow, setHeightWindow] = useState<number>(0);

    useEffect(() => {

        const handleSizes = () => {
            setWidthWindow(window.innerWidth);
            setHeightWindow(window.innerHeight);
        };

        handleSizes();

        window.addEventListener('resize', handleSizes);

        return () => {
            window.removeEventListener('resize', handleSizes);
        };

    }, []);

    return [WidthWindow, HeightWindow] as const;
};