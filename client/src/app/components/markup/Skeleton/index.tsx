import style from './styles.module.scss';

const Skeleton = () => {

    return (
        <>
            <div className={style.skeleton}>
                <div className={style.skeleton__glare}></div>
                <div className={style.skeleton__header}>
                    <div className={style.header__nav}>
                        <div className={style.nav__ul}>
                            <div className={style.ul__li}></div>
                            <div className={style.ul__li}></div>
                            <div className={style.ul__li}></div>
                            <div className={style.ul__li}></div>
                            <div className={style.ul__li}></div>
                        </div>
                    </div>
                </div>
                <div className={style.skeleton__main}>
                    <div className={style.main__section_welcome}>
                        <div className={style.section_welcome__image}></div>
                        <div className={style.section_welcome__text}>
                            <div className={style.text__one}></div>
                            <div className={style.text__two}></div>
                        </div>
                    </div>
                    <div className={style.main__section_content}>
                        <div className={style.section_content__content}>
                            <div className={style.content__row_one}></div>
                            <div className={style.content__row_two}></div>
                        </div>
                        <div className={style.section_content__content}>
                            <div className={style.content__row_one}></div>
                            <div className={style.content__row_two}></div>
                        </div>
                        <div className={style.section_content__content}>
                            <div className={style.content__row_one}></div>
                            <div className={style.content__row_two}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Skeleton;