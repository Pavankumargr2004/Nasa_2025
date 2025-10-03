
import React, { useState, useEffect, useCallback } from 'react';
import SpeakerIcon from './icons/SpeakerIcon';

interface Page {
    image: string;
    text: string;
}

interface FlipbookProps {
    pages: Page[];
    onBack: () => void;
    title: string;
}

const Flipbook: React.FC<FlipbookProps> = ({ pages, onBack, title }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const handleSpeech = useCallback(() => {
        if (!('speechSynthesis' in window)) {
            alert("Sorry, your browser doesn't support the voice assistant.");
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const textToRead = pages[currentPage].text;
        const newUtterance = new SpeechSynthesisUtterance(textToRead);
        utteranceRef.current = newUtterance;
        
        newUtterance.onstart = () => setIsSpeaking(true);
        newUtterance.onend = () => setIsSpeaking(false);
        newUtterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(newUtterance);
    }, [isSpeaking, currentPage, pages]);

    // Cleanup speech on component unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const nextPage = () => {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    };

    const prevPage = () => {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        setCurrentPage(prev => Math.max(prev - 1, 0));
    };

    const pageData = pages[currentPage];

    return (
        <div className="w-full h-full flex flex-col p-2 sm:p-4 animate-fade-in">
            <div className="flex-shrink-0 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-orbitron text-xl font-bold text-center text-sky-300">{title}</h3>
                <button onClick={onBack} className="px-4 py-2 bg-sky-600/80 hover:bg-sky-700 rounded-full text-sm font-semibold transition-transform hover:scale-105">
                    Back to Stories
                </button>
            </div>

            <div className="flex-grow w-full max-w-4xl mx-auto flex flex-col bg-black/50 rounded-2xl shadow-2xl shadow-violet-500/20 backdrop-blur-sm border border-violet-700/30 overflow-hidden">
                <div className="relative aspect-video w-full flex-shrink-0 bg-black">
                    <img 
                        key={pageData.image}
                        src={pageData.image} 
                        alt={`Story page ${currentPage + 1}`} 
                        className="w-full h-full object-contain animate-fade-in-fast"
                    />
                </div>
                
                <div className="flex flex-col justify-between flex-grow p-4 sm:p-6">
                    <div className="relative text-violet-200 text-center text-base sm:text-lg leading-relaxed min-h-[6rem]">
                         <button 
                            onClick={handleSpeech} 
                            className="absolute -top-2 left-0 text-violet-300 hover:text-white transition-colors"
                            aria-label="Read text aloud"
                        >
                           <SpeakerIcon isSpeaking={isSpeaking} />
                        </button>
                        <p key={currentPage} className="animate-fade-in">{pageData.text}</p>
                    </div>
                  
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={prevPage} disabled={currentPage === 0} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>
                        <span className="font-semibold text-violet-300">{currentPage + 1} / {pages.length}</span>
                        <button onClick={nextPage} disabled={currentPage === pages.length - 1} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flipbook;
