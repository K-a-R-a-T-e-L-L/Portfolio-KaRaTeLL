import React, { useEffect, useRef, useState } from 'react';
import style from './styles.module.scss';

const LoadingCirle: React.FC<{ size: string }> = ({ size }) => {
    const RefLoading = useRef<HTMLDivElement>(null);
    const [ShadowLoading, setShadowLoading] = useState<number>(0);

    useEffect(() => {
        const handleResizeLoading = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                setShadowLoading(width * 0.1);
            };
        };

        const refCurrent = RefLoading.current as Element;

        const resizeObserver = new ResizeObserver(handleResizeLoading);
        if (RefLoading.current) resizeObserver.observe(refCurrent);
        return () => {
            if (refCurrent) resizeObserver.unobserve(refCurrent);
        }
    }, [RefLoading]);

    return (
        <>
            <div className={style.loading} ref={RefLoading} style={{ width: `${size}vw`, '--shadow': `${ShadowLoading}px` } as React.CSSProperties}>
                <div className={style.loading__inside}>
                    <div className={style.inside__inside}></div>
                </div>
            </div>
        </>
    );
};

export default LoadingCirle;