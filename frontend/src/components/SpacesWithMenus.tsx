import React, { MouseEventHandler, useEffect, useState } from 'react';
import AddButton from '../buttons/AddButton';
import TripleDotButton from '../buttons/TripleDotButton';
import Space from './Space';

interface ISpacesWithMenusProps {
    spaces: any[];
    childrenRequiredDemountingHandler: boolean;
    childrenRequiredArgument?: string;
    children?: (...props: any) => JSX.Element;
}

export default function SpacesWithMenus(props: ISpacesWithMenusProps): JSX.Element {
    const { spaces, childrenRequiredDemountingHandler } = props;

    const [indexOfSpaceWhereTripleDotsClicked, setIndexOfSpaceWhereTripleDotsClicked] = useState<number>();

    const handleTripleDotButtonClick = (i: number): MouseEventHandler<HTMLDivElement> => {
        return () => {
            if (i !== indexOfSpaceWhereTripleDotsClicked) {
                //  setAppointmentControlDropdownIsOpen(true);
                setIndexOfSpaceWhereTripleDotsClicked(i);
            } else {
                //  setAppointmentControlDropdownIsOpen(false);
                setIndexOfSpaceWhereTripleDotsClicked(undefined);
            }
        };
    };

    const renderChildren = (space: Record<any, any>): JSX.Element => {
        if (props.childrenRequiredArgument && childrenRequiredDemountingHandler) {
            return props.children!(
                space[props.childrenRequiredArgument],
                () => setIndexOfSpaceWhereTripleDotsClicked(undefined),
                space.lockerId
            );
        } else if (props.childrenRequiredArgument && !childrenRequiredDemountingHandler) {
            return props.children!(space[props.childrenRequiredArgument], null, space.lockerId);
        } else if (!props.childrenRequiredArgument && childrenRequiredDemountingHandler) {
            return props.children!(null, () => setIndexOfSpaceWhereTripleDotsClicked(undefined), space.lockerId);
        }

        return props.children!();
    };

    const renderSpaces = spaces?.map((space, i: number) => (
        <React.Fragment key={i}>
            <Space space={space} index={i}>
                <TripleDotButton
                    componentClassNames={`triple-dot-button--${i}`}
                    vertical
                    active={indexOfSpaceWhereTripleDotsClicked === i}
                    handleClick={handleTripleDotButtonClick(i)}
                />
            </Space>
            {i === indexOfSpaceWhereTripleDotsClicked ? renderChildren(space) : null}
        </React.Fragment>
    ));

    useEffect(() => {
        return () => {
            setIndexOfSpaceWhereTripleDotsClicked(undefined);
        };
    }, []);

    return <>{renderSpaces}</>;
}
