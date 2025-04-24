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
import { CustomError, TokenDecodeType, WarnInputsType } from '@/types.global';
import { GetServerSidePropsContext } from 'next';

const Form = ({ token }: { token: string }) => {

    const [InsetShadowAvatar, setInsetShadowAvatar] = useState<number>(20);
    const { TokenCookie, updateTokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    const { setToken, TokenDecode, setTokenDecode, Loading, setLoading, MessageError, setMessageError } = useTokenValid(TokenCookie ? TokenCookie : token || '', deleteTokenCookie);
    const [Login, setLogin] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [WarnInputs, setWarnInputs] = useState<WarnInputsType>({ login: '', password: '' });
    const RefAvatar = useRef<HTMLDivElement>(null);
    const RefInputL = useRef<HTMLInputElement>(null);
    const RefInputP = useRef<HTMLInputElement>(null);

    const handleValueInput = (e: ChangeEvent<HTMLInputElement>, set: (value: string) => void) => {
        set(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (Login === '' || Login.length < 3 || Login.length > 150) {
            setWarnInputs((prevState) => {
                const newPrevState = { ...prevState };
                newPrevState.login = 'Введите от 3 до 150 символов !!!';
                return newPrevState;
            });
            setLoading(false);
            return;
        };

        if (Password === '' || Password.length < 8 || Password.length > 50) {
            setWarnInputs((prevState) => {
                const newPrevState = { ...prevState };
                newPrevState.password = 'Введите от 8 до 50 символов !!!';
                return newPrevState;
            });
            setLoading(false);
            return;
        };

        try {
            setWarnInputs({ login: '', password: '' });
            setLogin('');
            setPassword('');
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/auth/login`, { login: Login, password: Password })
            const accessToken = res.data.access_token;
            if (accessToken) {
                try {
                    const decodedToken: TokenDecodeType = jwtDecode(accessToken);
                    setTokenDecode(decodedToken);
                    if (decodedToken.exp > Date.now() / 1000) {
                        if (decodedToken.role !== process.env.NEXT_PUBLIC_ROLE) { setMessageError('Вы не являетесь владельцем!!!'); return; }
                        updateTokenCookie(accessToken);
                        setMessageError('');
                        window.location.href = '/';
                    }
                    else {
                        deleteTokenCookie();
                        setMessageError('Истёк срок сессии!!!');
                    };
                } catch (error) {
                    deleteTokenCookie();
                    setTokenDecode(null);
                    setMessageError('Ошибка валидации сессии!!!');
                    console.log(error);
                };
            }
            else {
                deleteTokenCookie();
                setTokenDecode(null);
                setMessageError('Ошибка получения сессии!!!');
            };
        }
        catch (error: unknown) {
            deleteTokenCookie();
            console.error(error);
            if (error instanceof Error) {
                const customError = error as CustomError;
                if (customError.status) {
                    switch (customError.status) {
                        case 401:
                            setMessageError('Неправильный логин или пароль!!!');
                            break;
                        case 400:
                            setMessageError('Отправляемые данные не соответствуют по кол-ву символов!!!');
                            break;
                        default:
                            setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                            break;
                    };
                }
                else { console.log("Error:", customError) };
            }
            else { console.log("Error:", error) };
        }
        finally {
            setLoading(false);
        };
    };

    const handleRemoveReadOnly = () => {
        const ArrayRef = [RefInputL.current, RefInputP.current];
        ArrayRef.map((el) => {
            if (!el) return;
            el.removeAttribute('readOnly');
        });
    };

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
                                <h1 className={style.form__h1}>Вы успешно вошли в аккаунт</h1>
                            ) : (
                                <>
                                    <div className={style.form__div_input}>
                                        <input
                                            ref={RefInputL}
                                            className={style.div_input__input}
                                            type="text"
                                            minLength={3}
                                            maxLength={150}
                                            readOnly
                                            onFocus={handleRemoveReadOnly}
                                            placeholder='LOGIN'
                                            autoComplete="off"
                                            onChange={(e) => handleValueInput(e, setLogin)}
                                        />
                                        {WarnInputs.login !== '' && (<strong className={style.strong}>{WarnInputs.login}</strong>)}
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