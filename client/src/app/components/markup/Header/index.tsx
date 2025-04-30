import React, { useCallback, useEffect, useState } from 'react';
import style from './styles.module.scss';
import { useGetSizingWindow } from '@/hooks/useGetSizingWindow/useGetSizingWindow';
import LogoReactAnimation from '../../decorative/LogoReactAnimation';

interface HeaderProps {
    CurrentComponent: string,
    setCurrentComponent: (value: string) => void,
    StateBurgerMenu: boolean,
    setStateBurgerMenu: (value: boolean) => void
};

const Header: React.FC<HeaderProps> = ({ CurrentComponent, setCurrentComponent, StateBurgerMenu, setStateBurgerMenu }) => {

    const [WidthWindow, HeightWindow] = useGetSizingWindow();
    const [BurgerMenu, setBurgerMenu] = useState<boolean>(false);
    const [HeightListLink, setHeightListLink] = useState('');

    const ArrayLinks = [
        { en: 'About', ru: 'Обо мне' },
        { en: 'Skills', ru: 'Навыки' },
        { en: 'Projects', ru: 'Проекты' },
        { en: 'Contacts', ru: 'Контакты' },
        // { en: 'Resume', ru: 'Резюме' },
    ];

    const handleCurrentComponent = useCallback((value: string) => {
        if (StateBurgerMenu) {
            setCurrentComponent(value);
            setStateBurgerMenu(!StateBurgerMenu);
        }
        else {
            setCurrentComponent(value);
        };
    }, [setCurrentComponent, setStateBurgerMenu, StateBurgerMenu]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLLIElement>, value: string) => {
            if (event.key === 'Enter') {
                handleCurrentComponent(value);
            }
        },
        [handleCurrentComponent]
    );

    useEffect(() => {
        if (StateBurgerMenu) {
            setBurgerMenu(true);
            setTimeout(() => { setHeightListLink('100%') }, 1350)
        }
        else {
            setHeightListLink('200px');
            setTimeout(() => { setBurgerMenu(false) }, 1400);
        };
    }, [StateBurgerMenu]);

    useEffect(() => {
        if(WidthWindow > 600 && StateBurgerMenu === true) setStateBurgerMenu(false);
    }, [WidthWindow, setStateBurgerMenu, StateBurgerMenu]);

    return (
        <>
            <header className={style.header}>
                {WidthWindow > 600 ? (
                    <nav className={style.header__nav}>
                        <ul className={style.nav__ul}>
                            {ArrayLinks.map((el, i) => {
                                return (
                                    <li
                                        key={i}
                                        data-interactive="true"
                                        id={`li-${el.en}`}
                                        style={CurrentComponent === el.en ? { color: 'aqua', opacity: 1 } : {}}
                                        tabIndex={0}
                                        onClick={() => handleCurrentComponent(el.en)}
                                        onKeyDown={(e) => handleKeyDown(e, el.en)}
                                        className={style.ul__li}
                                    >
                                        {CurrentComponent === el.en && (<LogoReactAnimation styles={[{ width: '20px', height: '20px', }, { border: '2px  solid aqua' }]} />)}
                                        {el.ru}
                                    </li>
                                )
                            })}
                        </ul >
                    </nav >
                ) : (
                    <button data-interactive="true" className={style.header__button_burger_menu} onClick={() => setStateBurgerMenu(!StateBurgerMenu)}></button>
                )}
            </header >
            {BurgerMenu && (
                <nav className={!StateBurgerMenu ? style.nav_burger_menu_hiding : style.nav_burger_menu_appereance} style={{ width: WidthWindow, height: `calc(${HeightWindow}px - 60px)` }}>
                    <ul className={!StateBurgerMenu ? style.nav_burger_menu__ul_hiding : style.nav_burger_menu__ul_appereance} style={{ height: HeightListLink }}>
                        {ArrayLinks.map((el, i) => {
                            return (
                                <li
                                    key={i}
                                    data-interactive="true"
                                    id={`li-${el.en}`}
                                    style={CurrentComponent === el.en ? { color: 'aqua', opacity: 1 } : {}}
                                    tabIndex={0}
                                    onClick={() => handleCurrentComponent(el.en)}
                                    onKeyDown={(e) => handleKeyDown(e, el.en)}
                                    className={style.ul__li}
                                >
                                    {CurrentComponent === el.en && (<LogoReactAnimation styles={[{ width: '20px', height: '20px', }, { border: '2px  solid aqua' }]} />)}
                                    {el.ru}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            )}
        </>
    );
};

export default Header;
