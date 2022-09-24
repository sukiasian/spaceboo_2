import { MouseEventHandler, useState } from 'react';
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
            return props.children!(space[props.childrenRequiredArgument], () =>
                setIndexOfSpaceWhereTripleDotsClicked(undefined)
            );
        } else if (props.childrenRequiredArgument && !childrenRequiredDemountingHandler) {
            return props.children!(space[props.childrenRequiredArgument]);
        } else if (!props.childrenRequiredArgument && childrenRequiredDemountingHandler) {
            return props.children!(null, () => setIndexOfSpaceWhereTripleDotsClicked(undefined));
        }

        return props.children!();
    };

    const renderSpaces = spaces?.map((space, i: number) => (
        <>
            <Space space={space} index={i} key={i}>
                <TripleDotButton
                    componentClassNames={`triple-dot-button--${i}`}
                    vertical
                    active={indexOfSpaceWhereTripleDotsClicked === i}
                    handleClick={handleTripleDotButtonClick(i)}
                />
            </Space>
            {i === indexOfSpaceWhereTripleDotsClicked ? renderChildren(space) : null}
        </>
    ));
    return <div className="spaces-with-menus">{renderSpaces}</div>;
}
