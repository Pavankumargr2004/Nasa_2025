
import React, { useState, useEffect } from 'react';
import { getParkerProbeFact } from '../services/geminiService';

interface ParkerSolarProbeMissionProps {
    addAchievement: (id: string) => void;
    onBack: () => void;
}

const ParkerSolarProbeMission: React.FC<ParkerSolarProbeMissionProps> = ({ addAchievement, onBack }) => {
    const [fact, setFact] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [probeData, setProbeData] = useState({ speed: 0, distance: 0 });

    useEffect(() => {
        addAchievement('sun-grazer');
        
        const fetchFact = async () => {
            setIsLoading(true);
            try {
                const newFact = await getParkerProbeFact();
                setFact(newFact);
            } catch (error) {
                setFact("The Parker Solar Probe is one of the fastest objects ever built by humans! 🚀");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFact();

        // Simulate probe data update
        const interval = setInterval(() => {
            setProbeData({
                speed: 430000 + Math.floor(Math.random() * 5000 - 2500),
                distance: 4.3 + (Math.random() * 0.2 - 0.1)
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [addAchievement]);

    return (
        <div className="w-full h-[85vh] bg-black/30 rounded-2xl shadow-2xl shadow-violet-500/10 p-2 sm:p-4 backdrop-blur-sm border border-violet-700/30 relative flex flex-col">
            <div className="flex-shrink-0 flex justify-between items-center z-10 p-2">
                <h3 className="font-orbitron text-xl font-bold text-sky-300">Parker Solar Probe Mission</h3>
                 <button onClick={onBack} className="px-4 py-2 bg-sky-600/80 hover:bg-sky-700 rounded-full text-sm font-semibold transition-transform hover:scale-105">Back to Missions</button>
            </div>
            
            <div className="flex-grow relative rounded-lg overflow-hidden">
                <a-scene embedded renderer="colorManagement: true;" vr-mode-ui="enabled: false" className="w-full h-full" style={{ border: 'none' }}>
                    <a-assets timeout="10000">
                        <img id="sun-texture-probe" src="https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/2k_sun.jpg?v=1716409415496" alt="sun texture" />
                        <a-asset-item id="probe-model" src="https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/Parker_Solar_Probe.glb?v=1716480302395"></a-asset-item>
                    </a-assets>

                    {/* Sun Entity */}
                    <a-entity>
                        <a-sphere
                            radius="1.5"
                            src="#sun-texture-probe"
                            material="emissive: #ffaa00; emissiveIntensity: 0.8; shader: flat;"
                        >
                            <a-animation attribute="rotation" to="0 360 0" dur="40000" easing="linear" repeat="indefinite"></a-animation>
                        </a-sphere>
                        <a-sphere radius="1.6" material="shader: flat; color: #ffcc00; transparent: true; opacity: 0.3"></a-sphere>
                        <a-sphere radius="1.7" material="shader: flat; color: #ffcc00; transparent: true; opacity: 0.2"></a-sphere>
                        <a-entity solar-flare-system></a-entity>
                    </a-entity>
                    
                    {/* Parker Solar Probe Entity */}
                    <a-entity rotation="0 0 0">
                         <a-animation attribute="rotation" to="0 -360 0" dur="20000" easing="linear" repeat="indefinite"></a-animation>
                        <a-entity gltf-model="#probe-model" position="4 0 0" scale="0.1 0.1 0.1" rotation="0 90 0"></a-entity>
                    </a-entity>

                    <a-camera position="0 3 10" rotation="-10 0 0"></a-camera>
                    <a-light type="ambient" intensity="0.4"></a-light>
                    <a-light type="point" intensity="1.5" position="0 0 0"></a-light>
                </a-scene>

                {/* UI Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row gap-4 pointer-events-none">
                    {/* Data HUD */}
                    <div className="w-full md:w-1/3 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-sky-500/50 animate-fade-in">
                        <h4 className="font-orbitron text-lg font-bold text-sky-300">Probe Telemetry</h4>
                        <div className="mt-2 space-y-1 text-violet-200">
                            <p><strong className="font-semibold text-sky-400">Speed:</strong> {probeData.speed.toLocaleString()} mph</p>
                            <p><strong className="font-semibold text-sky-400">Distance from Sun:</strong> {probeData.distance.toFixed(2)} million miles</p>
                        </div>
                    </div>
                    {/* Science Nugget */}
                    <div className="w-full md:w-2/3 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-violet-500/50 animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <h4 className="font-orbitron text-lg font-bold text-yellow-300">Science Nugget</h4>
                        <div className="mt-2 min-h-[3rem] text-violet-200">
                           {isLoading ? <p className="animate-pulse">Receiving transmission...</p> : <p>{fact}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkerSolarProbeMission;