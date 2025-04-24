import Image from 'next/image';
import style from './styles.module.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { usePrintingTextAnimation } from '@/hooks/usePrintingTextAnimation/usePrintingTextAnimation';
import axios, { isAxiosError } from 'axios';
import useCookie from '@/hooks/useCookie/useCookie';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import LoadingCirle from '../../decorative/LoadingCirle/LoadingCirle';
import MessageErrorBlock from '../../decorative/MessageErrorBlock';
import MessageSuccessfullyBlock from '../../decorative/MessageSuccessfullyBlock';
import { ArrayContactsType, InputsDataType } from './types';

const Contacts = () => {

    const {TokenCookie, deleteTokenCookie} = useCookie('token', '', '/', 600);
    const { setLoading, setMessageError, Loading, MessageError } = useTokenValid(TokenCookie || '', deleteTokenCookie);
    const [AnimationPlaceholderName] = usePrintingTextAnimation(['Ваше имя'], 100, 'null');
    const [AnimationPlaceholderContacts] = usePrintingTextAnimation(['Ваши контакты'], 100, 'null');
    const [AnimationPlaceholderMessage] = usePrintingTextAnimation(['Сообщение'], 100, 'null');
    const [ArrayContacts, setArrayContacts] = useState<ArrayContactsType>([
        { link: 'https://t.me/K_a_R_a_T_e_L_L', title: 'Telegram', display: false },
        { link: 'https://github.com/K-a-R-a-T-e-L-L', title: 'GitHub', display: false },
        { link: 'mailto:kirillcuhorukov6@gmail.com', title: 'Email', display: false },
        { link: 'https://wa.me/qr/TULX5ES7DG5HA1', title: 'Whatsapp', display: false },
    ]);
    const [ValuesInputs, setValuesInputs] = useState<InputsDataType>({ name: '', contacts: '', message: '' });
    const [WarnInputs, setWarnInputs] = useState<InputsDataType>({ name: '', contacts: '', message: '' });
    const [SuccessfullySendMessage, setSuccessfullySendMessage] = useState<string | null>(null);

    const handleValuesInputs = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        setValuesInputs((prevState) => {
            return { ...prevState, [key]: e.target.value }
        });
    };

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (ValuesInputs.name === '' || ValuesInputs.name.length < 3 || ValuesInputs.name.length > 150) {
            setWarnInputs((prevState) => {
                const newPrevState = { ...prevState };
                newPrevState.name = "Введите от 3 до 150 символов !!!";
                return newPrevState;
            });
            return;
        };
        if (ValuesInputs.contacts === '' || ValuesInputs.contacts.length < 5 || ValuesInputs.contacts.length > 150) {
            setWarnInputs((prevState) => {
                const newPrevState = { ...prevState };
                newPrevState.contacts = "Введите от 5 до 150 символов !!!";
                return newPrevState;
            });
            return;
        };
        if (ValuesInputs.message === '' || ValuesInputs.message.length < 10 || ValuesInputs.message.length > 1000) {
            setWarnInputs((prevState) => {
                const newPrevState = { ...prevState };
                newPrevState.message = "Введите от 10 до 1000 символов !!!";
                return newPrevState;
            });
            return;
        };
        
        setLoading(true);
        
        axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/message/send`, ValuesInputs)
            .then(() => {
                setWarnInputs({ name: '', contacts: '', message: '' });
                setValuesInputs({ name: '', contacts: '', message: '' });
                setMessageError("");
                setSuccessfullySendMessage('Сообщение успешно отправлено! Их можно отправлять не чаще чем раз в сутки) ');
            })
            .catch((error) => {
                console.error(error);
                if (isAxiosError(error)) {
                    switch (error.response?.status) {
                        case 409:
                            setMessageError('Сообщения нельзя отправлять чаще чем 1 раза в 24 часа!!!');
                            break;
                        case 400:
                            setMessageError('Отправляемые данные не соответствуют по кол-ву символов!!!');
                            break;
                        default:
                            setMessageError('Ошибка сервера при отправки сообщения!!!');
                            break;
                    }
                }
            })
            .finally(() => setLoading(false));
    };

    const handleCloseSuccessBlock = () => {
        setSuccessfullySendMessage(null);
        setValuesInputs({ name: '', contacts: '', message: '' });
    };

    useEffect(() => {
        const TimeoutId: NodeJS.Timeout[] = [];
        for (let i = 0; i < ArrayContacts.length; i++) {
            const timeout = setTimeout(() => {
                setArrayContacts(value => {
                    const updatedContacts = [...value];
                    updatedContacts[i].display = true;
                    return updatedContacts;
                })
            }, i * 400);
            TimeoutId.push(timeout);
        };

        return () => {
            TimeoutId.forEach(clearTimeout);
        };
    }, [ArrayContacts?.length]);

    useEffect(() => {
        if (SuccessfullySendMessage) {
            const timeout = setTimeout(() => {
                handleCloseSuccessBlock();
            }, 3000);

            return () => clearTimeout(timeout);
        };
    }, [SuccessfullySendMessage]);

    return (
        <>
            <article className={style.article}>
                <form className={style.article__form} onSubmit={(e) => handleSend(e)}>
                    {Loading ? (
                        <div className={style.form__loading}><LoadingCirle size='7' /></div>
                    ) : (
                        SuccessfullySendMessage ? (
                            <div className={style.form__success}><MessageSuccessfullyBlock successfullyMessage={SuccessfullySendMessage} buttonText='ОК' func={handleCloseSuccessBlock} /></div>
                        ) : (
                            <>
                                <div className={style.form__input}>
                                    <input
                                        className={style.input__input}
                                        minLength={3}
                                        maxLength={150}
                                        value={ValuesInputs.name}
                                        onChange={(e) => handleValuesInputs(e, 'name')}
                                        type="text"
                                        placeholder={AnimationPlaceholderName as string}
                                    />
                                    {WarnInputs.name !== '' && (<strong>{WarnInputs.name}</strong>)}
                                </div>
                                <div className={style.form__input}>
                                    <input
                                        className={style.input__input}
                                        minLength={5}
                                        maxLength={100}
                                        value={ValuesInputs.contacts}
                                        onChange={(e) => handleValuesInputs(e, 'contacts')}
                                        type="text"
                                        placeholder={AnimationPlaceholderContacts as string}
                                    />
                                    {WarnInputs.contacts !== '' && (<strong>{WarnInputs.contacts}</strong>)}
                                </div>
                                <div className={style.form__textarea}>
                                    <textarea
                                        className={style.textarea__textarea}
                                        minLength={10}
                                        maxLength={1000}
                                        value={ValuesInputs.message}
                                        onChange={(e) => handleValuesInputs(e, 'message')}
                                        name="" id=""
                                        placeholder={AnimationPlaceholderMessage as string}></
                                    textarea>
                                    {WarnInputs.message !== '' && (<strong>{WarnInputs.message}</strong>)}
                                </div>
                                <button className={style.form__button} data-interactive="true">Отправить</button>
                            </>
                        )
                    )}
                </form>
                <div className={style.article__div_contacts}>
                    {ArrayContacts.map((el, i) => {
                        if (el.display === true) return (
                            <a key={i} href={el.link} className={style.div_contacts__contact} target='_blank' rel='noopener noreferrer' data-interactive="true">
                                <div className={style.contact__top_box}>
                                    <div className={style.top_box__image}>
                                        <Image src={`/images/${el.title}.png`} alt={el.title} sizes='100%' fill priority style={{ objectFit: 'contain' }} />
                                    </div>
                                    <h3 className={style.top_box__name}>{el.title}</h3>
                                </div>
                                <span className={style.contact__link}>{el.link}</span>
                            </a>
                        )
                    })}
                </div>
                {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
            </article>
        </>
    );
};

export default Contacts;