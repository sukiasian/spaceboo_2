import { useState } from 'react';
import { IComponentClassNameProps } from '../types/types';

interface ISpaceProps extends IComponentClassNameProps {
    mainImageUrl: string;
    facilities: string[];
    price: number;
    roomsNumber: number;
    city: string;
    address: string;
}

export default function Space(props: ISpaceProps): JSX.Element {
    const { index, mainImageUrl, facilities, price, roomsNumber, city, address } = props;
    // TODO NOTE how to handle spaces without images?
    const renderFacilities = (): JSX.Element[] | JSX.Element => {
        // Если больше 4 удобств то используем 4 и плюс еще +количество удобств - 4 (=== остаток)
        return <></>;
    };
    const renderPrice = (): JSX.Element => {
        return (
            <div className={`space-card__price space-card--${index}`}>
                <p className="paragraph paragraph--price">₽{price}</p>
            </div>
        );
    };

    return (
        <div className={`space-card space-card--${index}`}>
            <div className={`space-card__content space-card--${index}`}>
                <img className="space-card__image" src={mainImageUrl || '/no-image.src'} alt="Пространство" />
                <div className="facilities-bar">
                    {renderFacilities()}
                    {renderPrice()}
                </div>
            </div>
            <div className={`space-card__under-image space-card__under-image--${index}`}>
                <div className="space-card__under-image__row space-card__under-image__row--1">
                    <div className="space-card__under-image__row--1__rooms-number-container">
                        <p className="paragraph paragraph--light space-card__under-image__row--1__rooms-number">
                            {roomsNumber} комн.
                        </p>
                    </div>
                    <div className="space-card__under-image__row--1__city">
                        <div className="space-card__under-image__row--1__city-icon-container">
                            <i className="city-icon" />
                        </div>
                        <div className="space-card__under-image__row--1__city-name-container">
                            <p className="paragraph paragraph--light paragraph--space-card__under-image__row--1__city-name">
                                {city}
                            </p>
                        </div>
                    </div>
                    <div className="space-card__under-image__row space-card__under-image__row--2">
                        <div className="space-card__under-image__row--2__address-container">
                            <h3 className="heading heading--tertiary space-card__under-image__row--2__address">
                                {address}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
