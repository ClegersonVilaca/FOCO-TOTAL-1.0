
import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseService';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email.trim() || !password.trim()) {
            setError('Preencha todos os campos.');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (!isLogin && password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // onAuthStateChange in App.tsx will handle the redirect
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                if (data.session) {
                    // Auto-confirmed, user is logged in
                } else {
                    setSuccess('Conta criada! Verifique seu e-mail para confirmar.');
                }
            }
        } catch (err: any) {
            const msg = err.message || 'Erro desconhecido.';
            if (msg === 'Invalid login credentials') {
                setError('E-mail ou senha incorretos.');
            } else if (msg.includes('already registered')) {
                setError('Este e-mail já está cadastrado. Faça login.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-screen">
            {/* Animated background orbs */}
            <div className="auth-bg-orb auth-bg-orb-1" />
            <div className="auth-bg-orb auth-bg-orb-2" />
            <div className="auth-bg-orb auth-bg-orb-3" />

            <div className="auth-container">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <Zap size={32} />
                    </div>
                    <h1 className="auth-logo-text">Foco Total</h1>
                    <p className="auth-subtitle">Sua mente em alta performance</p>
                </div>

                {/* Card */}
                <div className="auth-card">
                    {/* Toggle */}
                    <div className="auth-toggle">
                        <button
                            type="button"
                            className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                        >
                            Entrar
                        </button>
                        <button
                            type="button"
                            className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                        >
                            Criar Conta
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Error */}
                        {error && (
                            <div className="auth-message auth-error">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="auth-message auth-success">
                                <Zap size={16} />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label">E-mail</label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label">Senha</label>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (signup only) */}
                        {!isLogin && (
                            <div className="auth-field" style={{ animation: 'authSlideDown 0.3s ease-out' }}>
                                <label className="auth-label">Confirmar Senha</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={18} className="auth-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className="auth-spinner" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-footer">
                        {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
                        <button
                            type="button"
                            className="auth-footer-link"
                            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
                        >
                            {isLogin ? 'Crie agora' : 'Faça login'}
                        </button>
                    </p>
                </div>

                <p className="auth-version">Protocolo v5.5 • Performance Insights</p>
            </div>
        </div>
    );
};

export default AuthScreen;
