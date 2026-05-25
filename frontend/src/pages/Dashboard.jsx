import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [protocols, setProtocols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', category: '' });
    const navigate = useNavigate();

    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchProtocols();
    }, [statusFilter, categoryFilter]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProtocols = async (url = null) => {
        try {
            let fetchUrl = url || 'protocols/?';
            if (!url) {
                if (statusFilter) fetchUrl += `status=${statusFilter}&`;
                if (categoryFilter) fetchUrl += `category=${categoryFilter}&`;
            }

            const response = await api.get(fetchUrl);
            setProtocols(response.data.results || []);
            setNextPageUrl(response.data.next);
            setPrevPageUrl(response.data.previous);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
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

    const toggleStatus = async (protocol) => {
        const newStatus = protocol.status === 'PENDING' ? 'EXECUTED' : 'PENDING';
        try {
            await api.patch(`protocols/${protocol.id}/`, { status: newStatus });
            toast.success(`Protocolo marcado como ${newStatus === 'EXECUTED' ? 'Executado' : 'Pendente'}`);
            fetchProtocols();
        } catch (error) {
            toast.error('Erro ao atualizar o status do protocolo.');
        }
    };

    const handleSimulatePatient = async (e) => {
        e.preventDefault();
        try {
            toast.loading("Buscando paciente...", { id: "simulacao" });
            const response = await api.get('patients/random/');
            const patient = response.data;
            
            setFormData({
                ...formData,
                title: `Avaliação: ${patient.full_name}`,
                description: `Paciente com ${patient.age} anos. Status clínico: ${patient.clinical_status}.`
            });
            toast.success("Paciente simulado carregado!", { id: "simulacao" });
        } catch (error) {
            toast.error("Erro ao buscar paciente simulado.", { id: "simulacao" });
        }
    };

    const handleCreateProtocol = async (e) => {
        e.preventDefault();
        try {
            await api.post('protocols/', formData);
            setIsModalOpen(false);
            setFormData({ title: '', description: '', category: '' });
            toast.success("Novo protocolo criado com sucesso!");
            fetchProtocols();
        } catch (error) {
            toast.error('Erro ao criar protocolo. Verifique os dados.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">AdviceFlow | Plantão</h1>
                <button onClick={handleLogout} className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded transition text-sm">
                    Encerrar Sessão
                </button>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Protocolos Ativos</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                    >
                        + Novo Protocolo
                    </button>
                </div>

                <div className="flex space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar por Status</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos os Status</option>
                            <option value="PENDING">Pendentes</option>
                            <option value="EXECUTED">Executados</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Filtrar por Categoria</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded text-sm bg-white"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Todas as Categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.length === 0 ? (
                        <p className="text-slate-500">Nenhum protocolo encontrado com estes filtros.</p>
                    ) : (
                        protocols.map(protocol => (
                            <div key={protocol.id} className={`p-4 rounded-lg shadow border-l-4 ${protocol.status === 'EXECUTED' ? 'bg-slate-100 border-slate-400' : 'bg-white border-blue-500'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`font-bold ${protocol.status === 'EXECUTED' ? 'line-through text-slate-500' : 'text-blue-900'}`}>{protocol.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{protocol.description}</p>
                                        <div className="mt-3 text-xs text-slate-500">
                                            <p>De: Dr(a). {protocol.creator_name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleStatus(protocol)} className={`px-3 py-1 rounded text-sm font-medium transition ${protocol.status === 'EXECUTED' ? 'bg-slate-300 text-slate-700 hover:bg-slate-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                                        {protocol.status === 'EXECUTED' ? 'Reabrir' : 'Executar'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
                    <button 
                        onClick={() => fetchProtocols(prevPageUrl)}
                        disabled={!prevPageUrl}
                        className={`px-4 py-2 rounded text-sm font-medium ${prevPageUrl ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        &larr; Página Anterior
                    </button>
                    <button 
                        onClick={() => fetchProtocols(nextPageUrl)}
                        disabled={!nextPageUrl}
                        className={`px-4 py-2 rounded text-sm font-medium ${nextPageUrl ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        Próxima Página &rarr;
                    </button>
                </div>
            </main>

            {/* --- MODAL DE CRIAÇÃO --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">Novo Protocolo Clínico</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white">&times;</button>
                        </div>
                        
                        <form onSubmit={handleCreateProtocol} className="p-6 space-y-4">
                            <button 
                                onClick={handleSimulatePatient}
                                className="w-full bg-indigo-100 text-indigo-700 py-2 rounded text-sm font-medium hover:bg-indigo-200 transition border border-indigo-200"
                            >
                                ⚡ Autopreencher com Paciente Simulado
                            </button>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Título</label>
                                <input 
                                    type="text" required
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Descrição</label>
                                <textarea 
                                    required rows="3"
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Categoria</label>
                                <select 
                                    required
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded bg-white focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">Selecione uma categoria...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow">
                                    Salvar Protocolo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}