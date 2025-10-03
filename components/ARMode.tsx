// Fix: The entire component has been updated to the interactive version, which was previously in a separate, unused file.
// This new version includes state management, speech recognition, and Gemini API integration for a conversational experience.
import React, { useEffect, useState, useRef, useCallback } from 'react';
// Fix: Corrected import path for geminiService to be relative to the components directory.
import { getSunnyARResponse } from '../services/geminiService';
// Fix: Corrected import path for MicrophoneIcon to be relative to the components directory.
import MicrophoneIcon from './icons/MicrophoneIcon';

interface ARModeProps {
  onClose: () => void;
  // Fix: Added the `addAchievement` prop to allow the component to grant achievements.
  addAchievement: (id: string) => void;
}

// Fix: The component's function signature was updated to accept the new `addAchievement` prop.
const ARMode: React.FC<ARModeProps> = ({ onClose, addAchievement }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sunnyResponse, setSunnyResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      setSupportsSpeech(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleQuestion(transcript);
      };
      recognitionRef.current = recognition;
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleQuestion = async (question: string) => {
    if (!question) return;
    setSunnyResponse('...'); // Thinking indicator
    const response = await getSunnyARResponse(question);
    addAchievement('cosmic-conversationalist');
    setSunnyResponse(response);
    speak(response);
  };
  
  const handleMicClick = () => {
    if (isListening || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Could not start speech recognition:", e);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuestion(userInput);
    setUserInput('');
  };

  return (
    <div id="ar-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000
    }}>
      <a-scene
        webxr="requiredFeatures: viewer,local-floor; optionalFeatures: dom-overlay; overlayElement: #ar-overlay;"
        vr-mode-ui="enabled: false"
        ar-mode-ui="enabled: false"
        renderer="colorManagement: true;"
      >
        <a-assets>
          <audio id="chime-sound" src="https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/magic-chime.mp3?v=1716334543143" preload="auto"></audio>
        </a-assets>

        <a-camera position="0 1.6 0" cursor="rayOrigin: mouse;"></a-camera>

        <a-entity
          gltf-model="url(https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/sun_character.glb?v=1716330343388)"
          position="0 1.5 -2.5"
          scale="0.5 0.5 0.5"
        >
          {/* Base rotation */}
          <a-animation attribute="rotation" to="0 360 0" dur="15000" easing="linear" repeat="indefinite"></a-animation>
          {/* Bobbing animation */}
          <a-animation attribute="position" from="0 1.45 -2.5" to="0 1.55 -2.5" dur="3000" direction="alternate" easing="easeInOutSine" repeat="indefinite"></a-animation>
          {/* Talking animation */}
          {isSpeaking && (
            <a-animation attribute="scale" from="0.5 0.5 0.5" to="0.52 0.52 0.52" dur="300" direction="alternate" repeat="indefinite" easing="easeInOutSine"></a-animation>
          )}
        </a-entity>
        
        <a-light type="ambient" intensity="0.6"></a-light>
        <a-light type="point" intensity="1" position="0 2 -2"></a-light>
      </a-scene>
      
       {/* UI Elements */}
      <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          maxWidth: '400px',
          padding: '0 20px',
          zIndex: 1001,
      }}>
          {sunnyResponse && (
             <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-xl shadow-lg animate-fade-in text-center relative w-full">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-black/60 border-r-[10px] border-r-transparent"></div>
                {sunnyResponse}
             </div>
          )}

          {supportsSpeech ? (
            <button
              onClick={handleMicClick}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-sky-500'}`}
              aria-label="Ask Sunny a question"
            >
              <MicrophoneIcon isListening={isListening} />
            </button>
          ) : (
            <form onSubmit={handleTextSubmit} className="flex gap-2 w-full">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask Sunny a question..."
                className="w-full bg-black/50 border border-violet-500 rounded-full px-4 py-2 text-white"
              />
              <button type="submit" className="px-4 py-2 bg-sky-600 rounded-full">Send</button>
            </form>
          )}
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: 'rgba(56, 189, 248, 0.8)',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1001
        }}
      >
        Exit AR
      </button>
    </div>
  );
};

export default ARMode;
