

import React from 'react';
import { useLanguage } from './contexts/LanguageContext';

const AstroVR: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="flex flex-col items-center h-full justify-center p-2 sm:p-4 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-orbitron text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 mb-4">
                    {t('astroVRTitle')}
                </h2>
                <p className="text-lg text-violet-200 max-w-3xl mx-auto">
                    {t('astroVRDesc')}
                </p>
            </div>
            <div className="w-full h-[70vh] bg-black/40 rounded-2xl border border-violet-500/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-violet-500/10">
                <iframe
                    src="https://vr-nine-xi.vercel.app/"
                    title="AstroVR Experience"
                    allowFullScreen
                    frameBorder="0"
                    className="w-full h-full"
                ></iframe>
            </div>
        </section>
    );
};

export default AstroVR;