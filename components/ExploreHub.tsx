

import React from 'react';
import SectionCard from './SectionCard';
import { useLanguage } from './contexts/LanguageContext';
import { View } from '../App';

interface ExploreHubProps {
    onNavigate: (view: View) => void;
}

const exploreActivities: { id: View; titleKey: string; descriptionKey: string; }[] = [
  { id: 'perspectives', titleKey: "perspectivesTitle", descriptionKey: 'perspectivesDesc' },
  { id: 'aurora', titleKey: 'auroraTitle', descriptionKey: "auroraDesc" },
  { id: 'solar-system', titleKey: 'solarSystemTitle', descriptionKey: 'solarSystemDesc' },
  { id: 'telescopes', titleKey: 'telescopesTitle', descriptionKey: 'telescopesDesc' },
  { id: 'james-webb', titleKey: 'jamesWebbTitle', descriptionKey: 'jamesWebbDesc' },
];

const ExploreHub: React.FC<ExploreHubProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <section className="flex flex-col items-center h-full justify-center p-2 sm:p-4 animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="font-orbitron text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 mb-4">
                    {t('exploreUniverseTitle')}
                </h2>
                <p className="text-lg text-violet-200 max-w-3xl mx-auto">
                    Dive deeper into the cosmos with these interactive explorations.
                </p>
            </div>
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exploreActivities.map(activity => (
                    <SectionCard
                        key={activity.id}
                        title={t(activity.titleKey)}
                        description={t(activity.descriptionKey)}
                        onExplore={() => onNavigate(activity.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExploreHub;