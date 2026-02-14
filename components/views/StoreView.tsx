
import React from 'react';
import {
    Palette,
    Zap,
    Coffee,
    Headphones,
    Brain
} from 'lucide-react';
import { UserStats, ShopItem } from '../../types';
import { SHOP_ITEMS } from '../../constants';

interface StoreViewProps {
    stats: UserStats;
    saveStats: (stats: UserStats) => void;
}

const StoreView: React.FC<StoreViewProps> = ({ stats, saveStats }) => {

    const handleStoreAction = (item: ShopItem) => {
        const owned = stats.itensComprados.includes(item.id);

        if (item.tipo === 'consumable') {
            if (stats.neuronios >= item.preco) {
                saveStats({
                    ...stats,
                    neuronios: stats.neuronios - item.preco,
                    multiplierActive: item.valor === 'multiplier' ? true : stats.multiplierActive
                });
                alert("Consumível ativado!");
            } else alert("Neurônios insuficientes!");
            return;
        }

        if (owned) {
            if (item.tipo === 'tema') saveStats({ ...stats, activeTheme: item.valor });
            else saveStats({ ...stats, activeSound: item.valor === stats.activeSound ? null : item.valor });
        } else {
            if (stats.neuronios >= item.preco) {
                saveStats({ ...stats, neuronios: stats.neuronios - item.preco, itensComprados: [...stats.itensComprados, item.id] });
            } else alert("Neurônios insuficientes!");
        }
    };

    const getIcon = (item: ShopItem) => {
        if (item.tipo === 'tema') return <Palette size={28} />;
        if (item.id === 'consumable_2x') return <Zap size={28} />;
        if (item.id === 'som_cafeteria') return <Coffee size={28} />;
        return <Headphones size={28} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            {SHOP_ITEMS.map(item => {
                const owned = stats.itensComprados.includes(item.id);
                const active = item.tipo === 'tema' ? stats.activeTheme === item.valor : stats.activeSound === item.valor;
                const isMultiplier = item.tipo === 'consumable';

                return (
                    <div key={item.id} className="bg-foco-card border border-white/5 p-8 rounded-[32px] group hover:border-foco-accent/40 transition-all flex flex-col shadow-xl">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-4 rounded-2xl ${item.tipo === 'tema' ? 'bg-indigo-500/20 text-indigo-400' : (item.tipo === 'consumable' ? 'bg-foco-accent/20 text-foco-accent' : 'bg-foco-alert/20 text-foco-alert')}`}>
                                {getIcon(item)}
                            </div>
                            <div className="font-black text-foco-alert text-xl flex items-center gap-1"><Brain size={18} /> {item.preco}</div>
                        </div>
                        <h4 className="text-2xl font-black mb-2">{item.nome}</h4>
                        <p className="text-sm text-foco-secondary mb-10 h-16 leading-relaxed">{item.descricao}</p>
                        <button
                            onClick={() => handleStoreAction(item)}
                            className={`w-full py-5 rounded-[20px] font-black transition-all ${isMultiplier
                                    ? (stats.multiplierActive ? 'bg-foco-accent/50 text-foco-bg cursor-not-allowed' : 'bg-foco-accent text-foco-bg hover:scale-105')
                                    : (owned ? (active ? 'bg-foco-accent text-foco-bg shadow-lg shadow-foco-accent/20' : 'bg-white/10 hover:bg-white/20') : 'bg-white text-black hover:brightness-90')
                                }`}
                            disabled={isMultiplier && stats.multiplierActive}
                        >
                            {isMultiplier ? (stats.multiplierActive ? 'ATIVADO' : 'ADQUIRIR') : (owned ? (active ? 'ATIVO' : 'APLICAR') : 'ADQUIRIR')}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default StoreView;
