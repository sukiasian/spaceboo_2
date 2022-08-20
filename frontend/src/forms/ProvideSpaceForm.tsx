import React, {
    ChangeEvent,
    ChangeEventHandler,
    MouseEventHandler,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    annualizeFoundBySearchPatternCitiesAction,
    fetchCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import { postProvideSpaceAction, setPostProvideSpaceDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IProvideSpaceData, SpaceType } from '../redux/reducers/spaceReducer';
import { handleFormSubmit, separateCityNameFromRegionIfCityNameContains, valueIsNumeric } from '../utils/utilFunctions';
import RequiredField from '../components/RequiredField';
import Checkbox from '../components/Checkbox';
import ValidationOkIcon from '../icons/ValidationOkIcon';

interface ITypeOfSpaceInputData {
    spaceType: SpaceType;
}

/* 

1. При выборе города если он выбран из города то должна появляться галочка.
Если не все поля заполнены кнопка предоставить пространство должна быть деактивирована.

Для этого должна быть проверка на все поля provideSpaceData.

Город может устанавливаться (.cityId) только при нажатии на какой нибудь из результатов

*/

export default function ProvideSpaceForm(): JSX.Element {
    const [imagesAmountExceeded, setImagesAmountExceeded] = useState(false);
    const findCityRef = useRef<HTMLInputElement>(null);
    const { provideSpaceData } = useSelector((state: IReduxState) => state.spaceStorage);
    const { fetchCitiesByPatternSuccessResponse } = useSelector((state: IReduxState) => state.cityStorage);
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
    const imagesAmountAllowed = 5;
    const validatorAllowedClassName = 'validator--allowed';
    const validatorDisallowedClassName = 'validator--disallowed';
    const applyDropdownValuesToFormDataOnInit = (): void => {
        const newFormData: IProvideSpaceData = { ...provideSpaceData };

        newFormData.roomsNumber = initialRoomsNumber;
        newFormData.bedsNumber = initialBedsNumber;

        dispatch(setPostProvideSpaceDataAction(newFormData));
    };
    const applyEffectsOnInit = (): void => {
        applyDropdownValuesToFormDataOnInit();
    };
    const defineAddImageIconClassName = (): string => {
        return imagesAmountExceeded ? 'button--inactive add-button-icon--inactive' : '';
    };
    const cleanValidateClassNamesBeforeValidation = (e: ChangeEvent): void => {
        if (e.target.classList.contains(validatorDisallowedClassName)) {
            e.target.classList.remove(validatorDisallowedClassName);
        } else if (e.target.classList.contains(validatorAllowedClassName)) {
            e.target.classList.remove(validatorAllowedClassName);
        }
    };
    const validateInputByLength = (length: number, e: ChangeEvent<HTMLInputElement>): void => {
        cleanValidateClassNamesBeforeValidation(e);

        if (e.target.value.length < length) {
            e.target.classList.add(validatorDisallowedClassName);

            e.target.style.background = 'none';
        } else {
            e.target.classList.add(validatorAllowedClassName);

            e.target.style.background = 'url(/images/icon-done.png) calc(100% - 5px) 50% no-repeat';
            e.target.style.backgroundSize = '16px';
        }
    };
    const applyDisallowedValidatorOnInputChangeForCityInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.classList.contains(validatorAllowedClassName)) {
            e.currentTarget.classList.remove(validatorAllowedClassName);
        }

        e.currentTarget.classList.add(validatorDisallowedClassName);

        e.currentTarget.style.background = 'none';
    };
    const handleTypeOfSpaceBoxCheckingBySpaceType = (spaceType: SpaceType): (() => void) => {
        return () => {
            const newFormData: IProvideSpaceData = { ...provideSpaceData };

            newFormData.type = spaceType;

            dispatch(setPostProvideSpaceDataAction(newFormData));
        };
    };
    const handleRoomsNumberDropDownSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const newFormData: IProvideSpaceData = { ...provideSpaceData };

        newFormData.roomsNumber = parseInt(e.target.value, 10);

        dispatch(setPostProvideSpaceDataAction(newFormData));
    };
    const handleInputChangeByFormDataProperty = (
        formDataProp: keyof IProvideSpaceData,
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void => {
        const newFormData: IProvideSpaceData = { ...provideSpaceData };

        // @ts-ignore
        newFormData[formDataProp] = e.target.value as string;

        dispatch(setPostProvideSpaceDataAction(newFormData));
    };
    const handlePriceInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: IProvideSpaceData = { ...provideSpaceData };
        const value = e.target.value;

        if (valueIsNumeric(value)) {
            newFormData.pricePerNight = parseInt(value, 10);
        } else if (e.target.value.length !== 0) {
            e.target.value = newFormData.pricePerNight?.toString() || '';
        } else {
            newFormData.pricePerNight = undefined;

            e.target.value = '';
        }

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
    const handlePickCity = (city: any): (() => void) => {
        return () => {
            const newFormData: IProvideSpaceData = { ...provideSpaceData };

            newFormData.cityId = city.id;

            dispatch(setPostProvideSpaceDataAction(newFormData));

            findCityRef.current!.value = city.name;

            annualizeFoundBySearchPatternCities();

            findCityRef.current!.classList.remove(validatorDisallowedClassName);
            findCityRef.current!.classList.add(validatorAllowedClassName);

            findCityRef.current!.style.background = 'url(/images/icon-done.png) calc(100% - 5px) 50% no-repeat';
            findCityRef.current!.style.backgroundSize = '16px';
        };
    };
    const handleUploadSpaceImages: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: IProvideSpaceData = { ...provideSpaceData };

        if (e.target.files) {
            const { files } = e.target;
            const spaceImages = transformSpaceImagesFileListIntoArray(files);

            // сюда добавить сведения о размере файлов

            for (let i = 0; i < spaceImages.length; i++) {
                const image = spaceImages[i];

                if (image.size > 10485760) {
                    spaceImages.splice(i, 1);
                }
            }

            for (const image of spaceImages) {
                console.log(image.size);
            }

            if (
                provideSpaceData?.spaceImages &&
                provideSpaceData.spaceImages.length + files.length > imagesAmountAllowed
            ) {
                newFormData.spaceImages = [...newFormData.spaceImages!, ...spaceImages].splice(-imagesAmountAllowed);
            } else if (e.target.files.length > imagesAmountAllowed) {
                const imagesToUpload = spaceImages.splice(-5);

                newFormData.spaceImages = [...imagesToUpload];
            } else {
                newFormData.spaceImages = [...(newFormData.spaceImages || []), ...spaceImages];
            }

            if (newFormData.spaceImages.length === 5) {
                setImagesAmountExceeded(true);
            }

            dispatch(setPostProvideSpaceDataAction(newFormData));
        }
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
    const removeSpaceImageFromList = (imageToRemove: File): (() => void) => {
        return () => {
            const newSpaceImagesList = provideSpaceData?.spaceImages!.filter((el: File) => el !== imageToRemove);
            const newFormData: IProvideSpaceData = { ...provideSpaceData };

            newFormData.spaceImages = newSpaceImagesList;

            dispatch(setPostProvideSpaceDataAction(newFormData));

            if (imagesAmountExceeded) {
                setImagesAmountExceeded(false);
            }
        };
    };
    const handleSubmitButton = (): void => {
        dispatch(postProvideSpaceAction(provideSpaceData!));
    };
    const deactivateAddButtonOnOverload: MouseEventHandler<HTMLInputElement> = (e) => {
        if (imagesAmountExceeded) {
            e.preventDefault();
        }
    };
    const renderTypeOfSpaceCheckboxes = (): JSX.Element[] => {
        return typeOfSpaceInputsData.map((typeOfSpaceInputData: ITypeOfSpaceInputData, i: number) => {
            const checkboxIsChecked = typeOfSpaceInputData.spaceType === provideSpaceData?.type;

            return (
                <div
                    className={`type-of-space__checkbox type-of-space__checkbox--${i}`}
                    onClick={handleTypeOfSpaceBoxCheckingBySpaceType(typeOfSpaceInputData.spaceType)}
                    key={i}
                >
                    <Checkbox isChecked={checkboxIsChecked} />
                    <div className="type-of-space__checkbox__label">
                        <label className="type-of-space-label"> {typeOfSpaceInputData.spaceType} </label>
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
                              onClick={handlePickCity(city)}
                              key={i}
                          >
                              {`${city.region.name}, ${separateCityNameFromRegionIfCityNameContains(city.name)}`}
                          </p>
                      ))
                    : null}
            </>
        );
    };
    const renderUploadedFiles = (): ReactNode | void => {
        const spaceImages = provideSpaceData?.spaceImages;

        if (spaceImages) {
            const spaces = spaceImages.map((file: File, i: number) => {
                const src = URL.createObjectURL(file);

                return (
                    <div className="images-to-upload-container" key={i}>
                        <img
                            className="image-to-upload"
                            src={src}
                            alt="Загруженное изображение"
                            onMouseDown={() => {}}
                            onMouseUp={() => {}}
                        />
                        <div className="remove-image-to-upload" onClick={removeSpaceImageFromList(file)}>
                            <FontAwesomeIcon icon={faTimes} className="icon--remove" />
                        </div>
                    </div>
                );
            });

            return spaces;
        }
    };
    const renderImagesOverloadAlert = (): JSX.Element => {
        return <></>;
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <form className="provide-space__form" onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className="type-of-space__label-container">
                <label className="label label--type-of-space">Тип пространства</label>
                <RequiredField />
            </div>
            <div className="checkboxes">{renderTypeOfSpaceCheckboxes()}</div>
            <div className="rooms-number__label-container">
                <label className="label label--rooms-number">Количество комнат</label>
                <RequiredField />
                {/*  NOTE if here we use select tag then in dropdown menus we should also use that in other places and vice versa*/}
            </div>
            <div className="rooms-number__dropdown-container">
                <select
                    className="rooms-number__dropdown"
                    onChange={handleRoomsNumberDropDownSelect}
                    defaultValue={initialRoomsNumber}
                >
                    {renderDropdownNumericalOptions()}
                </select>
            </div>
            <div className="description__label-container">
                <label className="label label--description">Описание</label>
            </div>
            <div className="description__textarea-container">
                <textarea
                    className="description__textarea"
                    placeholder="Добавьте описание..."
                    onChange={(e) => handleInputChangeByFormDataProperty('description', e)}
                />
            </div>
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
            <div className="address__label-container">
                <label className="label label--address">Адрес</label>
                <RequiredField />
            </div>
            <div className="address__input-container">
                <input
                    className="address__input"
                    type="text"
                    placeholder="Введите адрес..."
                    name="address"
                    onChange={(e) => {
                        validateInputByLength(5, e);
                        handleInputChangeByFormDataProperty('address', e);
                    }}
                />
                <ValidationOkIcon identifier="address" />
            </div>
            <div className="price-per-night__label-container">
                <label className="label label--price-per-night">Цена за 1 ночь</label>
                <RequiredField />
            </div>
            <div className="price-per-night__input-container">
                <input
                    className="price-per-night__input"
                    name="price-per-night"
                    type="tel"
                    placeholder="Укажите цену за 1 ночь..."
                    onChange={(e) => {
                        validateInputByLength(3, e);
                        handlePriceInput(e);
                    }}
                />
                <ValidationOkIcon identifier="price-per-night" />
            </div>
            <div className="city__label-container">
                <label className="label label--city">Город</label>
                <RequiredField />
            </div>
            <div className="city-picker__search">
                <input
                    ref={findCityRef}
                    className="city-picker__input"
                    id="city-picker__input"
                    name="city-picker"
                    placeholder="Введите название города..."
                    onChange={(e) => {
                        applyDisallowedValidatorOnInputChangeForCityInput(e);
                        handleFindCityInput(e);
                    }}
                    autoComplete="off"
                />
                <ValidationOkIcon identifier="city-picker" />
                {renderFindCityResults()}
            </div>
            <div className="photos__label-and-label-description-container">
                <div className="label-container">
                    <label className="label label--photos">Фотографии</label>
                    <RequiredField />
                </div>
                <div className="label-description-container">
                    <p className="paragraph paragraph--light paragraph--label-description">До 5 фотографий</p>
                </div>
            </div>
            <div className="photos__input-container">
                <div className="uploaded-files-container">
                    {renderUploadedFiles() as ReactNode}
                    <div className="add-photo">
                        <label className={`add-button-icon add-photo-icon ${defineAddImageIconClassName()}`}>
                            <input
                                name="spaceImages"
                                className="photos__input"
                                type="file"
                                accept="image/*"
                                onChange={handleUploadSpaceImages}
                                multiple
                                onClick={deactivateAddButtonOnOverload}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div className="provide-space-button-container">
                <button className="button button--primary button--provide-space" onClick={handleSubmitButton}>
                    Предоставить пространство
                </button>
            </div>
        </form>
    );
}
