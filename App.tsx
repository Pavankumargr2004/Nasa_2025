
import React, { useState, useEffect, useMemo, ComponentType } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Storybook from './components/Storybook';
import ARMode from './components/ARMode';
import Perspectives from './components/Perspectives';
import Missions from './components/Missions';
import AuroraExplorer from './components/AuroraExplorer';
import SolarSystemExplorer from './components/SolarSystemExplorer';
import TelescopeExplorer from './components/TelescopeExplorer';
import JamesWebbExplorer from './components/JamesWebbExplorer';
import CosmoBuddy from './components/CosmoBuddy';
import Achievements, { Achievement as AchievementType } from './components/Achievements';
import { useLanguage } from './components/contexts/LanguageContext';
import APOD from './components/APOD';
import SolarStoriesHub from './components/SolarStoriesHub';
import ExploreHub from './components/ExploreHub';
import AstroVR from './components/AstroVR';
import Earth from './components/Earth';


export type View = 'home' | 'storybook' | 'missions' | 'achievements' | 'perspectives' | 'aurora' | 'solar-system' | 'telescopes' | 'james-webb' | 'ar-mode' | 'solar-stories' | 'explore' | 'astro-vr';

const allAchievements: AchievementType[] = [
    { id: 'story-explorer', emoji: '🗺️', title: 'Story Explorer', description: 'Made 5 choices in the Living Storybook.' },
    { id: 'sun-grazer', emoji: '🌟', title: 'Sun Grazer', description: 'Completed the Parker Solar Probe mission.' },
    { id: 'aurora-artist', emoji: '🎨', title: 'Aurora Artist', description: 'Painted a beautiful aurora.' },
    { id: 'cosmic-photographer', emoji: '📸', title: 'Cosmic Photographer', description: 'Completed the Telescope Image Quiz.' },
    { id: 'stellar-interviewer', emoji: '🎙️', title: 'Stellar Interviewer', description: 'Heard from all of Sunny\'s friends.' },
    { id: 'sky-watcher', emoji: '👀', title: 'Sky Watcher', description: 'Checked for aurora activity.' },
    { id: 'planet-designer', emoji: '🪐', title: 'Planet Designer', description: 'Designed a new planet from scratch.' },
    { id: 'cosmic-conversationalist', emoji: '💬', title: 'Cosmic Conversationalist', description: "Had your first chat with Sunny in AR Mode." },
];

