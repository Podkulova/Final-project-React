'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Hesla se neshodují.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://edupage.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Registrace selhala');
            }

            // Redirect to the login page after successful registration
            router.push('/login');
        } catch (error) {
            setError('Registrace selhala. Zkuste to prosím znovu.');
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-800 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Registrace</h2>
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
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-300">Potvrzení hesla</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button
                    type="submit"
                    className={`py-2 px-4 rounded ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-800'} text-white font-bold`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Registrovat se'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-300">Máte již účet? <button
                    className="text-blue-500 hover:text-blue-700 underline"
                    onClick={() => router.push('/login')}
                >
                    Přihlásit se
                </button></p>
            </div>
        </div>
    );
};

export default Register;