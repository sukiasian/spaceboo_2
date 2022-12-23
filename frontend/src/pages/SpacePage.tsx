import { MouseEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
    annualizeDeleteSpaceResponsesAction,
    fetchSpaceByIdAction,
    fetchSpacesByUserActiveAppointmentsAction,
    fetchSpacesByUserUpcomingAppointmentsAction,
    fetchUserSpacesAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleAppointmentDatePickerAction } from '../redux/actions/modalActions';
import { updateDocumentTitle } from '../utils/utilFunctions';
import DisappearingAlert from '../components/DisappearingAlert';
import AppointmentDatePicker from '../components/AppointmentDatePicker';
import TextButton from '../buttons/TextButton';
import { IDatesRange } from '../components/Filters';
import SpaceActionButtonsForOwner from '../components/SpaceActionButtonsForOwner';

interface ISpaceInitialField {
    fieldName: string;
    fieldDescription: string;
}

export default function SpacePage(): JSX.Element {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [datesForRender, setDatesForRender] = useState<IDatesRange>();
    const {
        fetchSpaceByIdSuccessResponse,
        fetchSpaceByIdFailureResponse,
        deleteSpaceSuccessResponse,
        deleteSpaceFailureResponse,
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserActiveAppointmentsSuccessResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);

    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const { appointmentDatePickerIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

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

    const amountOfImages = spaceData?.imagesUrl?.length;
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
    const requestUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointmentsAction());
    };
    const requestUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointmentsAction());
    };
    const handleDocumentTitle = (): void => {
        const documentTitle = spaceData
            ? `${spaceData.roomsNumber}-к. пространство на ${spaceData.address} | Spaceboo`
            : 'Пространство | Spaceboo';

        updateDocumentTitle(documentTitle);
    };
    const applyEffectsOnInit = (): (() => void) => {
        requestSpaceById();
        requestUserSpaces();
        handleDocumentTitle();
        requestUserUpcomingAppointments();
        requestUserActiveAppointments();

        return () => {
            if (deleteSpaceSuccessResponse) {
                annualizeDeleteSpaceResponses();
            }
        };
    };
    const annualizeDeleteSpaceResponses = (): void => {
        dispatch(annualizeDeleteSpaceResponsesAction());
    };
    const toggleDatePicker: MouseEventHandler = () => {
        if (!appointmentDatePickerIsOpen) {
            dispatch(toggleAppointmentDatePickerAction());
        }
    };

    const redirectIfSpaceIsNotFound = (): void => {
        // TODO: maybe better throw error ?
        if (fetchSpaceByIdFailureResponse) {
            navigate('/not-found');
        }
    };
    const redirectIfSpaceIsDeleted = (): void => {
        if (deleteSpaceSuccessResponse) {
            setTimeout(() => {
                annualizeDeleteSpaceResponses();
                navigate('/');
            }, 2000);
        }
    };
    const spaceBelongsToUser = spaceData && spaceData?.userId === currentUserData?.id ? true : false;
    const userHasActiveAppointments = fetchSpacesByUserActiveAppointmentsSuccessResponse?.data.length > 0;
    const spaceIsAppointedByUser = fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.includes(spaceId);

    const appointSpace = (): void => {
        // забронировать и обновить список upcoming appointm ent-ов пользователя
        // чтобы появилась кнопка отменить бронь

        requestUserUpcomingAppointments();
    };
    const cancelAppointment: MouseEventHandler<HTMLDivElement> = () => {
        // TODO: эта функция будет использоваться не только здесь, так что нужно будет ее вынести в общую.
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
    const renderLockerConnectedStatus = (): JSX.Element => {
        return spaceData?.lockerId ? (
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
    const renderImages = (): JSX.Element => {
        return (
            <div className="page-box space__images">
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
        );
    };
    const renderAppointmentButton = (): JSX.Element | null => {
        const activeClassName = appointmentDatePickerIsOpen ? 'appointment-button--active' : '';

        // проверить есть ли активные бронирования у пользователя. проверка !spaceIsAppointedByUser нужна только для того чтобы отменять бронирование
        return !spaceBelongsToUser && !userHasActiveAppointments ? (
            <div
                className={`button button--secondary appointment-button ${activeClassName}`}
                onClick={toggleDatePicker}
            >
                Бронирование
            </div>
        ) : null;
    };
    const renderCancelAppointmentButton = (): JSX.Element | void => {
        // проверить есть ли в бронировании спейса id пользователя - если есть
        // или посмотреть есть ли в предстоящих бронированиях пользователя данный спейс
        if (spaceIsAppointedByUser) {
            return <TextButton handleClick={cancelAppointment}> Отменить бронирование</TextButton>;
        }
    };
    const renderSpaceDescription = (): JSX.Element => {
        return (
            <div className="page-box space-description-page-box space-description-container">
                <h3 className="heading heading--tertiary space-description-heading">Описание</h3>
                <div className="space-description-paragraph-container">
                    <p className="paragraph space-description-paragraph">{spaceData?.description}</p>
                </div>
            </div>
        );
    };

    const renderDisappearingAlertOnDeleteError = (): JSX.Element | void => {
        if (deleteSpaceFailureResponse) {
            return <DisappearingAlert failureResponse={deleteSpaceFailureResponse} />;
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleDocumentTitle, [fetchSpaceByIdSuccessResponse]);
    useEffect(redirectIfSpaceIsNotFound, [fetchSpaceByIdFailureResponse, navigate]);
    useEffect(redirectIfSpaceIsDeleted, [deleteSpaceSuccessResponse]);

    return (
        <div className="page space-page">
            <div className="space-page__flows">
                <div className="space-page__flows--left">
                    {renderImages()}
                    {renderSpaceDescription()}
                </div>
                <div className="space-page__flows--right">
                    <div className="locker-connection-status-bar">{renderLockerConnectedStatus()}</div>
                    <div className="page-box">{renderSpaceInitialFields()}</div>
                    {renderAppointmentButton()}
                    {renderCancelAppointmentButton()}
                    <SpaceActionButtonsForOwner />
                    <AppointmentDatePicker datesForRender={datesForRender} setDatesForRender={setDatesForRender} />
                </div>
            </div>
            {renderDisappearingAlertOnDeleteError()}
        </div>
    );
}
