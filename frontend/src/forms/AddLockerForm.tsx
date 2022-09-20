export default function AddLockerForm(): JSX.Element {
    return (
        <form className="form add-locker-form">
            <div className="add-locker-form__input add-locker-form__input--1">
                <label>Locker ID</label>
                <input className="input locker-id-input" />
            </div>
            <div className="add-locker-form__input add-locker-form__input--2">
                <label>TTLock Email</label>
                <input className="input locker-id-input" />
            </div>
            <div className="add-locker-form__input add-locker-form__input--3">
                <label>TTLock Password</label>
                <input className="input locker-id-input" />
            </div>
        </form>
    );
}
