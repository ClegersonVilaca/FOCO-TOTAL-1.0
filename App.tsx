
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Menu,
  Palette,
  Sparkles,
  Clock,
  X,
  Moon,
  Sun,
  Trees,
  Waves,
  Zap,
} from 'lucide-react';
import { UserStats, TimerStatus, AppView } from './types';
import { STORAGE_KEY, INITIAL_STATS } from './constants';
import { getMotivationalTip } from './services/geminiService';
import { supabase, saveUserStats, loadUserStats } from './services/supabaseService';

// Components
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';
import FocusView from './components/views/FocusView';
import PlannerView from './components/views/PlannerView';
import EvolutionView from './components/views/EvolutionView';

const App: React.FC = () => {
  // Navigation & Auth State
  const [currentView, setCurrentView] = useState<AppView>('focus');
  const [isMinimalist, setIsMinimalist] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App Core State
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [taskName, setTaskName] = useState('');
  const [customMinutes, setCustomMinutes] = useState('25');

  // UI State
  const [motivationalTip, setMotivationalTip] = useState('Processando dados de alto rendimento...');
  const [showMasteryFeedback, setShowMasteryFeedback] = useState(false);
  const [lastFinishedTask, setLastFinishedTask] = useState('');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Refs
  const timerRef = useRef<any>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Consistency Logic ---

  const currentStreak = useMemo(() => {
    if (!stats.historicoEstudo || stats.historicoEstudo.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const checkDate = new Date(today);
    const historySet = new Set(stats.historicoEstudo);
    const todayStr = today.toISOString().split('T')[0];
    if (!historySet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (historySet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [stats.historicoEstudo]);

  const isComboActive = currentStreak >= 5;

  // --- Auth & Sync ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const initData = async () => {
      if (user) {
        const cloudStats = await loadUserStats(user.id);
        if (cloudStats) setStats(cloudStats);
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const hydratedMaterias = (parsed.materias || []).map((m: any) => ({
              ...m,
              flashcards: m.flashcards || []
            }));
            setStats({
              ...INITIAL_STATS,
              ...parsed,
              materias: hydratedMaterias,
              historicoEstudo: parsed.historicoEstudo || [],
              totalNeuroniosGanhos: parsed.totalNeuroniosGanhos || parsed.neuronios || 0,
              chatHistory: parsed.chatHistory || []
            });
          } catch (e) { console.error(e); }
        }
      }
    };
    initData();
    fetchTip();
  }, [user]);

  const saveStats = useCallback(async (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    if (user) await saveUserStats(user.id, newStats);
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStats(INITIAL_STATS);
  };

  const fetchTip = async () => setMotivationalTip(await getMotivationalTip());

  // --- Theme Selection Logic ---

  const selectTheme = (themeId: string) => {
    saveStats({ ...stats, activeTheme: themeId });
    setShowThemeSelector(false);
  };

  // --- Timer Logic ---

  const startTimer = () => {
    if (!taskName.trim()) { alert("Qual o seu foco?"); return; }
    setTimerStatus('running');
    if (stats.activeSound) playSound(stats.activeSound, true);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimerStatus('idle');
    setTimeLeft(initialTime);
    if (ambientAudioRef.current) { ambientAudioRef.current.pause(); ambientAudioRef.current = null; }
  };

  const playSound = (url: string, loop: boolean = false) => {
    try {
      const audio = new Audio(url);
      if (loop) { audio.loop = true; ambientAudioRef.current = audio; }
      audio.play();
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (timerStatus === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      document.title = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} - Foco`;
    } else if (timeLeft === 0 && timerStatus === 'running') {
      handleComplete();
    } else {
      document.title = "Foco Total";
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerStatus, timeLeft]);

  const handleComplete = () => {
    setTimerStatus('finished');
    setLastFinishedTask(taskName);
    if (ambientAudioRef.current) { ambientAudioRef.current.pause(); ambientAudioRef.current = null; }
    if (stats.activeAlarm) playSound(stats.activeAlarm);

    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = stats.historicoEstudo.includes(todayStr)
      ? stats.historicoEstudo
      : [...stats.historicoEstudo, todayStr];

    let reward = isComboActive ? 20 : 10;

    saveStats({
      ...stats,
      totalNeuroniosGanhos: (stats.totalNeuroniosGanhos || 0) + reward,
      sessoesConcluidas: stats.sessoesConcluidas + 1,
      horasDeFoco: stats.horasDeFoco + (initialTime / 3600),
      historicoEstudo: newHistory
    });
    setShowMasteryFeedback(true);
  };

  // --- Auth Loading Screen ---
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-logo-icon">
          <Zap size={32} />
        </div>
        <p style={{ color: '#666', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
          Carregando...
        </p>
      </div>
    );
  }

  // --- Auth Screen (not logged in) ---
  if (!user) {
    return <AuthScreen onAuthSuccess={() => { }} />;
  }

  // --- Main App (logged in) ---
  return (
    <div className={`main-app-container flex flex-col lg:flex-row bg-foco-bg text-foco-text transition-all duration-700 ease-in-out ${stats.activeTheme}`}>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black/40 border-b border-white/5 sticky top-0 z-[110]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foco-accent rounded-xl flex items-center justify-center text-foco-bg font-black">FT</div>
          <span className="font-black tracking-tighter">Foco Total</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowThemeSelector(!showThemeSelector)} className="p-2 text-foco-accent"><Palette size={24} /></button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foco-accent"><Menu size={28} /></button>
        </div>
      </div>

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        stats={stats}
        saveStats={saveStats}
        user={user}
        authLoading={authLoading}
        handleLogin={() => { }}
        handleLogout={handleLogout}
        showThemeSelector={showThemeSelector}
        setShowThemeSelector={setShowThemeSelector}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-14 relative">
        {/* Theme Selector Popover */}
        {showThemeSelector && (
          <div className="fixed top-20 right-6 lg:right-14 z-[150] bg-foco-card border border-white/10 rounded-[28px] p-6 shadow-2xl animate-in zoom-in duration-200 w-64">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-sm uppercase tracking-widest text-foco-secondary">Seleção de Tema</h4>
              <button onClick={() => setShowThemeSelector(false)} className="text-foco-secondary hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => selectTheme('default')} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${stats.activeTheme === 'default' ? 'bg-foco-accent/10 border-foco-accent' : 'border-white/5 hover:bg-white/5'}`}>
                <Moon className="text-indigo-400" size={20} /> <span className="text-sm font-bold">Foco Noturno</span>
              </button>
              <button onClick={() => selectTheme('theme-light')} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${stats.activeTheme === 'theme-light' ? 'bg-foco-accent/10 border-foco-accent' : 'border-white/5 hover:bg-white/5'}`}>
                <Sun className="text-foco-accent" size={20} /> <span className="text-sm font-bold">Tema Elegante</span>
              </button>
            </div>
          </div>
        )}

        {!isMinimalist && (
          <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
            <div>
              <p className="text-foco-secondary text-[10px] font-black tracking-[0.3em] uppercase opacity-70">Protocolo v5.5 Performance Insights</p>
              <h2 className="text-xl lg:text-2xl font-black flex items-center gap-3 text-left"><Sparkles size={24} className="text-foco-accent flex-shrink-0" /> {motivationalTip}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-foco-card border border-white/10 px-8 py-4 rounded-[24px] flex items-center gap-4 shadow-xl">
                <Clock className="text-indigo-400" size={20} />
                <div><p className="text-[10px] text-foco-secondary uppercase font-black">Produtividade</p><p className="text-xl font-black leading-none">{stats.horasDeFoco.toFixed(1)}h</p></div>
              </div>
              <button onClick={() => setShowThemeSelector(!showThemeSelector)} className="hidden lg:flex p-4 bg-foco-card border border-white/10 rounded-[20px] text-foco-accent hover:scale-105 transition-all shadow-xl">
                <Palette size={22} className={`${showThemeSelector ? 'rotate-90' : 'rotate-0'} transition-transform duration-500`} />
              </button>
            </div>
          </header>
        )}

        <div className="max-w-7xl mx-auto">
          {currentView === 'focus' && (
            <FocusView
              isMinimalist={isMinimalist}
              setIsMinimalist={setIsMinimalist}
              stats={stats}
              currentStreak={currentStreak}
              isComboActive={isComboActive}
              taskName={taskName}
              setTaskName={setTaskName}
              timerStatus={timerStatus}
              timeLeft={timeLeft}
              initialTime={initialTime}
              setInitialTime={setInitialTime}
              setTimeLeft={setTimeLeft}
              customMinutes={customMinutes}
              setCustomMinutes={setCustomMinutes}
              startTimer={startTimer}
              stopTimer={stopTimer}
              showMasteryFeedback={showMasteryFeedback}
              setShowMasteryFeedback={setShowMasteryFeedback}
              lastFinishedTask={lastFinishedTask}
              saveStats={saveStats}
              setTimerStatus={setTimerStatus}
            />
          )}

          {currentView === 'planner' && (
            <PlannerView
              stats={stats}
              saveStats={saveStats}
            />
          )}

          {currentView === 'evolution' && (
            <EvolutionView
              stats={stats}
              currentStreak={currentStreak}
            />
          )}

        </div>
      </main>

      {isMobileMenuOpen && (<div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[115] lg:hidden" />)}
    </div>
  );
};

export default App;
