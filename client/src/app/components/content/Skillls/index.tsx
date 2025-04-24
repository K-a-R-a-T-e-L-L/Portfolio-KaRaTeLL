import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import style from './styles.module.scss';
import useCookie from '@/hooks/useCookie/useCookie';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import axios from 'axios';
import LoadingCirle from '../../decorative/LoadingCirle/LoadingCirle';
import MessageErrorBlock from '../../decorative/MessageErrorBlock';

const Skills = () => {

    const [ArraySkills, setArraySkills] = useState<{ id: number, value: string, active: boolean }[]>([]);
    const { TokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    const { setToken, Token, TokenDecode, setLoading, setMessageError, Loading, MessageError } = useTokenValid(TokenCookie || '', deleteTokenCookie);
    const [ValueSkill, setValueSkill] = useState<string>('');

    const handleAddingStack = (index: number, id: number) => {
        axios.put(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/skills/updateActive/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then((res) => {
                setArraySkills((prevState) => {
                    const newPrevState = [...prevState];
                    newPrevState[index] = res.data;
                    return newPrevState;
                });
            })
            .catch((error) => {
                console.error(error);
                if (axios.isAxiosError(error)) {
                    switch (error.response?.status) {
                        case 404:
                            setMessageError(`Навык с id: ${id} не был найден!!!`);
                            break;
                        case 401:
                            setMessageError('Доступ запрещён!!!');
                            break;
                        default:
                            setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                            break;
                    };
                }
            })
    };

    const handleDeleteSkill = (index: number, id: number) => {
        axios.delete(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/skills/deleteSkill/${id}`, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then(() => {
                setArraySkills((prevState) => prevState.filter((_, i) => i !== index));
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    switch (error.response?.status) {
                        case 401:
                            setMessageError('Доступ запрещён!!!');
                            break;
                        default:
                            setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                            break;
                    }
                }
            })
    };

    const handleValueSkill = (e: ChangeEvent<HTMLInputElement>) => {
        setValueSkill(e.target.value);
    };

    const handleSaveSkill = useCallback(() => {
        if (ValueSkill !== '') {
            axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/skills/addingSkill`, { value: ValueSkill, active: false }, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            })
                .then((res) => {
                    setArraySkills((prevState) => {
                        return [...prevState, res.data]
                    });
                    setValueSkill('');
                })
                .catch((error) => {
                    console.error(error);
                    if (axios.isAxiosError(error)) {
                        switch (error.response?.status) {
                            case 400:
                                setMessageError('Введите корректные данные!!!');
                                break;
                            case 401:
                                setMessageError('Доступ запрещён!!!');
                                break;
                            default:
                                setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                                break;
                        };
                    }
                })
        };
    }, [Token, ValueSkill, setMessageError]);

    const getRandomRGBColor = () => {
        const color = `${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}`;
        return color;
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/skills/getSkills`)
            .then((res) => {
                setArraySkills(res.data);
            })
            .catch((error) => {
                console.error(error);
                if (axios.isAxiosError(error)) {
                    switch (error.response?.status) {
                        default:
                            setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                            break;
                    };
                }
            })
            .finally(() => setLoading(false));
            // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (TokenCookie) {
            setToken(TokenCookie);
        };
    }, [TokenCookie, setToken]);

    useEffect(() => {
        const inputSkills = document.getElementById('new-skill');
        if (inputSkills) {
            const handleKeyPress = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    if (ValueSkill !== '') handleSaveSkill();
                };
            };

            inputSkills.addEventListener('keypress', handleKeyPress);

            return () => {
                inputSkills.removeEventListener('keypress', handleKeyPress);
            };
        };
    }, [handleSaveSkill, ValueSkill]);

    return (
        <>
            {Loading ? (
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}><LoadingCirle size='7' /></div>
            ) : (
                <article className={style.article}>
                    <div className={style.article__side_box}>
                        <h2 className={style.side_box__h2_one}>Навыки</h2>
                        <ul className={style.side_box__skills}>
                            {ArraySkills.length > 0 ? ArraySkills.map((el, i) => {
                                return (
                                    <li key={i} className={style.skills__skill} style={{ "--random-color": getRandomRGBColor(), "--delay": `${i / 7}s` } as React.CSSProperties}>
                                        {el.value}
                                        {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE && (
                                            <div className={style.skill__edit_box}>
                                                <input className={style.edit_box__checkbox} id={`checkbox-${i}`} checked={el.active} type="checkbox" data-interactive="true" onChange={() => handleAddingStack(i, el.id)} />
                                                <button className={style.edit_box__delete} data-interactive="true" onClick={() => handleDeleteSkill(i, el.id)}></button>
                                            </div>
                                        )}
                                    </li>
                                )
                            }) : (<p style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontSize: '10px' }}>Навыков не найдено!!!</p>)}
                            {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE && (
                                <div className={style.skills__adding_skill}>
                                    <input className={style.adding_skill__input} id='new-skill' type="text" placeholder='skill' value={ValueSkill} onChange={(e) => handleValueSkill(e)} />
                                    <button className={style.adding_skill__button} data-interactive="true" onClick={handleSaveSkill}></button>
                                </div>
                            )}
                        </ul>
                    </div>
                    <div className={style.article__side_box}>
                        <h2 className={style.side_box__h2_two}>Основной стэк</h2>
                        <div className={style.side_box__skills}>
                            {ArraySkills.length > 0 ? ArraySkills.map((el, i) =>
                                el.active && (
                                    <li key={i} className={style.skills__skill} style={{ "--random-color": getRandomRGBColor(), "--delay": `${i / 7}s` } as React.CSSProperties}>
                                        {el.value}
                                        {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE && (
                                            <div className={style.skill__edit_box}>
                                                <button className={`${style.edit_box__delete} ${style.edit_box__delete_two}`} data-interactive="true" onClick={() => handleAddingStack(i, el.id)}>✕</button>
                                            </div>
                                        )}
                                    </li>
                                )
                            ) : (<p style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontSize: '10px' }}>Навыков в стэке пока нет!!!</p>)}
                        </div>
                    </div>
                </article>
            )}
            {MessageError !== '' && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
        </>
    );
};

export default Skills;