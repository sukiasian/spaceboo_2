import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
    annualizeDeleteSpaceResponsesAction,
    deleteSpaceAction,
    fetchSpaceByIdAction,
    fetchSpacesByUserActiveAppointmentsAction,
    fetchSpacesByUserUpcomingAppointmentsAction,
    fetchUserSpacesAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import EditSpaceModal from '../modals/EditSpaceModal';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { EventListenerType } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';
import ConfirmDialog from '../components/ConfirmDialog';
import { IDeleteSpacePayload } from '../redux/reducers/spaceReducer';
import DisappearingAlert from '../components/DisappearingAlert';
import AppointmentDatePicker from '../components/AppointmentDatePicker';
import TextButton from '../buttons/TextButton';
import { IDatesRange } from '../components/Filters';
import AltButton from '../components/AltButton';
import EditButton from '../buttons/EditButton';
import DeleteButton from '../buttons/DeleteButton';

interface ISpaceInitialField {
    fieldName: string;
    fieldDescription: string;
}

export default function SpacePage(): JSX.Element {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [datesForRender, setDatesForRender] = useState<IDatesRange>();
    const [deleteSpaceConfirmIsOpen, setDeleteSpaceConfirmIsOpen] = useState(false);
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
    const {
        fetchSpaceByIdSuccessResponse,
        fetchSpaceByIdFailureResponse,
        deleteSpaceSuccessResponse,
        deleteSpaceFailureResponse,
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserActiveAppointmentsSuccessResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const { editSpaceModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const editSpaceModalRef = useRef<HTMLDivElement>(null);
    const confirmDialogRef = useRef<HTMLDivElement>(null);
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
    // const closeConfirmDialogOnOutsideClick = (e: MouseEvent) => {
    //     if (e.target !== confirmDialogRef.current) {
    //         toggleDeleteSpaceConfirm();
    //     }
    // };
    const annualizeDeleteSpaceResponses = (): void => {
        dispatch(annualizeDeleteSpaceResponsesAction());
    };
    // const applyConfirmDialogEvents = (): (() => void) => {
    //     if (deleteSpaceConfirmIsOpen) {
    //         window.addEventListener('click', closeConfirmDialogOnOutsideClick);
    //     }

    //     return () => {
    //         window.removeEventListener('click', closeConfirmDialogOnOutsideClick);
    //     };
    // };
    const toggleDatePicker: MouseEventHandler = () => {
        setDatePickerIsOpen((prev) => !prev);
    };
    const toggleDeleteSpaceConfirm = (): void => {
        setDeleteSpaceConfirmIsOpen((prev) => !prev);
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
    const spaceBelongsToUser = (): boolean => {
        return spaceData && spaceData?.userId === currentUserData?.id ? true : false;
    };
    const userHasActiveAppointments = (): boolean => {
        return fetchSpacesByUserActiveAppointmentsSuccessResponse?.data.length > 0;
    };
    const spaceIsAppointedByUser = (): boolean => {
        return fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.includes(spaceId);
    };
    const appointSpace = (): void => {
        // забронировать и обновить список upcoming appointm ent-ов пользователя
        // чтобы появилась кнопка отменить бронь

        requestUserUpcomingAppointments();
    };
    const cancelAppointment: MouseEventHandler<HTMLDivElement> = () => {
        // TODO: эта функция будет использоваться не только здесь, так что нужно будет ее вынести в общую.
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
        if (spaceBelongsToUser()) {
            return (
                <div className="space-owner-menu">
                    <EditButton handleClick={toggleEditSpaceModal} />
                    <DeleteButton handleClick={toggleDeleteSpaceConfirm} />{' '}
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
        const activeClassName = datePickerIsOpen ? 'appointment-button--active' : '';
        // проверить есть ли активные бронирования у пользователя
        if (!spaceBelongsToUser()) {
            return (
                <div
                    className={`button button--secondary appointment-button ${activeClassName}`}
                    onClick={toggleDatePicker}
                >
                    Бронирование
                </div>
            );
        }

        return null;
    };
    const renderDatePicker = (): JSX.Element | void => {
        if (datePickerIsOpen) {
            return <AppointmentDatePicker datesForRender={datesForRender} setDatesForRender={setDatesForRender} />;
        }
    };
    const renderCancelAppointmentButton = (): JSX.Element | void => {
        // проверить есть ли в бронировании спейса id пользователя - если есть
        // или посмотреть есть ли в предстоящих бронированиях пользователя данный спейс
        if (spaceIsAppointedByUser()) {
            return <TextButton text="Отменить бронирование" handleClick={cancelAppointment} />;
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

    const renderRemoveSpaceConfirmDialog = (): JSX.Element | void => {
        if (deleteSpaceConfirmIsOpen) {
            const handlePositiveClick: MouseEventHandler = (): void => {
                const deleteSpacePayload: IDeleteSpacePayload = {
                    spaceId: spaceId!,
                };

                dispatch(deleteSpaceAction(deleteSpacePayload));
            };

            return (
                <ConfirmDialog
                    question={'Удалить пространство?'}
                    positive={'Да'}
                    negative={'Отмена'}
                    handlePositiveClick={handlePositiveClick}
                    handleNegativeClick={toggleDeleteSpaceConfirm}
                    handleCloseButtonClick={toggleDeleteSpaceConfirm}
                    innerRef={confirmDialogRef}
                />
            );
        }
    };
    const renderDisappearingAlertOnDeleteError = (): JSX.Element | void => {
        if (deleteSpaceFailureResponse) {
            return <DisappearingAlert failureResponse={deleteSpaceFailureResponse} />;
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleDocumentTitle, [fetchSpaceByIdSuccessResponse]);
    useEffect(redirectIfSpaceIsNotFound, [fetchSpaceByIdFailureResponse, navigate]);
    useEffect(applyModalEventListenersEffects, [editSpaceModalIsOpen]);
    useEffect(redirectIfSpaceIsDeleted, [deleteSpaceSuccessResponse]);
    // useEffect(applyConfirmDialogEvents);

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
                    {renderDatePicker()}
                    {renderSpaceOwnerMenu()}
                </div>
            </div>
            {renderEditSpaceModal()}
            {renderRemoveSpaceConfirmDialog()}
            {renderDisappearingAlertOnDeleteError()}
        </div>
    );
}
