import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestUserLoginState } from '../redux/actions/authActions';
import { postCheckVerificationCodeAction } from '../redux/actions/emailVerificationActions';
import { IPostCheckVerificationEmailCodePayload } from '../redux/reducers/emailVerificationReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { HttpStatus } from '../types/types';
import { allowNumericInputValueOnly } from '../utils/utilFunctions';

type TDigitInput = { value?: string; ref: React.RefObject<HTMLInputElement> };
type TSixDigitInputs = [TDigitInput, TDigitInput, TDigitInput, TDigitInput, TDigitInput, TDigitInput];

export default function SixDigitVerification(): JSX.Element {
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const [digitInputs, setDigitInputs] = useState<TSixDigitInputs>([
        { ref: inputRefs[0] },
        { ref: inputRefs[1] },
        { ref: inputRefs[2] },
        { ref: inputRefs[3] },
        { ref: inputRefs[4] },
        { ref: inputRefs[5] },
    ]);
    const { checkVerificationCodeResponse } = useSelector((state: IReduxState) => state.emailVerificationStorage);
    const dispatch = useDispatch();
    const updateUserInformationAfterCheckingCode = () => {
        if (checkVerificationCodeResponse && checkVerificationCodeResponse.statusCode === HttpStatus.OK) {
            dispatch(requestUserLoginState());
        }
    };
    const focusOnFirstInput = (): void => {
        inputRefs[0].current!.focus();
    };
    const applyEffectsOnInit = (): void => {
        focusOnFirstInput();
    };
    const handleDigitInput = (i: number): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e) => {
            const { value } = e.target;
            const newDigitInputs: TSixDigitInputs = [...digitInputs];

            if (e.target.value.length === 1) {
                const valueRegExp = value.match(/[^0-9]/gm);

                if (!allowNumericInputValueOnly(e.target.value)) {
                    e.target.value = '';

                    return;
                }

                if (i < digitInputs.length - 1) {
                    inputRefs[i + 1].current!.focus();
                } else if (i === digitInputs.length - 1) {
                    inputRefs[i].current!.blur();
                }
            }

            newDigitInputs[i].value = value;
            setDigitInputs(newDigitInputs);
        };
    };
    const handleKeyDown = (i: number): ((e: React.KeyboardEvent<HTMLInputElement>) => void) => {
        return (e) => {
            if (i !== 0 && !digitInputs[i].value && e.key === 'Backspace') {
                inputRefs[i - 1].current!.focus();
            }
        };
    };
    const annualizeInputValue = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        e.currentTarget.value = '';
    };
    const checkCodeToConfirmAccount = () => {
        for (const digitInput of digitInputs) {
            if (!digitInput.value) {
                return;
            }
        }

        const digits = digitInputs.map((digitInput: TDigitInput) => digitInput.value);
        const currentCode = parseInt(digits.join(''), 10);
        const payload: IPostCheckVerificationEmailCodePayload = {
            currentCode,
            confirmation: true,
        };

        dispatch(postCheckVerificationCodeAction(payload));
    };
    const renderDigitInputs = (): JSX.Element[] => {
        return digitInputs.map((digitInput: TDigitInput, i: number) => {
            return (
                <input
                    ref={digitInput.ref}
                    className={`code-verification__digit-input code-verification__digit-input--${i}`}
                    maxLength={1}
                    type="tel"
                    onKeyPress={annualizeInputValue}
                    onInput={handleDigitInput(i)}
                    onKeyDown={handleKeyDown(i)}
                    key={i}
                />
            );
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(applyEffectsOnInit, []);
    // TODO we can use one custom effect to not pass dispatch every time to dependencies list in useEffect
    useEffect(checkCodeToConfirmAccount, [digitInputs, dispatch]);
    useEffect(updateUserInformationAfterCheckingCode, [checkVerificationCodeResponse, dispatch]);

    return <form className="code-verificaion"> {renderDigitInputs()} </form>;
}
