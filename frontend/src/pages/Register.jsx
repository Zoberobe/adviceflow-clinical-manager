import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/', { username, password });
            
            toast.success('Conta criada com sucesso! Por favor, faça o login.');
            navigate('/login'); 
        } catch (err) {
            toast.error('Erro ao criar conta. Usuário existente ou senha fraca.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">AdviceFlow</h1>
                <h2 className="text-center text-slate-500 mb-6">Cadastro de Novo Profissional</h2>                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Novo Usuário</label>
                        <input 
                            type="text" 
                            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Senha</label>
                        <input 
                            type="password" 
                            className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition font-medium"
                    >
                        Criar Minha Conta
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Já possui acesso?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Faça login aqui
                    </Link>
                </div>
            </div>
        </div>
    );
}