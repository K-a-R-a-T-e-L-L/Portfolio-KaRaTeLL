import style from './styles.module.scss';
import useCookie from '@/hooks/useCookie/useCookie';
import useTokenValid from '@/hooks/useTokenValid/useTokenValid';

const ButtonExit = () => {

    const {TokenCookie, deleteTokenCookie} = useCookie('token', '', '/', 600);
    const { Token } = useTokenValid(TokenCookie || '', deleteTokenCookie);

    return (
        <>
            {Token && (
                <button className={style.button_exit} onClick={() => { deleteTokenCookie(); window.location.reload() }} data-interactive="true">Выйти</button>
            )}
        </>
    );
};

export default ButtonExit;