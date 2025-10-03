import React from 'react';

const TelescopeExplorer: React.FC = () => {
    return (
        <section className="flex flex-col items-center h-full justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 sr-only">NASA's Great Observatories</h2>
            <div className="w-full bg-black/30 rounded-2xl shadow-2xl shadow-violet-500/10 p-4 sm:p-6 backdrop-blur-sm border border-violet-700/30">
                <p className="text-violet-300 text-center mb-6">
                    See where the James Webb and Hubble space telescopes are right now and explore their amazing journeys!
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* James Webb Telescope */}
                    <div>
                        <h3 className="font-orbitron text-xl font-bold text-center text-sky-300 mb-3">James Webb Space Telescope</h3>
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900 border border-violet-700/30">
                            <iframe
                                src="https://eyes.nasa.gov/apps/solar-system/#/sc_jwst"
                                title="NASA's Eyes on the James Webb Space Telescope"
                                allowFullScreen
                                frameBorder="0"
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                    {/* Hubble Telescope */}
                    <div>
                         <h3 className="font-orbitron text-xl font-bold text-center text-violet-300 mb-3">Hubble Space Telescope</h3>
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900 border border-violet-700/30">
                            <iframe
                                src="https://eyes.nasa.gov/apps/solar-system/#/story/hubble_25th"
                                title="NASA's Eyes on the Hubble Space Telescope"
                                allowFullScreen
                                frameBorder="0"
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TelescopeExplorer;