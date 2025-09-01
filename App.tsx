
import React, { useState, useEffect, useCallback } from 'react';
import { LevelSelectionScreen } from './components/LevelSelectionScreen';
import { GameScreen } from './components/GameScreen';
import { InstructionsModal } from './components/InstructionsModal';
import type { Level } from './types';
import { AnswerState } from './types';
import { LEVELS } from './constants';

const App: React.FC = () => {
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [levelTimes, setLevelTimes] = useState<{ [key: number]: number }>({});
  const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: AnswerState[] }>({});
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [levelHistory, setLevelHistory] = useState<number[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('completedLevels');
      if (savedProgress) {
        setCompletedLevels(new Set(JSON.parse(savedProgress)));
      }
      const savedTimes = localStorage.getItem('levelTimes');
      if (savedTimes) {
        setLevelTimes(JSON.parse(savedTimes));
      }
      const savedUserAnswers = localStorage.getItem('savedAnswers');
      if (savedUserAnswers) {
        setSavedAnswers(JSON.parse(savedUserAnswers));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    }
  }, []);

  const saveProgress = useCallback((newCompletedLevels: Set<number>) => {
    try {
      localStorage.setItem('completedLevels', JSON.stringify(Array.from(newCompletedLevels)));
    } catch (error)      {
       console.error("Failed to save progress to localStorage", error);
    }
  }, []);

  const saveTimes = useCallback((newLevelTimes: { [key: number]: number }) => {
    try {
        localStorage.setItem('levelTimes', JSON.stringify(newLevelTimes));
    } catch (error) {
        console.error("Failed to save times to localStorage", error);
    }
  }, []);

  const saveUserAnswers = useCallback((newSavedAnswers: { [key: number]: AnswerState[] }) => {
    try {
        localStorage.setItem('savedAnswers', JSON.stringify(newSavedAnswers));
    } catch (error) {
        console.error("Failed to save answers to localStorage", error);
    }
  }, []);

  const navigateToLevel = (levelId: number) => {
    if (levelId === currentLevelId) return;

    const newHistory = levelHistory.slice(0, historyIndex + 1);
    newHistory.push(levelId);

    setLevelHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentLevelId(levelId);
  };

  const handleLevelSelect = (levelId: number) => {
    navigateToLevel(levelId);
  };

  const handleLevelComplete = (levelId: number, time: number, userAnswers: AnswerState[]) => {
    const newCompletedLevels = new Set(completedLevels).add(levelId);
    setCompletedLevels(newCompletedLevels);
    saveProgress(newCompletedLevels);

    const existingTime = levelTimes[levelId];
    if (existingTime === undefined || time < existingTime) {
        const newLevelTimes = { ...levelTimes, [levelId]: time };
        setLevelTimes(newLevelTimes);
        saveTimes(newLevelTimes);
    }

    const newSavedAnswers = { ...savedAnswers, [levelId]: userAnswers };
    setSavedAnswers(newSavedAnswers);
    saveUserAnswers(newSavedAnswers);
  };

  const handleBackToMenu = () => {
    setCurrentLevelId(null);
  };
  
  const handleNextLevel = () => {
      if (currentLevelId !== null) {
          const isUnlocked = completedLevels.has(currentLevelId);
          const nextLevel = LEVELS.find(l => l.id === currentLevelId + 1);
          if(nextLevel && isUnlocked) {
              navigateToLevel(nextLevel.id);
          } else if (!nextLevel) {
              setCurrentLevelId(null); // Back to menu if it's the last level
          }
      }
  };
  
  const handlePreviousLevel = () => {
    if (currentLevelId !== null && currentLevelId > 1) {
      const prevLevel = LEVELS.find(l => l.id === currentLevelId - 1);
      if (prevLevel) {
        navigateToLevel(prevLevel.id);
      }
    }
  };

  const handleHistoryBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentLevelId(levelHistory[newIndex]);
    }
  };

  const handleHistoryForward = () => {
    if (historyIndex < levelHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentLevelId(levelHistory[newIndex]);
    }
  };

  const currentLevel = LEVELS.find(level => level.id === currentLevelId) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-900 to-cyan-900 text-white font-sans p-4 sm:p-8 flex items-center justify-center">
      <main className="w-full max-w-5xl">
        {currentLevel ? (
          <GameScreen
            level={currentLevel}
            onComplete={handleLevelComplete}
            onBack={handleBackToMenu}
            onNextLevel={handleNextLevel}
            onPreviousLevel={handlePreviousLevel}
            isFirstLevel={currentLevel.id === 1}
            isLastLevel={currentLevel.id === LEVELS.length}
            isNextLevelUnlocked={completedLevels.has(currentLevel.id)}
            onHistoryBack={handleHistoryBack}
            onHistoryForward={handleHistoryForward}
            canGoBackInHistory={historyIndex > 0}
            canGoForwardInHistory={historyIndex < levelHistory.length - 1}
            isAlreadyCompleted={completedLevels.has(currentLevel.id)}
            savedUserAnswers={savedAnswers[currentLevel.id]}
          />
        ) : (
          <LevelSelectionScreen
            levels={LEVELS}
            completedLevels={completedLevels}
            levelTimes={levelTimes}
            onSelectLevel={handleLevelSelect}
            onOpenInstructions={() => setIsInstructionsModalOpen(true)}
          />
        )}
      </main>
      <InstructionsModal 
        isOpen={isInstructionsModalOpen} 
        onClose={() => setIsInstructionsModalOpen(false)} 
      />
    </div>
  );
};

export default App;
