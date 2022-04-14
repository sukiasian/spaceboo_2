import { Route, Routes } from 'react-router-dom';
import HowItWorksSteps from '../components/HowItWorksSteps';

export default function HowItWorksRoutes(): JSX.Element {
    const stepTextsForSpaceowners = [
        'Вы выкладываете на Спейсбу свое жилье для посуточной аренды.',
        'С вами связывается команда Спейсбу, чтобы выдать Вам безопасный умный замок, который можно собрать самостоятельно за 5 минут!',
        'Если вы пока не готовы начинать с умным замком, вы можете просто использовать Спейсбу в качестве платформы для сдачи в аренду.',
        'Спейсбу сам позаботится обо всем, а Вы - считайте прибыль!',
    ];
    const stepTextsForSpacetakers = [
        'Вы выбираете пространство, которое хотите арендовать.',
        'Производите оплату',
        'Поздравляем! Вы арендовали пространство и можете управлять дверью через платформу - без громоздких.',
    ];

    return (
        <Routes>
            <Route path="spaceowner" element={<HowItWorksSteps stepTexts={stepTextsForSpaceowners} />} />
            <Route path="spacetaker" element={<HowItWorksSteps stepTexts={stepTextsForSpacetakers} />} />
        </Routes>
    );
}
