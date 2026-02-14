
import { UserStats, ShopItem } from './types';

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'consumable_2x',
    nome: 'Multiplicador 2x',
    descricao: 'Dobre os neurônios ganhos na sua próxima sessão de foco.',
    preco: 200,
    tipo: 'consumable',
    valor: 'multiplier'
  },
  {
    id: 'tema_forest',
    nome: 'Tema Floresta',
    descricao: 'Uma aura verde revigorante para sua concentração.',
    preco: 100,
    tipo: 'tema',
    valor: 'theme-forest'
  },
  {
    id: 'tema_ocean',
    nome: 'Tema Oceano',
    descricao: 'Profundidade e calma azul para estudos intensos.',
    preco: 150,
    tipo: 'tema',
    valor: 'theme-ocean'
  },
  {
    id: 'som_chuva',
    nome: 'Som de Chuva',
    descricao: 'O barulho relaxante da chuva ao fundo.',
    preco: 50,
    tipo: 'som',
    valor: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'som_cafeteria',
    nome: 'Cafeteria em Paris',
    descricao: 'O murmúrio ambiente de um bistrô clássico.',
    preco: 120,
    tipo: 'som',
    valor: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 'som_binaural',
    nome: 'Ondas Binaurais',
    descricao: 'Frequências científicas para foco ultra-profundo.',
    preco: 180,
    tipo: 'som',
    valor: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export const STORAGE_KEY = 'foco_total_data_v5.1';

export const INITIAL_STATS: UserStats = {
  neuronios: 1000,
  totalNeuroniosGanhos: 1000,
  multiplierActive: false,
  sessoesConcluidas: 0,
  horasDeFoco: 0,
  revisoesAgendadas: [],
  itensComprados: [],
  chatHistory: [],
  activeTheme: 'default',
  activeSound: null,
  activeAlarm: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  materias: [],
  uploadedAudio: [],
  sidebarOpen: true,
  historicoEstudo: []
};
