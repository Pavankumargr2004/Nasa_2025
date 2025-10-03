

import React from 'react';
import Flipbook from '../Flipbook';
import { useLanguage } from '../contexts/LanguageContext';

const pages = [
    {
        image: 'https://science.nasa.gov/wp-content/uploads/2020/01/hpd-fleet-chart-jan-2024.jpg',
        text: "Don't worry—scientists are watching us! NASA has a whole fleet of spacecraft keeping an eye on the Sun from every angle."
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2023/10/53240351711_b88b05f24d_o.jpg',
        text: "NOAA's Space Weather Prediction Center monitors us 24 hours a day. When they see a big flare or CME heading toward Earth, they send warnings so people can prepare."
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2022/03/51980183185_a72a781e0a_o.jpg',
        text: "After our adventure, CME and I continue our journey into deep space. Back on the Sun, new flares are being born every day."
    },
    {
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
        text: "Remember: Space weather affects all of us, but with science and preparation, we can stay safe and even enjoy the beautiful auroras we create!"
    }
];

const StoryNasaSentinels: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return <Flipbook pages={pages} onBack={onBack} title={t('storySentinelsTitle')} />;
};

export default StoryNasaSentinels;