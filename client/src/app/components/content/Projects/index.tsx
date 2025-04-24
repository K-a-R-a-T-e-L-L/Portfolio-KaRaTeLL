import style from './styles.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import LoadingCirle from '../../decorative/LoadingCirle/LoadingCirle';
import useCookie from '@/hooks/useCookie/useCookie';
import axios from 'axios';
import ProjectCard from '../../markup/ProjectCard';
import MessageErrorBlock from '../../decorative/MessageErrorBlock';

type ProjectType = {
    id: number,
    name: string,
    link: string,
    description: string,
    positioningIcon: {
        x: number,
        y: number
    }[],
    color: string,
    URLImages: {
        img: string[],
        icon: string[]
    },
    skills: string[],
    view: boolean[],
}

type ArrayProjectsType = ProjectType[];

const Projects = () => {
    const {TokenCookie, deleteTokenCookie} = useCookie('token', '', '/', 600);
    const { setToken, TokenDecode, setLoading, setMessageError, Loading, MessageError } = useTokenValid(TokenCookie || '', deleteTokenCookie);
    const [ArrayProjects, setArrayProjects] = useState<ArrayProjectsType>([]);

    const handleGettingProjects = () => {
            setLoading(true);
            axios.get(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/projects/getProjects`)
                .then((res) => {
                    setArrayProjects(res.data);                    
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
    };

    useEffect(() => {
        handleGettingProjects();
         // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (TokenCookie) {
            setToken(TokenCookie);
        };
    }, [TokenCookie, setToken]);

    return (
        <>
            {Loading ? (
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}><LoadingCirle size='7' /></div>
            ) : (
                <article className={style.article} style={Loading ? { paddingTop: '30px' } : {}}>
                    {TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE && (
                        <div className={style.article__add_projects}>
                            <Link href={`/adding/project`} className={style.add_projects__link} data-interactive="true">Добавить проект +</Link>
                        </div>
                    )}
                    {ArrayProjects.length > 0 ? ArrayProjects.map((el) => (
                        <ProjectCard data={el} key={el.id} />
                    )) : (
                        <><h1>Проекты отсутствуют!</h1></>
                    )}
                </article>
            )}
            {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
        </>
    );
};

export default Projects;