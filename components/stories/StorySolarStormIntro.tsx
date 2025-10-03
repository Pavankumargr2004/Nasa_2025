

import React from 'react';
import Flipbook from '../Flipbook';
import { useLanguage } from '../contexts/LanguageContext';

const pages = [
    {
        image: 'https://science.nasa.gov/wp-content/uploads/2023/05/sun-flare-fig-a-1.jpg?w=2048&format=jpeg',
        text: "Hi! I'm Sunny the Solar Flare. I'm a giant explosion of light and energy that bursts from the Sun's surface."
    },
    {
        image: 'https://s2.dmcdn.net/v/U-M6A1Y-5Pj3QZpNm/x1080',
        text: "When the Sun's powerful magnetic fields reconnect near sunspots, BOOM! That's when flares like me are born. I'm made of more energy than a million years of electricity on Earth!"
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2015/05/pia19391-main_8k.jpg',
        text: "Solar flares come in different sizes. My smallest cousins are B-class and C-class. My medium siblings are M-class, and my biggest brothers and sisters are X-class. X-class flares are the strongest!"
    },
    {
        image: 'https://svs.gsfc.nasa.gov/vis/a010000/a010800/a010809/CME_Still.jpg',
        text: "Sometimes I travel with my best friend, a Coronal Mass Ejection—we call him 'CME' for short. He's a massive cloud of hot, electrified gas that weighs 1.5 trillion tons!"
    },
];

const StorySolarStormIntro: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return <Flipbook pages={pages} onBack={onBack} title={t('storyIntroTitle')} />;
};

export default StorySolarStormIntro;