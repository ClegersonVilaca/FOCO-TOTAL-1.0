
export interface Review {
  id: string;
  tarefa: string;
  dataProximaRevisao: string; // ISO String
}

export interface Flashcard {
  id: string;
  pergunta: string;
  resposta: string;
  dataProximaRevisao: string; // ISO String
}

export interface Lesson {
  id: string;
  nome: string;
  concluida: boolean;
  link?: string;
}

export interface Exercise {
  id: string;
  nome: string;
  concluido: boolean;
}

export interface Subject {
  id: string;
  nome: string;
  aulas: Lesson[];
  exercicios: Exercise[];
  flashcards: Flashcard[];
  estrategiaIA?: string;
}

export interface CustomAudio {
  id: string;
  nome: string;
  data: string; // Base64 data URL
  tipo: 'alarm' | 'ambient';
}

export interface ShopItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tipo: 'tema' | 'som' | 'consumable';
  valor: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface UserStats {
  neuronios: number;
  totalNeuroniosGanhos: number; // Para sistema de níveis
  multiplierActive: boolean; // Flag para o item 2x
  sessoesConcluidas: number;
  horasDeFoco: number;
  revisoesAgendadas: Review[];
  itensComprados: string[];
  chatHistory: ChatMessage[]; // Histórico do Mentor IA
  activeTheme: string;
  activeSound: string | null;
  activeAlarm: string | null;
  materias: Subject[];
  uploadedAudio: CustomAudio[];
  sidebarOpen: boolean;
  historicoEstudo: string[]; // Formato YYYY-MM-DD
}

export type AppView = 'focus' | 'planner' | 'store' | 'evolution' | 'mentor';
export type TimerStatus = 'idle' | 'running' | 'finished';
