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

const ProjectPage = () => {

    const Router = useRouter();
    const { id } = Router.query;
    const { TokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    const { setToken, Token, TokenDecode, setLoading, Loading, setMessageError, MessageError } = useTokenValid(TokenCookie || '', deleteTokenCookie);
    const [Project, setProject] = useState<ProjectType | null>(null);
    const [ArrayImages, setArrayImages] = useState<ArrayImagesType[] | null>(null);
    const [SuccessfullyDelete, setSuccessfullyDelete] = useState<string | null>(null);

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
                                    {ArrayImages && (<SliderCarousel imagesCarousel={ArrayImages} />)}
                                    <section className={style.project_div__info} style={{ "--color": Project.color } as React.CSSProperties}>
                                        <div className={style.info__side_div}>
                                            <h3 className={style.side_div__name}>{Project.name}</h3>
                                            <p className={style.side_div__description}>{Project.description}</p>
                                        </div>
                                        <div className={style.info__side_div}>
                                            <a className={style.side_div__link} href={Project.link} data-interactive="true">{Project.link}</a>
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
                            <button data-interactive="true" className={style.project_div__delete_project} onClick={() => handleDeleteProject(Project.id)}></button>
                        )}
                        {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
                    </div>
                </>
            )}
        </>
    );
};

export default ProjectPage;