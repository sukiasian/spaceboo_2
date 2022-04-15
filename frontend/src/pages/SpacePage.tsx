import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft, faChevronRight, faEdit, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchSpaceByIdAction, fetchUserSpacesAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import EditSpaceModal from '../modals/EditSpaceModal';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { EventListenerType } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';

interface ISpaceInitialField {
    fieldName: string;
    fieldDescription: string;
}

// вначале мы должны отправить запрос на получение всех спейсов пользователя. Если в массиве числитя params.spaceId то

export default function SpacePage(): JSX.Element {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { fetchSpaceByIdSuccessResponse, fetchSpaceByIdFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const { fetchCurrentUserSuccessResponse, fetchCurrentUserFailureResponse } = useSelector(
        (state: IReduxState) => state.userStorage
    );
    const { editSpaceModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const editSpaceModalRef = useRef<HTMLDivElement>(null);
    const spaceData = fetchSpaceByIdSuccessResponse?.data;
    const currentUserData = fetchCurrentUserSuccessResponse?.data;
    const spaceInitialFields: ISpaceInitialField[] = [
        {
            fieldName: 'address',
            fieldDescription: 'РАСПОЛОЖЕНИЕ',
        },
        {
            fieldName: 'roomsNumber',
            fieldDescription: 'КОЛИЧЕСТВО КОМНАТ',
        },
        {
            fieldName: 'bedsNumber',
            fieldDescription: 'КОЛИЧЕСТВО СПАЛЬНЫХ МЕСТ',
        },
    ];
    const amountOfImages = spaceData?.imagesUrl.length;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { spaceId } = params;
    const requestSpaceById = (): void => {
        dispatch(fetchSpaceByIdAction(spaceId!));
    };
    const requestUserSpaces = (): void => {
        dispatch(fetchUserSpacesAction());
    };
    const handleDocumentTitle = (): void => {
        const documentTitle = spaceData
            ? `${spaceData.roomsNumber}-к. пространство на ${spaceData.address} | Spaceboo`
            : 'Пространство | Spaceboo';

        updateDocumentTitle(documentTitle);
    };
    const applyEffectsOnInit = (): void => {
        requestSpaceById();
        requestUserSpaces();
        handleDocumentTitle();
    };
    const closeModalOnOutsideClick = (e: MouseEvent) => {
        if (!editSpaceModalRef.current?.contains(e.target as HTMLDivElement)) {
            dispatch(toggleEditSpaceModalAction());
        }
    };
    const applyModalEventListenersEffects = (): (() => void) => {
        if (editSpaceModalIsOpen) {
            document.addEventListener(EventListenerType.CLICK, closeModalOnOutsideClick);
        }

        return () => {
            document.removeEventListener(EventListenerType.CLICK, closeModalOnOutsideClick);
        };
    };
    const redirectIfSpaceIsNotFound = (): void => {
        if (fetchSpaceByIdFailureResponse) {
            navigate('/not-found');
        }
    };
    const checkIfSpaceBelongsToUser = (): boolean => {
        return spaceData?.userId === currentUserData?.id ? true : false;
    };
    const toggleEditSpaceModal = (): void => {
        dispatch(toggleEditSpaceModalAction());
    };
    const flipImageLeft = (): void => {
        const defineShouldBePreviousImageOrLast = activeImageIndex > 0 ? activeImageIndex - 1 : amountOfImages - 1;

        setActiveImageIndex(defineShouldBePreviousImageOrLast);
    };
    const flipImageRight = (): void => {
        const defineShouldBeNextImageOrFirst = activeImageIndex === amountOfImages - 1 ? 0 : activeImageIndex + 1;

        setActiveImageIndex(defineShouldBeNextImageOrFirst);

        if (activeImageIndex) {
            setActiveImageIndex((prev) => prev + 1);
        } else {
            setActiveImageIndex(0);
        }
    };
    const renderEditSpaceModal = (): JSX.Element | void => {
        if (editSpaceModalIsOpen) {
            return <EditSpaceModal editSpaceModalRef={editSpaceModalRef} />;
        }
    };
    const renderSpaceOwnerMenu = (): JSX.Element | void => {
        if (checkIfSpaceBelongsToUser()) {
            return (
                <div className="space-owner-menu" onClick={toggleEditSpaceModal}>
                    <div className="space-owner-menu__edit">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                </div>
            );
        }
    };
    const renderLockerConnectedStatus = (): JSX.Element => {
        return spaceData?.lockerConnected ? (
            <>
                <div className="icon icon-connection icon-connection--connected">
                    <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="paragraph-container">
                    <p className="paragraph">Доступно бесконтактное заселение</p>
                </div>
            </>
        ) : (
            <>
                <div className="icon icon-connection icon-connection--not-connected">
                    <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div className="paragraph-container">
                    <p className="paragraph">Владелец пока не подключился к бесконтактному заселению.</p>
                </div>
            </>
        );
    };
    const renderSpaceInitialFields = (): JSX.Element[] => {
        return spaceInitialFields.map((initialField, i: number) => {
            return (
                <div className={`space-initial-field space-initial-field--${initialField.fieldName}`} key={i}>
                    <h4 className="heading heading--quarternary">
                        {initialField.fieldDescription}:{' '}
                        <span className="space-initial-field-value">{spaceData?.[initialField.fieldName]}</span>
                    </h4>
                </div>
            );
        });
    };
    const renderAppointment = (): JSX.Element => {
        return <></>;
    };
    const renderRemoveButton = (): JSX.Element => {
        return <div className="">{/* TODO */}</div>;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(redirectIfSpaceIsNotFound, [fetchSpaceByIdFailureResponse, navigate]);
    useEffect(applyModalEventListenersEffects, [editSpaceModalIsOpen]);
    useEffect(handleDocumentTitle, [fetchSpaceByIdSuccessResponse]);
    // календарик полоса с датами все нужно упаковать в один компонент

    return (
        <div className="space-page">
            {renderSpaceOwnerMenu()}
            <div className="space-page__flows">
                <div className="space-page__flows--left">
                    <div className="space__images">
                        <div className="icon icon-arrow icon-arrow--right" onClick={flipImageLeft}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <img
                            className="space-image"
                            src={`/${spaceData?.imagesUrl[activeImageIndex]}` || '/no-space-image.jpg'}
                            alt="Пространство"
                        />
                        <div className="icon icon-arrow icon-arrow--right" onClick={flipImageRight}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    </div>
                    <div className="space-description-container">
                        <h3 className="heading heading--tertiary space-description-heading">Описание</h3>
                        <div className="space-description-paragraph-container">
                            <p className="paragraph space-description-paragraph"> </p>
                        </div>
                    </div>
                </div>
                <div className="space-page__flows--right">
                    <div className="locker-connection-status-bar">{renderLockerConnectedStatus()}</div>
                    {renderSpaceInitialFields()}
                    {renderAppointment()}
                    {renderRemoveButton()}
                </div>
            </div>
            {renderEditSpaceModal()}
        </div>
    );
}
