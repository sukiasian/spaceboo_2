import { MouseEventHandler, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TripleDotButton from '../buttons/TripleDotButton';
import Space from './Space';

interface IAppointedSpacesProps {
    spaces: any[];
    appointmentControlDropdown: JSX.Element;
}

export default function AppointedSpaces({ spaces, appointmentControlDropdown }: IAppointedSpacesProps): JSX.Element {
    const [indexOfSpaceWhereTripleDotsClicked, setIndexOfSpaceWhereTripleDotsClicked] = useState<number>();
    const [appointmentControlDropdownIsOpen, setAppointmentControlDropdownIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { spaceId } = useParams();

    const toggleAppointmentMenuDropdown = (): void => {
        setAppointmentControlDropdownIsOpen((prev) => !prev);
    };

    const renderAppointmentControlDropdown = (): JSX.Element | void => {
        if (appointmentControlDropdownIsOpen) {
            return appointmentControlDropdown;
        }
    };

    // BUG при нажатии на точки все точки становятся активными. так не должно быть
    const renderSpaces = spaces.map((space: any, i) => {
        const handleTripleDotButtonClick: MouseEventHandler<HTMLDivElement> = (e) => {
            if (i !== indexOfSpaceWhereTripleDotsClicked) {
                setAppointmentControlDropdownIsOpen(true);
                setIndexOfSpaceWhereTripleDotsClicked(i);
            } else {
                setAppointmentControlDropdownIsOpen(false);
                setIndexOfSpaceWhereTripleDotsClicked(undefined);
            }
        };

        return (
            <Space space={space} index={i} key={i}>
                <>
                    <TripleDotButton
                        componentClassNames={`triple-dot-button--${i}`}
                        vertical
                        active={indexOfSpaceWhereTripleDotsClicked === i}
                        handleClick={handleTripleDotButtonClick}
                    />
                    {i === indexOfSpaceWhereTripleDotsClicked ? renderAppointmentControlDropdown() : null}
                </>
            </Space>
        );
    });

    return <div className="spaces">{renderSpaces}</div>;
}
