
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserStats } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Anon Key não configuradas. Verifique o .env.local');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const saveUserStats = async (userId: string, stats: UserStats) => {
  const { error } = await supabase
    .from('user_data')
    .upsert({ 
      id: userId, 
      stats: stats,
      updated_at: new Date().toISOString() 
    });
  
  if (error) console.error('Erro ao salvar no Supabase:', error);
};

export const loadUserStats = async (userId: string): Promise<UserStats | null> => {
  const { data, error } = await supabase
    .from('user_data')
    .select('stats')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is ok for new users
      console.error('Erro ao carregar do Supabase:', error);
    }
    return null;
  }
  return data?.stats as UserStats;
};
