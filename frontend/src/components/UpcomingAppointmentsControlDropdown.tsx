interface IAppointmentControlDropdownProps {
    cancelAppointment: (...props: any) => any;
    cancelAppointmentClassNames?: string;
}

interface IOption {
    name: string;
    handleClick: (...props: any) => any;
    classNames?: string;
}

type TOptions = IOption[];

export default function AppointmentControlDropdown({
    cancelAppointment,
    cancelAppointmentClassNames,
}: IAppointmentControlDropdownProps): JSX.Element {
    const options: TOptions = [
        {
            name: 'Отменить бронирование',
            handleClick: cancelAppointment,
            classNames: cancelAppointmentClassNames,
        },
    ];

    const renderOptions = options.map((option, i: number) => {
        return (
            <div
                className={`appointment-control-drop-down-option appointment-control-drop-down-option--${i} ${
                    option.classNames || ''
                }`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    option.handleClick();
                }}
                key={i}
            >
                {option.name}
            </div>
        );
    });

    return (
        <div className="appointment-control-drop-down-container">
            <div
                className="drop-down appointment-control-drop-down"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div className="appointment-control-options">{renderOptions}</div>
            </div>
        </div>
    );
}
