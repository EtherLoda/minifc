'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await register({ username, email, password });
            // AuthContext.register redirects to login
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 p-8 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black italic text-slate-900 dark:text-white mb-2">
                        NEW <span className="text-emerald-500">LICENSE</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Apply for your manager credentials.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Manager Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-emerald-900/50 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Sir Alex"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-emerald-900/50 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                            placeholder="manager@goalxi.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-emerald-900/50 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Apply Now <ArrowRight size={20} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have a license?{' '}
                    <Link href="/auth/login" className="text-emerald-500 font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
