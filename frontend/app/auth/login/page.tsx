import LoginForm from './LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 p-8 shadow-2xl backdrop-blur-xl flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl font-black italic text-slate-900 dark:text-white mb-2">
                        LOADING <span className="text-emerald-500">...</span>
                    </div>
                </div>
            </div>
        </div>}>
            <LoginForm />
        </Suspense>
    );
}
