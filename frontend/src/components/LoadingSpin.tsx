import ReactLoadingSpin from 'react-loading-spin';
import { AppColor } from '../types/types';

export default function LoadingSpin(): JSX.Element {
    const defineSpinSizeByDisplayWidth = (): string => {
        const screenWidth = window.screen.width;

        if (screenWidth < 400) {
            return '30px';
        } else if (screenWidth < 800) {
            return '40px';
        } else if (screenWidth < 800) {
            return '50px';
        } else {
            return '60px';
        }
    };

    return (
        // TODO: убрать хардкод стилей
        <div
            className="loading-spin"
            style={{ marginLeft: '50%', marginRight: '50%', transform: 'translate(-50%, -50%)' }}
        >
            <ReactLoadingSpin
                primaryColor={AppColor.YELLOW_PRIMARY}
                secondaryColor={AppColor.PURE_WHITE}
                size={defineSpinSizeByDisplayWidth()}
            />
        </div>
    );
}
