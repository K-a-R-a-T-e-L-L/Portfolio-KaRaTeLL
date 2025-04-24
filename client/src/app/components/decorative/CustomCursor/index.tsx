import { useGetCursorCoordinates } from '@/hooks/useGetCursorCoordinates/useGetCursorCoordinates';
import style from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useGetSizingWindow } from '@/hooks/useGetSizingWindow/useGetSizingWindow';

const CustomCursor = () => {

    const [X, Y] = useGetCursorCoordinates();
    const [ObjectStylesCircle, setObjectStylesCircle] = useState<object>({ left: X, top: Y });    //position circle
    const [ObjectStylesCenter, setObjectStylesCenter] = useState<object>({ left: X, top: Y });    //position circle center
    const [StateCursorHover, setStateCursorHover] = useState<object>({});                         //styles circle center hover
    const [OpacityCircle, setOpacityCircle] = useState<object>({});                               //styles opacity circle
    const [WidthWindow, HeightWindow] = useGetSizingWindow();

    useEffect(() => {
        const handleDisplay = () => {
            if (X <= 0 || Y <= 0) {
                return 'none';
            }
            else if (X >= WidthWindow - 9 || Y >= HeightWindow - 9) {
                return 'none';
            }
            else {
                return 'block'
            };
        };

        const StylesCircle = {
            left: X - 10,
            top: Y - 10,
            display: handleDisplay(),
        };

        setObjectStylesCircle(Object.assign(StylesCircle, OpacityCircle));

        const StylesCenter = {
            left: X - 2,
            top: Y - 2,
            display: handleDisplay()
        };

        setObjectStylesCenter(Object.assign(StylesCenter, StateCursorHover));

        const ElemetsLi = document.querySelectorAll('[data-interactive]');

        for (let i = 0; i < ElemetsLi.length; i++) {
            (ElemetsLi[i] as HTMLElement).onmouseover = () => {
                if (ElemetsLi[i].getAttribute('data-interactive') === 'true') {
                    setStateCursorHover({
                        transform: 'scale(8)',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        boxShadow: '0 0 5px 2px rgba(0, 255, 255, 0.1)',
                    });
                    setOpacityCircle({ opacity: 0 });
                };
            };
            (ElemetsLi[i] as HTMLElement).onmouseout = () => {
                if (ElemetsLi[i].getAttribute('data-interactive') === 'true') {
                    setStateCursorHover({
                        backgroundColor: 'aqua',
                        boxShadow: '0 0 0 0 aqua',
                    });
                    setOpacityCircle({ opacity: 1 });
                };
            };
        };

    }, [X, Y, WidthWindow, HeightWindow, OpacityCircle, StateCursorHover]);

    return (
        <>
            <div className={style.custom_cursor} style={ObjectStylesCircle}></div>
            <div className={style.center} style={ObjectStylesCenter}></div>
        </>
    );
};

export default CustomCursor;