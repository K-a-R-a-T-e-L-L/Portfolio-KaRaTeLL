'use client'
import { useEffect, useState } from "react";
import Header from "./components/markup/Header";
import SectionContent from "./components/markup/SectionContent";
import WelcomeForm from "./components/markup/WelcomeForm";
import "./globals.scss";
import CustomCursor from "./components/decorative/CustomCursor";
import Skeleton from "./components/markup/Skeleton";
import { useSessionStorage } from "../hooks/useSessionStorage/useSessionStorage";
import BackgroundMain from "./components/decorative/BackgroundMain";
import ButtonExit from "./components/decorative/ButtonExit";
import MessageErrorBlock from "./components/decorative/MessageErrorBlock";

export default function Home() {

  const [CurrentComponent, setCurrentComponent] = useSessionStorage('current-component', 'About');
  const [StateBurgerMenu, setStateBurgerMenu] = useState<boolean>(false);
  const [DisplayInsides, setDisplayInsides] = useState<boolean>(false);
  const [BackgroundUploaded, setBackgroundUploaded] = useState<HTMLCanvasElement | null>(null);
  const [MessageError, setMessageError] = useState<string>('');

  useEffect(() => {
    if (StateBurgerMenu) {
      setTimeout(() => { setDisplayInsides(true) }, 700);
    }
    else {
      setTimeout(() => { setDisplayInsides(false) }, 800);
    };
  }, [StateBurgerMenu]);

  useEffect(() => {
    const canvas = document.getElementsByTagName('canvas')[0];
    if (canvas) {
      setBackgroundUploaded(canvas);
      setMessageError('Если загрузка слишком долгая, прошу, дождитесь запуска сервера (до 1 мин)!!!');
    }
  }, []);

  useEffect(() => {
    if (MessageError !== '') {
      const timeout = setTimeout(() => { setMessageError('') }, 4000);
      return () => clearTimeout(timeout);
    };
  }, [MessageError]);

  return (
    <>
      <div className="div">
        <CustomCursor />
        <BackgroundMain />
        <ButtonExit />
        {BackgroundUploaded ? (
          <>
            <Header StateBurgerMenu={StateBurgerMenu} setStateBurgerMenu={setStateBurgerMenu} setCurrentComponent={setCurrentComponent} CurrentComponent={CurrentComponent} />
            {!DisplayInsides && (
              <main className="div__main">
                <WelcomeForm />
                <SectionContent currentComponent={CurrentComponent} />
                {MessageError && (<MessageErrorBlock setMessageError={setMessageError} MessageError={MessageError} />)}
              </main>
            )}
          </>
        ) : (
          <>
            <Skeleton />
          </>
        )}
      </div>
    </>
  );
};
