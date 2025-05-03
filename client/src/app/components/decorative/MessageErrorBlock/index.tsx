import React, { useEffect, useState } from 'react';
import style from './styles.module.scss';

interface MessageErrorBlockProps {
    MessageError: string,
    setMessageError: (value: string) => void
}

const MessageErrorBlock: React.FC<MessageErrorBlockProps> = ({ MessageError, setMessageError }) => {

    const [Warn, setWarn] = useState<boolean>(false);
    const [Color, setColor] = useState<string>('255, 0, 0');

    useEffect(() => {
        if (MessageError === 'Если загрузка слишком долгая, прошу, дождитесь запуска сервера (до 1 мин)!!!') {
            setWarn(true);
        } else setWarn(false);
    }, [MessageError]);

    useEffect(() => {
        if (Warn) {
            setColor('255, 150, 0');
        } else setColor('255, 0, 0');
    }, [Warn]);

    return (
        <>
            <div className={style.error} style={{ '--color': Color } as React.CSSProperties}>
                <p className={style.error__message}>{MessageError}</p>
                <button className={style.error__close} onClick={() => setMessageError('')} data-interactive="true">✕</button>
            </div>
        </>
    );
};

export default MessageErrorBlock;