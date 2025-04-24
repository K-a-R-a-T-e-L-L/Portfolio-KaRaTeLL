import Image from 'next/image';
import style from './styles.module.scss';
import { usePrintingTextAnimation } from '@/hooks/usePrintingTextAnimation/usePrintingTextAnimation';

const WelcomeForm = () => {

    const Text = [
        'Приветствую, меня зовут Кирилл. \n',
        'Я являюсь undefined веб-разработчиком'
    ];

    const [AnimationText, Finish] = usePrintingTextAnimation(Text, 80, 'undefined');

    return (
        <>
            <section className={style.section}>
                <div className={style.section__image_div}>
                    <Image className={style.image_div__img} sizes='100%' src="/images/dj.png" blurDataURL="/images/djMini.png" alt='Main fhoto' fill priority />
                </div>
                <div className={style.section__info_div}>
                    <h1 className={style.info_div__h1}>
                        {AnimationText}
                        <span className={Finish ? style.h1__printing_pointer_active : style.h1__printing_pointer}> |</span>
                    </h1>
                </div>
            </section>
        </>
    );
};

export default WelcomeForm;