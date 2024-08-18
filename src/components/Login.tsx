'use client'; // This directive must be at the top

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import

interface LoginResponse {
    token: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter(); // Use useRouter from next/navigation

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid login credentials');
            }

            const data: LoginResponse = await response.json();

            // Store token in localStorage
            localStorage.setItem('token', data.jwtToken);

              console.log('Toto je ten nas token' + localStorage.getItem('token'));

            // Redirect to the home page
            router.push('/');
        } catch (error) {
            setError('Přihlášení se nezdařilo. Zkontrolujte své údaje.');
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-800 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Přihlášení</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-300">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-300">Heslo</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button
                    type="submit"
                    className={`py-2 px-4 rounded ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-800'} text-white font-bold`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Přihlásit se'}
                </button>
            </form>
        </div>
    );
};

export default Login;
