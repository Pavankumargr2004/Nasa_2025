import React from 'react';

const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isListening ? (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4m4-4v4m4-4v4m4-4v4m4-4v4M5 8v8a2 2 0 002 2h10a2 2 0 002-2V8M9 4v16" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
        </svg>
    );
};

export default MicrophoneIcon;