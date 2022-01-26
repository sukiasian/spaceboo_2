import { ChangeEventHandler, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAction } from '../redux/actions/ActionTypes';
import { setEditSpaceDataAction, setProvideSpaceDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IProvideSpaceData, IEditSpaceData, SpaceType, ISpaceFormData } from '../redux/reducers/spaceReducer';
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
    provideSpaceData: (payload: IProvideSpaceData) => IAction<ReduxSpaceActions>;
    editSpaceData: (payload: IEditSpaceData) => IAction<ReduxSpaceActions>;
}

export default function SpaceInputFieldsForCreateAndEdit(props: ISpaceInputFieldsForCreateAndEditProps): JSX.Element {
    const formData = useSelector((state: IReduxState) => state.spaceStorage[props.componentIsFor]);
    const dispatch = useDispatch();
    const reduxSetFormDataActionsFor: IReduxSetFormDataActionsFor = {
        provideSpaceData: setProvideSpaceDataAction,
        editSpaceData: setEditSpaceDataAction,
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
    const reduxSetFormDataActionForComponent = reduxSetFormDataActionsFor[props.componentIsFor];
    const applyDropdownValuesToFormDataOnInit = (): void => {
        const newFormData: TFormDataForComponent = { ...formData };

        newFormData.roomsNumber = initialRoomsNumber;
        newFormData.bedsNumber = initialBedsNumber;

        dispatch(reduxSetFormDataActionForComponent(newFormData));
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
    // FIXME type
    const handleInputChangeByFormDataProperty = (
        formDataProp: keyof TFormDataForComponent
    ): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            const newFormData: TFormDataForComponent = { ...formData };

            // @ts-ignore happens beсause e.t.value === string and newFormData[formDataProp] can be not string but any other thing
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
    const handleUploadSpaceImages: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newFormData: TFormDataForComponent = { ...formData };

        if (e.target.files) {
            newFormData.spaceImages = e.target.files;
        }

        dispatch(reduxSetFormDataActionForComponent(newFormData));
    };
    const renderTypeOfSpaceCheckboxes = (): JSX.Element[] => {
        return typeOfSpaceInputsData.map((typeOfSpaceInputData: ITypeOfSpaceInputData, i: number) => {
            const checkboxIsChecked = typeOfSpaceInputData.spaceType === formData!.type;

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
    const renderUploadedFiles = () => {
        return <img src="" alt="Загруженное изображение" />;
    };
    const renderChildren = (): JSX.Element | void => {
        if (props.children) {
            return props.children;
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
                {/*  NOTE if here we use select tag then in dropdown menus we should also use that */}
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
            {/*  TODO здесь должен быть ситипикер но он выполнен только для хедера. Нужно его переделать так чтобы он подходил для всех  */}
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
            <div className="space-input-fields--photos">
                <div className="photos__label-and-label-description-container">
                    <div className="label-container">
                        <label className="label label--address">Адрес</label>
                        <RequiredField />
                    </div>
                    <div className="label-description-container">
                        <p className="paragraph paragraph--light paragraph--label-description">До 10 фотографий</p>
                    </div>
                </div>
                <div className="address__input-container">
                    <input
                        name="spaceImages"
                        className="photos__input"
                        type="file"
                        accept=".jpeg,.jpg,.png,.svg"
                        onChange={handleUploadSpaceImages}
                        multiple
                    />
                    {renderUploadedFiles()}
                </div>
            </div>
            {renderChildren()}
            <button className={props.buttonClassName} onClick={props.handleSubmitButton}>
                {props.buttonText}
            </button>
        </>
    );
}
