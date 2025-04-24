import React from 'react';
import style from './styles.module.scss';

interface MessageSuccessfullyBlockProps {
    successfullyMessage: string,
    buttonText: string,
    func: () => void
}

const MessageSuccessfullyBlock: React.FC<MessageSuccessfullyBlockProps> = ({ successfullyMessage, buttonText, func }) => {
    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateY(-50%) translateX(-50%)' }}>
            <h1 className={style.succesfully}>{successfullyMessage}!!!</h1>
            <button data-interactive="true" className={style.succesfully_button} onClick={func}>{buttonText}</button>
        </div>
    );
};

export default MessageSuccessfullyBlock;