
import React, { useMemo } from 'react';
import {
  Zap,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  ShoppingBag,
  Palette,
  User as UserIcon,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  TrendingUp as LevelIcon
} from 'lucide-react';
import { UserStats, AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  stats: UserStats;
  saveStats: (stats: UserStats) => void;
  user: any;
  authLoading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
}

const SidebarItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; expanded: boolean }> = ({ active, onClick, icon, label, expanded }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-foco-accent text-foco-bg font-bold shadow-lg shadow-foco-accent/20' : 'text-foco-secondary hover:bg-white/5 hover:text-white'}`}
  >
    <div className="shrink-0">{icon}</div>
    {expanded && <span className="truncate whitespace-nowrap animate-in fade-in duration-300">{label}</span>}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  stats,
  saveStats,
  user,
  authLoading,
  handleLogin,
  handleLogout,
  showThemeSelector,
  setShowThemeSelector
}) => {

  const levelTitle = useMemo(() => {
    const total = stats.totalNeuroniosGanhos || 0;
    if (total <= 500) return "Novato";
    if (total <= 2000) return "Estudante Focado";
    return "Erudito";
  }, [stats.totalNeuroniosGanhos]);

  return (
    <aside className={`
      ${stats.sidebarOpen ? 'lg:w-72' : 'lg:w-24'} 
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:sticky top-0 left-0 sidebar-container z-[120] lg:z-50
      border-r border-foco-text/10 p-4 flex flex-col gap-10 bg-foco-card/80 lg:bg-foco-bg/40 backdrop-blur-3xl transition-all duration-500 ease-in-out w-72 lg:w-auto min-h-screen lg:h-screen
    `}>
      <div className="hidden lg:flex items-center gap-4 py-6 px-3">
        <div className="w-12 h-12 bg-foco-accent rounded-[14px] flex items-center justify-center text-foco-bg font-black text-2xl shrink-0">FT</div>
        {stats.sidebarOpen && <span className="font-black text-2xl tracking-tighter">Foco Total</span>}
      </div>

      <nav className="flex-1 space-y-3">
        <SidebarItem active={currentView === 'focus'} onClick={() => { setCurrentView('focus'); setIsMobileMenuOpen(false); }} icon={<Zap size={22} />} label="Painel de Foco" expanded={stats.sidebarOpen || isMobileMenuOpen} />
        <SidebarItem active={currentView === 'planner'} onClick={() => { setCurrentView('planner'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard size={22} />} label=" HUB Acadêmico" expanded={stats.sidebarOpen || isMobileMenuOpen} />
        <SidebarItem active={currentView === 'evolution'} onClick={() => { setCurrentView('evolution'); setIsMobileMenuOpen(false); }} icon={<TrendingUp size={22} />} label="Evolução" expanded={stats.sidebarOpen || isMobileMenuOpen} />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className={`flex flex-col gap-2 px-2 ${(stats.sidebarOpen || isMobileMenuOpen) ? '' : 'items-center'}`}>
          <div className={`flex items-center gap-3 p-3 bg-foco-accent/10 border border-foco-accent/20 rounded-xl`}>
            <LevelIcon size={20} className="text-foco-accent shrink-0" />
            {(stats.sidebarOpen || isMobileMenuOpen) && (
              <div>
                <p className="text-[10px] font-black uppercase text-foco-secondary leading-none mb-1">Status Avatar</p>
                <p className="text-xs font-black text-foco-accent whitespace-nowrap">{levelTitle}</p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-foco-secondary hover:bg-white/5 hover:text-white ${!stats.sidebarOpen && !isMobileMenuOpen && 'justify-center'}`}
        >
          <Palette className="shrink-0" size={22} />
          {(stats.sidebarOpen || isMobileMenuOpen) && <span className="text-sm font-bold">Temas Ativos</span>}
        </button>
        {!authLoading && (
          user ? (
            <div className="p-2">
              <div className={`flex items-center gap-3 mb-4 ${!stats.sidebarOpen && !isMobileMenuOpen && 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full bg-foco-accent/20 flex items-center justify-center text-foco-accent"><UserIcon size={20} /></div>
                {(stats.sidebarOpen || isMobileMenuOpen) && <div className="truncate text-[10px] font-black uppercase opacity-50">{user.email}</div>}
              </div>
              <button onClick={handleLogout} className={`w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all ${!stats.sidebarOpen && !isMobileMenuOpen && 'justify-center'}`}>
                <LogOut size={20} />
                {(stats.sidebarOpen || isMobileMenuOpen) && <span className="text-xs font-bold">SAIR</span>}
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className={`w-full flex items-center gap-3 p-3 text-foco-accent hover:bg-foco-accent/10 rounded-xl transition-all ${!stats.sidebarOpen && !isMobileMenuOpen && 'justify-center'}`}>
              <LogIn size={20} />
              {(stats.sidebarOpen || isMobileMenuOpen) && <span className="text-xs font-bold uppercase tracking-widest">Cloud Sync</span>}
            </button>
          )
        )}
        <button
          onClick={() => saveStats({ ...stats, sidebarOpen: !stats.sidebarOpen })}
          className={`hidden lg:flex w-full items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 transition-all text-foco-secondary ${!stats.sidebarOpen ? 'justify-center' : ''}`}
        >
          {stats.sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
