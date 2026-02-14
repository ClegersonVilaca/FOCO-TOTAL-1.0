
import React, { useMemo } from 'react';
import {
    TrendingUp,
    BarChart2,
    PieChart,
    CheckCircle,
    Layers
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { UserStats } from '../../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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

    const { weeklyData, subjectData, completionData } = useMemo(() => {
        // Weekly Data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const weeklyLabels = last7Days.map(d => d.split('-').slice(1).reverse().join('/'));
        const weeklyValues = last7Days.map(date => {
            const hasStudied = stats.historicoEstudo.includes(date);
            return hasStudied ? (Math.random() * 2 + 1) : 0; // Keeping original logic
        });

        // Subject Data
        const subjectLabels = stats.materias.map(m => m.nome);
        const subjectValues = stats.materias.map(m => m.aulas.length || 1);

        // Completion Data
        const totalLessons = stats.materias.reduce((acc, curr) => acc + curr.aulas.length, 0);
        const completedLessons = stats.materias.reduce((acc, curr) => acc + curr.aulas.filter(a => a.concluida).length, 0);
        const completionValues = [completedLessons, totalLessons - completedLessons || 1];

        return {
            weeklyData: {
                labels: weeklyLabels,
                datasets: [{
                    label: 'Horas de Foco',
                    data: weeklyValues,
                    backgroundColor: '#68D391',
                    borderRadius: 8
                }]
            },
            subjectData: {
                labels: subjectLabels,
                datasets: [{
                    data: subjectValues,
                    backgroundColor: ['#68D391', '#4299e1', '#F6AD55', '#9f7aea', '#ed64a6'],
                    borderWidth: 0
                }]
            },
            completionData: {
                labels: ['Concluído', 'Pendente'],
                datasets: [{
                    data: completionValues,
                    backgroundColor: ['#68D391', 'rgba(255,255,255,0.05)'],
                    borderWidth: 0
                }]
            }
        };
    }, [stats]);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#A7A7A7',
                    font: { family: 'Inter', weight: 'bold' as const }
                }
            }
        }
    };

    const barOptions = {
        ...commonOptions,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A7A7A7' } },
            x: { grid: { display: false }, ticks: { color: '#A7A7A7' } }
        }
    };

    const doughnutOptions = {
        ...commonOptions,
        cutout: '70%'
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[400px]">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><TrendingUp size={24} className="text-foco-accent" /> Evolução Semanal</h3>
                    <div className="h-[300px] w-full">
                        <Bar data={weeklyData} options={barOptions} />
                    </div>
                </div>
                <div className="bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl flex flex-col justify-between">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><BarChart2 size={24} className="text-foco-alert" /> Resumo de Performance</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl"><span className="text-sm font-bold text-foco-secondary">Taxa de Foco</span><span className="text-xl font-black text-foco-accent">{(stats.horasDeFoco / Math.max(stats.sessoesConcluidas, 1)).toFixed(1)}h / sessão</span></div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl"><span className="text-sm font-bold text-foco-secondary">Dias Ativos</span><span className="text-xl font-black text-indigo-400">{stats.historicoEstudo.length}</span></div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl"><span className="text-sm font-bold text-foco-secondary">Combo Máximo</span><span className="text-xl font-black text-orange-500">{currentStreak}</span></div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5"><p className="text-[10px] uppercase font-black tracking-widest text-foco-secondary mb-2">Dica de IA</p><p className="text-sm font-medium italic opacity-80">"Você é mais produtivo pela manhã. Tente agendar suas matérias mais difíceis nesse horário."</p></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[350px]">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><PieChart size={24} className="text-indigo-400" /> Foco por Matéria</h3>
                    {stats.materias.length > 0 ? (
                        <div className="h-[250px]">
                            <Doughnut data={subjectData} options={doughnutOptions} />
                        </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center opacity-20 flex-col gap-4"><Layers size={48} /><p className="font-bold">Nenhuma matéria criada</p></div>
                    )}
                </div>
                <div className="bg-foco-card border border-white/5 rounded-[32px] p-8 shadow-xl min-h-[350px]">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><CheckCircle size={24} className="text-foco-accent" /> Taxa de Conclusão</h3>
                    <div className="h-[250px]">
                        <Pie data={completionData} options={commonOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvolutionView;
