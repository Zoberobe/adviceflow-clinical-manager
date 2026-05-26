import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

import ProtocolCard from '../components/ProtocolCard';
import CategoryModal from '../components/CategoryModal';
import ProtocolModal from '../components/ProtocolModal';

export default function Dashboard() {
    const [protocols, setProtocols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const navigate = useNavigate();

    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(''); 

    useEffect(() => {
        fetchProtocols();
    }, [statusFilter, categoryFilter, dateFilter]); 

    useEffect(() => {
        fetchCategories();
        fetchUsers();
    }, []);

    const fetchProtocols = async (url = null) => {
        try {
            let fetchUrl = url || 'protocols/?';
            if (!url) {
                if (statusFilter) fetchUrl += `status=${statusFilter}&`;
                if (categoryFilter) fetchUrl += `category=${categoryFilter}&`;
                if (dateFilter) fetchUrl += `created_at__date=${dateFilter}&`; 
            }
            const response = await api.get(fetchUrl);
            setProtocols(response.data.results || []);
            setNextPageUrl(response.data.next);
            setPrevPageUrl(response.data.previous);
        } catch (error) {
            console.error("Erro ao buscar protocolos.");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('categories/');
            setCategories(response.data.results || []);
        } catch (error) {
            toast.error("Erro ao carregar categorias.");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('users/');
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários");
        }
    };

    const toggleStatus = async (protocol) => {
        const newStatus = protocol.status === 'PENDING' ? 'EXECUTED' : 'PENDING';
        try {
            await api.patch(`protocols/${protocol.id}/`, { status: newStatus });
            toast.success(`Protocolo marcado como ${newStatus === 'EXECUTED' ? 'Executado' : 'Pendente'}`);
            fetchProtocols();
        } catch (error) {
            toast.error('Erro ao atualizar o status.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-10">
            <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">AdviceFlow | Plantão</h1>
                <button onClick={handleLogout} className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded transition text-sm">
                    Encerrar Sessão
                </button>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Protocolos Ativos</h2>
                    <div className="space-x-2">
                        <button onClick={() => setIsCatModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                            + Nova Categoria
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                            + Novo Protocolo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar por Status</label>
                        <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Todos os Status</option>
                            <option value="PENDING">Pendentes</option>
                            <option value="EXECUTED">Executados</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar por Categoria</label>
                        <select className="w-full p-2 border border-slate-300 rounded text-sm bg-white" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="">Todas as Categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar por Data</label>
                        <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm bg-white" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.length === 0 ? (
                        <p className="text-slate-500">Nenhum protocolo encontrado com estes filtros.</p>
                    ) : (
                        protocols.map(protocol => (
                            <ProtocolCard 
                                key={protocol.id} 
                                protocol={protocol} 
                                toggleStatus={toggleStatus} 
                            />
                        ))
                    )}
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
                    <button onClick={() => fetchProtocols(prevPageUrl)} disabled={!prevPageUrl} className={`px-4 py-2 rounded text-sm font-medium ${prevPageUrl ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        &larr; Página Anterior
                    </button>
                    <button onClick={() => fetchProtocols(nextPageUrl)} disabled={!nextPageUrl} className={`px-4 py-2 rounded text-sm font-medium ${nextPageUrl ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        Próxima Página &rarr;
                    </button>
                </div>
            </main>

            <CategoryModal 
                isOpen={isCatModalOpen} 
                onClose={() => setIsCatModalOpen(false)} 
                onSuccess={fetchCategories} 
            />
            <ProtocolModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProtocols} 
                categories={categories} 
                users={users} 
            />
        </div>
    );
}