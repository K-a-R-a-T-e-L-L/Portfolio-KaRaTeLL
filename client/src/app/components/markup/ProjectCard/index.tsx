import React, { useCallback, useEffect, useState } from 'react';
import style from './styles.module.scss';
// import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
    data: {
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
    },
    edit?: boolean
};

const ProjectCard: React.FC<ProjectCardProps> = ({ data, edit }) => {
    const [ArrayIconBackground, setArrayIconBackground] = useState<string[]>(['', '', '']);
    const [PreviewImg, setPreviewImg] = useState<string>('');
    const [TimeoutAppereance, setTimeoutAppereance] = useState<boolean>(false);
    const ServerURL = `${process.env.NEXT_PUBLIC_URL_SERVER}/uploads/`;

    const handleRelevantURLImages = useCallback(() => {
        if (data.URLImages.img.length > 0) setPreviewImg(data.URLImages.img[data.view.findIndex(el => el === true)]);
        switch (data.URLImages.icon.length) {
            case 0:
                setArrayIconBackground(['', '', '']);
                break;
            case 1:
                if (edit) setArrayIconBackground([`${data.URLImages.icon[0]}`, `${data.URLImages.icon[0]}`, `${data.URLImages.icon[0]}`]);
                else setArrayIconBackground([`${ServerURL}${data.URLImages.icon[0]}`, `${ServerURL}${data.URLImages.icon[0]}`, `${ServerURL}${data.URLImages.icon[0]}`]);
                break;
            case 2:
                if (edit) setArrayIconBackground([`${data.URLImages.icon[0]}`, `${data.URLImages.icon[1]}`, `${data.URLImages.icon[0]}`]);
                else setArrayIconBackground([`${ServerURL}${data.URLImages.icon[0]}`, `${ServerURL}${data.URLImages.icon[1]}`, `${ServerURL}${data.URLImages.icon[0]}`]);
                break;
            case 3:
                if (edit) setArrayIconBackground([`${data.URLImages.icon[0]}`, `${data.URLImages.icon[1]}`, `${data.URLImages.icon[2]}`]);
                else setArrayIconBackground([`${ServerURL}${data.URLImages.icon[0]}`, `${ServerURL}${data.URLImages.icon[1]}`, `${ServerURL}${data.URLImages.icon[2]}`]);
                break;
        };
    }, [ServerURL, data, edit]);

    useEffect(() => {
        handleRelevantURLImages();
    }, [data, handleRelevantURLImages]);

    useEffect(() => {
        if (data.URLImages.img && data.URLImages.img.length > 0 || edit) {
            const timeout = setTimeout(() => {
                setTimeoutAppereance(true);
            }, 1);

            return () => { clearTimeout(timeout) };
        };
    }, [data, edit]);

    return (
        <div className={style.project}>
            <Link href={edit ? '' : `/project/${data.id}`} style={{ width: edit ? '65%' : '90%' }} className={`${style.project_card} ${style.project_card_animation} `} data-interactive="true" tabIndex={0}>
                <div className={style.project_card__project} style={{ borderColor: `rgba(${data.color}, 0.3)` }} data-interactive="true">
                    <div className={style.project__preview}>
                        {TimeoutAppereance && (
                            // <Image
                            //     src={edit ? (data?.URLImages?.img?.length > 0 && PreviewImg ? PreviewImg : '/images/two.png') : (data?.URLImages?.img?.length > 0 ? `${ServerURL}${PreviewImg}?v=${Date.now()}` : '/images/two.png')}
                            //     alt='Image preview'
                            //     className={style.preview__image}
                            //     sizes='100%'
                            //     fill
                            // />
                            <img
                                src={edit ? (data?.URLImages?.img?.length > 0 && PreviewImg ? PreviewImg : '/images/two.png') : (data?.URLImages?.img?.length > 0 ? `${ServerURL}${PreviewImg}?v=${Date.now()}` : '/images/two.png')}
                                alt='Image'
                                className={style.preview__image}
                            />
                        )}
                    </div>
                    <div className={style.project__description}>
                        <h3 className={style.description__name}>{data.name}</h3>
                        <p className={style.description__description}>{data.description}</p>
                        {ArrayIconBackground.map((el, i) => {
                            return (
                                <div className={style.description__background_image} key={i} style={{ left: `${data.positioningIcon[i].x}%`, bottom: `${data.positioningIcon[i].y}%` }}>
                                    {edit ? (
                                        ArrayIconBackground[i] !== '' && (
                                            // <Image src={`${ArrayIconBackground[i]}?v=${Date.now()}`} alt='Icon' sizes='100%' fill style={{ filter: `drop-shadow(0 0 15px rgb(${data.color}))`, objectFit: 'contain' }} />
                                            <img
                                                src={`${ArrayIconBackground[i]}?v=${Date.now()}`}
                                                alt='Icon'
                                                style={{ filter: `drop-shadow(0 0 15px rgb(${data.color}))` }}
                                            />
                                        )
                                    ) : (
                                        el !== '' && (
                                            // <Image src={el} alt='Icon' sizes='100%' fill style={{ filter: `drop-shadow(0 0 15px rgb(${data.color}))`, objectFit: 'contain' }} />
                                            <img
                                                src={el}
                                                alt='Icon'
                                                style={{ filter: `drop-shadow(0 0 15px rgb(${data.color}))` }}
                                            />
                                        )
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className={style.project__box_stack}>
                        {data.skills.map((el, i) => {
                            if (i < 3) {
                                return (
                                    <div className={style.box_stack__el} key={i} style={{ borderColor: `rgb(${data.color}, 0.3)`, color: `rgba(${data.color}, 0.6)` }}>{el}</div>
                                )
                            }
                        })}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProjectCard;