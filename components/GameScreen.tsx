
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TruthTable } from './TruthTable';
import type { Level } from '../types';
import { AnswerState, CheckState } from '../types';
import { BackIcon, CorrectIcon, IncorrectIcon, ClockIcon, LightbulbIcon, ResetIcon, ArrowLeftIcon, ArrowRightIcon, HistoryBackIcon, HistoryForwardIcon } from './Icons';

interface GameScreenProps {
  level: Level;
  onComplete: (levelId: number, time: number, answers: AnswerState[]) => void;
  onBack: () => void;
  onNextLevel: () => void;
  onPreviousLevel: () => void;
  isFirstLevel: boolean;
  isLastLevel: boolean;
  isNextLevelUnlocked: boolean;
  onHistoryBack: () => void;
  onHistoryForward: () => void;
  canGoBackInHistory: boolean;
  canGoForwardInHistory: boolean;
  isAlreadyCompleted: boolean;
  savedUserAnswers: AnswerState[] | undefined;
}

const INITIAL_HINT_COUNT = 3;

export const GameScreen: React.FC<GameScreenProps> = ({ 
    level, 
    onComplete, 
    onBack, 
    onNextLevel, 
    onPreviousLevel,
    isFirstLevel,
    isLastLevel,
    isNextLevelUnlocked,
    onHistoryBack,
    onHistoryForward,
    canGoBackInHistory,
    canGoForwardInHistory,
    isAlreadyCompleted,
    savedUserAnswers,
}) => {
  const numRows = 2 ** level.variables.length;

  const getInitialAnswers = useCallback(() => {
    return savedUserAnswers && isAlreadyCompleted 
      ? savedUserAnswers 
      : Array(numRows).fill(AnswerState.EMPTY);
  }, [savedUserAnswers, isAlreadyCompleted, numRows]);

  const getInitialCheckState = useCallback(() => {
    return isAlreadyCompleted 
      ? Array(numRows).fill(CheckState.CORRECT)
      : Array(numRows).fill(CheckState.UNCHECKED);
  }, [isAlreadyCompleted, numRows]);


  const [userAnswers, setUserAnswers] = useState<AnswerState[]>(getInitialAnswers());
  const [rowCheckState, setRowCheckState] = useState<CheckState[]>(getInitialCheckState());
  const [isComplete, setIsComplete] = useState(isAlreadyCompleted);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const [time, setTime] = useState(0);
  const [hintCount, setHintCount] = useState(INITIAL_HINT_COUNT);
  const [hintedRow, setHintedRow] = useState<number | null>(null);

  const resetLevelState = useCallback(() => {
    setUserAnswers(Array(numRows).fill(AnswerState.EMPTY));
    setRowCheckState(Array(numRows).fill(CheckState.UNCHECKED));
    setIsComplete(false);
    setShowIncorrectMessage(false);
    setTime(0);
    setHintCount(INITIAL_HINT_COUNT);
    setHintedRow(null);
  }, [numRows]);


  useEffect(() => {
    setUserAnswers(getInitialAnswers());
    setRowCheckState(getInitialCheckState());
    setIsComplete(isAlreadyCompleted);
    setShowIncorrectMessage(false);
    setTime(0);
    setHintCount(INITIAL_HINT_COUNT);
    setHintedRow(null);
  }, [level, isAlreadyCompleted, getInitialAnswers, getInitialCheckState]);

  useEffect(() => {
    if (isComplete) return;

    const timerId = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isComplete]);
  
  const handleAnswerChange = (rowIndex: number, answer: AnswerState) => {
    if (isComplete) return;
    const newAnswers = [...userAnswers];
    newAnswers[rowIndex] = answer;
    setUserAnswers(newAnswers);
    const newCheckStates = [...rowCheckState];
    newCheckStates[rowIndex] = CheckState.UNCHECKED;
    setRowCheckState(newCheckStates);
    setShowIncorrectMessage(false);
  };
  
  const inputRows = useMemo(() => {
    const rows: boolean[][] = [];
    const numVars = level.variables.length;
    for (let i = (2 ** numVars) - 1; i >= 0; i--) {
      const row: boolean[] = [];
      for (let j = numVars - 1; j >= 0; j--) {
        row.push(!!(i & (1 << j)));
      }
      rows.push(row);
    }
    return rows;
  }, [level.variables.length]);

  const checkAnswers = () => {
    if (userAnswers.some(a => a === AnswerState.EMPTY)) {
        setShowIncorrectMessage(true);
        return;
    }

    const newRowCheckState = userAnswers.map((answer, index) => {
      const userAnswerBool = answer === AnswerState.V;
      return userAnswerBool === level.solution[index] ? CheckState.CORRECT : CheckState.INCORRECT;
    });
    setRowCheckState(newRowCheckState);

    const allCorrect = newRowCheckState.every(state => state === CheckState.CORRECT);
    if (allCorrect) {
      setIsComplete(true);
      onComplete(level.id, time, userAnswers);
      setShowIncorrectMessage(false);
    } else {
      setShowIncorrectMessage(true);
    }
  };

  const handleUseHint = () => {
    if (hintCount <= 0 || isComplete) return;
  
    const firstIncorrectOrEmptyIndex = userAnswers.findIndex((answer, index) => {
      const userAnswerBool = answer === AnswerState.V;
      return answer === AnswerState.EMPTY || userAnswerBool !== level.solution[index];
    });
  
    if (firstIncorrectOrEmptyIndex !== -1) {
      const newAnswers = [...userAnswers];
      const correctAnswer = level.solution[firstIncorrectOrEmptyIndex] ? AnswerState.V : AnswerState.F;
      newAnswers[firstIncorrectOrEmptyIndex] = correctAnswer;
      setUserAnswers(newAnswers);
      setHintCount(prev => prev - 1);
      setHintedRow(firstIncorrectOrEmptyIndex);
      setTimeout(() => setHintedRow(null), 1000); // Highlight for 1 second
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const commonButtonStyles = "p-2 rounded-full text-cyan-300 hover:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200 border-2 border-transparent hover:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500";

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full animate-fade-in">
        <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors">
                    <BackIcon className="w-6 h-6" />
                    <span className="hidden sm:inline">Voltar</span>
                </button>
                <button 
                    onClick={onHistoryBack} 
                    disabled={!canGoBackInHistory}
                    className={commonButtonStyles}
                    aria-label="Voltar no histórico"
                    title={canGoBackInHistory ? "Voltar no histórico" : "Não há histórico anterior"}
                >
                    <HistoryBackIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={onHistoryForward} 
                    disabled={!canGoForwardInHistory}
                    className={commonButtonStyles}
                    aria-label="Avançar no histórico"
                    title={canGoForwardInHistory ? "Avançar no histórico" : "Não há histórico posterior"}
                >
                    <HistoryForwardIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-grow justify-center min-w-0">
                <button 
                    onClick={onPreviousLevel} 
                    disabled={isFirstLevel}
                    className={commonButtonStyles}
                    aria-label="Nível anterior"
                    title={isFirstLevel ? "Este é o primeiro nível" : "Nível anterior"}
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 text-center truncate">{level.title}</h1>
                <button 
                    onClick={onNextLevel} 
                    disabled={isLastLevel || !isNextLevelUnlocked}
                    className={commonButtonStyles}
                    aria-label="Próximo nível"
                    title={isLastLevel ? "Você chegou ao último nível!" : !isNextLevelUnlocked ? "Complete o nível atual para desbloquear" : "Próximo nível"}
                >
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center justify-end gap-4 flex-shrink-0">
                <button onClick={resetLevelState} className="text-cyan-300 hover:text-cyan-200 transition-colors" aria-label="Recomeçar nível">
                    <ResetIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-end gap-2" aria-label="Timer">
                    <ClockIcon className="w-6 h-6 text-yellow-300" />
                    <span className="text-2xl font-mono text-yellow-300">{formatTime(time)}</span>
                </div>
            </div>
        </div>
      
        <p className="text-slate-300 mb-6 text-center max-w-3xl mx-auto">{level.description}</p>
      
        <div className="bg-slate-900/50 rounded-xl p-4 overflow-x-auto">
            <TruthTable
                variables={level.variables}
                expression={level.expression}
                inputRows={inputRows}
                userAnswers={userAnswers}
                onAnswerChange={handleAnswerChange}
                rowCheckState={rowCheckState}
                isComplete={isComplete}
                hintedRow={hintedRow}
            />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isComplete ? (
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={handleUseHint}
                      disabled={hintCount === 0}
                      className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <LightbulbIcon className="w-6 h-6"/>
                        <span>Dica ({hintCount})</span>
                    </button>
                    <button onClick={checkAnswers} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg">
                       Verificar Respostas
                   </button>
                 </div>
            ) : (
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-semibold mb-4">
                         <CorrectIcon className="w-8 h-8"/>
                         <span>Parabéns, nível concluído!</span>
                    </div>
                    {isLastLevel ? (
                         <button onClick={onBack} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg">
                            Voltar ao Menu
                        </button>
                    ) : (
                        <button onClick={onNextLevel} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg">
                            Próximo Nível
                        </button>
                    )}
                </div>
            )}
        </div>
        {showIncorrectMessage && !isComplete && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-400 text-md">
                <IncorrectIcon className="w-6 h-6" />
                <span>Algumas respostas estão incorretas ou incompletas. Tente novamente!</span>
            </div>
        )}
    </div>
  );
};
