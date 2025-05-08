import { ChangeEvent, useEffect, useRef, useState } from 'react';
import style from './styles.module.scss';
import CustomCursor from '@/app/components/decorative/CustomCursor';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LoadingCirle from '@/app/components/decorative/LoadingCirle/LoadingCirle';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import ButtonExit from '@/app/components/decorative/ButtonExit';
import ButtonBack from '@/app/components/decorative/ButtonBack';
import useCookie from '@/hooks/useCookie/useCookie';
import MessageErrorBlock from '@/app/components/decorative/MessageErrorBlock';
import { CustomError, TokenDecodeType, WarnInputsTypeRegister } from '@/types.global';
import { GetServerSidePropsContext } from 'next';

const Form = ({ token }: { token: string }) => {

    const [InsetShadowAvatar, setInsetShadowAvatar] = useState<number>(20);
    const { TokenCookie, updateTokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    const { setToken, TokenDecode, setTokenDecode, Loading, setLoading, MessageError, setMessageError } = useTokenValid(TokenCookie ? TokenCookie : token || '', deleteTokenCookie);
    const [Email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [Number, setNumber] = useState<string>('');
    const [WarnInputs, setWarnInputs] = useState<WarnInputsTypeRegister>({ email: '',  number: '', password: ''});
    const RefAvatar = useRef<HTMLDivElement>(null);
    const RefInputE = useRef<HTMLInputElement>(null);
    const RefInputN = useRef<HTMLInputElement>(null);
    const RefInputP = useRef<HTMLInputElement>(null);
    const [LoadingTime, setLoadingTime] = useState<number>(0);

    const handleValueInput = (e: ChangeEvent<HTMLInputElement>, set: (value: string) => void) => {
        set(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        // if (Email === '' || Email.length < 7 || Email.length > 130) {
        //     setWarnInputs((prevState) => {
        //         const newPrevState = { ...prevState };
        //         newPrevState.email = 'Введите от 7 до 130 символов !!!';
        //         return newPrevState;
        //     });
        //     setLoading(false);
        //     return;
        // };

        // if (Number === '' || Number.length < 5 || Number.length > 20) {
        //     setWarnInputs((prevState) => {
        //         const newPrevState = { ...prevState };
        //         newPrevState.number = 'Введите от 5 до 20 символов !!!';
        //         return newPrevState;
        //     });
        //     setLoading(false);
        //     return;
        // };

        // if (Password === '' || Password.length < 8 || Password.length > 50) {
        //     setWarnInputs((prevState) => {
        //         const newPrevState = { ...prevState };
        //         newPrevState.password = 'Введите от 8 до 50 символов !!!';
        //         return newPrevState;
        //     });
        //     setLoading(false);
        //     return;
        // };

        // try {
        //     setWarnInputs({ email: '', number: '', password: '' });
        //     setEmail('');
        //     setNumber('');
        //     setPassword('');
        //     const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/auth/register`, { email: Email, number: Number, password: Password })
        //     const accessToken = res.data.access_token;
        //     if (accessToken) {
        //         try {
        //             const decodedToken: TokenDecodeType = jwtDecode(accessToken);
        //             setTokenDecode(decodedToken);
        //             if (decodedToken.exp > Date.now() / 1000) {
        //                 updateTokenCookie(accessToken);
        //                 setMessageError('');
        //                 window.location.href = '/';
        //             }
        //             else {
        //                 deleteTokenCookie();
        //                 setMessageError('Истёк срок сессии!!!');
        //             };
        //         } catch (error) {
        //             deleteTokenCookie();
        //             setTokenDecode(null);
        //             setMessageError('Ошибка валидации сессии!!!');
        //             console.log(error);
        //         };
        //     }
        //     else {
        //         deleteTokenCookie();
        //         setTokenDecode(null);
        //         setMessageError('Ошибка получения сессии!!!');
        //     };
        // }
        // catch (error: unknown) {
        //     deleteTokenCookie();
        //     console.error(error);
        //     if (error instanceof Error) {
        //         const customError = error as CustomError;
        //         if (customError.status) {
        //             switch (customError.status) {
        //                 case 400:
        //                     setMessageError('Отправляемые данные не соответствуют по кол-ву символов!!!');
        //                     break;
        //                 default:
        //                     setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
        //                     break;
        //             };
        //         }
        //         else { console.log("Error:", customError) };
        //     }
        //     else { console.log("Error:", error) };
        // }
        // finally {
        //     setLoading(false);
        // };
    };

    const handleRemoveReadOnly = () => {
        const ArrayRef = [RefInputE.current, RefInputN.current, RefInputP.current];
        ArrayRef.map((el) => {
            if (!el) return;
            el.removeAttribute('readOnly');
        });
    };

    useEffect(() => {
        if (Loading) {
            const interval = setInterval(() => {
                setLoadingTime((prevState) => prevState + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else (setLoadingTime(0));
    }, [Loading]);

    useEffect(() => {
        if (MessageError === '' && LoadingTime === 4) {
            setMessageError('Если загрузка слишком долгая, прошу, дождитесь запуска сервера (до 1 мин)!!!');
        };
    }, [LoadingTime, MessageError, setMessageError]);

    useEffect(() => {
        if (MessageError === 'Если загрузка слишком долгая, прошу, дождитесь запуска сервера (до 1 мин)!!!') {
            const timeout = setTimeout(() => { setMessageError('') }, 5000);
            return () => clearTimeout(timeout);
        };
    }, [MessageError, setMessageError]);

    useEffect(() => {
        if (TokenCookie) {
            setToken(TokenCookie);
        };
    }, [TokenCookie, setToken]);

    useEffect(() => {
        const handleResizeDiv = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setInsetShadowAvatar(Math.min(width, height) * 0.2);
            };
        };

        const refCurrent = RefAvatar.current as Element;

        const resizeObserver = new ResizeObserver(handleResizeDiv);
        resizeObserver.observe(refCurrent);
        return () => resizeObserver.unobserve(refCurrent);
    }, [RefAvatar]);

    useEffect(() => {
        const bodyDocument = document.body;
        if (bodyDocument) {
            bodyDocument.style.margin = "0";
        };
    }, []);

    return (
        <>
            <div className={style.div_secret_form}>
                <CustomCursor />
                <ButtonBack />
                <ButtonExit />
                <form className={style.div_secret_form__form} onSubmit={handleSubmit} autoComplete='off'>
                    <div className={style.form__avatar} ref={RefAvatar} style={{ boxShadow: `inset 0 0 ${InsetShadowAvatar}px ${InsetShadowAvatar}px black` }}></div>
                    {Loading ? (
                        <><LoadingCirle size={"8"} /></>
                    ) : (
                        <>
                            {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE ? (
                                <h1 className={style.form__h1}>Вы успешно зарегестрировали свой аккаунт ! {':)'}</h1>
                            ) : (
                                <>
                                    <div className={style.form__div_input}>
                                        <input
                                            ref={RefInputE}
                                            className={style.div_input__input}
                                            type="text"
                                            minLength={7}
                                            maxLength={130}
                                            readOnly
                                            onFocus={handleRemoveReadOnly}
                                            placeholder='EMAIL'
                                            autoComplete="off"
                                            onChange={(e) => handleValueInput(e, setEmail)}
                                        />
                                        {WarnInputs.email !== '' && (<strong className={style.strong}>{WarnInputs.email}</strong>)}
                                    </div>
                                    <div className={style.form__div_input}>
                                        <input
                                            ref={RefInputN}
                                            className={style.div_input__input}
                                            type="text"
                                            minLength={5}
                                            maxLength={20}
                                            readOnly
                                            onFocus={handleRemoveReadOnly}
                                            placeholder='NUMBER'
                                            autoComplete='off'
                                            onChange={(e) => handleValueInput(e, setNumber)}
                                        />
                                        {WarnInputs.number !== '' && (<strong className={style.strong}>{WarnInputs.number}</strong>)}
                                    </div>
                                    <div className={style.form__div_input}>
                                        <input
                                            ref={RefInputP}
                                            className={style.div_input__input}
                                            type="password"
                                            minLength={8}
                                            maxLength={50}
                                            readOnly
                                            onFocus={handleRemoveReadOnly}
                                            placeholder='PASSWORD'
                                            autoComplete='off'
                                            onChange={(e) => handleValueInput(e, setPassword)}
                                        />
                                        {WarnInputs.password !== '' && (<strong className={style.strong}>{WarnInputs.password}</strong>)}
                                    </div>
                                    <button className={style.form__button} data-interactive="true">LOGIN</button>
                                </>
                            )}
                        </>
                    )}
                </form>
                {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
            </div>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const token = context.req.cookies.token || '';

    return {
        props: {
            token,
        },
    };
};

export default Form;