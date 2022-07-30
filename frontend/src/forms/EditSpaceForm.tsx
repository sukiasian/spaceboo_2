import { ChangeEvent, ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    annualizeFoundBySearchPatternCitiesAction,
    fetchCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import {
    putEditSpaceAction,
    setPostProvideSpaceDataAction,
    setPutEditSpaceDataAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IEditSpaceData, IEditSpacePayload, IProvideSpaceData, SpaceType } from '../redux/reducers/spaceReducer';
import { handleFormSubmit } from '../utils/utilFunctions';
import RequiredField from '../components/RequiredField';
import Checkbox from '../components/Checkbox';
import Alert from '../components/Alert';
import { EventKey } from '../types/types';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';

interface ITypeOfSpaceInputData {
    spaceType: SpaceType;
}

enum EditSpaceOpenableField {
    ADDRESS = 'ADDRESS',
    PRICE_PER_NIGHT = 'PRICE_PER_NIGHT',
    DESCRIPTION = 'DESCRIPTION',
    CITY = 'CITY',
}

// TODO: отправка фото, удаление
export default function EditSpaceForm(): JSX.Element {
    const [openedInput, setOpenedInput] = useState<EditSpaceOpenableField>();
    const [pickedCityName, setPickedCityName] = useState<string>();
    const [spaceImages, setSpaceImages] = useState<string[]>();
    const [spaceImagesToRemove, setSpaceImagesToRemove] = useState<string[]>();
    const openedInputRef = useRef<HTMLInputElement>(null);
    const { editSpaceData, fetchSpaceByIdSuccessResponse, putEditSpaceSuccessResponse, putEditSpaceFailureResponse } =
        useSelector((state: IReduxState) => state.spaceStorage);
    const { fetchCitiesByPatternSuccessResponse } = useSelector((state: IReduxState) => state.cityStorage);
    const { spaceId } = useParams();
    const spaceData = fetchSpaceByIdSuccessResponse?.data;
    const dispatch = useDispatch();
    const initialRoomsNumber = 2;
    const initialBedsNumber = 2;
    const roomsMaximumNumber = 11;
    const typeOfSpaceInputsData: ITypeOfSpaceInputData[] = [
        {
            spaceType: SpaceType.FLAT,
        },
        {
            spaceType: SpaceType.HOUSE,
        },
    ];
    const setDropdownValuesToFormDataOnInit = (): void => {
        const newFormData: IProvideSpaceData = { ...editSpaceData };

        newFormData.roomsNumber = initialRoomsNumber;
        newFormData.bedsNumber = initialBedsNumber;

        dispatch(setPostProvideSpaceDataAction(newFormData));
    };
    const applyEffectsOnInit = (): void => {
        setDropdownValuesToFormDataOnInit();
        setCityPickerValue();
    };
    const applyEventListenersToActiveInput = (): (() => void) => {
        if (openedInput) {
            openedInputRef.current!.focus();
            document.addEventListener('click', cancelInputWhenEmptyOnOutsideClickForRequiredField);
            document.addEventListener('keydown', cancelInputOnEscapePress);
            document.addEventListener('mousedown', saveInputOnOutsideClickForRequiredFields);
            document.addEventListener('mousedown', saveInputOnOutsideClickForNonRequiredFields);
            document.addEventListener('keydown', saveInputOnEnterPressForRequiredFields);
            document.addEventListener('keydown', saveInputOnEnterPressForNonRequiredFields);
        }

        return () => {
            document.removeEventListener('click', cancelInputWhenEmptyOnOutsideClickForRequiredField);
            document.removeEventListener('keydown', cancelInputOnEscapePress);
            document.removeEventListener('mousedown', saveInputOnOutsideClickForRequiredFields);
            document.removeEventListener('mousedown', saveInputOnOutsideClickForNonRequiredFields);
            document.removeEventListener('keydown', saveInputOnEnterPressForRequiredFields);
            document.removeEventListener('keydown', saveInputOnEnterPressForNonRequiredFields);
        };
    };
    const setCityPickerValue = (): void => {
        if (openedInputRef.current?.name === 'cityId') {
            openedInputRef.current.value = separateCityNameFromRegionIfCityNameContains(spaceData.city.name);
        }
    };
    const setSpaceImagesAfterFetchingSpaceData = (): void => {
        const spaceImages = spaceData.imagesUrl;

        setSpaceImages(spaceImages);
    };
    const assignSpaceImagesToEditSpaceData = (): void => {
        const newFormData: IEditSpaceData = { ...editSpaceData };

        newFormData.imagesUrl = spaceImages;

        dispatch(setPutEditSpaceDataAction(newFormData));
    };
    const checkIfFieldIsOpen = (field: EditSpaceOpenableField): boolean => {
        return field === openedInput ? true : false;
    };
    const handleActiveField = (field: EditSpaceOpenableField): MouseEventHandler => {
        return (e) => {
            e.stopPropagation();

            setOpenedInput(field);
        };
    };
    const annualizeActiveField = (): void => {
        setOpenedInput(undefined);
    };
    const checkIfActiveFieldIsRequired = (): boolean => {
        return openedInputRef.current?.getAttribute('data-required') === 'true' ? true : false;
    };
    const checkIfActiveFieldInputLengthIsNotEmpty = (): boolean => {
        return openedInputRef.current?.value.length !== 0 ? true : false;
    };
    const checkIfInputNotHavingDropdown = (): boolean => {
        return openedInputRef.current?.getAttribute('data-has-dropdown') === 'false' ? true : false;
    };
    const saveInput = (): void => {
        const newFormData: IEditSpaceData = { ...editSpaceData };

        // @ts-ignore
        newFormData[openedInputRef.current?.name] = openedInputRef.current?.value;

        dispatch(setPutEditSpaceDataAction(newFormData));
        annualizeActiveField();
    };
    const cancelInputOnEscapePress = (e: KeyboardEvent): void => {
        if (e.key === EventKey.ESCAPE) {
            annualizeActiveField();
        }
    };
    const cancelInputWhenEmptyOnOutsideClickForRequiredField = (e: MouseEvent): void => {
        if (e.target !== openedInputRef.current && checkIfActiveFieldInputLengthIsNotEmpty()) {
            annualizeActiveField();
        }
    };
    const saveInputOnOutsideClickForRequiredFields = (e: MouseEvent): void => {
        // MUST CHECK IF INPUT DOES NOT HAVE A CUSTOM DROPDOWN - OTHERWISE CHOOSING DROPDOWN OPTION WILL TRIGGER CLOSING THE INPUT
        if (
            e.target !== openedInputRef.current &&
            checkIfActiveFieldInputLengthIsNotEmpty() &&
            checkIfActiveFieldIsRequired() &&
            checkIfInputNotHavingDropdown()
        ) {
            saveInput();
        }
    };
    const saveInputOnOutsideClickForNonRequiredFields = (e: MouseEvent): void => {
        if (e.target !== openedInputRef.current && !checkIfActiveFieldIsRequired() && checkIfInputNotHavingDropdown()) {
            saveInput();
        }
    };
    const saveInputOnEnterPressForRequiredFields = (e: KeyboardEvent): void => {
        if (e.key === EventKey.ENTER && checkIfActiveFieldIsRequired() && checkIfActiveFieldInputLengthIsNotEmpty()) {
            saveInput();
        }
    };
    const saveInputOnEnterPressForNonRequiredFields = (e: KeyboardEvent): void => {
        if (e.key === EventKey.ENTER && !checkIfActiveFieldIsRequired() === false) {
            saveInput();
        }
    };
    const handleTypeOfSpaceBoxCheck = (spaceType: SpaceType): (() => void) => {
        return () => {
            const newFormData: IProvideSpaceData = { ...editSpaceData };

            newFormData.type = spaceType;

            dispatch(setPostProvideSpaceDataAction(newFormData));
        };
    };
    const handleRoomsNumberDropDownSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const newFormData: IProvideSpaceData = { ...editSpaceData };

        newFormData.roomsNumber = parseInt(e.target.value, 10);

        dispatch(setPostProvideSpaceDataAction(newFormData));
    };
    const handleFindCityInput = (e: ChangeEvent<{ value: string }>): void => {
        const { value } = e.target;

        if (value.length >= 1) {
            dispatch(fetchCitiesBySearchPatternAction(value));
        }
    };
    const annualizeFoundBySearchPatternCities = (): void => {
        dispatch(annualizeFoundBySearchPatternCitiesAction());
    };
    const handlePickCity = (city: any): MouseEventHandler => {
        return (e) => {
            e.stopPropagation();

            const newFormData: IProvideSpaceData = { ...editSpaceData };

            newFormData.cityId = city.id;

            dispatch(setPutEditSpaceDataAction(newFormData));

            openedInputRef.current!.value = city.name;

            setPickedCityName(city.name);
            annualizeActiveField();
            annualizeFoundBySearchPatternCities();
        };
    };
    // NOTE: probably can be an utilfunction
    const transformSpaceImagesFileListIntoArray = (spaceImagesFileList: FileList): Array<any> => {
        let spaceImages: any[] = [];

        for (const key in spaceImagesFileList) {
            if (key !== 'length' && key !== 'item') {
                spaceImages = [...spaceImages, spaceImagesFileList[key]];
            }
        }

        return spaceImages;
    };
    const separateCityNameFromRegionIfCityNameContains = (cityName: string) => {
        const cityNameValuesSeparately = cityName.split(' ');

        return cityNameValuesSeparately[0];
    };
    const handleUploadSpaceImages: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: IProvideSpaceData = { ...editSpaceData };

        if (e.target.files) {
            const spaceImages = transformSpaceImagesFileListIntoArray(e.target.files);

            newFormData.spaceImages = [...(newFormData.spaceImages || []), ...spaceImages];
        }

        dispatch(setPutEditSpaceDataAction(newFormData));
    };
    const deleteImage = (imageToDelete: string): MouseEventHandler => {
        return (e) => {
            e.stopPropagation();

            const newSpaceImages = spaceImages!.filter((el) => el !== imageToDelete);

            setSpaceImages(newSpaceImages);
        };
    };
    const handleSubmitButton = (): void => {
        const editSpacePayload: IEditSpacePayload = {
            editSpaceData: editSpaceData!,
            spaceId: spaceId!,
            spaceImagesToRemove,
        };

        dispatch(putEditSpaceAction(editSpacePayload));
    };
    const closeModalOnSubmit = (): void => {
        dispatch(toggleEditSpaceModalAction());
    };
    const renderTypeOfSpaceCheckboxes = (): JSX.Element[] => {
        return typeOfSpaceInputsData.map((typeOfSpaceInputData: ITypeOfSpaceInputData, i: number) => {
            const checkboxIsChecked = typeOfSpaceInputData.spaceType === spaceData.type;

            return (
                <div
                    className="type-of-space__checkbox"
                    onClick={handleTypeOfSpaceBoxCheck(typeOfSpaceInputData.spaceType)}
                    key={i}
                >
                    <Checkbox isChecked={checkboxIsChecked} />
                    <div className="type-of-space__checkbox__label">
                        <label> {typeOfSpaceInputData.spaceType} </label>
                    </div>
                </div>
            );
        });
    };
    const renderDropdownNumericalOptions = (): JSX.Element[] => {
        const dropdownOptions: JSX.Element[] = [];

        for (let i = 1; i <= roomsMaximumNumber; i++) {
            dropdownOptions.push(
                <option className="rooms-number-dropdown-option" value={i} key={i}>
                    {i}
                </option>
            );
        }

        return dropdownOptions;
    };
    const renderFindCityResults = (): JSX.Element => {
        return (
            <>
                {fetchCitiesByPatternSuccessResponse?.data?.length !== 0
                    ? fetchCitiesByPatternSuccessResponse?.data?.map((city: any, i: number) => (
                          <p
                              className={`city-picker__search-results city-picker__search-results--${i}`}
                              key={i}
                              onClick={handlePickCity(city)}
                          >
                              {`${city.region.name}, ${separateCityNameFromRegionIfCityNameContains(city.name)}`}
                          </p>
                      ))
                    : null}
            </>
        );
    };
    const renderExistingImages = (): JSX.Element[] | void => {
        return spaceImages?.map((imageUrl: string, i: number) => {
            return (
                <div className="images-to-upload-container" key={i}>
                    <img className="image-to-upload" src={`/${imageUrl}`} alt="Загруженное изображение" />
                    <div className="remove-uploaded-image" onClick={deleteImage(imageUrl)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            );
        });
    };
    const renderUploadedImages = (): JSX.Element[] | void => {};
    const renderAlertAfterSubmit = (): JSX.Element => {
        return <Alert successResponse={putEditSpaceSuccessResponse} failureResponse={putEditSpaceFailureResponse} />;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(applyEventListenersToActiveInput, [openedInput]);
    useEffect(setCityPickerValue, [openedInput]);
    useEffect(setSpaceImagesAfterFetchingSpaceData, [spaceData]);
    // NOTE if here we use select tag then in dropdown menus we should also use that in other places and vice versa

    return (
        <form className="provide-space__form" onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className="space-input-fields--type-of-space">
                <div className="type-of-space__label-container">
                    <label className="label label--type-of-space">Тип пространства</label>
                    <RequiredField />
                </div>
                <div className="type-of-space__checkboxes">{renderTypeOfSpaceCheckboxes()}</div>
            </div>
            <div className="space-input-fields--rooms-number">
                <div className="rooms-number__label-container">
                    <label className="label label--rooms-number">Количество комнат</label>
                    <RequiredField />
                </div>
                <div className="rooms-number__dropdown-container">
                    <select
                        className="rooms-number__dropdown"
                        onChange={handleRoomsNumberDropDownSelect}
                        defaultValue={spaceData.roomsNumber}
                    >
                        {renderDropdownNumericalOptions()}
                    </select>
                </div>
            </div>
            <div className="space-input-fields--description">
                <div className="description__label-container">
                    <label className="label label--description">Описание</label>
                </div>
                {checkIfFieldIsOpen(EditSpaceOpenableField.DESCRIPTION) ? (
                    <div className="description__input-container">
                        <input
                            ref={openedInputRef}
                            className="description__input"
                            name="description"
                            type="text"
                            placeholder="Добавьте описание..."
                            data-required={true}
                            data-has-dropdown={false}
                        />
                    </div>
                ) : (
                    <div className="space-description">
                        <p onClick={handleActiveField(EditSpaceOpenableField.DESCRIPTION)}>
                            {editSpaceData?.description || spaceData.description}
                        </p>
                    </div>
                )}
            </div>
            <div className="space-input-fields--beds-number">
                <div className="beds-number__label-container">
                    <label className="label label--rooms-number">Количество спальных мест</label>
                    <RequiredField />
                </div>
                <div className="beds-number__dropdown-container">
                    <select
                        className="beds-number__dropdown"
                        onChange={handleRoomsNumberDropDownSelect}
                        defaultValue={initialRoomsNumber}
                    >
                        {renderDropdownNumericalOptions()}
                    </select>
                </div>
            </div>
            <div className="space-input-fields--address">
                <div className="address__label-container">
                    <label className="label label--address">Адрес</label>
                    <RequiredField />
                </div>
                {checkIfFieldIsOpen(EditSpaceOpenableField.ADDRESS) ? (
                    <div className="address__input-container">
                        <input
                            ref={openedInputRef}
                            name="address"
                            className="address__input"
                            type="text"
                            placeholder="Введите адрес..."
                            data-required={true}
                            data-has-dropdown={false}
                        />
                    </div>
                ) : (
                    <div className="space-address">
                        <p onClick={handleActiveField(EditSpaceOpenableField.ADDRESS)}>
                            {editSpaceData?.address || spaceData.address}
                        </p>
                    </div>
                )}
            </div>
            <div className="space-input-fields--price-per-night">
                <div className="label-container">
                    <label className="label label--price-per-night">Цена за 1 ночь</label>
                    <RequiredField />
                </div>
                {checkIfFieldIsOpen(EditSpaceOpenableField.PRICE_PER_NIGHT) ? (
                    <div className="price-per-night__input-container">
                        <input
                            ref={openedInputRef}
                            name="pricePerNight"
                            className="price-per-night__input"
                            type="tel"
                            placeholder="Укажите цену за 1 ночь..."
                            data-required={true}
                            data-has-dropdown={false}
                        />
                    </div>
                ) : (
                    <div className="space-price-per-night">
                        <p onClick={handleActiveField(EditSpaceOpenableField.PRICE_PER_NIGHT)}>
                            {editSpaceData?.pricePerNight || spaceData.pricePerNight}
                        </p>
                    </div>
                )}
            </div>
            {checkIfFieldIsOpen(EditSpaceOpenableField.CITY) ? (
                <div className="city-picker__search">
                    <input
                        ref={openedInputRef}
                        className="city-picker"
                        name="cityId"
                        placeholder="Введите название города..."
                        onChange={handleFindCityInput}
                        autoComplete="off"
                        data-required={true}
                        data-has-dropdown={true}
                    />
                    {renderFindCityResults()}
                </div>
            ) : (
                <div className="space-city">
                    <p onClick={handleActiveField(EditSpaceOpenableField.CITY)}>
                        {pickedCityName || spaceData.city.name}
                    </p>
                </div>
            )}
            <div className="space-input-fields--photos">
                <div className="photos__label-and-label-description-container">
                    <div className="label-description-container">
                        <p className="paragraph paragraph--light paragraph--label-description">До 5 фотографий</p>
                    </div>
                </div>

                <div className="images-container">
                    {renderExistingImages()}
                    {renderUploadedImages()}
                    <label
                        className="add-button-icon"
                        // TODO: this is a working  example to go with in css
                        style={{
                            display: 'block',
                            width: '45px',
                            height: '45px',
                            background: 'url(/images/icons/icon-add.png)',
                            backgroundSize: 'cover',
                        }}
                    >
                        <input
                            style={{ display: 'none' }}
                            name="spaceImages"
                            className="photos__input"
                            type="file"
                            accept="image/*"
                            onChange={handleUploadSpaceImages}
                            multiple
                        />
                    </label>
                </div>
            </div>
            <button className="button button--provide-space" onClick={handleSubmitButton}>
                Обновить данные
            </button>
            {renderAlertAfterSubmit()}
        </form>
    );
}
