import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { fetchSpaceByIdAction, fetchUserSpacesAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import EditSpaceModal from '../modals/EditSpaceModal';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { EventListenerType } from '../types/types';

interface ISpaceInitialField {
    fieldName: string;
    fieldDescription: string;
}

// вначале мы должны отправить запрос на получение всех спейсов пользователя. Если в массиве числитя params.spaceId то

export default function SpacePage(): JSX.Element {
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
            fieldDescription: 'Расположение',
        },
        {
            fieldName: 'roomsNumber',
            fieldDescription: 'Количество комнат',
        },
    ];
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
    const applyEffectsOnInit = (): void => {
        requestSpaceById();
        requestUserSpaces();
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
        if (spaceData?.lockerConnected) {
            return <>connected</>;
        }

        return <>not connected</>;
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
    const renderRemoveButton = (): JSX.Element => {
        return <div className="">{/* TODO */}</div>;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(redirectIfSpaceIsNotFound, [fetchSpaceByIdFailureResponse, navigate]);
    useEffect(applyModalEventListenersEffects, [editSpaceModalIsOpen]);

    return (
        <section className="page space-page-container">
            {renderSpaceOwnerMenu()}
            <div className="space-page__flows">
                <div className="space-page__flows--left">
                    <div className="space-page__image">
                        <img src={`/${spaceData?.imagesUrl[0]}` || '/no-space-image.jpg'} alt="Пространство" />
                    </div>
                    <div className="space-description-container">
                        <h3 className="heading heading--tertiary space-description-heading">Описание</h3>
                        <div className="space-description-paragraph-container">
                            <p className="paragraph space-description-paragraph"> </p>
                        </div>
                    </div>
                </div>
                <div className="space-page__flows--right">
                    {renderLockerConnectedStatus()}
                    {renderSpaceInitialFields()}
                    {renderRemoveButton()}
                </div>
            </div>
            {renderEditSpaceModal()}
        </section>
    );
}
