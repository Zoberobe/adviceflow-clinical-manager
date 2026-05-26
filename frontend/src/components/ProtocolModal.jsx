import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProtocolModal({ isOpen, onClose, onSuccess, categories, users }) {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', delegated_to: '' });

    if (!isOpen) return null;

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
            setFormData({ title: '', description: '', category: '', delegated_to: '' });
            toast.success("Novo protocolo criado com sucesso!");
            onSuccess(); 
            onClose();
        } catch (error) {
            toast.error('Erro ao criar protocolo. Verifique os dados.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Novo Protocolo Clínico</h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white">&times;</button>
                </div>
                <form onSubmit={handleCreateProtocol} className="p-6 space-y-4">
                    <button type="button" onClick={handleSimulatePatient} className="w-full bg-indigo-100 text-indigo-700 py-2 rounded text-sm font-medium hover:bg-indigo-200 transition border border-indigo-200">
                        ⚡ Autopreencher com Paciente Simulado
                    </button>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Título</label>
                        <input type="text" required className="mt-1 block w-full p-2 border border-slate-300 rounded" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Descrição</label>
                        <textarea required rows="3" className="mt-1 block w-full p-2 border border-slate-300 rounded" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Categoria</label>
                        <select required className="mt-1 block w-full p-2 border border-slate-300 rounded bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option value="">Selecione uma categoria...</option>
                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Delegar para (Opcional)</label>
                        <select className="mt-1 block w-full p-2 border border-slate-300 rounded bg-white" value={formData.delegated_to} onChange={(e) => setFormData({...formData, delegated_to: e.target.value})}>
                            <option value="">Manter comigo (Privado)</option>
                            {users.map(user => (<option key={user.id} value={user.id}>Dr(a). {user.username}</option>))}
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Salvar Protocolo</button>
                    </div>
                </form>
            </div>
        </div>
    );
}