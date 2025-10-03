

import React, { useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import SectionCard from './SectionCard';
import StorySolarStormIntro from './stories/StorySolarStormIntro';
import StoryFlaresJourney from './stories/StoryFlaresJourney';
import StoryNasaSentinels from './stories/StoryNasaSentinels';

type StoryId = 'intro' | 'journey' | 'sentinels';

const stories: { id: StoryId; titleKey: string; descriptionKey: string; component: React.FC<{ onBack: () => void }> }[] = [
    { id: 'intro', titleKey: 'storyIntroTitle', descriptionKey: 'storyIntroDesc', component: StorySolarStormIntro },
    { id: 'journey', titleKey: 'storyJourneyTitle', descriptionKey: 'storyJourneyDesc', component: StoryFlaresJourney },
    { id: 'sentinels', titleKey: 'storySentinelsTitle', descriptionKey: 'storySentinelsDesc', component: StoryNasaSentinels },
];

const SolarStoriesHub: React.FC = () => {
    const { t } = useLanguage();
    const [activeStory, setActiveStory] = useState<StoryId | null>(null);

    const handleBack = () => {
        setActiveStory(null);
    };

    if (activeStory) {
        const StoryComponent = stories.find(s => s.id === activeStory)?.component;
        return StoryComponent ? <StoryComponent onBack={handleBack} /> : null;
    }

    return (
        <section className="flex flex-col items-center h-full justify-center p-2 sm:p-4">
            <div className="text-center mb-12">
                <h2 className="font-orbitron text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 mb-4">
                    {t('solarStoriesTitle')}
                </h2>
                <p className="text-lg text-violet-200 max-w-3xl mx-auto">
                    Follow Sunny the Solar Flare on amazing adventures from the Sun to Earth! Choose a story to begin.
                </p>
            </div>
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map(story => (
                    <SectionCard
                        key={story.id}
                        title={t(story.titleKey)}
                        description={t(story.descriptionKey)}
                        onExplore={() => setActiveStory(story.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default SolarStoriesHub;