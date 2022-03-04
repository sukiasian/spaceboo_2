import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putEditUserAction, setEditUserData } from '../redux/actions/userActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IEditUserData } from '../redux/reducers/userReducer';
import { EventKey } from '../types/types';

interface IField {
    finalValue?: string;
    label: string;
    inputName: keyof IEditUserData;
    placeholder: string;
    currentValue?: string;
    className?: string;
    type?: string;
    handleInputChange?: ChangeEventHandler<HTMLInputElement> | ((...props: any) => any);
}

// TODO: На каждый failure response выкидывать ошибку!

export default function EditUserInputs(): JSX.Element {
    const [openedInput, setOpenedInput] = useState<keyof IEditUserData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { fetchCurrentUserSuccessResponse, fetchCurrentUserFailureResponse } = useSelector(
        (state: IReduxState) => state.userStorage
    );
    const { editUserData } = useSelector((state: IReduxState) => state.userStorage);
    const fields: IField[] = [
        {
            label: 'Фамилия',
            inputName: 'surname',
            placeholder: 'Фамилия...',
        },
        {
            label: 'Имя',
            inputName: 'name',
            placeholder: 'Имя...',
        },
        {
            label: 'Отчество',
            inputName: 'middleName',
            placeholder: 'Отчество...',
        },
    ];
    const userData = fetchCurrentUserSuccessResponse?.data;
    const setPlaceholderForInput = (): void => {
        if (inputRef.current?.value.length === 0) {
            const inputIndex = parseInt(inputRef.current.dataset['index'] as string, 10);

            inputRef.current.placeholder = fields[inputIndex].placeholder;
        }
    };
    const checkIfInputValueIsEmpty = (): boolean => {
        return openedInput && inputRef.current?.value.length === 0 ? true : false;
    };
    const checkIfClickedOutside = (target: EventTarget): boolean => {
        return inputRef.current && target !== inputRef.current ? true : false;
    };
    const saveInputValueOnOutsideClick = (e: MouseEvent): any => {
        if (checkIfClickedOutside(e.target!) && openedInput) {
            // dispatch to edit user
            dispatch(putEditUserAction(editUserData!));
            closeInput();
        }
    };
    const saveInputValueOnEnter = (e: KeyboardEvent): any => {
        if (openedInput && e.key === EventKey.ENTER) {
            // dispatch to edit user
            closeInput();
        }
    };
    const cancelEditingFieldByKeydown = (e: KeyboardEvent): any => {
        if (openedInput && e.key === EventKey.ESCAPE) {
            closeInput();
        }
    };
    const cancelEditingFieldWhenEmptyByOutsideClick = (e: MouseEvent) => {
        if (checkIfClickedOutside(e.target!) && checkIfInputValueIsEmpty()) {
            closeInput();
        }
    };
    const dispatch = useDispatch();

    // NOTE: если нажат escape то просто возвращается в исходное положение. также это можно сделать если очистить поле и нажать на любое место на экране. либо через клавишу escape.
    // NOTE!!! как быть с мобильными устройствами???
    const applyEffectsOnInit = (): void => {};
    const applyOpenedInputEventListenersEffects = (): (() => void) => {
        if (openedInput) {
            document.addEventListener('keydown', cancelEditingFieldByKeydown);
            document.addEventListener('keydown', saveInputValueOnEnter);
            document.addEventListener('click', saveInputValueOnOutsideClick);
            document.addEventListener('click', cancelEditingFieldWhenEmptyByOutsideClick);

            if (inputRef.current) {
                inputRef.current.value = userData?.[inputRef.current.name];
            }
        }

        return () => {
            document.removeEventListener('keydown', cancelEditingFieldByKeydown);
            document.removeEventListener('keydown', saveInputValueOnEnter);
            document.removeEventListener('click', saveInputValueOnOutsideClick);
            document.removeEventListener('click', cancelEditingFieldWhenEmptyByOutsideClick);
        };
    };
    const openFieldInput = (inputName: keyof IEditUserData): MouseEventHandler => {
        return (e) => {
            const preventInputEventListenerFromInterruptingByDocumentEventListener = e.stopPropagation.bind(e);

            preventInputEventListenerFromInterruptingByDocumentEventListener();
            setOpenedInput(inputName);
        };
    };
    const focusOnInput = (): void => {
        inputRef.current?.focus();
    };
    const closeInput = (): void => {
        setOpenedInput(null);
    };
    const validateInput = () => {};
    const checkIfInputValueIsDifferentFromCurrentUserData = (
        value: string,
        inputName: keyof IEditUserData
    ): boolean => {
        return value !== fetchCurrentUserSuccessResponse!.data[inputName] ? true : false;
    };
    const changeUserEditFieldValue = (fieldIndex: number): ChangeEventHandler<HTMLInputElement> => {
        return (e) => {
            validateInput();

            const { value } = e.target;
            const inputName = fields[fieldIndex].inputName;

            if (checkIfInputValueIsDifferentFromCurrentUserData(value, inputName)) {
                const newEditUserData: IEditUserData = { ...editUserData };

                newEditUserData[inputName] = value;

                dispatch(setEditUserData(newEditUserData));
            }
        };
    };
    const handleErrors = () => {
        if (fetchCurrentUserFailureResponse) {
            // NOTE: можно создать отдельный класс наследующийся от Error по типу AppError. А можно поставить sentry который будет записывать в файлы
            // NOTE: ошибка должна выкидываться в том случае если не выкидывается уведомление
            throw new Error();
        }
    };
    const renderUserEditFields = (): JSX.Element[] => {
        return fields.map((field, i: number) => {
            return (
                <div className={`user-edit-field--${field.inputName}`} key={i}>
                    <label className="user-edit-field__label">{field.label}</label>
                    {openedInput === field.inputName ? (
                        <div className={`user-edit-field__input-container`}>
                            <input
                                className={`user-edit-field__input`}
                                name={field.inputName}
                                onChange={changeUserEditFieldValue(i)}
                                value={field.currentValue}
                                data-index={i}
                                ref={inputRef}
                            />
                        </div>
                    ) : (
                        <>
                            <p
                                className="paragraph user-edit-field-value"
                                onClick={openFieldInput(field.inputName)}
                                key={i}
                            >
                                {userData?.[field.inputName]}
                            </p>
                        </>
                    )}
                </div>
            );
        });
    };
    const renderEmailField = (): JSX.Element => {
        return (
            <div className="user-edit-field--email">
                <label>Эл. почта</label>
                <p>{userData?.email}</p>
            </div>
        );
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleErrors, [fetchCurrentUserFailureResponse]);
    useEffect(focusOnInput);
    useEffect(applyOpenedInputEventListenersEffects, [openedInput]);
    useEffect(setPlaceholderForInput, [inputRef.current?.value]);

    return (
        <div>
            <div>{renderUserEditFields()}</div>
            {renderEmailField()}
        </div>
    );
}

/* 

Задача 1: при нажатии на элемент изначальное значение должно равняться значению 
Задача 2: при нажатии на элемент 

*/
