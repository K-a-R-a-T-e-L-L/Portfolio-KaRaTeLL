import { useEffect, useState } from 'react';
import style from './styles.module.scss';
import Image from 'next/image';
import { useGetSizingWindow } from '@/hooks/useGetSizingWindow/useGetSizingWindow';

type ArrayImagesType = {
    view: boolean,
    shift: number,
    path: string
};

interface SliderCarouselProps {
    imagesCarousel: ArrayImagesType[];
    color: string;
};

const SliderCarousel: React.FC<SliderCarouselProps> = ({ imagesCarousel, color }) => {

    const [ArrayImages, setArrayImages] = useState<ArrayImagesType[]>(imagesCarousel);
    const ServerURL = `${process.env.NEXT_PUBLIC_URL_SERVER}/uploads/`;
    const [WidthWindow] = useGetSizingWindow();
    const [WidthImgView, setWidthImgView] = useState(WidthWindow >= 1200 ? 400 : (WidthWindow > 650 ? 320 : (WidthWindow < 450 ? 190 : 240)));
    const [ImgStateView, setImgStateView] = useState<boolean>(false);

    const handleBlockShift = (index: number) => {
        setArrayImages((prevState) => {
            const newArray = [...prevState];
            const currentViewIndex = newArray.findIndex((el) => el.view === true);

            if (index > currentViewIndex) {
                newArray.filter((el, i) => {
                    if (i === index) {
                        el.view = true;
                        el.shift -= WidthImgView;
                    }
                    else {
                        el.view = false;
                        el.shift -= WidthImgView;
                    };
                });
            }
            else if (index < currentViewIndex) {
                newArray.filter((el, i) => {
                    if (i === index) {
                        el.view = true;
                        el.shift += WidthImgView;
                    }
                    else {
                        el.view = false;
                        el.shift += WidthImgView;
                    };
                });
            }
            else {
                return newArray;
            };
            return newArray;
        });
    };

    useEffect(() => {
        const middleElementIndex = Math.floor(ArrayImages.length / 2);
        setArrayImages((prevState) => {
            const newArray = [...prevState];
            newArray.map((el) => {
                el.view = false;
                el.shift = -WidthImgView * middleElementIndex;
            });
            newArray[middleElementIndex].view = true;
            return newArray;
        });
    }, [WidthImgView, ArrayImages?.length]);

    useEffect(() => {
        setWidthImgView(WidthWindow >= 1200 ? 400 : (WidthWindow > 650 ? 320 : (WidthWindow < 450 ? 190 : 240)));
    }, [WidthWindow]);

    return (
        <>
            <section className={style.slider}>
                <div className={style.slider__window}>
                    {ArrayImages.map((el, i) => {
                        return (
                            <div
                                className={ImgStateView && el.view ? `${style.window__img} ${style.window__img_full}` : `${style.window__img}`}
                                onClick={() => handleBlockShift(i)}
                                key={i}
                                data-interactive={`${el.view ? 'false' : 'true'}`}
                                style={{ transform: `translateX(${el.shift}px) ${!el.view ? 'scale(0.8)' : 'scale(1)'}`, cursor: `${!el.view ? 'pointer' : 'default'}`, opacity: `${!el.view ? '0.8' : '1'}`, border: `1px solid ${`rgba(${color}, 0.4)`}` }}
                            >
                                <Image
                                    className={style.img__image}
                                    src={`${ServerURL}${el.path}`}
                                    alt='Image'
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 33%"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                                {el.view && (<button data-interactive="true" className={ImgStateView ? style.image__button_close : style.image__button_open} onClick={() => setImgStateView(!ImgStateView)}></button>)}
                                {el.view && !ImgStateView && (
                                    <>
                                        {i === 0 ? null : (
                                            <button className={style.img__button_left} onClick={() => handleBlockShift(i--)} data-interactive="true">⟨</button>
                                        )}
                                        {i === ArrayImages.length - 1 ? null : (
                                            <button className={style.img__button_right} onClick={() => handleBlockShift(i++)} data-interactive="true">⟩</button>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
};

export default SliderCarousel;