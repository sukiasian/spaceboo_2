import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UrlPathname } from '../types/types';
import { isMobile } from '../utils/utilFunctions';
import AltButton, { IAltButtonProps } from './AltButton';

interface ISliderProps {
    sliderIntervalRef: React.MutableRefObject<NodeJS.Timeout>;
}
interface ISlideButton extends IAltButtonProps {
    to: UrlPathname;
    handleClick?: (...props: any) => any;
}

type TSlide = {
    imageUrl: string;
    message: string;
    buttons: ISlideButton[];
};

// TODO:  проблему с мерцанием при открытии вкладки со spaceboo после других вкладок
// вероятно можно решить если установить слушатель событий который при
// смене вкладки удалит все интервалы и наоборот
/* 
document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    console.log("tab is active") -- добавить интервал (начать все заново)
  } else {
    console.log("tab is inactive") -- удалить интервал
  }
});
*/
export default function Slider(props: ISliderProps): JSX.Element | null {
    const buttonToHowItWorks: ISlideButton = {
        to: UrlPathname.HOW_IT_WORKS,
        buttonText: 'Узнать больше',
    };
    const [slides] = useState<TSlide[]>([
        {
            imageUrl: 'doors.jpeg',
            message: 'Доверьтесь Spaceboo - он автоматически возьмет на себя заселение гостей и уборку.',
            buttons: [
                buttonToHowItWorks,
                {
                    to: UrlPathname.PROVIDE_SPACE,
                    buttonText: 'Подключиться к системе',
                },
            ],
        },
        {
            imageUrl: 'flats.jpg',
            message:
                'Заселяйтесь в жилье в любое время, не дожидаясь, пока вам привезут ключи. Бесконтактно. Безопасно.',
            buttons: [
                buttonToHowItWorks,
                {
                    to: UrlPathname.PROVIDE_SPACE,
                    buttonText: 'Найти жилье',
                },
            ],
        },
    ]);

    const [indexOfActiveImage, setIndexOfActiveImage] = useState<number>(0);
    const [sliderIntervalIsOn, setSliderIntervalIsOn] = useState(false);
    const sliderImageRef = useRef<HTMLDivElement>(null);
    const sliderImageContentMessageRef = useRef<HTMLDivElement>(null);
    const sliderIntervalRef = useRef<NodeJS.Timeout>();
    const opacityChangeRef = useRef<NodeJS.Timeout>();
    const applyEffectsOnInit = (): (() => void) => {
        if (!sliderIntervalIsOn && slides.length !== 1) {
            sliderIntervalRef.current = setInterval(() => {
                setIndexOfActiveImage((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 14000);

            setSliderIntervalIsOn(true);
        }

        return (): void => {
            clearInterval(sliderIntervalRef.current!);
            clearInterval(opacityChangeRef.current!);
        };
    };

    const changeSliderImage = (): void => {
        if (sliderImageRef.current && opacityChangeRef.current && sliderImageRef && sliderImageContentMessageRef) {
            sliderImageRef.current!.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/slider/${slides[indexOfActiveImage].imageUrl}')`;
            sliderImageRef.current!.style.backgroundColor = 'rgba(96, 96, 96, 0.5)';
            sliderImageRef.current!.style.height = '400px';

            let opacity = 0.5;

            opacityChangeRef.current = setInterval(() => {
                if (opacity < 1) {
                    opacity += 0.001;
                    sliderImageRef.current!.style.opacity = `${opacity}`;
                    sliderImageContentMessageRef.current!.style.opacity = `${opacity}`;
                } else {
                    clearInterval(opacityChangeRef.current!);
                }
            }, 0);
        }
    };
    const handleSliderImageFromMoveStatusBarOnClick = (i: number): (() => void) => {
        return (): void => {
            if (i !== indexOfActiveImage) {
                clearInterval(opacityChangeRef.current!);
                clearInterval(sliderIntervalRef.current!);
                sliderIntervalRef.current = setInterval(() => {
                    setIndexOfActiveImage((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
                }, 15000);

                setIndexOfActiveImage(i);
            }
        };
    };
    const defineSliderActiveImageClassName = (indexOfSlide: number) => {
        if (indexOfSlide === indexOfActiveImage) {
            return 'slider__move-status__active';
        }

        return '';
    };
    const renderSliderMoveStatusBar = (): JSX.Element => {
        const statusBar = slides.map((slide: TSlide, i: number) => {
            return (
                <div
                    className={`slider__move-status-bar-elem slider__move-status-bar__elem--${i} ${defineSliderActiveImageClassName(
                        i
                    )}`}
                    onClick={handleSliderImageFromMoveStatusBarOnClick(i)}
                    key={i}
                ></div>
            );
        });

        return (
            <div className="slider__move-status-bar" style={{ display: 'flex', flexDirection: 'row' }}>
                {statusBar}
            </div>
        );
    };
    const renderSlideContent = (): JSX.Element | void => {
        const buttons = slides[indexOfActiveImage].buttons.map((button: ISlideButton, i: number) => {
            return (
                <NavLink to={button.to} key={i}>
                    <AltButton
                        buttonText={button.buttonText}
                        additionalClassNames={`slider__image__content__button slider__image__content__button--${i}`}
                    />
                </NavLink>
            );
        });

        return (
            <div className="slider__image__content">
                <h2
                    className="heading heading--secondary slider__text heading heading--primary"
                    ref={sliderImageContentMessageRef}
                >
                    {slides[indexOfActiveImage].message}
                </h2>
                <div className="slider__image__content__buttons">{buttons}</div>
                {renderSliderMoveStatusBar()}
            </div>
        );
    };

    // useEffect(applyEffectsOnInit, []);
    // useEffect(changeSliderImage, [indexOfActiveImage]);

    // return !isMobile() ? (
    //     <section className="slider-section">
    //         <div className="slider">
    //             <div className="slider__image" ref={sliderImageRef}>
    //                 {renderSlideContent() as JSX.Element}
    //             </div>
    //         </div>
    //     </section>
    // ) : null;
    return null;
}
