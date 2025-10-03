import React, { useState } from 'react';
import TelescopeQuiz from './TelescopeQuiz';
import PlanetDesigner from './PlanetDesigner';
import SectionCard from './SectionCard';
import ParkerSolarProbeMission from './ParkerSolarProbeMission';
import AuroraPainter from './AuroraPainter';

interface MissionProps {
    addAchievement: (id: string) => void;
}

const missionsList = [
    { id: 'planet-designer', title: 'Design-A-Planet', description: 'Chat with an AI guide to create a unique world.', component: PlanetDesigner },
    { id: 'aurora-painter', title: 'Aurora Painter', description: 'Paint swirling auroras on a digital canvas.', component: AuroraPainter },
    { id: 'parker-probe', title: 'Parker Solar Probe', description: 'Witness the probe orbit the sun and learn cool facts.', component: ParkerSolarProbeMission },
    { id: 'telescope-quiz', title: 'Telescope Image Quiz', description: 'Guess who took the photo: Hubble or James Webb?', component: TelescopeQuiz },
];

const Missions: React.FC<MissionProps> = ({ addAchievement }) => {
    const [activeMission, setActiveMission] = useState<string | null>(null);

    const renderContent = () => {
        if (activeMission) {
            const MissionComponent = missionsList.find(m => m.id === activeMission)?.component;
            if (MissionComponent) {
                return (
                    <div className="w-full h-full animate-fade-in">
                        <MissionComponent addAchievement={addAchievement} onBack={() => setActiveMission(null)} />
                    </div>
                )
            }
        }

        return (
            <div className="flex flex-col items-center animate-fade-in">
                <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">Learning Missions</h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {missionsList.map(mission => (
                        <SectionCard
                            key={mission.id}
                            title={mission.title}
                            description={mission.description}
                            onExplore={() => setActiveMission(mission.id)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="h-full">
            {renderContent()}
        </section>
    );
};

export default Missions;