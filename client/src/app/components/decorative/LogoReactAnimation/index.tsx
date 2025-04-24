import React from 'react';
import style from './styles.module.scss';

interface LogoReactAnimationProps {
    styles: [
        {
            width: string,
            height: string
        },
        {
            border: string
        }
    ]
};

const LogoReactAnimation: React.FC<LogoReactAnimationProps> = ({ styles }) => {
    return (
        <div className={style.logo} style={{ width: styles[0].width, height: styles[0].height }}>
            <div style={{ border: styles[1].border }} className={style.logo__axis_one}></div>
            <div style={{ border: styles[1].border }} className={style.logo__axis_two}></div>
            <div style={{ border: styles[1].border }} className={style.logo__axis_three}></div>
            <div className={style.logo__center}></div>
        </div>
    );
};

export default LogoReactAnimation;