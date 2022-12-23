import { ChangeEventHandler, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AltButton from '../components/AltButton';
import {
    postRequestLockerAction,
    postReturnRequestAction,
    setLockerRequestPayloadAction,
} from '../redux/actions/lockerRequestsActions';
import { toggleLockerRequestModalAction } from '../redux/actions/modalActions';
import {
    ILockerRequestPayload,
    IRequestLockerConnectionPayload,
    IRequestReturnLockerPayload,
} from '../redux/reducers/lockerRequestsReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { handleFormSubmit } from '../utils/utilFunctions';

interface IProps {
    lockerId: string;
    spaceId: string;
}

export default function LockerConnectionAndReturnRequestForm(props: IProps): JSX.Element {
    const { lockerId, spaceId } = props;
    const { requestLockerPayload } = useSelector((state: IReduxState) => state.lockerRequestsStorage);

    const dispatch = useDispatch();

    const setSpaceIdOnInit = (): void => {
        const newPayload = { ...requestLockerPayload };

        newPayload.spaceId = spaceId;

        dispatch(setLockerRequestPayloadAction(newPayload));
    };

    const defineActiveOrInactiveButtonClassName = (): string => {
        if (!requestLockerPayload) {
            return 'button--inactive';
        }

        let key: keyof IRequestLockerConnectionPayload;

        for (key in requestLockerPayload) {
            if (!requestLockerPayload[key]) {
                return 'button--inactive';
            }
        }

        return 'button--active';
    };

    const setFields: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newPayload: ILockerRequestPayload = { ...requestLockerPayload };

        // @ts-ignore
        newPayload[e.target.name] = e.target.value;

        dispatch(setLockerRequestPayloadAction(newPayload));
    };

    const submitForm = () => {
        if (requestLockerPayload) {
            lockerId
                ? dispatch(postReturnRequestAction(requestLockerPayload))
                : dispatch(postRequestLockerAction(requestLockerPayload));

            dispatch(toggleLockerRequestModalAction());
        }
    };

    useEffect(setSpaceIdOnInit, []);

    return (
        <form className="form locker-connection-or-return-request-form" onSubmit={handleFormSubmit}>
            <div className="phone-number-input-container">
                <label> Номер телефона </label>
                <input name={'phoneNumber' as keyof IRequestReturnLockerPayload} type="tel" onChange={setFields} />
            </div>
            <AltButton
                mainDivClassName={`button--primary ${defineActiveOrInactiveButtonClassName()}`}
                buttonText="Отправить заявку"
                handleClick={submitForm}
            />
        </form>
    );
}
