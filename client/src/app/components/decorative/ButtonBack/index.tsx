import { useRouter } from 'next/router';
import style from './styles.module.scss';

const ButtonBack = () => {

    const Router = useRouter();

    return (
        <> <button className={style.button_back} onClick={() => Router.back()} data-interactive="true">Назад</button></>
    );
};

export default ButtonBack;