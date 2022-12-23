import { ChangeEventHandler, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postPairLockerAction, setPostPairLockerPayloadAction } from '../redux/actions/adminActions';
import { ICreateLockerPayload } from '../redux/reducers/adminReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { preventDefault } from '../utils/utilFunctions';

interface IProps {
    spaceId: string;
}

interface IFormField {
    label: string;
    name: keyof ICreateLockerPayload;
    type?: string;
    className?: string;
}

export default function PairLockerForm(props: IProps): JSX.Element {
    const { spaceId } = props;

    const { postPairLockerPayload } = useSelector((state: IReduxState) => state.adminStorage);

    const dispatch = useDispatch();

    const fields: IFormField[] = [
        {
            label: 'Locker ID',
            name: 'id',
            type: 'text',
            className: 'locker-id-input',
        },
        {
            label: 'TTLockEmail',
            name: 'ttlockEmail',
            type: 'email',
            className: 'locker-email-input',
        },
        {
            label: 'TTLock Password',
            name: 'ttlockPassword',
            type: 'password',
            className: 'locker-password-input',
        },
    ];

    const pairLocker = (): void => {
        for (const key in postPairLockerPayload) {
            if (!postPairLockerPayload[key as keyof ICreateLockerPayload]) {
                return;
            }
        }

        dispatch(postPairLockerAction(postPairLockerPayload!));
    };

    const setFieldValue: ChangeEventHandler<HTMLInputElement> = (e): void => {
        const newPairLockerPayload: ICreateLockerPayload = { ...postPairLockerPayload! };

        const inputName = e.target.name as keyof ICreateLockerPayload;

        newPairLockerPayload[inputName] = e.target.value;

        dispatch(setPostPairLockerPayloadAction(newPairLockerPayload));
    };

    const renderInputs = fields.map((field: IFormField, i: number) => (
        <div className={`add-locker-form__input add-locker-form__input--${i}`} key={i}>
            <label>{field.label}</label>
            <input className="input locker-id-input" name={field.name} onChange={setFieldValue} />
        </div>
    ));

    const setPairLockerPayloadOnInit = (): void => {
        dispatch(
            setPostPairLockerPayloadAction({
                ttlockEmail: '',
                ttlockPassword: '',
                id: '',
            } as ICreateLockerPayload)
        );
    };

    const setSpaceIdOnInit = (): void => {
        // NOTE: где достать spaceId
        dispatch(setPostPairLockerPayloadAction({ ...postPairLockerPayload, spaceId } as ICreateLockerPayload));
    };

    const applyEffectsOnInit = (): void => {
        setPairLockerPayloadOnInit();
        setSpaceIdOnInit();
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <form className="form add-locker-form" onSubmit={preventDefault}>
            {renderInputs}
            <div>
                <button onClick={pairLocker}> Подключить локер к пространству </button>
            </div>
        </form>
    );
}
