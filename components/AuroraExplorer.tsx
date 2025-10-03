import React, { useState } from 'react';
import { getAuroraStory } from '../services/geminiService';

interface AuroraExplorerProps {
    addAchievement: (id: string) => void;
}

const AuroraExplorer: React.FC<AuroraExplorerProps> = ({ addAchievement }) => {
    const [auroraStory, setAuroraStory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuroras = async () => {
        setIsLoading(true);
        setAuroraStory(null);
        addAchievement('sky-watcher');
        // Add a small delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            // For this prototype, we'll always find an aurora!
            const story = await getAuroraStory();
            setAuroraStory(story);
        } catch (error) {
            setAuroraStory("The stars are shining bright, but the auroras are shy tonight.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="flex flex-col items-center h-full justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 sr-only">Aurora Explorer</h2>
            <div className="w-full bg-black/30 rounded-2xl shadow-2xl shadow-violet-500/10 p-4 sm:p-6 backdrop-blur-sm border border-violet-700/30">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6 bg-gray-800">
                    <img src="https://www.nasa.gov/wp-content/uploads/2022/10/iss067e372579.jpg" alt="View of a green aurora over Earth from the International Space Station" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                            onClick={checkAuroras} 
                            disabled={isLoading}
                            className="px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-500 text-white font-bold rounded-full shadow-lg hover:shadow-sky-400/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Searching the Skies...' : 'Are Auroras Active?'}
                        </button>
                    </div>
                </div>

                {auroraStory && (
                    <div className="bg-gradient-to-br from-sky-500/20 to-violet-500/20 p-6 rounded-lg text-center border border-sky-400/30 animate-fade-in">
                        <h3 className="text-xl font-bold text-sky-300 mb-2">✨ A Message from the Sky! ✨</h3>
                        <p className="text-violet-200 text-lg">{auroraStory}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AuroraExplorer;