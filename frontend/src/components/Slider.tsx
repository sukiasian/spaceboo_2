import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UrlPathnames } from '../types/types';
import AltButton, { IAltButtonProps } from './AltButton';

interface ISliderProps {
    sliderIntervalRef: React.MutableRefObject<NodeJS.Timeout>;
}
interface ISlideButton extends IAltButtonProps {
    to: UrlPathnames;
    handleClick?: (...props: any) => any;
}

type TSlide = {
    imageUrl: string;
    message: string;
    buttons: ISlideButton[];
};

export default function Slider(props: ISliderProps): JSX.Element {
    const buttonToHowItWorks: ISlideButton = {
        to: UrlPathnames.HOW_IT_WORKS,
        buttonText: 'Узнать больше',
    };
    const [slides] = useState<TSlide[]>([
        {
            imageUrl: 'doors.jpeg',
            message: 'Доверьтесь Spaceboo - он автоматически возьмет на себя заселение гостей и уборку.',
            buttons: [
                buttonToHowItWorks,
                {
                    to: UrlPathnames.PROVIDE_SPACE,
                    buttonText: 'Подключиться к системе',
                },
            ],
        },
        {
            imageUrl: '12.jpg',
            message:
                'Заселяйтесь в жилье в любое время, не дожидаясь, пока вам привезут ключи. Бесконтактно. Безопасно.',
            buttons: [
                buttonToHowItWorks,
                {
                    to: UrlPathnames.PROVIDE_SPACE,
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
        // NOTE возможно из за того что мы диспатчим в App-е мы получаем несколько ререндеров здесь прежде чем страница загрузится.
        // Посему мы можем в App.tsx создать переменную в редакс которая будет хранить в себе appIsMounted: boolean;

        if (!sliderIntervalIsOn && slides.length !== 1) {
            sliderIntervalRef.current = setInterval(() => {
                setIndexOfActiveImage((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 7000);

            setSliderIntervalIsOn(true);
        }

        return (): void => {
            clearInterval(sliderIntervalRef.current!);
            clearInterval(opacityChangeRef.current!);
        };
    };

    const changeSliderImage = (): void => {
        sliderImageRef.current!.style.backgroundImage = `url('/images/slider-images/${slides[indexOfActiveImage].imageUrl}')`;
        sliderImageRef.current!.style.width = `${window.screen.width}px`;
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
    };
    const handleSliderImageFromMoveStatusBarOnClick = (i: number): (() => void) => {
        return (): void => {
            if (i !== indexOfActiveImage) {
                clearInterval(opacityChangeRef.current!);
                clearInterval(sliderIntervalRef.current!);
                sliderIntervalRef.current = setInterval(() => {
                    setIndexOfActiveImage((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
                }, 7000);

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
                    className={`slider__move-status-bar__elem slider__move-status-bar__elem--${i} ${defineSliderActiveImageClassName(
                        i
                    )}`}
                    onClick={handleSliderImageFromMoveStatusBarOnClick(i)}
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: 'blue',
                        margin: '5px',
                    }}
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
                        additionalClassNames="slider__image__content__buttons--i"
                    />
                </NavLink>
            );
        });

        return (
            <div className="slider__image__content">
                <h1
                    className="slider__image__content__message heading heading--primary"
                    ref={sliderImageContentMessageRef}
                >
                    {slides[indexOfActiveImage].message}
                </h1>
                <div className="slider__image__content__buttons">{buttons}</div>
            </div>
        );
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(changeSliderImage, [indexOfActiveImage]);

    return (
        <section className="slider-section">
            <div className="slider">
                <div className="slider__image" ref={sliderImageRef}></div>
                {renderSlideContent()}
                {renderSliderMoveStatusBar()}
            </div>
        </section>
    );
}
