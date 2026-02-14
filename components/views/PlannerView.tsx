
import React, { useState, useMemo } from 'react';
import {
    BookOpen,
    Trash2,
    Plus,
    CheckCircle,
    ExternalLink,
    Link as LinkIcon,
    Eye,
    EyeOff,
    Layers,
    GraduationCap,
    HelpCircle,
    Sparkles,
    ChevronRight,
    FileText,
    X,
    Search,
    BarChart2,
    ArrowLeft
} from 'lucide-react';
import { UserStats, Subject, Lesson, Flashcard } from '../../types';

interface PlannerViewProps {
    stats: UserStats;
    saveStats: (stats: UserStats) => void;
}

const PlannerView: React.FC<PlannerViewProps> = ({ stats, saveStats }) => {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newLessonName, setNewLessonName] = useState('');
    const [plannerTab, setPlannerTab] = useState<'aulas' | 'flashcards'>('aulas');
    const [newFlashcardQ, setNewFlashcardQ] = useState('');
    const [newFlashcardA, setNewFlashcardA] = useState('');
    const [showCardAnswer, setShowCardAnswer] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddFlashcard, setShowAddFlashcard] = useState(false);

    // --- Computed ---
    const selectedSubject = useMemo(() => {
        return stats.materias.find(s => s.id === selectedSubjectId) || null;
    }, [stats.materias, selectedSubjectId]);

    const filteredSubjects = useMemo(() => {
        if (!searchQuery.trim()) return stats.materias;
        return stats.materias.filter(s =>
            s.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [stats.materias, searchQuery]);

    const getSubjectProgress = (subject: Subject) => {
        if (subject.aulas.length === 0) return 0;
        const completed = subject.aulas.filter(a => a.concluida).length;
        return Math.round((completed / subject.aulas.length) * 100);
    };

    const totalProgress = useMemo(() => {
        const totalLessons = stats.materias.reduce((acc, m) => acc + m.aulas.length, 0);
        if (totalLessons === 0) return 0;
        const completed = stats.materias.reduce((acc, m) => acc + m.aulas.filter(a => a.concluida).length, 0);
        return Math.round((completed / totalLessons) * 100);
    }, [stats.materias]);

    // --- Actions ---
    const addSubject = () => {
        if (!newSubjectName.trim()) return;
        const newSub: Subject = { id: Date.now().toString(), nome: newSubjectName, aulas: [], exercicios: [], flashcards: [] };
        saveStats({ ...stats, materias: [...stats.materias, newSub] });
        setNewSubjectName('');
        setSelectedSubjectId(newSub.id);
        setShowAddSubject(false);
    };

    const deleteSubject = (subjectId: string) => {
        if (!confirm("Remover esta matéria e todos os tópicos?")) return;
        saveStats({ ...stats, materias: stats.materias.filter(m => m.id !== subjectId) });
        if (selectedSubjectId === subjectId) setSelectedSubjectId(null);
    };

    const addLesson = (subjectId: string) => {
        if (!newLessonName.trim()) return;
        const newLes: Lesson = { id: Date.now().toString(), nome: newLessonName, concluida: false };
        const updatedMaterias = stats.materias.map(m => m.id === subjectId ? { ...m, aulas: [...m.aulas, newLes] } : m);
        saveStats({ ...stats, materias: updatedMaterias });
        setNewLessonName('');
    };

    const toggleLesson = (subjectId: string, lessonId: string) => {
        const updatedMaterias = stats.materias.map(m => {
            if (m.id === subjectId) {
                return { ...m, aulas: m.aulas.map(l => l.id === lessonId ? { ...l, concluida: !l.concluida } : l) };
            }
            return m;
        });
        saveStats({ ...stats, materias: updatedMaterias });
    };

    const deleteLesson = (subjectId: string, lessonId: string) => {
        const updatedMaterias = stats.materias.map(m => {
            if (m.id === subjectId) {
                return { ...m, aulas: m.aulas.filter(l => l.id !== lessonId) };
            }
            return m;
        });
        saveStats({ ...stats, materias: updatedMaterias });
    };

    const attachLink = (subjectId: string, lessonId: string) => {
        const link = prompt("Insira o link para este tópico:");
        if (link === null) return;
        const updatedMaterias = stats.materias.map(m => {
            if (m.id === subjectId) {
                return { ...m, aulas: m.aulas.map(l => l.id === lessonId ? { ...l, link: link || undefined } : l) };
            }
            return m;
        });
        saveStats({ ...stats, materias: updatedMaterias });
    };

    const addFlashcard = (subjectId: string) => {
        if (!newFlashcardQ.trim() || !newFlashcardA.trim()) return;
        const newCard: Flashcard = { id: Date.now().toString(), pergunta: newFlashcardQ, resposta: newFlashcardA, dataProximaRevisao: new Date().toISOString() };
        const updatedMaterias = stats.materias.map(m => m.id === subjectId ? { ...m, flashcards: [...(m.flashcards || []), newCard] } : m);
        saveStats({ ...stats, materias: updatedMaterias });
        setNewFlashcardQ('');
        setNewFlashcardA('');
        setShowAddFlashcard(false);
    };

    const deleteFlashcard = (subjectId: string, cardId: string) => {
        const updatedMaterias = stats.materias.map(m =>
            m.id === subjectId ? { ...m, flashcards: (m.flashcards || []).filter(card => card.id !== cardId) } : m
        );
        saveStats({ ...stats, materias: updatedMaterias });
    };

    // --- Render: Subject Detail View ---
    if (selectedSubject) {
        const progress = getSubjectProgress(selectedSubject);
        const completedCount = selectedSubject.aulas.filter(a => a.concluida).length;
        const totalCount = selectedSubject.aulas.length;
        const flashcardCount = (selectedSubject.flashcards || []).length;

        return (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                {/* Back + Header */}
                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => setSelectedSubjectId(null)}
                        className="flex items-center gap-2 text-foco-secondary hover:text-white transition-colors w-fit group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Voltar às Matérias</span>
                    </button>

                    <div className="bg-foco-card border border-white/5 rounded-[28px] p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-foco-accent/15 rounded-2xl flex items-center justify-center text-foco-accent">
                                    <GraduationCap size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-black">{selectedSubject.nome}</h2>
                                    <p className="text-xs text-foco-secondary mt-1">
                                        {completedCount}/{totalCount} tópicos • {flashcardCount} flashcards
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteSubject(selectedSubject.id)}
                                className="text-foco-secondary hover:text-red-400 transition-colors p-2 self-start"
                                title="Excluir matéria"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {totalCount > 0 && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-foco-secondary">Progresso</span>
                                    <span className="text-foco-accent">{progress}%</span>
                                </div>
                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-foco-accent to-emerald-400 rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-foco-card border border-white/5 rounded-2xl w-fit">
                    <button
                        onClick={() => setPlannerTab('aulas')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${plannerTab === 'aulas' ? 'bg-foco-accent text-foco-bg shadow-lg' : 'text-foco-secondary hover:text-white hover:bg-white/5'}`}
                    >
                        <FileText size={16} />
                        Tópicos ({totalCount})
                    </button>
                    <button
                        onClick={() => setPlannerTab('flashcards')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${plannerTab === 'flashcards' ? 'bg-indigo-500 text-white shadow-lg' : 'text-foco-secondary hover:text-white hover:bg-white/5'}`}
                    >
                        <Layers size={16} />
                        Flashcards ({flashcardCount})
                    </button>
                </div>

                {/* Tab Content */}
                {plannerTab === 'aulas' ? (
                    <div className="space-y-4">
                        {/* Add Lesson Input */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Adicionar novo tópico..."
                                value={newLessonName}
                                onChange={(e) => setNewLessonName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addLesson(selectedSubject.id)}
                                className="flex-1 bg-foco-card border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-foco-accent/50 focus:border-foco-accent/30 transition-all placeholder:text-foco-secondary/40"
                            />
                            <button
                                onClick={() => addLesson(selectedSubject.id)}
                                className="px-6 bg-foco-accent text-foco-bg rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foco-accent/20 flex items-center gap-2"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Adicionar</span>
                            </button>
                        </div>

                        {/* Lessons List */}
                        {selectedSubject.aulas.length === 0 ? (
                            <div className="bg-foco-card border border-dashed border-white/10 rounded-[24px] p-12 text-center">
                                <FileText size={40} className="mx-auto mb-4 text-foco-secondary/30" />
                                <p className="font-bold text-foco-secondary/50">Nenhum tópico ainda</p>
                                <p className="text-xs text-foco-secondary/30 mt-1">Adicione tópicos para acompanhar seu progresso</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedSubject.aulas.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className={`group flex items-center gap-4 p-4 bg-foco-card border rounded-2xl transition-all hover:border-white/15 ${lesson.concluida
                                            ? 'border-foco-accent/20 bg-foco-accent/5'
                                            : 'border-white/5'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleLesson(selectedSubject.id, lesson.id)}
                                            className="shrink-0"
                                        >
                                            <CheckCircle
                                                size={24}
                                                className={`transition-all ${lesson.concluida
                                                    ? 'text-foco-accent fill-foco-accent/20'
                                                    : 'text-white/15 hover:text-white/40'
                                                    }`}
                                            />
                                        </button>

                                        {/* Lesson Name */}
                                        <span className={`flex-1 font-semibold transition-all ${lesson.concluida ? 'line-through opacity-50' : ''
                                            }`}>
                                            {lesson.nome}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {lesson.link && (
                                                <a
                                                    href={lesson.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                                                    title="Abrir link"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => attachLink(selectedSubject.id, lesson.id)}
                                                className="p-2 text-foco-secondary hover:text-foco-accent hover:bg-foco-accent/10 rounded-lg transition-all"
                                                title="Anexar link"
                                            >
                                                <LinkIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteLesson(selectedSubject.id, lesson.id)}
                                                className="p-2 text-foco-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="Excluir tópico"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Add Flashcard */}
                        {showAddFlashcard ? (
                            <div className="bg-foco-card border border-indigo-500/20 rounded-[24px] p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black uppercase text-indigo-400 tracking-widest">Novo Flashcard</p>
                                    <button
                                        onClick={() => setShowAddFlashcard(false)}
                                        className="text-foco-secondary hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pergunta..."
                                    value={newFlashcardQ}
                                    onChange={(e) => setNewFlashcardQ(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                                <textarea
                                    placeholder="Resposta..."
                                    value={newFlashcardA}
                                    onChange={(e) => setNewFlashcardA(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-500 h-24 resize-none transition-all"
                                />
                                <button
                                    onClick={() => addFlashcard(selectedSubject.id)}
                                    className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all"
                                >
                                    Salvar Flashcard
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddFlashcard(true)}
                                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-2xl text-foco-secondary hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
                            >
                                <Plus size={18} />
                                <span className="font-bold text-sm">Criar Flashcard</span>
                            </button>
                        )}

                        {/* Flashcards Grid */}
                        {(selectedSubject.flashcards || []).length === 0 && !showAddFlashcard ? (
                            <div className="bg-foco-card border border-dashed border-white/10 rounded-[24px] p-12 text-center">
                                <Layers size={40} className="mx-auto mb-4 text-foco-secondary/30" />
                                <p className="font-bold text-foco-secondary/50">Nenhum flashcard ainda</p>
                                <p className="text-xs text-foco-secondary/30 mt-1">Crie flashcards para memorizar melhor</p>
                            </div>
                        ) : (
                            <div className="flashcard-grid">
                                {(selectedSubject.flashcards || []).map(f => (
                                    <div key={f.id} className="flashcard-container">
                                        <div
                                            className={`flashcard-inner ${showCardAnswer === f.id ? 'flipped' : ''}`}
                                            onClick={() => setShowCardAnswer(showCardAnswer === f.id ? null : f.id)}
                                        >
                                            {/* Front - Question */}
                                            <div className="flashcard-front">
                                                <button
                                                    className="flashcard-delete-btn"
                                                    onClick={(e) => { e.stopPropagation(); deleteFlashcard(selectedSubject.id, f.id); }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="flashcard-label">
                                                    <HelpCircle size={12} /> PERGUNTA
                                                </div>
                                                <div className="flashcard-content">
                                                    <p>{f.pergunta}</p>
                                                </div>
                                                <div className="flashcard-hint">Clique para virar</div>
                                            </div>

                                            {/* Back - Answer */}
                                            <div className="flashcard-back">
                                                <button
                                                    className="flashcard-delete-btn"
                                                    onClick={(e) => { e.stopPropagation(); deleteFlashcard(selectedSubject.id, f.id); }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="flashcard-label">
                                                    <Sparkles size={12} /> RESPOSTA
                                                </div>
                                                <div className="flashcard-content">
                                                    <p>{f.resposta}</p>
                                                </div>
                                                <div className="flashcard-hint">Clique para voltar</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // --- Render: Subjects Overview ---
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-foco-accent/15 rounded-2xl flex items-center justify-center text-foco-accent">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black">Hub Acadêmico</h2>
                        <p className="text-xs text-foco-secondary mt-1">
                            {stats.materias.length} matéria{stats.materias.length !== 1 ? 's' : ''} • Progresso geral: {totalProgress}%
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddSubject(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-foco-accent text-foco-bg rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foco-accent/20"
                >
                    <Plus size={18} />
                    Nova Matéria
                </button>
            </div>

            {/* Global Progress */}
            {stats.materias.length > 0 && (
                <div className="bg-foco-card border border-white/5 rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <BarChart2 size={16} className="text-foco-accent" />
                            <span className="text-xs font-black uppercase text-foco-secondary tracking-wider">Progresso Geral</span>
                        </div>
                        <span className="text-sm font-black text-foco-accent">{totalProgress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-foco-accent via-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${totalProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Add Subject Modal-like */}
            {showAddSubject && (
                <div className="bg-foco-card border border-foco-accent/20 rounded-[24px] p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-black text-sm text-foco-accent">Nova Matéria</h4>
                        <button
                            onClick={() => { setShowAddSubject(false); setNewSubjectName(''); }}
                            className="text-foco-secondary hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Nome da matéria..."
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                            autoFocus
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:ring-1 focus:ring-foco-accent transition-all"
                        />
                        <button
                            onClick={addSubject}
                            className="px-8 py-3 bg-foco-accent text-foco-bg rounded-xl font-black hover:scale-105 active:scale-95 transition-all"
                        >
                            Criar
                        </button>
                    </div>
                </div>
            )}

            {/* Search (only if there are subjects) */}
            {stats.materias.length > 3 && (
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foco-secondary/50" />
                    <input
                        type="text"
                        placeholder="Buscar matéria..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-foco-card border border-white/5 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:ring-2 focus:ring-foco-accent/30 transition-all text-sm"
                    />
                </div>
            )}

            {/* Subjects Grid */}
            {filteredSubjects.length === 0 && !showAddSubject ? (
                <div className="bg-foco-card border border-dashed border-white/10 rounded-[32px] p-16 text-center">
                    <GraduationCap size={56} className="mx-auto mb-6 text-foco-secondary/20" />
                    <h3 className="text-xl font-black text-foco-secondary/40 mb-2">
                        {searchQuery ? 'Nenhuma matéria encontrada' : 'Comece sua jornada acadêmica'}
                    </h3>
                    <p className="text-sm text-foco-secondary/30">
                        {searchQuery ? 'Tente outro termo de busca' : 'Adicione matérias para organizar seus estudos'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowAddSubject(true)}
                            className="mt-6 px-6 py-3 bg-foco-accent/10 text-foco-accent border border-foco-accent/20 rounded-2xl font-bold hover:bg-foco-accent/20 transition-all"
                        >
                            <Plus size={16} className="inline mr-2" />
                            Criar primeira matéria
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSubjects.map(subject => {
                        const progress = getSubjectProgress(subject);
                        const completedLessons = subject.aulas.filter(a => a.concluida).length;
                        const totalLessons = subject.aulas.length;
                        const flashcards = (subject.flashcards || []).length;

                        return (
                            <button
                                key={subject.id}
                                onClick={() => setSelectedSubjectId(subject.id)}
                                className="bg-foco-card border border-white/5 rounded-[24px] p-6 text-left hover:border-foco-accent/30 hover:shadow-xl hover:shadow-foco-accent/5 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 bg-foco-accent/10 rounded-xl flex items-center justify-center text-foco-accent group-hover:bg-foco-accent/20 transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                    <ChevronRight size={18} className="text-foco-secondary/30 group-hover:text-foco-accent group-hover:translate-x-1 transition-all" />
                                </div>

                                <h3 className="font-black text-lg mb-1 truncate">{subject.nome}</h3>
                                <p className="text-xs text-foco-secondary mb-4">
                                    {totalLessons} tópico{totalLessons !== 1 ? 's' : ''} • {flashcards} card{flashcards !== 1 ? 's' : ''}
                                </p>

                                {/* Mini Progress */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-foco-secondary">{completedLessons}/{totalLessons} completos</span>
                                        <span className="text-foco-accent">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-foco-accent rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlannerView;
