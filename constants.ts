
import { UserStats } from './types';

export const STORAGE_KEY = 'foco_total_data_v5.1';

export const INITIAL_STATS: UserStats = {
  totalNeuroniosGanhos: 100,
  sessoesConcluidas: 0,
  horasDeFoco: 0,
  revisoesAgendadas: [],
  activeTheme: 'default',
  activeSound: null,
  activeAlarm: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  materias: [],
  uploadedAudio: [],
  sidebarOpen: true,
  historicoEstudo: []
};
