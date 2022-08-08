import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { IComponentClassNameProps, UrlPathname } from '../types/types';

interface ISpace {
    id: string;
    imagesUrl: string[];
    pricePerNight: number;
    roomsNumber: number;
    cityName: Record<any, any>;
    address: string;
}
interface ISpaceProps extends IComponentClassNameProps {
    space: ISpace;
    children?: JSX.Element;
}

export default function Space(props: ISpaceProps): JSX.Element {
    const { index, space, children } = props;
    const { id, imagesUrl, pricePerNight, roomsNumber, cityName, address } = space;
    const mainImageUrl = imagesUrl[0];
    const renderPrice = (): JSX.Element => {
        return (
            <div className="space-card__price-container">
                <div className={`space-card__price space-card--${index}`}>
                    <p className="paragraph paragraph--price">₽{pricePerNight}</p>
                </div>
            </div>
        );
    };
    const renderChildren = (): JSX.Element | void => {
        if (children) {
            return children;
        }
    };

    return (
        <NavLink to={`${UrlPathname.SPACES}/${id}`} className={`space-card-link space-card-link--${index}`}>
            <div className="space-card">
                <div className={`space-card__content space-card--${index}`}>
                    <img className="space-card__image" src={mainImageUrl || '/no-image.src'} alt="Пространство" />
                    {renderPrice()}
                </div>
                <div className={`space-card__under-image space-card__under-image--${index}`}>
                    <div className="rooms-and-city">
                        <div className="rooms-and-city__rooms-container">
                            <p className="paragraph paragraph--light space-card__under-image__row--1__rooms-number">
                                {roomsNumber} комн.
                            </p>
                        </div>
                        <div className="rooms-and-city__city-icon-container">
                            <FontAwesomeIcon icon={faMapMarker} />
                        </div>
                        <div className="rooms-and-city__city-name-container">
                            <p className="paragraph paragraph--light paragraph--space-card__under-image__row--1__city-name">
                                {cityName}
                            </p>
                        </div>
                    </div>
                    <div className="address-container">
                        <p className="paragraph address-paragraph">{address.toUpperCase()}</p>
                    </div>
                    {renderChildren()}
                </div>
            </div>
        </NavLink>
    );
}
