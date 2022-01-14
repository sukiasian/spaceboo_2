import { ChangeEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAction } from '../redux/actions/ActionTypes';
import { setEditSpaceDataAction, setProvideSpaceDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IProvideSpaceData, IEditSpaceData, SpaceType, ISpaceFormData } from '../redux/reducers/spaceReducer';
import { ReduxSpaceActions } from '../types/types';
import Checkbox from './Checkbox';
import RequiredField from './RequiredField';

type TFormDataForComponent = IProvideSpaceData | IEditSpaceData;

interface ISpaceInputFieldsForCreateAndEditProps {
    buttonClassName: string;
    buttonText: string;
    componentIsFor: keyof ISpaceFormData;
    handleSubmitButton: (...props: any) => any;
}
interface ITypeOfSpaceInputData {
    spaceType: SpaceType;
}
interface IReduxActionsFor {
    provideSpaceData: (payload: IProvideSpaceData) => IAction<ReduxSpaceActions>;
    editSpaceData: (payload: IEditSpaceData) => IAction<ReduxSpaceActions>;
}

export default function SpaceInputFieldsForCreateAndEdit(props: ISpaceInputFieldsForCreateAndEditProps): JSX.Element {
    const [inapropriateFileDimensions, setInapropriateFileDimensions] = useState(false);
    const formData = useSelector((state: IReduxState) => state.spaceStorage[props.componentIsFor]);
    const dispatch = useDispatch();
    const reduxActionsFor: IReduxActionsFor = {
        provideSpaceData: setProvideSpaceDataAction,
        editSpaceData: setEditSpaceDataAction,
    };
    const roomsMaximumNumber = 11;
    const typeOfSpaceInputsData: ITypeOfSpaceInputData[] = [
        {
            spaceType: SpaceType.FLAT,
        },
        {
            spaceType: SpaceType.HOUSE,
        },
    ];
    const reduxActionForComponent = reduxActionsFor[props.componentIsFor];
    const handleTypeOfSpaceBoxCheckingBySpaceType = (spaceType: SpaceType): (() => void) => {
        return () => {
            const newFormData: TFormDataForComponent = { ...formData };

            newFormData.type = spaceType;

            dispatch(reduxActionForComponent(newFormData));
        };
    };
    const handleRoomsNumberDropDownSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const newFormData: TFormDataForComponent = { ...formData };

        newFormData.roomsNumber = parseInt(e.target.value, 10);

        dispatch(reduxActionForComponent(newFormData));
    };
    // FIXME type
    const handleDescriptionChange = (
        formDataProp: keyof TFormDataForComponent
    ): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            const newFormData: TFormDataForComponent = { ...formData };

            // @ts-ignore happens beсause e.t.value === string and newFormData[formDataProp] can be not string but any other thing
            newFormData[formDataProp] = e.target.value as string;

            dispatch(reduxActionForComponent(newFormData));
        };
    };
    const handleUploadFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.files) {
            e.preventDefault();

            const { files } = e.target;
            const file = files.length > 0 ? files[files.length - 1] : files[0];
            const img = new Image();

            img.src = window.URL.createObjectURL(file);

            const handleImageLoad = (): void => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;

                window.URL.revokeObjectURL(img.src);

                if (width >= 800 && height >= 600) {
                    const newFormData: TFormDataForComponent = { ...formData };
                }
            };
            img.onload = (): void => {};
        }
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

    // NOTE неправильное использование BEM практически везде
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
                        defaultValue={2}
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
                        onChange={handleDescriptionChange('description')}
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
                        defaultValue={2}
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
                        onChange={handleDescriptionChange('address')}
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
                        className="photos__input"
                        type="file"
                        onChange={(e) => {
                            console.log(e.target.value);
                        }}
                        multiple
                    />
                    {renderUploadedFiles()}
                </div>
            </div>
            <button className={props.buttonClassName} onClick={props.handleSubmitButton}>
                {props.buttonText}
            </button>
        </>
    );
}
