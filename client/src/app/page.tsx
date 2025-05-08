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
import axios from "axios";

export default function Home() {

  const [CurrentComponent, setCurrentComponent] = useSessionStorage('current-component', 'About');
  const [StateBurgerMenu, setStateBurgerMenu] = useState<boolean>(false);
  const [DisplayInsides, setDisplayInsides] = useState<boolean>(false);
  const [BackgroundUploaded, setBackgroundUploaded] = useState<HTMLCanvasElement | null>(null);

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
    if (canvas) setBackgroundUploaded(canvas);
  }, []);


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/up/list`)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [CurrentComponent]);

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
