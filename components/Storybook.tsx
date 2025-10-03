import React, { useState, useEffect, useRef } from 'react';
import { getStoryStream, getErrorMessage } from '../services/geminiService';
import { Content } from '@google/generative-ai';

interface StorybookProps {
    addAchievement: (id: string) => void;
}

const Storybook: React.FC<StorybookProps> = ({ addAchievement }) => {
  const [history, setHistory] = useState<Content[]>([]);
  const [currentStoryChunk, setCurrentStoryChunk] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [choiceCount, setChoiceCount] = useState(0);
  const choiceRegex = /\[CHOICE\s?\d:\s?(.*?)\]/g;
  
  const processStream = async (message: string) => {
    setIsLoading(true);
    setCurrentStoryChunk('');
    setChoices([]);
    
    try {
      const chat = getStoryStream(history);
      const stream = await chat.sendMessageStream({ message });
      
      let accumulatedText = '';
      
      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        const cleanedText = accumulatedText.replace(choiceRegex, '').trim();
        setCurrentStoryChunk(cleanedText);

        const foundChoices = [...accumulatedText.matchAll(choiceRegex)].map(match => match[1]);
        if (foundChoices.length > 0) {
          setChoices(foundChoices);
        }
      }
      
      setHistory(prev => [...prev, { role: 'user', parts: [{ text: message }] }, { role: 'model', parts: [{ text: accumulatedText }] }]);
    } catch (error) {
        console.error("Error processing story stream:", error);
        
        const errorMessage = getErrorMessage(error);
        
        let displayError = "The storyteller seems to have lost their train of thought! Let's try that again.";
        if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
            displayError = "The storyteller is pausing to catch their breath! Too many exciting ideas at once. Please make a choice again in a moment. 😮";
        }
        setCurrentStoryChunk(displayError);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    processStream("Let's start the story!");
  }, []);

  const handleChoice = (choiceText: string) => {
    if (isLoading) return;
    const newCount = choiceCount + 1;
    setChoiceCount(newCount);
    if (newCount >= 5) {
        addAchievement('story-explorer');
    }
    processStream(choiceText);
  };
  
  return (
    <section className="flex flex-col items-center h-full justify-center p-2 sm:p-4">
      <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">The Living Storybook</h2>
      <div className="w-full max-w-4xl h-[70vh] flex flex-col bg-black/50 rounded-2xl shadow-2xl shadow-violet-500/20 backdrop-blur-sm border border-violet-700/30 overflow-hidden">
        <div className="relative aspect-video w-full flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1614726353103-936658095b32?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Sunny the Solar Flare" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        <div className="flex flex-col justify-between flex-grow p-6">
          <div className="text-violet-200 text-center text-lg sm:text-xl leading-relaxed min-h-[6rem]">
            {currentStoryChunk}
            {isLoading && choices.length === 0 && <span className="inline-block w-2 h-2 ml-2 bg-violet-400 rounded-full animate-pulse"></span>}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            {choices.length > 0 && !isLoading ? (
              choices.map((choice, index) => (
                <button 
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold animate-fade-in"
                >
                  {choice}
                </button>
              ))
            ) : (
                 <div className="h-[58px]"> {/* Placeholder to prevent layout shift */}
                    {isLoading && <p className="text-center text-violet-400 animate-pulse">Sunny is thinking...</p>}
                 </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Storybook;