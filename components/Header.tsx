

import React, { useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { View } from '../App';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const mainNavLinks: { view: View; titleKey: string }[] = [
    { view: 'home', titleKey: 'home' },
    { view: 'solar-stories', titleKey: 'solarStoriesNav' },
    { view: 'missions', titleKey: 'missionsTitle' },
    { view: 'explore', titleKey: 'exploreNav' },
    { view: 'astro-vr', titleKey: 'astroVRNav' },
];

const topLevelViews: View[] = ['home', 'solar-stories', 'missions', 'explore', 'astro-vr'];

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
      onNavigate(view);
      setIsMenuOpen(false);
  }
  
  const showMainNav = topLevelViews.includes(currentView);

  const renderNavLinks = (isMobile: boolean) => {
    const baseClass = isMobile ? "w-full text-center px-3 py-3 rounded-md transition-colors font-semibold text-violet-200 hover:bg-violet-700/50" : "px-3 py-2 rounded-md transition-colors text-sm font-semibold";

    if (showMainNav) {
      return mainNavLinks.map(link => (
          <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={`${baseClass} ${!isMobile && (currentView === link.view ? 'bg-violet-600 text-white' : 'text-violet-200 hover:bg-violet-700/50')}`}
          >
               {t(link.titleKey)}
          </button>
      ));
    }
    
    return (
        <button
            onClick={() => handleNavClick('home')}
            className={`${baseClass} ${!isMobile ? 'text-violet-200 hover:bg-violet-700/50 flex items-center gap-2' : ''}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isMobile ? 'hidden': ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t('home')}
        </button>
    );
  };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-gray-900/40 sticky top-0 z-50 border-b border-violet-800/50 flex-shrink-0">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo / Title */}
        <div>
           <button onClick={() => handleNavClick('home')} className="text-2xl font-bold tracking-wider font-orbitron">
              <span className="text-sky-400">Cosmo</span><span className="text-violet-400">Connect</span>
           </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 lg:gap-4">
            {renderNavLinks(false)}
        </nav>

        {/* Achievements & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button 
             onClick={() => handleNavClick('achievements')}
             className="px-4 py-2 text-yellow-300 hover:bg-yellow-700/50 rounded-md transition-colors flex items-center gap-2"
             aria-label="Show Achievements"
           >
            <span className="text-2xl">🏆</span>
            <span className="hidden sm:inline">{t('achievements')}</span>
           </button>
            <button className="md:hidden p-2 rounded-md text-violet-200 hover:bg-violet-700/50" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
            </button>
        </div>
      </div>
       {/* Mobile Menu */}
       {isMenuOpen && (
          <div className="md:hidden mt-4 animate-fade-in-fast">
              <nav className="flex flex-col items-center gap-2">
                   {renderNavLinks(true)}
              </nav>
          </div>
        )}
    </header>
  );
};

export default Header;