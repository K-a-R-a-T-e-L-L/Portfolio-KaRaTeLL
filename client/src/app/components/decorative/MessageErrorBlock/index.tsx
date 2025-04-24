import React from 'react';
import style from './styles.module.scss';

interface MessageErrorBlockProps {
    MessageError: string,
    setMessageError: (value: string) => void
}

const MessageErrorBlock: React.FC<MessageErrorBlockProps> = ({ MessageError, setMessageError }) => {
    return (
        <>
            <div className={style.error}>
                <p className={style.error__message}>{MessageError}</p>
                <button className={style.error__close} onClick={() => setMessageError('')} data-interactive="true">✕</button>
            </div>
        </>
    );
};

export default MessageErrorBlock;