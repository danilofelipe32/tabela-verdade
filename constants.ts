import type { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Nível 1: Negação (NOT)',
    description: 'A negação inverte o valor de verdade. Se P é verdadeiro, ¬P é falso.',
    expression: '¬P',
    variables: ['P'],
    solution: [false, true], // V->F; F->V
  },
  {
    id: 2,
    title: 'Nível 2: Conjunção (AND)',
    description: 'A conjunção (E) só é verdadeira se ambas as proposições forem verdadeiras.',
    expression: 'P ∧ Q',
    variables: ['P', 'Q'],
    solution: [true, false, false, false], // VV->V, VF->F, FV->F, FF->F
  },
  {
    id: 3,
    title: 'Nível 3: Disjunção (OR)',
    description: 'A disjunção (OU) é verdadeira se pelo menos uma das proposições for verdadeira.',
    expression: 'P ∨ Q',
    variables: ['P', 'Q'],
    solution: [true, true, true, false], // VV->V, VF->V, FV->V, FF->F
  },
  {
    id: 4,
    title: 'Nível 4: Disjunção Exclusiva (XOR)',
    description: 'O OU exclusivo é verdadeiro apenas se uma das proposições for verdadeira, mas não ambas.',
    expression: 'P ⊕ Q',
    variables: ['P', 'Q'],
    solution: [false, true, true, false], // VV->F, VF->V, FV->V, FF->F
  },
  {
    id: 5,
    title: 'Nível 5: Condicional (IF...THEN)',
    description: 'A condicional (Se... Então...) só é falsa quando a primeira proposição é verdadeira e a segunda é falsa.',
    expression: 'P → Q',
    variables: ['P', 'Q'],
    solution: [true, false, true, true], // VV->V, VF->F, FV->V, FF->V
  },
  {
    id: 6,
    title: 'Nível 6: Bicondicional (IF AND ONLY IF)',
    description: 'A bicondicional (Se e somente se) é verdadeira quando ambas as proposições têm o mesmo valor de verdade.',
    expression: 'P ↔ Q',
    variables: ['P', 'Q'],
    solution: [true, false, false, true], // VV->V, VF->F, FV->F, FF->V
  },
  {
    id: 7,
    title: 'Nível 7: Leis de De Morgan (¬ AND)',
    description: 'A negação de uma conjunção é a disjunção das negações.',
    expression: '¬(P ∧ Q)',
    variables: ['P', 'Q'],
    solution: [false, true, true, true],
  },
  {
    id: 8,
    title: 'Nível 8: Leis de De Morgan (¬ OR)',
    description: 'A negação de uma disjunção é a conjunção das negações.',
    expression: '¬(P ∨ Q)',
    variables: ['P', 'Q'],
    solution: [false, false, false, true],
  },
  {
    id: 9,
    title: 'Nível 9: Expressão Composta',
    description: 'Combine operadores para resolver expressões mais complexas.',
    expression: '(P ∧ Q) ∨ P',
    variables: ['P', 'Q'],
    solution: [true, true, false, false],
  },
  {
    id: 10,
    title: 'Nível 10: Tautologia',
    description: 'Uma tautologia é uma proposição que é sempre verdadeira. Verifique se P ∨ ¬P é uma.',
    expression: 'P ∨ ¬P',
    variables: ['P'],
    solution: [true, true],
  },
  {
    id: 11,
    title: 'Nível 11: Contradição',
    description: 'Uma contradição é uma proposição que é sempre falsa. Verifique se P ∧ ¬P é uma.',
    expression: 'P ∧ ¬P',
    variables: ['P'],
    solution: [false, false],
  },
  {
    id: 12,
    title: 'Nível 12: Três Variáveis',
    description: 'Agora com 3 variáveis! O número de linhas da tabela dobra.',
    expression: 'P ∧ (Q ∨ R)',
    variables: ['P', 'Q', 'R'],
    solution: [true, true, true, false, false, false, false, false],
  },
  {
    id: 13,
    title: 'Nível 13: Implicação e Negação',
    description: 'Investigue a relação entre operadores.',
    expression: '¬P → ¬Q',
    variables: ['P', 'Q'],
    solution: [true, true, false, true],
  },
  {
    id: 14,
    title: 'Nível 14: Distributiva',
    description: 'A lei distributiva: P ∨ (Q ∧ R).',
    expression: 'P ∨ (Q ∧ R)',
    variables: ['P', 'Q', 'R'],
    solution: [true, true, true, true, true, false, false, false],
  },
  {
    id: 15,
    title: 'Nível 15: Equivalência Lógica',
    description: 'P → Q é logicamente equivalente a ¬P ∨ Q?',
    expression: '(P → Q) ↔ (¬P ∨ Q)',
    variables: ['P', 'Q'],
    solution: [true, true, true, true],
  },
  {
    id: 16,
    title: 'Nível 16: Desafio Final',
    description: 'Uma expressão complexa para testar suas habilidades.',
    expression: '(P → Q) ∧ (Q → R)',
    variables: ['P', 'Q', 'R'],
    solution: [true, false, false, false, true, false, true, true],
  },
];