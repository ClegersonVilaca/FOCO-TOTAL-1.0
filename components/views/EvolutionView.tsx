
import React, { useMemo } from 'react';
import {
    TrendingUp,
    BarChart2,
    PieChart,
    CheckCircle,
    Layers,
    Award,
    Flame,
    Clock,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { UserStats } from '../../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface EvolutionViewProps {
    stats: UserStats;
    currentStreak: number;
}

const EvolutionView: React.FC<EvolutionViewProps> = ({ stats, currentStreak }) => {

    const levels = [
        { name: 'Iniciante', minHours: 0, color: '#A0AEC0', icon: <Award size={24} /> },
        { name: 'Focado', minHours: 10, color: '#68D391', icon: <Flame size={24} /> },
        { name: 'Determinado', minHours: 50, color: '#4299E1', icon: <Clock size={24} /> },
        { name: 'Imparável', minHours: 150, color: '#ED64A6', icon: <TrendingUp size={24} /> },
        { name: 'Elite', minHours: 500, color: '#F6AD55', icon: <Award size={24} /> }
    ];

    const currentLevel = useMemo(() => {
        const hours = stats.horasDeFoco || 0;
        return [...levels].reverse().find(l => hours >= l.minHours) || levels[0];
    }, [stats.horasDeFoco]);

    const nextLevel = useMemo(() => {
        const hours = stats.horasDeFoco || 0;
        return levels.find(l => l.minHours > hours);
    }, [stats.horasDeFoco]);

    const progressToNext = useMemo(() => {
        if (!nextLevel) return 100;
        const hours = stats.horasDeFoco || 0;
        const prevMin = levels.find(l => l === currentLevel)?.minHours || 0;
        return Math.min(100, ((hours - prevMin) / (nextLevel.minHours - prevMin)) * 100);
    }, [stats.horasDeFoco, currentLevel, nextLevel]);

    const { weeklyData, comparison, subjectData } = useMemo(() => {
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const prev7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (13 - i));
            return d.toISOString().split('T')[0];
        });

        const weeklyLabels = last7Days.map(d => {
            const date = new Date(d);
            return date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
        });

        // Simplified hour calculation from history (mocking since we don't have per-session timestamps in UserStats yet)
        // In a real app, we'd sum sessions per day. Here we check history existence.
        const currentWeekHours = last7Days.reduce((acc, date) => {
            return acc + (stats.historicoEstudo.includes(date) ? (stats.horasDeFoco / Math.max(stats.historicoEstudo.length, 1)) : 0);
        }, 0);

        const prevWeekHours = prev7Days.reduce((acc, date) => {
            return acc + (stats.historicoEstudo.includes(date) ? (stats.horasDeFoco / Math.max(stats.historicoEstudo.length, 1)) : 0);
        }, 0);

        const diff = currentWeekHours - prevWeekHours;
        const percentChange = prevWeekHours > 0 ? (diff / prevWeekHours) * 100 : 0;

        return {
            weeklyData: {
                labels: weeklyLabels,
                datasets: [{
                    label: 'Foco Diário',
                    data: last7Days.map(date => stats.historicoEstudo.includes(date) ? 1 : 0), // Placeholder logic
                    backgroundColor: currentLevel.color,
                    borderRadius: 12,
                    barThickness: 20
                }]
            },
            comparison: {
                current: currentWeekHours.toFixed(1),
                diff: diff.toFixed(1),
                percent: percentChange.toFixed(0),
                isPositive: diff >= 0
            },
            subjectData: {
                labels: stats.materias.map(m => m.nome),
                datasets: [{
                    data: stats.materias.map(m => m.aulas.length),
                    backgroundColor: [currentLevel.color, '#4299E1', '#F6AD55', '#9F7AEA', '#ED64A6'],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            }
        };
    }, [stats, currentLevel]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' as const },
                bodyFont: { size: 12 },
                cornerRadius: 12
            }
        },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#718096', font: { size: 10, weight: 'bold' as const } } }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Level Card */}
            <div className="bg-foco-card border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-foco-accent/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-foco-accent/10 transition-all duration-700" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-shrink-0 relative">
                        <div className="w-32 h-32 rounded-[32px] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${currentLevel.color}20`, border: `2px solid ${currentLevel.color}` }}>
                            {React.cloneElement(currentLevel.icon as React.ReactElement, { size: 56, color: currentLevel.color })}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-foco-bg rounded-full border-4 border-foco-card flex items-center justify-center">
                            <Flame size={18} className="text-orange-500" />
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foco-secondary opacity-60 mb-2">Patente de Evolução</p>
                                <h2 className="text-5xl font-black tracking-tighter" style={{ color: currentLevel.color }}>{currentLevel.name}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-foco-secondary">Próxima Patente: <span className="text-foco-text">{nextLevel?.name || 'MAX'}</span></p>
                                <p className="text-2xl font-black">{stats.horasDeFoco.toFixed(1)} <span className="text-xs text-foco-secondary">/ {nextLevel?.minHours || stats.horasDeFoco.toFixed(1)}h</span></p>
                            </div>
                        </div>

                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                style={{ width: `${progressToNext}%`, backgroundColor: currentLevel.color }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={<Calendar className="text-indigo-400" />} label="Dias de Foco" value={stats.historicoEstudo.length} subValue="Totais acumulados" />
                <MetricCard icon={<Flame className="text-orange-500" />} label="Streak Atual" value={currentStreak} subValue="Dias consecutivos" />
                <MetricCard icon={<Clock className="text-foco-accent" />} label="Horas Totais" value={stats.horasDeFoco.toFixed(1)} subValue="XP Produtivo" />
                <MetricCard
                    icon={comparison.isPositive ? <ArrowUpRight className="text-foco-accent" /> : <ArrowDownRight className="text-foco-alert" />}
                    label="vs Semana Passada"
                    value={`${comparison.percent}%`}
                    subValue={`${comparison.diff}h de diferença`}
                    trend={comparison.isPositive ? 'up' : 'down'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Chart */}
                <div className="lg:col-span-2 bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black flex items-center gap-3"><TrendingUp size={24} className="text-foco-accent" /> Consistência Semanal</h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-foco-secondary">ESTA SEMANA</div>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <Bar data={weeklyData} options={chartOptions} />
                    </div>
                </div>

                {/* Subjets Chart */}
                <div className="bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3"><PieChart size={24} className="text-indigo-400" /> Distribuição</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="w-full h-full max-h-[250px]">
                            <Doughnut
                                data={subjectData}
                                options={{
                                    ...chartOptions,
                                    cutout: '75%',
                                    plugins: { ...chartOptions.plugins, legend: { display: false } }
                                }}
                            />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black">{stats.materias.length}</span>
                            <span className="text-[10px] font-black uppercase text-foco-secondary">Matérias</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-2">
                        {stats.materias.slice(0, 3).map((m, i) => (
                            <div key={m.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: [currentLevel.color, '#4299E1', '#F6AD55'][i] }} />
                                    <span className="font-bold text-foco-secondary uppercase tracking-tighter">{m.nome}</span>
                                </div>
                                <span className="font-black">{m.aulas.length} aulas</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, subValue: string, trend?: 'up' | 'down' }> = ({ icon, label, value, subValue, trend }) => (
    <div className="bg-foco-card border border-white/5 p-6 rounded-[28px] shadow-xl hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            {trend && (
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${trend === 'up' ? 'bg-foco-accent/20 text-foco-accent' : 'bg-foco-alert/20 text-foco-alert'}`}>
                    {trend === 'up' ? '+ IMPROVE' : '- ALERT'}
                </div>
            )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-foco-secondary opacity-60 mb-1">{label}</p>
        <h4 className="text-3xl font-black tracking-tighter mb-1">{value}</h4>
        <p className="text-xs font-medium text-foco-secondary opacity-60">{subValue}</p>
    </div>
);

export default EvolutionView;
