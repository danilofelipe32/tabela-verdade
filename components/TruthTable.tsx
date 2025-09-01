
import React from 'react';
import { AnswerState, CheckState } from '../types';
import { CorrectIcon, IncorrectIcon } from './Icons';

interface TruthTableProps {
  variables: string[];
  expression: string;
  inputRows: boolean[][];
  userAnswers: AnswerState[];
  onAnswerChange: (rowIndex: number, answer: AnswerState) => void;
  rowCheckState: CheckState[];
  isComplete: boolean;
  hintedRow: number | null;
}

const AnswerButton: React.FC<{
    value: AnswerState;
    current: AnswerState;
    onClick: () => void;
    disabled: boolean;
}> = ({ value, current, onClick, disabled }) => {
    const isActive = value === current;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-4 py-1 rounded-md text-sm font-semibold transition-all
                ${isActive
                    ? (value === AnswerState.V ? 'bg-green-500 text-white shadow-md' : 'bg-red-500 text-white shadow-md')
                    : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}
                ${disabled ? 'cursor-not-allowed opacity-70' : ''}
            `}
        >
            {value}
        </button>
    );
};


export const TruthTable: React.FC<TruthTableProps> = ({ variables, expression, inputRows, userAnswers, onAnswerChange, rowCheckState, isComplete, hintedRow }) => {
  return (
    <table className="w-full text-center text-sm sm:text-base border-collapse">
      <thead>
        <tr className="border-b-2 border-cyan-500">
          {variables.map(v => (
            <th key={v} className="p-3 font-bold text-cyan-300">{v}</th>
          ))}
          <th className="p-3 font-bold text-yellow-300 border-l-2 border-cyan-700">{expression}</th>
          <th className="p-3 w-16"></th>
        </tr>
      </thead>
      <tbody>
        {inputRows.map((row, rowIndex) => {
          const checkState = rowCheckState[rowIndex];
          return (
            <tr
              key={rowIndex}
              className={`
                border-b border-slate-700 last:border-b-0 transition-colors duration-500
                ${rowIndex === hintedRow ? 'bg-yellow-500/30' : ''}
                ${checkState === CheckState.CORRECT ? 'bg-green-500/30' : ''}
                ${checkState === CheckState.INCORRECT ? 'bg-red-500/30' : ''}
              `}
            >
              {row.map((val, colIndex) => (
                <td key={colIndex} className={`p-3 font-mono ${val ? 'text-green-400' : 'text-red-400'}`}>{val ? 'V' : 'F'}</td>
              ))}
              <td className="p-3 border-l-2 border-cyan-700">
                <div className="flex justify-center items-center gap-2">
                   <AnswerButton
                      value={AnswerState.V}
                      current={userAnswers[rowIndex]}
                      onClick={() => onAnswerChange(rowIndex, AnswerState.V)}
                      disabled={isComplete}
                   />
                   <AnswerButton
                      value={AnswerState.F}
                      current={userAnswers[rowIndex]}
                      onClick={() => onAnswerChange(rowIndex, AnswerState.F)}
                      disabled={isComplete}
                   />
                </div>
              </td>
              <td className="p-3 w-16">
                  <div className="flex justify-center items-center h-full">
                      {checkState === CheckState.CORRECT && <CorrectIcon className="w-6 h-6 text-green-500" />}
                      {checkState === CheckState.INCORRECT && <IncorrectIcon className="w-6 h-6 text-red-500" />}
                  </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
    