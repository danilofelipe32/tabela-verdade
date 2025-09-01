
import React from 'react';
import { XIcon } from './Icons';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-slate-200 relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Fechar modal"
        >
          <XIcon className="w-7 h-7" />
        </button>

        <h2 className="text-3xl font-bold text-cyan-300 mb-6 text-center">Como Jogar</h2>
        
        <div className="space-y-4 text-left">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">🎯 Objetivo do Jogo</h3>
            <p className="text-slate-300">
              Seu desafio é preencher corretamente a coluna de resultados de cada tabela verdade. Cada nível apresenta uma expressão lógica diferente, de simples negações a combinações complexas.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">✍️ Preenchendo a Tabela</h3>
            <p className="text-slate-300">
              Para cada linha, avalie a expressão lógica com os valores de 'V' (Verdadeiro) e 'F' (Falso) fornecidos para as variáveis. Clique nos botões 'V' ou 'F' na coluna da expressão para registrar sua resposta.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">🚀 Verificação e Progresso</h3>
            <p className="text-slate-300">
              Após preencher todas as linhas, clique em "Verificar Respostas". Respostas corretas serão marcadas com um ícone verde, e as incorretas, com um vermelho. Acerte tudo para concluir o nível, destravar o próximo e registrar seu tempo!
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">💡 Dicas e Recomeço</h3>
            <p className="text-slate-300">
              Se estiver em dúvida, use o botão "Dica" para revelar a resposta de uma linha. Você tem 3 dicas por nível. Se quiser começar de novo, o botão "Recomeçar" limpa a tabela e reinicia o cronômetro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
