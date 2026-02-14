
import React, { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    Zap,
    Eraser,
    Sparkles,
    Send
} from 'lucide-react';
import { UserStats, ChatMessage } from '../../types';
import { getMentorResponse } from '../../services/geminiService';

interface MentorViewProps {
    stats: UserStats;
    saveStats: (stats: UserStats) => void;
}

const MentorView: React.FC<MentorViewProps> = ({ stats, saveStats }) => {
    const [mentorInput, setMentorInput] = useState('');
    const [isMentorLoading, setIsMentorLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [stats.chatHistory]);

    const handleSendMentorMessage = async () => {
        if (!mentorInput.trim()) return;
        if (stats.neuronios < 5) {
            alert("Neurônios insuficientes! Complete sessões de foco para ganhar mais.");
            return;
        }

        const userMsg: ChatMessage = {
            role: 'user',
            text: mentorInput,
            timestamp: new Date().toISOString()
        };

        const newHistory = [...(stats.chatHistory || []), userMsg];

        // Optimistic update
        const updatedStats = {
            ...stats,
            chatHistory: newHistory,
            neuronios: stats.neuronios - 5
        };
        saveStats(updatedStats);

        setMentorInput('');
        setIsMentorLoading(true);

        try {
            const subjectNames = stats.materias.map(m => m.nome);
            const historyForAPI = newHistory.map(h => ({ role: h.role, text: h.text }));
            const responseText = await getMentorResponse(mentorInput, historyForAPI, subjectNames);

            const aiMsg: ChatMessage = {
                role: 'model',
                text: responseText,
                timestamp: new Date().toISOString()
            };

            const updatedHistory = [...newHistory, aiMsg];
            saveStats({ ...updatedStats, chatHistory: updatedHistory });
        } catch (e) {
            console.error(e);
            // Optional: revert state or show error
        } finally {
            setIsMentorLoading(false);
        }
    };

    const clearChat = () => {
        if (confirm("Deseja limpar o histórico de conversa com o Mentor?")) {
            saveStats({ ...stats, chatHistory: [] });
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-foco-card border border-white/5 rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foco-accent/20 flex items-center justify-center text-foco-accent">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Mentor IA</h3>
                        <p className="text-[10px] font-bold text-foco-secondary uppercase tracking-widest">Consultoria Acadêmica em Tempo Real</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-foco-secondary uppercase tracking-tighter">Custo por Mensagem</p>
                        <p className="text-sm font-black text-foco-accent flex items-center gap-1 justify-end">5 <Zap size={12} /></p>
                    </div>
                    <button onClick={clearChat} title="Limpar Histórico" className="p-3 hover:bg-white/5 rounded-xl text-foco-secondary transition-all">
                        <Eraser size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {stats.chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                        <Sparkles size={48} className="mb-4" />
                        <p className="text-xl font-black">Como posso acelerar sua jornada hoje?</p>
                        <p className="text-sm mt-2 max-w-xs">Pergunte sobre matérias, técnicas de estudo ou peça motivação.</p>
                    </div>
                ) : (
                    stats.chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-[24px] ${msg.role === 'user'
                                    ? 'bg-foco-accent text-foco-bg font-bold rounded-tr-none'
                                    : 'bg-white/5 border border-white/10 text-foco-text rounded-tl-none'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <p className={`text-[9px] mt-2 opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                {isMentorLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-[24px] rounded-tl-none flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-foco-accent rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-foco-accent rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-foco-accent rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-black/10 flex gap-2 overflow-x-auto no-scrollbar">
                {[
                    { label: '🎯 Estratégia', prompt: 'Crie uma estratégia de estudo para as minhas matérias atuais.' },
                    { label: '💡 Explicar', prompt: 'Explique o conceito de [ASSUNTO] de forma simples.' },
                    { label: '🔥 Motivação', prompt: 'Me dê uma dose de motivação para continuar focado agora!' },
                    { label: '📝 Quiz', prompt: 'Faça 3 perguntas rápidas sobre as matérias que estou estudando.' }
                ].map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setMentorInput(action.prompt);
                            // Auto-send motvations or strategies if they don't need placeholders
                            if (!action.prompt.includes('[ASSUNTO]')) {
                                // Small timeout to ensure state update before send logic (or just update and call handle)
                                setTimeout(() => document.getElementById('mentor-send-btn')?.click(), 10);
                            }
                        }}
                        className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-foco-accent hover:text-foco-bg transition-all"
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            <footer className="p-6 bg-black/20 border-t border-white/5">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Diga ao Mentor o que você precisa..."
                        value={mentorInput}
                        onChange={(e) => setMentorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMentorMessage()}
                        disabled={isMentorLoading}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-foco-accent transition-all placeholder:opacity-30"
                    />
                    <button
                        id="mentor-send-btn"
                        onClick={handleSendMentorMessage}
                        disabled={isMentorLoading || !mentorInput.trim()}
                        className="bg-foco-accent text-foco-bg p-4 rounded-2xl shadow-lg shadow-foco-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default MentorView;
