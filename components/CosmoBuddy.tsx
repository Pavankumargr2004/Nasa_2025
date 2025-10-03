import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { Content } from '@google/generative-ai';

const CosmoBuddy: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Content[]>([
        { role: 'model', parts: [{ text: "Hi there! I'm Cosmo Buddy. Ask me anything about space! 🚀" }] }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Content = { role: 'user', parts: [{ text: userInput }] };
        const newMessages: Content[] = [...messages, newUserMessage];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const history = newMessages.slice(0, -1);
        const responseText = await getChatbotResponse(history, userInput);

        setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
        setIsLoading(false);
    };
    
    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-[70] w-16 h-16 bg-black/40 backdrop-blur-md border border-violet-500/50 rounded-full text-3xl 
                           flex items-center justify-center shadow-lg hover:scale-110 hover:border-cyan-400/80 transition-all duration-300
                           ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Open Cosmo Buddy Chat"
            >
                🛸
            </button>

            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-black/60 backdrop-blur-xl border-l border-violet-700/50 
                           shadow-2xl z-[80] flex flex-col transition-transform duration-500 ease-in-out
                           ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-violet-700/50">
                    <h3 className="font-orbitron text-xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">
                        <span className="text-2xl">🛸</span> Cosmo Buddy
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-3xl text-violet-300 hover:text-white transition-colors">&times;</button>
                </header>
                
                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 no-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 animate-fade-in-fast ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">🛸</div>}
                            <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-sky-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
                                <p className="text-white whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 animate-fade-in-fast">
                             <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">🛸</div>
                            <div className="max-w-xs md:max-w-sm rounded-2xl px-4 py-3 bg-gray-800 rounded-bl-none">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                 </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex-shrink-0 p-4 border-t border-violet-700/50 bg-black/30">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about planets..."
                            className="w-full bg-gray-900/70 border border-violet-600 rounded-full px-4 py-2 text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            disabled={isLoading}
                        />
                        <button type="submit" className="px-4 h-10 w-24 bg-sky-600 rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !userInput.trim()}>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CosmoBuddy;