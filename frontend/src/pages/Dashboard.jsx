import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const [protocols, setProtocols] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProtocols();
    }, []);

    const fetchProtocols = async () => {
        try {
            const response = await api.get('protocols/');
            setProtocols(response.data.results || []); 
        } catch (error) {
            console.error("Erro ao buscar dados", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
        }
    };

    const toggleStatus = async (protocol) => {
        const newStatus = protocol.status === 'PENDING' ? 'EXECUTED' : 'PENDING';
        try {
            await api.patch(`protocols/${protocol.id}/`, { status: newStatus });
            fetchProtocols(); 
        } catch (error) {
            alert('Erro ao atualizar o status do protocolo.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">AdviceFlow | Plantão</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded transition text-sm"
                >
                    Encerrar Sessão
                </button>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">Protocolos Ativos</h2>
                    <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                        + Novo Protocolo
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {protocols.length === 0 ? (
                        <p className="text-slate-500">Nenhum protocolo encontrado no sistema.</p>
                    ) : (
                        protocols.map(protocol => (
                            <div 
                                key={protocol.id} 
                                className={`p-4 rounded-lg shadow border-l-4 ${protocol.status === 'EXECUTED' ? 'bg-slate-100 border-slate-400' : 'bg-white border-blue-500'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`font-bold ${protocol.status === 'EXECUTED' ? 'line-through text-slate-500' : 'text-blue-900'}`}>
                                            {protocol.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">{protocol.description}</p>
                                        <div className="mt-3 text-xs text-slate-500">
                                            <p>De: Dr(a). {protocol.creator_name}</p>
                                            {protocol.delegated_to_name && (
                                                <p>Para: {protocol.delegated_to_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => toggleStatus(protocol)}
                                        className={`px-3 py-1 rounded text-sm font-medium transition ${protocol.status === 'EXECUTED' ? 'bg-slate-300 text-slate-700 hover:bg-slate-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                    >
                                        {protocol.status === 'EXECUTED' ? 'Reabrir' : 'Executar'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}