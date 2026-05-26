import React from 'react';

export default function ProtocolCard({ protocol, toggleStatus }) {
    const isExecuted = protocol.status === 'EXECUTED';

    return (
        <div className={`p-4 rounded-lg shadow border-l-4 flex flex-col justify-between ${isExecuted ? 'bg-slate-100 border-slate-400' : 'bg-white border-blue-500'}`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <h3 className={`font-bold ${isExecuted ? 'line-through text-slate-500' : 'text-blue-900'}`}>{protocol.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{protocol.description}</p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                        <div>
                            <p className="font-medium text-slate-700">De: Dr(a). {protocol.creator_name}</p>
                            {protocol.delegated_to_name && (
                                <p className="text-indigo-600 mt-1">Para: {protocol.delegated_to_name}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p>Criado: {new Date(protocol.created_at).toLocaleDateString('pt-BR')}</p>
                            {isExecuted && (
                                <p className="text-green-600 mt-1">Executado: {new Date(protocol.updated_at).toLocaleDateString('pt-BR')}</p>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => toggleStatus(protocol)} 
                    className={`px-3 py-1 rounded text-sm font-medium transition whitespace-nowrap ${isExecuted ? 'bg-slate-300 text-slate-700 hover:bg-slate-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                    {isExecuted ? 'Reabrir' : 'Executar'}
                </button>
            </div>
        </div>
    );
}