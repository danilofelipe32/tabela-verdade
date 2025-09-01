
import React from 'react';
import type { Level } from '../types';
import { LockIcon, CheckIcon, ClockIcon, InfoIcon } from './Icons';

interface LevelSelectionScreenProps {
  levels: Level[];
  completedLevels: Set<number>;
  levelTimes: { [key: number]: number };
  onSelectLevel: (levelId: number) => void;
  onOpenInstructions: () => void;
}

export const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ levels, completedLevels, levelTimes, onSelectLevel, onOpenInstructions }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
      <div className="relative w-full max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300">Desafio Tabela Verdade</h1>
        <button
          onClick={onOpenInstructions}
          className="absolute top-1/2 right-0 -translate-y-1/2 text-cyan-400 hover:text-cyan-200 transition-colors p-2 rounded-full hover:bg-slate-700/50"
          aria-label="Mostrar instruções do jogo"
        >
          <InfoIcon className="w-7 h-7" />
        </button>
      </div>
      <p className="text-slate-300 mt-2 mb-8 sm:mb-12 max-w-2xl mx-auto">
        Selecione um nível para começar. Complete os níveis para desbloquear os próximos desafios de lógica!
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {levels.map((level) => {
          const isCompleted = completedLevels.has(level.id);
          const isUnlocked = level.id === 1 || completedLevels.has(level.id - 1);
          const bestTime = levelTimes[level.id];

          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              disabled={!isUnlocked}
              className={`
                aspect-square flex flex-col items-center justify-center p-2 rounded-lg 
                transition-all duration-300 ease-in-out transform
                ${isUnlocked 
                  ? 'bg-sky-800/70 border-2 border-sky-600 hover:bg-sky-700 hover:scale-105 shadow-lg' 
                  : 'bg-slate-700/50 border border-slate-600 cursor-not-allowed'}
                ${isCompleted ? 'bg-green-800/70 border-green-600' : ''}
              `}
            >
              <span className="text-2xl sm:text-3xl font-bold text-white">{level.id}</span>
              {isCompleted && bestTime !== undefined && (
                <div className="flex items-center gap-1 text-yellow-300 mt-1">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-xs font-mono">{formatTime(bestTime)}</span>
                </div>
              )}
              {isCompleted && <CheckIcon className="w-5 h-5 text-green-300 absolute top-1 right-1" />}
              {!isUnlocked && <LockIcon className="w-5 h-5 text-slate-400 absolute bottom-1 right-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