const activityComponents: { [key in View]?: ComponentType<any> } = {
  storybook: Storybook,
  missions: Missions,
  perspectives: Perspectives,
  aurora: AuroraExplorer,
  'solar-system': SolarSystemExplorer,
  telescopes: TelescopeExplorer,
  'james-webb': JamesWebbExplorer,
  'ar-mode': ARMode,
  'solar-stories': SolarStoriesHub,
  explore: ExploreHub,
  'astro-vr': AstroVR,
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [achievements, setAchievements] = useState<string[]>([]);
  const { t } = useLanguage();

  const [typedWord, setTypedWord] = useState('');
  const wordsToType = useMemo(() => ['Activities', 'Wonders', 'Missions', 'Explorations'], []);
  
  useEffect(() => {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let timeoutId: number;
      const typingSpeed = 150;
      const deletingSpeed = 75;
      const pauseDuration = 2000;

      const typeEffect = () => {
          const currentWord = wordsToType[wordIndex];
          
          if (isDeleting) {
              charIndex--;
              setTypedWord(currentWord.substring(0, charIndex));
          } else {
              charIndex++;
              setTypedWord(currentWord.substring(0, charIndex));
          }

          if (!isDeleting && charIndex === currentWord.length) {
              isDeleting = true;
              timeoutId = window.setTimeout(typeEffect, pauseDuration);
          } else if (isDeleting && charIndex === 0) {
              isDeleting = false;
              wordIndex = (wordIndex + 1) % wordsToType.length;
              timeoutId = window.setTimeout(typeEffect, 500);
          } else {
              timeoutId = window.setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
          }
      };

      timeoutId = window.setTimeout(typeEffect, 250);

      return () => {
          clearTimeout(timeoutId);
      };
  }, [wordsToType]);
  
  const addAchievement = (id: string) => {
    if (!achievements.includes(id)) {
        setAchievements(prev => [...prev, id]);
    }
  }
  
  const handleSetView = (view: View) => {
    if (view === 'ar-mode') {
      if ((navigator as any).xr) {
        setCurrentView(view);
      } else {
        alert("Sorry, your browser doesn't support the AR experience!");
      }
    } else {
       setCurrentView(view);
       window.scrollTo(0, 0);
    }
  }

  const renderView = () => {
      if (currentView === 'home') {
        return (
          <>
            <section id="home" className="min-h-screen flex items-center py-20 px-4">
              <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-fade-in text-center md:text-left">
                  <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 mb-4 h-36 sm:h-auto">
                    <span>{t('heroTitle')}</span>
                    <span>
                        {typedWord}
                        <span className="animate-blink-cursor text-cyan-300">|</span>
                    </span>
                  </h1>
                  <p className="text-lg text-violet-200 max-w-xl mx-auto md:mx-0 mb-8">
                      {t('heroSubtitle')}
                  </p>
                  <a
                    href="#apod"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('apod')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-full shadow-lg hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    {t('explore')}
                  </a>
                </div>
                <div className="hidden md:flex justify-center items-center">
                  <Earth />
                </div>
              </div>
            </section>

            <section id="apod" className="py-20">
                <APOD />
            </section>

            <section id="ar-section" className="py-20">
              <div className="container mx-auto flex justify-center">
                  <div 
                    className="group relative p-8 bg-black/40 rounded-3xl border-2 border-violet-500/30 backdrop-blur-sm
                               transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20
                               flex flex-col text-center items-center cursor-pointer w-full max-w-md
                               overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500/50 before:to-cyan-500/50 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-30"
                    onClick={() => handleSetView('ar-mode')}
                  >
                      <h3 className="font-orbitron text-2xl font-bold text-violet-200 mb-2 z-10">{t('arTitle')}</h3>
                      <p className="text-violet-300 text-base mb-6 flex-grow z-10">{t('arDesc')}</p>
                      <div
                          className="mt-auto px-8 py-3 bg-gradient-to-r from-violet-600/80 to-sky-500/80 text-white font-semibold rounded-full 
                                     shadow-lg transition-all duration-300 group-hover:shadow-sky-500/50 group-hover:scale-105 group-hover:from-violet-600 group-hover:to-sky-500 z-10"
                      >
                          {t('explore')}
                      </div>
                  </div>
              </div>
            </section>
          </>
        );
      }
      
      if (currentView === 'achievements') {
        return <Achievements unlockedAchievements={achievements} allAchievements={allAchievements} />;
      }
      
      if (currentView === 'ar-mode') {
          return <ARMode onClose={() => setCurrentView('home')} addAchievement={addAchievement} />;
      }

      const ActivityComponent = activityComponents[currentView];
      if (ActivityComponent) {
          const componentProps: { addAchievement?: (id: string) => void; onNavigate?: (view: View) => void; } = {};

          if (['storybook', 'missions', 'perspectives', 'aurora'].includes(currentView)) {
              componentProps.addAchievement = addAchievement;
          }
           if (currentView === 'explore') {
              componentProps.onNavigate = handleSetView;
          }
          
          return (
              <div className="container mx-auto py-28 min-h-screen flex items-center">
                  <div className={`w-full h-full ${['explore', 'solar-stories', 'astro-vr'].includes(currentView) ? '' : 'bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-violet-500/30 animate-zoom-in'}`}>
                      <ActivityComponent {...componentProps} />
                  </div>
              </div>
          );
      }
      return null;
  }

  const isHomePage = currentView === 'home';

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header 
            currentView={currentView}
            onNavigate={handleSetView}
        />
        
        <main className="flex-grow">
            {renderView()}
        </main>

        {isHomePage && <Footer />}
      </div>
      
      <CosmoBuddy />
    </div>
  );
};

export default App;