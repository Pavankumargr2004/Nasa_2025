

import React from 'react';
import Flipbook from '../Flipbook';
import { useLanguage } from '../contexts/LanguageContext';

const pages = [
    {
        image: 'https://svs.gsfc.nasa.gov/vis/a010000/a012600/a012640/frames/1920x1080_16x9_30p/STEREO_Sees_CME_Blast_from_Sun_to_Earth-MASTER-prores_00075.jpg',
        text: "It's a long trip from the Sun to Earth—93 million miles! NASA's STEREO spacecraft watches our entire journey. The trip takes about 3 days if we're moving fast."
    },
    {
        image: 'https://svs.gsfc.nasa.gov/vis/a010000/a010900/a010959/frames/1920x1080_16x9_30p/MagnetosphereAndCME_label_Earth-MASTER_prores_00185.jpg',
        text: "When we get close to Earth, we meet its magnetic shield called the magnetosphere. It's like an invisible force field that protects the planet!"
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2024/05/nasa-makes-it-rain-aurora-in-new-simulation.jpg',
        text: "The most beautiful thing we create is the aurora! When our energy reaches Earth's upper atmosphere, it makes the sky glow with dancing curtains of green, purple, and red light."
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2023/10/goes-18-seiss-instruments-first-light-1.jpg',
        text: "But we can also cause problems. When I'm a strong X-class flare, I can confuse satellites in space. GPS signals get mixed up, and astronauts have to take shelter!"
    },
    {
        image: 'https://www.nasa.gov/wp-content/uploads/2022/10/iss067e372579.jpg',
        text: "My X-ray energy can also make radio signals disappear! This is called a 'radio blackout,' and it can make it hard for pilots and emergency responders to communicate."
    },
    {
        image: 'https://images.unsplash.com/photo-1594269896429-2Ebaa12282e3?q=80&w=2070&auto=format&fit=crop',
        text: 'The biggest challenge we can cause is trouble for power grids. A strong CME can cause blackouts affecting millions of people!'
    }
];

const StoryFlaresJourney: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useLanguage();
    return <Flipbook pages={pages} onBack={onBack} title={t('storyJourneyTitle')} />;
};

export default StoryFlaresJourney;