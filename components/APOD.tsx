
import React, { useState, useEffect } from 'react';
import { getAPOD, APODData } from '../services/nasaService';
import { useLanguage } from './contexts/LanguageContext';

const APOD: React.FC = () => {
    const [apodData, setApodData] = useState<APODData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useLanguage();

    const fetchAPOD = async (random: boolean = false) => {
        setIsLoading(true);
        const data = await getAPOD(random);
        setApodData(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAPOD();
    }, []);

    const renderMedia = () => {
        if (!apodData) return null;

        if (apodData.media_type === 'image') {
            return (
                <a href={apodData.hdurl || apodData.url} target="_blank" rel="noopener noreferrer">
                    <img src={apodData.url} alt={apodData.title} className="w-full h-full object-contain" />
                </a>
            );
        }

        if (apodData.media_type === 'video') {
            return (
                <iframe
                    src={apodData.url}
                    title={apodData.title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full aspect-video"
                ></iframe>
            );
        }
        return <p>Unsupported media type</p>;
    };

    return (
        <div className="container mx-auto">
            <h2 className="font-orbitron text-4xl sm:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">{t('apodTitle')}</h2>
            
            <div className="p-6 bg-black/40 rounded-2xl border border-violet-500/30 backdrop-blur-sm shadow-2xl shadow-violet-500/10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-pulse text-violet-300">Loading today's cosmic wonder...</div>
                    </div>
                ) : apodData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fade-in">
                        <div className="order-2 lg:order-1">
                            <h3 className="font-orbitron text-2xl font-bold text-violet-200 mb-3">{apodData.title}</h3>
                            <p className="text-violet-300 text-sm mb-4">Date: {apodData.date}</p>
                            <p className="text-violet-200 text-base leading-relaxed max-h-60 overflow-y-auto no-scrollbar">{apodData.explanation}</p>
                            <button
                                onClick={() => fetchAPOD(true)}
                                className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-600/80 to-sky-500/80 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-sky-500/50 hover:scale-105"
                            >
                                {t('apodButton')}
                            </button>
                        </div>
                        <div className="order-1 lg:order-2 h-80 lg:h-96 w-full flex justify-center items-center bg-black rounded-lg">
                           {renderMedia()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APOD;