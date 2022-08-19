import { ChangeEvent, ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUserAction, putEditUserAction, setEditUserData } from '../redux/actions/userActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IEditUserData } from '../redux/reducers/userReducer';
import { AlertType, EventKey } from '../types/types';
import ValidationAlert from './ValidationAlert';

interface IField {
    finalValue?: string;
    label: string;
    inputName: keyof IEditUserData;
    placeholder: string;
    currentValue?: string;
    className?: string;
    type?: string;
    handleInputChange?: ChangeEventHandler<HTMLInputElement> | ((...props: any) => any);
    validator?: ChangeEventHandler<HTMLInputElement>;
}

// TODO: На каждый failure response выкидывать ошибку!

export default function EditUserInputs(): JSX.Element {
    const [openedInput, setOpenedInput] = useState<keyof IEditUserData | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [validationErrorIsActive, setValidationErrorIsActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { fetchCurrentUserSuccessResponse, fetchCurrentUserFailureResponse, putEditUserSuccessResponse } =
        useSelector((state: IReduxState) => state.userStorage);
    const { editUserData } = useSelector((state: IReduxState) => state.userStorage);
    const fields: IField[] = [
        {
            label: 'Фамилия',
            inputName: 'surname',
            placeholder: 'Фамилия...',
            validator: (e) => {
                // TODO вынести проверку на кириллицу в качестве утил функции
                cleanValidateClassNamesBeforeValidation(e);
                cleanValidationErrorBeforeValidation();

                if (e.target.value.length < 3) {
                    e.target.classList.add('validator--disallowed');
                    setValidationError('Имя должно состоять не менее 3-х символов.');

                    return;
                } else if (e.target.value.search(/[^а-яА-Я]/) !== -1) {
                    e.target.classList.add('validator--disallowed');
                    setValidationError('Имя должно быть на кириллице и не содержать знаков и символов.');

                    return;
                }

                setTimeout(() => {
                    setValidationErrorIsActive(false);
                }, 3000);
                e.target.classList.add('validator--allowed');
            },
        },
        {
            label: 'Имя',
            inputName: 'name',
            placeholder: 'Имя...',
            validator: (e) => {
                cleanValidateClassNamesBeforeValidation(e);

                if (e.target.value.length < 3 || e.target.value.search(/[^а-яА-Я]/) !== -1) {
                    e.target.classList.add('validator--disallowed');
                } else {
                    e.target.classList.add('validator--allowed');
                }
            },
        },
        {
            label: 'Отчество',
            inputName: 'middleName',
            placeholder: 'Отчество...',
            validator: (e) => {
                cleanValidateClassNamesBeforeValidation(e);

                if (e.target.value.length < 5 || e.target.value.search(/[^а-яА-Я]/) !== -1) {
                    e.target.classList.add('validator--disallowed');

                    return;
                }

                e.target.classList.add('validator--allowed');
            },
        },
    ];

    const userData = fetchCurrentUserSuccessResponse?.data;
    const dispatch = useDispatch();
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
    const changeUserEditFieldValueAndCloseInput = (): void => {
        const { value } = inputRef.current!;
        const inputName = inputRef.current!.name as keyof IEditUserData;

        if (checkIfInputValueIsDifferentFromCurrentUserData(value, inputName)) {
            const newEditUserData: IEditUserData = { ...editUserData };

            newEditUserData[inputName] = uppercaseFieldFirstLetter(value);

            dispatch(setEditUserData(newEditUserData));
        }

        closeInput();
    };
    const saveInputValueOnOutsideClick = (e: MouseEvent): any => {
        if (checkIfClickedOutside(e.target!) && openedInput) {
            changeUserEditFieldValueAndCloseInput();
        }
    };
    const saveInputValueOnEnter = (e: KeyboardEvent): any => {
        if (openedInput && e.key === EventKey.ENTER) {
            changeUserEditFieldValueAndCloseInput();
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
    const changeActiveInputFieldOnTabPress = (e: KeyboardEvent) => {
        if (e.key === EventKey.TAB) {
            fields.forEach((field, i) => {
                if (field.inputName === openedInput) {
                    if (i < fields.length - 1 && field.inputName === openedInput) {
                        setOpenedInput(fields[i + 1].inputName);
                    } else if (i === fields.length - 1) {
                        e.preventDefault();
                        setOpenedInput(fields[0].inputName);
                    }
                }
            });
        }
    };
    // NOTE: если нажат escape то просто возвращается в исходное положение. также это можно сделать если очистить поле и нажать на любое место на экране. либо через клавишу escape.
    // NOTE!!! как быть с мобильными устройствами???
    const applyEffectsOnInit = (): void => {};
    const applyOpenedInputEventListenersEffects = (): (() => void) => {
        if (openedInput) {
            document.addEventListener('keydown', cancelEditingFieldByKeydown);
            document.addEventListener('click', cancelEditingFieldWhenEmptyByOutsideClick);
            document.addEventListener('keydown', saveInputValueOnEnter);
            document.addEventListener('click', saveInputValueOnOutsideClick);
            document.addEventListener('keydown', changeActiveInputFieldOnTabPress);

            if (inputRef.current) {
                inputRef.current.value = userData?.[inputRef.current.name];
            }
        }

        return () => {
            document.removeEventListener('keydown', cancelEditingFieldByKeydown);
            document.removeEventListener('click', cancelEditingFieldWhenEmptyByOutsideClick);
            document.removeEventListener('keydown', saveInputValueOnEnter);
            document.removeEventListener('click', saveInputValueOnOutsideClick);
            document.removeEventListener('keydown', changeActiveInputFieldOnTabPress);
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
    const cleanValidateClassNamesBeforeValidation = (e: ChangeEvent): void => {
        const disallowedClassName = 'validator--disallowed';
        const allowedClassName = 'validator--allowed';

        if (e.target.classList.contains(disallowedClassName)) {
            e.target.classList.remove(disallowedClassName);
        } else if (e.target.classList.contains(allowedClassName)) {
            e.target.classList.remove(allowedClassName);
        }
    };
    const cleanValidationErrorBeforeValidation = (): void => {
        if (validationError) {
            setValidationError(null);
        }
    };
    const uppercaseFieldFirstLetter = (value: string): string => {
        return `${value[0].toUpperCase()}${value.substring(1).toLowerCase()}`;
    };
    const checkIfInputValueIsDifferentFromCurrentUserData = (
        value: string,
        inputName: keyof IEditUserData
    ): boolean => {
        return value !== fetchCurrentUserSuccessResponse!.data[inputName] ? true : false;
    };
    const handleErrors = () => {
        if (fetchCurrentUserFailureResponse) {
            // NOTE: можно создать отдельный класс наследующийся от Error по типу AppError. А можно поставить sentry который будет записывать в файлы
            // NOTE: ошибка должна выкидываться в том случае если не выкидывается уведомление
            throw new Error();
        }
    };
    const updateUserData = (): void => {
        dispatch(putEditUserAction(editUserData!));
    };
    const updateCurrentUser = (): void => {
        dispatch(fetchCurrentUserAction());
    };
    const renderUserEditFields = (): JSX.Element[] => {
        return fields.map((field, i: number) => {
            return (
                <div className={`user-edit-field user-edit-field--${field.inputName}`} key={i}>
                    <label className="label user-edit-field__label">{field.label}</label>
                    {openedInput === field.inputName ? (
                        <div className={`user-edit-field__input-container`}>
                            <input
                                className={`input user-edit-field__input`}
                                name={field.inputName}
                                value={field.currentValue}
                                data-index={i}
                                onChange={field.validator}
                                ref={inputRef}
                            />
                        </div>
                    ) : (
                        <p
                            className="paragraph user-edit-field-value"
                            onClick={openFieldInput(field.inputName)}
                            key={i}
                        >
                            {userData?.[field.inputName]}
                        </p>
                    )}
                </div>
            );
        });
    };
    const renderEmailField = (): JSX.Element => {
        return (
            <div className="user-edit-field--email">
                <label className="label user-edit-field--email__label">Эл. почта</label>
                <p>{userData?.email}</p>
            </div>
        );
    };
    const renderErrorNotificationAlert = (): JSX.Element | void => {
        if (validationErrorIsActive) {
            return <ValidationAlert alertType={AlertType.FAILURE} message={validationError!} />;
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleErrors, [fetchCurrentUserFailureResponse]);
    useEffect(focusOnInput);
    useEffect(applyOpenedInputEventListenersEffects, [openedInput]);
    useEffect(setPlaceholderForInput, [inputRef.current?.value]);
    useEffect(updateUserData, [editUserData]);
    useEffect(updateCurrentUser, [putEditUserSuccessResponse]);
    useEffect(() => {
        if (validationError) {
            setValidationErrorIsActive(true);
        }
    }, [validationError]);
    // useEffect(() => {
    //     if (validationErrorIsActive) {
    //         console.log('since validation error is active we create a timeoutww');

    //         // setTimeout(() => setValidationErrorIsActive(false), 3000);
    //     }
    // }, [validationErrorIsActive]);

    return (
        <>
            {renderUserEditFields()}
            {renderEmailField()}
            {renderErrorNotificationAlert()}
        </>
    );
}
