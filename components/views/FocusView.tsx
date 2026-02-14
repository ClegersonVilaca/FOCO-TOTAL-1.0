
import React, { useMemo } from 'react';
import {
    Zap,
    Target,
    Clock,
    Flame,
    Sparkles,
    Calendar,
    Maximize2,
    Minimize2,
    Award
} from 'lucide-react';
import { UserStats, TimerStatus, Review } from '../../types';

interface FocusViewProps {
    isMinimalist: boolean;
    setIsMinimalist: (isMinimalist: boolean) => void;
    stats: UserStats;
    currentStreak: number;
    isComboActive: boolean;
    taskName: string;
    setTaskName: (name: string) => void;
    timerStatus: TimerStatus;
    timeLeft: number;
    initialTime: number;
    setInitialTime: (time: number) => void;
    setTimeLeft: (time: number) => void;
    customMinutes: string;
    setCustomMinutes: (minutes: string) => void;
    startTimer: () => void;
    stopTimer: () => void;
    showMasteryFeedback: boolean;
    setShowMasteryFeedback: (show: boolean) => void;
    lastFinishedTask: string;
    saveStats: (stats: UserStats) => void;
    setTimerStatus: (status: TimerStatus) => void; // needed for resetting after feedback
}

const FocusView: React.FC<FocusViewProps> = ({
    isMinimalist,
    setIsMinimalist,
    stats,
    currentStreak,
    isComboActive,
    taskName,
    setTaskName,
    timerStatus,
    timeLeft,
    initialTime,
    setInitialTime,
    setTimeLeft,
    customMinutes,
    setCustomMinutes,
    startTimer,
    stopTimer,
    showMasteryFeedback,
    setShowMasteryFeedback,
    lastFinishedTask,
    saveStats,
    setTimerStatus
}) => {

    const heatmapDays = useMemo(() => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalDays = 15 * 7;
        const startDay = new Date(today);
        startDay.setDate(today.getDate() - (totalDays - 1));
        const historySet = new Set(stats.historicoEstudo);
        for (let i = 0; i < totalDays; i++) {
            const d = new Date(startDay);
            d.setDate(startDay.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                active: historySet.has(dateStr),
                label: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
            });
        }
        return days;
    }, [stats.historicoEstudo]);

    const progressPercent = (timeLeft / initialTime) * 100;
    const strokeDashoffset = 283 - (283 * progressPercent) / 100;

    return (
        <div className={`space-y-12 animate-in fade-in duration-500 ${isMinimalist ? 'fixed inset-0 z-[200] bg-foco-bg flex flex-col items-center justify-center p-6' : ''}`}>
            {isMinimalist && (
                <button onClick={() => setIsMinimalist(false)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-foco-secondary">
                    <Minimize2 size={24} />
                </button>
            )}

            <div className="w-full max-w-5xl mx-auto space-y-12">
                {!isMinimalist && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-foco-card p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={64} /></div>
                                <p className="text-[10px] font-black uppercase text-foco-secondary mb-1">Neurônios</p>
                                <div className="flex items-center gap-2 text-foco-accent">
                                    <Zap size={18} />
                                    <span className="text-2xl font-black">{stats.neuronios}</span>
                                    {isComboActive && <span className="text-[10px] bg-foco-accent/20 px-2 py-0.5 rounded-full animate-pulse">2X ATIVO</span>}
                                    {stats.multiplierActive && <span className="text-[10px] bg-foco-alert/20 text-foco-alert px-2 py-0.5 rounded-full animate-bounce">2X PROX.</span>}
                                </div>
                            </div>
                            <div className="bg-foco-card p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={64} /></div>
                                <p className="text-[10px] font-black uppercase text-foco-secondary mb-1">Sessões</p>
                                <div className="flex items-center gap-2 text-foco-alert"><Target size={18} /> <span className="text-2xl font-black">{stats.sessoesConcluidas}</span></div>
                            </div>
                            <div className="bg-foco-card p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Clock size={64} /></div>
                                <p className="text-[10px] font-black uppercase text-foco-secondary mb-1">Horas Foco</p>
                                <div className="flex items-center gap-2 text-indigo-400"><Clock size={18} /> <span className="text-2xl font-black">{stats.horasDeFoco.toFixed(1)}h</span></div>
                            </div>
                            <div className="bg-foco-card p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Flame size={64} /></div>
                                <p className="text-[10px] font-black uppercase text-foco-secondary mb-1">Fogo (Streak)</p>
                                <div className="flex items-center gap-2 text-orange-500"><Flame size={18} fill="currentColor" /> <span className="text-2xl font-black">{currentStreak} Dias</span></div>
                            </div>
                        </div>

                        {isComboActive && (
                            <div className="bg-foco-accent/10 border border-foco-accent/20 p-4 rounded-2xl flex items-center justify-between animate-pulse-soft">
                                <div className="flex items-center gap-3">
                                    <div className="bg-foco-accent text-foco-bg p-2 rounded-lg"><Sparkles size={20} /></div>
                                    <div>
                                        <p className="font-black text-sm text-foco-accent">COMBO DE {currentStreak} DIAS ATIVO!</p>
                                        <p className="text-xs text-foco-secondary">Você está em estado de Fluxo. Recompensas de Neurônios dobradas!</p>
                                    </div>
                                </div>
                                <Zap className="text-foco-accent" size={24} />
                            </div>
                        )}

                        <section className="bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black flex items-center gap-3"><Calendar size={20} className="text-foco-accent" /> Sua Jornada de Consistência</h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-foco-secondary">
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-white/5 rounded-sm"></div> Menos</div>
                                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-foco-accent rounded-sm"></div> Mais</div>
                                </div>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar pb-4">
                                <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
                                    {heatmapDays.map((d, idx) => (
                                        <div key={idx} title={`${d.date}: ${d.active ? 'Atividade' : 'Vazio'}`} className={`w-3.5 h-3.5 rounded-sm transition-all hover:ring-2 hover:ring-white/20 cursor-help ${d.active ? 'bg-foco-accent' : 'bg-white/5'}`} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}

                <section className={`bg-foco-card border border-white/5 rounded-[40px] p-8 lg:p-16 relative overflow-hidden transition-all ${isMinimalist ? 'border-none bg-transparent' : ''}`}>
                    <div className="relative z-10 flex flex-col items-center gap-12">
                        <div className="w-full max-w-md">
                            <input type="text" placeholder="Qual sua missão?" value={taskName} onChange={(e) => setTaskName(e.target.value)} disabled={timerStatus !== 'idle'} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-center focus:ring-2 focus:ring-foco-accent outline-none transition-all placeholder:opacity-30" />
                        </div>
                        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                            <svg className="absolute w-full h-full -rotate-90"><circle cx="50%" cy="50%" r="45%" className="fill-none stroke-white/5 stroke-[8]" /><circle cx="50%" cy="50%" r="45%" className="fill-none stroke-foco-accent stroke-[8] transition-all duration-1000" style={{ strokeDasharray: '283', strokeDashoffset: strokeDashoffset }} /></svg>
                            <div className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-foco-text">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                            {!isMinimalist && <button onClick={() => setIsMinimalist(true)} className="absolute bottom-0 right-0 p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-foco-secondary"><Maximize2 size={20} /></button>}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {timerStatus === 'idle' ? (
                                <>
                                    <input type="number" value={customMinutes} onChange={(e) => { const val = e.target.value; setCustomMinutes(val); const mins = parseInt(val); if (!isNaN(mins) && mins > 0) { setTimeLeft(mins * 60); setInitialTime(mins * 60); } }} className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center font-black focus:ring-2 focus:ring-foco-accent outline-none" />
                                    <button onClick={startTimer} className="px-12 py-5 bg-foco-accent text-foco-bg rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foco-accent/20">INICIAR FOCO</button>
                                </>
                            ) : (
                                <button onClick={stopTimer} className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xl hover:bg-white/10 transition-all">CANCELAR</button>
                            )}
                        </div>
                    </div>
                    {showMasteryFeedback && (
                        <div className="absolute inset-0 bg-foco-bg/95 backdrop-blur-xl z-50 flex items-center justify-center animate-in zoom-in duration-300">
                            <div className="max-w-md w-full text-center space-y-8 p-6">
                                <Award size={64} className="mx-auto text-foco-accent" />
                                <h2 className="text-4xl font-black">Ciclo Finalizado!</h2>
                                <div className="p-4 bg-foco-accent/20 rounded-2xl border border-foco-accent/30 mb-4">
                                    <p className="text-foco-accent font-black text-lg">+{isComboActive ? 20 : 10} NEURÔNIOS</p>
                                    {stats.multiplierActive && <p className="text-xs text-foco-alert font-bold mt-1">X2 ATIVADO! Recompensa Final: {(isComboActive ? 20 : 10) * 2} Neurônios</p>}
                                </div>
                                <p className="text-foco-secondary text-sm">Nível de domínio sobre "{lastFinishedTask}":</p>
                                <div className="grid grid-cols-6 gap-2">
                                    {[0, 1, 2, 3, 4, 5].map(lv => (
                                        <button key={lv} onClick={() => {
                                            const days = lv <= 2 ? 1 : lv <= 4 ? 7 : 30;
                                            const next = new Date(); next.setDate(next.getDate() + days);
                                            const rev: Review = { id: Date.now().toString(), tarefa: lastFinishedTask, dataProximaRevisao: next.toISOString() };
                                            saveStats({ ...stats, revisoesAgendadas: [...stats.revisoesAgendadas, rev] });
                                            setShowMasteryFeedback(false); setTimerStatus('idle'); setTaskName('');
                                        }} className="aspect-square bg-foco-card border border-white/10 rounded-2xl flex items-center justify-center font-black hover:border-foco-accent transition-all">{lv}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FocusView;
