import { useState } from 'react';
import style from './styles.module.scss';
import Image from 'next/image';

const About = () => {

    const [ImgStateView, setImgStateView] = useState<boolean>(false);

    return (
        <>
            <article className={style.article}>
                <h2 className={style.article__h2}><span>Краткая информация обо мне</span></h2>
                <p className={style.article__p}>
                    Меня зовут Сухоруков Кирилл, я являюсь начинающим разработчиком клиентских частей для веб-приложений с опытом работы в этой сфере уже свыше 2-ух лет.<br />
                    Данное веб-приложение создано для того, чтобы визуально, структурированно и функционально отражать мои навыки в веб-разработке {'(как клиентской, так и серверной составляющих)'}. <br />
                    Мой путь {'(как и у многих)'} начался с прохождения курсов ориентированных на данную область, а затем все пошло своим чередом. <br />
                </p>
                <figure className={ImgStateView ? style.article__image_full : style.article__image}>
                    <Image src="/images/certificate.png" sizes="100%" placeholder="blur" blurDataURL="/images/certificateMini.png" alt='Certificate' fill priority style={{ objectFit: 'contain' }} />
                    <figcaption className={style.image__signature}>- Сертификат о прохождении курсов на js разработчика</figcaption>
                    <button data-interactive="true" className={ImgStateView ? style.image__button_close : style.image__button_open} onClick={() => setImgStateView(!ImgStateView)}></button>
                </figure>
            </article>
        </>
    );
};

export default About;