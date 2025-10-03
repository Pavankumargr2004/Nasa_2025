import React, { useState, useMemo } from 'react';

const quizData = [
    { image: 'https://esahubble.org/media/archives/datasets/images/wallpaper5/heic1509a.jpg', answer: 'Hubble', fact: "This is the 'Pillars of Creation' in the Eagle Nebula, one of Hubble's most iconic images!" },
    { image: 'https://www.nasa.gov/wp-content/uploads/2022/07/webb_first_images_release-20220712-2.jpg', answer: 'James Webb', fact: "Webb's infrared vision reveals thousands of previously unseen young stars in the 'Cosmic Cliffs' of the Carina Nebula." },
    { image: 'https://esahubble.org/media/archives/images/large/heic0506a.jpg', answer: 'Hubble', fact: 'This is the Whirlpool Galaxy (M51). Hubble shows its amazing spiral arms in visible light.' },
    { image: 'https://www.nasa.gov/wp-content/uploads/2022/07/stephans-quintet-rev-b-1.jpg', answer: 'James Webb', fact: "Webb's view of Stephan's Quintet shows huge shockwaves as one of the galaxies smashes through the cluster." },
    { image: 'https://www.nasa.gov/wp-content/uploads/2023/08/ring-nebula-jwst-1.jpg', answer: 'James Webb', fact: "The Ring Nebula looks like a cosmic eye! Webb captured this dying star's final farewell in stunning detail." },
    { image: 'https://esahubble.org/media/archives/images/large/heic1608a.jpg', answer: 'Hubble', fact: 'The Bubble Nebula, captured by Hubble for its 26th anniversary, is being shaped by a massive, hot star inside.' },
];

interface TelescopeQuizProps {
    addAchievement: (id: string) => void;
    // Fix: Add onBack prop to allow navigating back to the missions list.
    onBack: () => void;
}

const TelescopeQuiz: React.FC<TelescopeQuizProps> = ({ addAchievement, onBack }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameId, setGameId] = useState(1);

    const shuffledQuizData = useMemo(() => 
        [...quizData].sort(() => Math.random() - 0.5), 
        [gameId]
    );
    const currentQuestion = shuffledQuizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    const handleAnswer = (answer: string) => {
        if (showFeedback) return;
        setSelectedAnswer(answer);
        setShowFeedback(true);
        if (answer === currentQuestion.answer) {
            setScore(prev => prev + 1);
        }
    };
    
    const handleNext = () => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        if (currentQuestionIndex + 1 >= shuffledQuizData.length) {
            addAchievement('cosmic-photographer');
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setGameId(g => g + 1);
    }
    
    if (currentQuestionIndex >= shuffledQuizData.length) {
        return (
            <div className="w-full bg-black/30 rounded-2xl shadow-2xl shadow-violet-500/10 p-4 sm:p-6 backdrop-blur-sm border border-violet-700/30 text-center">
                 <h3 className="font-orbitron text-xl font-bold mb-4">Quiz Complete!</h3>
                 <p className="text-2xl text-violet-200 mb-6">You scored {score} out of {shuffledQuizData.length}!</p>
                 {/* Fix: Add a back button to the results screen. */}
                 <div className="flex justify-center items-center gap-4">
                    <button onClick={handleRestart} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-violet-500/50">Play Again</button>
                    <button onClick={onBack} className="px-6 py-2 bg-sky-600/80 hover:bg-sky-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-sky-500/50">Back to Missions</button>
                 </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-black/30 rounded-2xl shadow-2xl shadow-violet-500/10 p-4 sm:p-6 backdrop-blur-sm border border-violet-700/30">
            {/* Fix: Add a header with a back button. */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <div className="text-center sm:text-left">
                    <h3 className="font-orbitron text-xl font-bold mb-2">Mission: Telescope Image Quiz</h3>
                    <p className="text-violet-300">Who took this amazing picture? Hubble or James Webb?</p>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-sky-600/80 hover:bg-sky-700 rounded-full text-sm font-semibold transition-transform hover:scale-105 flex-shrink-0">Back to Missions</button>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-gray-900 border border-violet-700/30">
                <img src={currentQuestion.image} alt="A nebula or galaxy" className="w-full h-full object-cover" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {['Hubble', 'James Webb'].map(option => (
                    <button 
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={showFeedback}
                        className={`p-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:cursor-not-allowed
                            ${showFeedback && currentQuestion.answer === option ? 'bg-green-500/80 ring-2 ring-white' : ''}
                            ${showFeedback && selectedAnswer === option && !isCorrect ? 'bg-red-500/80' : ''}
                            ${!showFeedback ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-700/50'}
                        `}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {showFeedback && (
                <div className="text-center p-4 rounded-lg animate-fade-in bg-black/30">
                    <p className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite!'}
                    </p>
                    <p className="text-violet-200">{currentQuestion.fact}</p>
                    <button onClick={handleNext} className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-full transition-transform hover:scale-105">
                        Next Question
                    </button>
                </div>
            )}
        </div>
    );
};

export default TelescopeQuiz;