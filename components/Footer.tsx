

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { supportedLanguages, Language } from './i18n/translations';
import GithubIcon from './icons/GithubIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import XIcon from './icons/XIcon';

const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const selectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setIsDropdownOpen(false);
  };


  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 mt-auto backdrop-blur-md bg-gray-900/40 border-t border-violet-800/50 flex-shrink-0">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
          <div className="text-lg font-bold font-orbitron">
            <span className="text-sky-400">Cosmo</span><span className="text-violet-400">Connect</span>
          </div>
          <p className="text-sm text-violet-300">&copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-6">
              <a href="#" aria-label="GitHub" className="text-violet-300 hover:text-white transition-colors"><GithubIcon /></a>
              <a href="#" aria-label="LinkedIn" className="text-violet-300 hover:text-white transition-colors"><LinkedinIcon /></a>
              <a href="#" aria-label="X" className="text-violet-300 hover:text-white transition-colors"><XIcon /></a>
              <a href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer" aria-label="NASA">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg" alt="NASA Logo" className="h-8 w-auto invert brightness-0 opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <div ref={dropdownRef} className="relative flex items-center gap-2">
               <span className="text-violet-300 text-sm">{t('languageLabel')}</span>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-28 text-left px-3 py-1 bg-violet-700/50 hover:bg-violet-700/80 rounded-md text-violet-200 font-semibold transition-colors flex justify-between items-center"
                    aria-label="Select language"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <span>{supportedLanguages.find(l => l.code === language)?.name}</span>
                    <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-gray-800/90 backdrop-blur-sm border border-violet-700/50 rounded-md shadow-lg z-10 animate-fade-in-fast">
                        <ul className="py-1">
                            {supportedLanguages.map(lang => (
                                <li key={lang.code}>
                                    <button
                                        onClick={() => selectLanguage(lang.code)}
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${language === lang.code ? 'bg-violet-600 text-white' : 'text-violet-200 hover:bg-violet-700'}`}
                                    >
                                        {lang.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;