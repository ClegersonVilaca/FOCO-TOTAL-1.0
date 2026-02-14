
import React, { useState, useEffect, useMemo } from 'react';
import {
    Play,
    Square,
    Clock,
    Flame,
    Zap,
    Maximize2,
    Award
} from 'lucide-react';
import { UserStats, TimerStatus, Review } from '../../types';

interface FocusViewProps {
    isMinimalist: boolean;
    setIsMinimalist: (val: boolean) => void;
    stats: UserStats;
    currentStreak: number;
    isComboActive: boolean;
    taskName: string;
    setTaskName: (val: string) => void;
    timerStatus: TimerStatus;
    timeLeft: number;
    initialTime: number;
    setInitialTime: (val: number) => void;
    setTimeLeft: (val: number) => void;
    customMinutes: string;
    setCustomMinutes: (val: string) => void;
    startTimer: () => void;
    stopTimer: () => void;
    showMasteryFeedback: boolean;
    setShowMasteryFeedback: (val: boolean) => void;
    lastFinishedTask: string;
    saveStats: (stats: UserStats) => void;
    setTimerStatus: (status: TimerStatus) => void;
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
    const strokeDashoffset = useMemo(() => {
        return (timeLeft / initialTime) * 283;
    }, [timeLeft, initialTime]);

    return (
        <div className="relative animate-in fade-in duration-500">
            {isMinimalist && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex flex-col items-center justify-center animate-in zoom-in duration-700">
                    <div className="text-[12rem] md:text-[20rem] font-black font-mono tracking-tighter text-foco-accent/20 absolute select-none">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                    <div className="relative z-10 flex flex-col items-center gap-12 text-center p-6">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foco-text/50 uppercase">{taskName}</h2>
                        <div className="text-9xl md:text-[12rem] font-black font-mono tracking-tighter text-foco-text">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                        <button onClick={() => setIsMinimalist(false)} className="px-8 py-3 bg-foco-text/5 border border-foco-text/10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-foco-text/10 transition-all text-foco-secondary">Sair do Modo Profundo</button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<Zap className="text-foco-accent" />} label="Sessões" value={stats.sessoesConcluidas} />
                    <StatCard icon={<Clock className="text-indigo-400" />} label="Horas Foco" value={`${stats.horasDeFoco.toFixed(1)}h`} />
                    <StatCard icon={<Flame className="text-orange-500" />} label="Fogo (Streak)" value={`${currentStreak}d`} />
                </section>

                <section className="bg-foco-card border border-white/5 rounded-[48px] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-foco-accent/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center gap-12">
                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Qual sua missão agora?"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                disabled={timerStatus !== 'idle'}
                                className="w-full bg-foco-bg/40 border border-foco-text/10 rounded-2xl px-6 py-5 text-xl font-black text-center focus:ring-2 focus:ring-foco-accent outline-none transition-all placeholder:text-foco-text/20"
                            />
                        </div>

                        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                            <svg className="absolute w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-foco-text/5 stroke-[8]" />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    className="fill-none stroke-foco-accent stroke-[8] transition-all duration-1000 ease-linear"
                                    style={{ strokeDasharray: '283', strokeDashoffset: strokeDashoffset }}
                                />
                            </svg>
                            <div className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-foco-text">
                                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            {!isMinimalist && (
                                <button
                                    onClick={() => setIsMinimalist(true)}
                                    className="absolute bottom-0 right-0 p-4 bg-white/5 rounded-[20px] hover:bg-white/10 text-foco-secondary transition-all"
                                >
                                    <Maximize2 size={24} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {timerStatus === 'idle' ? (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex items-center gap-4 bg-foco-bg/40 border border-foco-text/10 rounded-2xl px-6 py-4">
                                        <input
                                            type="number"
                                            value={customMinutes}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setCustomMinutes(val);
                                                const mins = parseInt(val);
                                                if (!isNaN(mins) && mins > 0) {
                                                    setTimeLeft(mins * 60);
                                                    setInitialTime(mins * 60);
                                                }
                                            }}
                                            className="w-16 bg-transparent text-center font-black text-2xl outline-none focus:text-foco-accent transition-colors text-foco-text"
                                        />
                                        <span className="font-bold text-foco-secondary text-sm uppercase tracking-widest">MIN</span>
                                    </div>
                                    <button
                                        onClick={startTimer}
                                        className="px-12 py-6 bg-foco-accent text-foco-bg rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foco-accent/20 flex items-center gap-3"
                                    >
                                        <Play size={24} fill="currentColor" /> INICIAR FOCO
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={stopTimer}
                                    className="px-12 py-5 bg-foco-text/5 border border-foco-text/10 rounded-2xl font-black text-xl hover:bg-foco-text/10 transition-all text-foco-secondary flex items-center gap-3"
                                >
                                    <Square size={20} fill="currentColor" /> CANCELAR FOCO
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {showMasteryFeedback && (
                    <div className="fixed inset-0 bg-foco-bg/95 backdrop-blur-xl z-50 flex items-center justify-center animate-in zoom-in duration-300">
                        <div className="max-w-md w-full text-center space-y-8 p-10 bg-foco-card border border-white/10 rounded-[48px] shadow-2xl">
                            <div className="w-24 h-24 bg-foco-accent/20 rounded-[32px] flex items-center justify-center mx-auto mb-4 border border-foco-accent/30">
                                <Award size={48} className="text-foco-accent" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter">Missão Concluída!</h2>
                            <div className="p-6 bg-foco-accent/10 rounded-2xl border border-foco-accent/20">
                                <p className="text-foco-accent font-black text-2xl">+{isComboActive ? 20 : 10} XP</p>
                                <p className="text-xs font-bold text-foco-secondary mt-2">PONTOS DE EVOLUÇÃO ACUMULADOS</p>
                            </div>
                            <p className="text-foco-secondary font-medium">Auto-avaliação do domínio sobre:<br /><span className="text-foco-text font-black uppercase tracking-tight">{lastFinishedTask}</span></p>
                            <div className="grid grid-cols-6 gap-2">
                                {[0, 1, 2, 3, 4, 5].map(lv => (
                                    <button
                                        key={lv}
                                        onClick={() => {
                                            const days = lv <= 2 ? 1 : lv <= 4 ? 7 : 30;
                                            const next = new Date(); next.setDate(next.getDate() + days);
                                            const rev: Review = { id: Date.now().toString(), tarefa: lastFinishedTask, dataProximaRevisao: next.toISOString() };
                                            saveStats({ ...stats, revisoesAgendadas: [...stats.revisoesAgendadas, rev] });
                                            setShowMasteryFeedback(false);
                                            setTimerStatus('idle');
                                            setTaskName('');
                                        }}
                                        className="aspect-square bg-white/5 hover:bg-foco-accent hover:text-foco-bg border border-white/10 rounded-xl flex items-center justify-center font-black transition-all text-lg"
                                    >
                                        {lv}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-foco-card border border-white/5 p-6 rounded-[28px] shadow-xl flex items-center gap-5 group hover:border-white/10 transition-all">
        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foco-secondary opacity-60 mb-1">{label}</p>
            <p className="text-2xl font-black tracking-tighter">{value}</p>
        </div>
    </div>
);

export default FocusView;
