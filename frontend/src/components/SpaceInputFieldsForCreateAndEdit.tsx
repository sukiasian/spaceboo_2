import { ChangeEvent, ChangeEventHandler, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IAction } from '../redux/actions/ActionTypes';
import {
    annualizeFoundBySearchPatternCitiesAction,
    fetchCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import { setPutEditSpaceDataAction, setPostProvideSpaceDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import {
    IProvideSpaceData,
    IEditSpaceData,
    SpaceType,
    ISpaceFormData,
    IPutEditSpacePayload,
} from '../redux/reducers/spaceReducer';
import { ReduxSpaceActions } from '../types/types';
import { valueIsNumeric } from '../utils/utilFunctions';
import Checkbox from './Checkbox';
import RequiredField from './RequiredField';

type TFormDataForComponent = IProvideSpaceData | IEditSpaceData;

interface ISpaceInputFieldsForCreateAndEditProps {
    buttonClassName: string;
    buttonText: string;
    componentIsFor: keyof ISpaceFormData;
    handleSubmitButton: (...props: any) => any;
    children?: JSX.Element;
}
interface ITypeOfSpaceInputData {
    spaceType: SpaceType;
}
interface IReduxSetFormDataActionsFor {
    provideSpaceData: (payload: IProvideSpaceData) => IAction<ReduxSpaceActions, IProvideSpaceData>;
    editSpaceData: (payload: IPutEditSpacePayload) => IAction<ReduxSpaceActions, IPutEditSpacePayload>;
}

export default function SpaceInputFieldsForCreateAndEdit(props: ISpaceInputFieldsForCreateAndEditProps): JSX.Element {
    const { buttonClassName, buttonText, componentIsFor, handleSubmitButton, children } = props;
    const findCityRef = useRef<HTMLInputElement>(null);
    const formData = useSelector((state: IReduxState) => state.spaceStorage[componentIsFor]);
    const { fetchCitiesByPatternSuccessResponse } = useSelector((state: IReduxState) => state.cityStorage);
    const dispatch = useDispatch();
    const reduxSetFormDataActionsFor: IReduxSetFormDataActionsFor = {
        provideSpaceData: setPostProvideSpaceDataAction,
        editSpaceData: setPutEditSpaceDataAction,
    };
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
    const reduxSetFormDataActionForComponent = reduxSetFormDataActionsFor[componentIsFor];
    const applyDropdownValuesToFormDataOnInit = (): void => {
        const newFormData: TFormDataForComponent = { ...formData };

        newFormData.roomsNumber = initialRoomsNumber;
        newFormData.bedsNumber = initialBedsNumber;

        dispatch(reduxSetFormDataActionForComponent({ editSpaceData: newFormData, spaceId: 'space' }));
    };
    const applyEffectsOnInit = (): void => {
        applyDropdownValuesToFormDataOnInit();
    };
    const handleTypeOfSpaceBoxCheckingBySpaceType = (spaceType: SpaceType): (() => void) => {
        return () => {
            const newFormData: TFormDataForComponent = { ...formData };

            newFormData.type = spaceType;

            dispatch(reduxSetFormDataActionForComponent(newFormData));
        };
    };
    const handleRoomsNumberDropDownSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const newFormData: TFormDataForComponent = { ...formData };

        newFormData.roomsNumber = parseInt(e.target.value, 10);

        dispatch(reduxSetFormDataActionForComponent(newFormData));
    };
    const handleInputChangeByFormDataProperty = (
        formDataProp: keyof TFormDataForComponent
    ): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            const newFormData: TFormDataForComponent = { ...formData };

            // @ts-ignore
            newFormData[formDataProp] = e.target.value as string;

            dispatch(reduxSetFormDataActionForComponent(newFormData));
        };
    };
    const handlePriceInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: TFormDataForComponent = { ...formData };
        const value = e.target.value;

        if (valueIsNumeric(value)) {
            newFormData.pricePerNight = parseInt(value, 10);
        } else if (e.target.value.length !== 0) {
            e.target.value = newFormData.pricePerNight?.toString() || '';
        } else {
            newFormData.pricePerNight = undefined;

            e.target.value = '';
        }

        dispatch(reduxSetFormDataActionForComponent(newFormData));
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
            const newFormData: TFormDataForComponent = { ...formData };

            newFormData.cityId = city.id;

            dispatch(reduxSetFormDataActionForComponent(newFormData));

            findCityRef.current!.value = city.name;

            annualizeFoundBySearchPatternCities();
        };
    };
    const handleUploadSpaceImages: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: TFormDataForComponent = { ...formData };

        if (e.target.files) {
            const spaceImages = transformSpaceImagesFileListIntoArray(e.target.files);

            newFormData.spaceImages = [...(newFormData.spaceImages || []), ...spaceImages];
        }

        dispatch(reduxSetFormDataActionForComponent(newFormData));
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
            const newSpaceImagesList = formData?.spaceImages!.filter((el: File) => el !== imageToRemove);
            const newFormData: TFormDataForComponent = { ...formData };

            newFormData.spaceImages = newSpaceImagesList;

            dispatch(reduxSetFormDataActionForComponent(newFormData));
        };
    };
    const separateCityNameFromRegionIfCityNameContains = (cityName: string) => {
        const cityNameValuesSeparately = cityName.split(' ');

        return cityNameValuesSeparately[0];
    };
    const renderTypeOfSpaceCheckboxes = (): JSX.Element[] => {
        return typeOfSpaceInputsData.map((typeOfSpaceInputData: ITypeOfSpaceInputData, i: number) => {
            const checkboxIsChecked = typeOfSpaceInputData.spaceType === formData?.type;

            return (
                <div
                    className="type-of-space__checkbox"
                    onClick={handleTypeOfSpaceBoxCheckingBySpaceType(typeOfSpaceInputData.spaceType)}
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
    const renderUploadedFiles = (): JSX.Element[] | void => {
        const spaceImages = formData?.spaceImages;

        if (spaceImages) {
            const spaces = spaceImages.map((file: File, i: number) => {
                const src = URL.createObjectURL(file);

                return (
                    <div className="images-to-upload-container" key={i}>
                        <img className="image-to-upload" src={src} alt="Загруженное изображение" />
                        <div className="remove-image-to-upload" onClick={removeSpaceImageFromList(file)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                );
            });

            return spaces;
        }
    };
    const renderChildren = (): JSX.Element | void => {
        if (children) {
            return children;
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <>
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
                {/*  NOTE if here we use select tag then in dropdown menus we should also use that in other places and vice versa*/}
                <div className="rooms-number__dropdown-container">
                    <select
                        className="rooms-number__dropdown"
                        onChange={handleRoomsNumberDropDownSelect}
                        defaultValue={initialRoomsNumber}
                    >
                        {renderDropdownNumericalOptions()}
                    </select>
                </div>
            </div>
            <div className="space-input-fields--description">
                <div className="description__label-container">
                    <label className="label label--description">Описание</label>
                </div>
                <div className="description__input-container">
                    <input
                        className="description__input"
                        type="text"
                        placeholder="Добавьте описание..."
                        onChange={handleInputChangeByFormDataProperty('description')}
                    />
                </div>
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
                <div className="address__input-container">
                    <input
                        className="address__input"
                        type="text"
                        placeholder="Введите адрес..."
                        onChange={handleInputChangeByFormDataProperty('address')}
                    />
                </div>
            </div>
            <div className="space-input-fields--price-per-night">
                <div className="label-container">
                    <label className="label label--price-per-night">Цена за 1 ночь</label>
                    <RequiredField />
                </div>
                <div className="price-per-night__input-container">
                    <input
                        className="price-per-night__input"
                        type="tel"
                        placeholder="Укажите цену за 1 ночь..."
                        onChange={handlePriceInput}
                    />
                </div>
            </div>
            <div className="city-picker__search">
                <input
                    ref={findCityRef}
                    className="city-picker__input"
                    name="city-picker__input"
                    placeholder="Введите название города..."
                    onChange={handleFindCityInput}
                    autoComplete="off"
                />
                {renderFindCityResults()}
            </div>
            <div className="space-input-fields--photos">
                <div className="photos__label-and-label-description-container">
                    <div className="label-container">
                        <label className="label label--address">Адрес</label>
                        <RequiredField />
                    </div>
                    <div className="label-description-container">
                        <p className="paragraph paragraph--light paragraph--label-description">До 5 фотографий</p>
                    </div>
                </div>
                <div className="address__input-container">
                    {renderUploadedFiles()}
                    <label
                        className="add-button-icon"
                        // TODO this is a working  example to go with in css
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
            {renderChildren()}

            <button className={buttonClassName} onClick={handleSubmitButton}>
                {buttonText}
            </button>
        </>
    );
}
