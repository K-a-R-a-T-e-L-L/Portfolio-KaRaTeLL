import style from './styles.module.scss';
import React, { useCallback, useEffect, useState } from "react";
import SliderCarousel from "@/app/components/markup/SliderCarousel";
import CustomCursor from "@/app/components/decorative/CustomCursor";
import ButtonBack from '@/app/components/decorative/ButtonBack';
import ButtonExit from '@/app/components/decorative/ButtonExit';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import useCookie from '@/hooks/useCookie/useCookie';
import axios from 'axios';
import LoadingCirle from '@/app/components/decorative/LoadingCirle/LoadingCirle';
import { useRouter } from 'next/router';
import MessageErrorBlock from '@/app/components/decorative/MessageErrorBlock';
import MessageSuccessfullyBlock from '@/app/components/decorative/MessageSuccessfullyBlock';
import { ArrayImagesType, ProjectType } from '@/types.global';
import Link from 'next/link';

const ProjectPage = () => {

    const Router = useRouter();
    const { id } = Router.query;
    const { TokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    const { setToken, Token, TokenDecode, setLoading, Loading, setMessageError, MessageError } = useTokenValid(TokenCookie || '', deleteTokenCookie);
    const [Project, setProject] = useState<ProjectType | null>(null);
    const [ArrayImages, setArrayImages] = useState<ArrayImagesType[] | null>(null);
    const [SuccessfullyDelete, setSuccessfullyDelete] = useState<string | null>(null);
    const [ColorHSL, setColorHSL] = useState<number[]>([]);

    const handleGettingProject = useCallback(() => {
        setLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/projects/getProject/${id}`)
            .then((res) => {
                setProject(res.data);
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
            .finally(() => { setLoading(false); });
    }, [id, setLoading, setMessageError]);

    const handleDeleteProject = (id: number) => {
        setLoading(true);
        axios.delete(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/projects/deleteProject/${id}`, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then((res) => {
                if (res) setSuccessfullyDelete(`Проект ${Project?.name} успешно удален!`);
            })
            .catch((error) => {
                console.error(error);
                if (axios.isAxiosError(error)) {
                    switch (error.response?.status) {
                        case 401:
                            setMessageError('Доступ запрещен!!!');
                            break;
                        case 404:
                            setMessageError('Данного проекта не существует, вероятно он был уже удален!!!');
                            break;
                        default:
                            setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                            break;
                    };
                };
                setSuccessfullyDelete(null);
            })
            .finally(() => setLoading(false));
    };

    const handleBack = () => {
        window.location.href = '/';
    };

    useEffect(() => {
        if (SuccessfullyDelete) {
            const timeout = setTimeout(() => { handleBack(); }, 2000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [SuccessfullyDelete]);

    useEffect(() => {
        if (id) {
            handleGettingProject();
        };
    }, [id, handleGettingProject]);

    useEffect(() => {
        if (!Project?.color) return;
        const r = Number(Project?.color.split(',')[0]) / 255;
        const g = Number(Project?.color.split(',')[1]) / 255;
        const b = Number(Project?.color.split(',')[2]) / 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h: number = 0;
        let s: number = 0;
        const l: number = (max + min) / 2;

        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));
            if (max === r) {
                h = ((g - b) / delta) % 6;
            }
            else if (max == g) {
                h = (b - r) / delta + 2;
            }
            else {
                h = (r - g) / delta + 4;
            };
            h *= 60;
            if (h < 0) h += 360;
        };

        setColorHSL([h, s * 100, l * 100]);
    }, [Project?.color]);

    useEffect(() => {
        if (TokenCookie) {
            setToken(TokenCookie);
        }
    }, [TokenCookie, setToken]);

    useEffect(() => {
        if (Project) {
            const ArrayImages = [];
            for (let i = 0; i < Project.URLImages.img.length; i++) {
                const ObjectImage = {
                    view: Project.view[i],
                    shift: 0,
                    path: Project.URLImages.img[i]
                };
                ArrayImages.push(ObjectImage);
            }
            setArrayImages(ArrayImages);
        };
    }, [Project]);

    useEffect(() => {
        const bodyElement = document.body;
        if (bodyElement) {
            bodyElement.style.margin = '0';
        };
    }, []);

    useEffect(() => {
        const nextElement = document.getElementById('__next');
        if (nextElement) {
            nextElement.style.width = '100vw';
            nextElement.style.height = '100vh';
            nextElement.style.maxWidth = '1488px';
            nextElement.style.maxHeight = '740px';
        }
    }, []);

    if (!id) {
        return <div>Project not found</div>;
    };

    return (
        <>
            {Project && (
                <>
                    <div className={style.project_div}>
                        <CustomCursor />
                        <ButtonBack />
                        <ButtonExit />
                        {Loading ? (
                            <div className={style.project_div__loading}><LoadingCirle size='7' /></div>
                        ) : (
                            SuccessfullyDelete ? (
                                <MessageSuccessfullyBlock successfullyMessage={SuccessfullyDelete} buttonText={'Назад'} func={handleBack} />
                            ) : (
                                <>
                                    {ArrayImages && (<SliderCarousel imagesCarousel={ArrayImages} color={Project.color} />)}
                                    <section
                                        className={style.project_div__info}
                                        style={ColorHSL.length ? { "--color-h": ColorHSL[0], "--color-s": ColorHSL[1].toString() + '%', "--color-l": ColorHSL[2].toString() + '%', '--color-rgb': Project.color } as React.CSSProperties : { color: 'white' }}
                                    >
                                        <div className={style.info__side_div}>
                                            <h3 className={style.side_div__name}>{Project.name}</h3>
                                            <pre className={style.side_div__description}>{Project.description}</pre>
                                        </div>
                                        <div className={style.info__side_div}>
                                            <a className={style.side_div__link} href={Project.link} target='_blank' data-interactive="true">{Project.link}</a>
                                            <div className={style.side_div__stack}>
                                                {Project.skills.map((el, i) => {
                                                    return (
                                                        <div className={style.stack_el} key={i}>{el}</div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                </>
                            )
                        )}
                        {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE && !SuccessfullyDelete && (
                            <>
                                <button data-interactive="true" className={style.project_div__delete_project} onClick={() => handleDeleteProject(Project.id)}></button>
                                <Link href={`/edit/${Project.id}`} className={style.project_div__edit_project} data-interactive="true"></Link>
                            </>
                        )}
                        {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
                    </div>
                </>
            )}
        </>
    );
};

export default ProjectPage;