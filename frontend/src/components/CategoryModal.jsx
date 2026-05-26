import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CategoryModal({ isOpen, onClose, onSuccess }) {
    const [catFormData, setCatFormData] = useState({ name: '', description: '' });

    if (!isOpen) return null;

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('categories/', catFormData);
            setCatFormData({ name: '', description: '' });
            toast.success("Categoria criada com sucesso!");
            onSuccess(); 
            onClose();   
        } catch (error) {
            toast.error("Erro ao criar categoria. Pode ser que o nome já exista.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Nova Categoria Hospitalar</h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white">&times;</button>
                </div>
                <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Nome da Categoria</label>
                        <input type="text" required placeholder="Ex: Ala Psiquiátrica, UTI, Pediatria" className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500" value={catFormData.name} onChange={(e) => setCatFormData({...catFormData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Descrição (Opcional)</label>
                        <textarea rows="2" className="mt-1 block w-full p-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500" value={catFormData.description} onChange={(e) => setCatFormData({...catFormData, description: e.target.value})}></textarea>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Criar Categoria</button>
                    </div>
                </form>
            </div>
        </div>
    );
}