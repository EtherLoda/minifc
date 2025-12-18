'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    username?: string;
    teamId?: string;
    teamName?: string;
    leagueId?: string;
    role?: string;
    // Add other user fields as needed
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session
    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('goalxi_token');
            if (token) {
                try {
                    const userData = await api.getMe(token);
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user', error);
                    localStorage.removeItem('goalxi_token');
                }
            }
            setIsLoading(false);
        }
        loadUser();
    }, []);

    const login = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. Call Login Endpoint
            const res = await api.login(data);
            const { accessToken, userId } = res;

            // 2. Store Token
            localStorage.setItem('goalxi_token', accessToken);

            // 3. Update User State (Fetch full profile)
            const userData = await api.getMe(accessToken);
            setUser(userData);

            // 4. Redirect handled by caller or here
            router.push('/');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. Register
            const res = await api.register(data);
            // Register might not return token immediately if email verification is required
            // But AuthService.register code (viewed earlier) DOES NOT return token. It returns { userId }.
            // So we might need to Auto-Login or ask user to login.
            // Let's check AuthService.register again (Step 10349 Line 139).
            // It returns `RegisterResDto`.
            // Wait, AuthService.register RETURNS plainToInstance(RegisterResDto, { userId: user.id }).
            // It does NOT return token.
            // So we cannot auto-login unless we change backend (User restriction).
            // We should redirect to Login with a success message.

            router.push('/auth/login?registered=true');
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('goalxi_token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
