// src/components/HintSystem.jsx
import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function HintSystem({ hints, onUseHint }) {
    const [isOpen, setIsOpen] = useState(false);
    const [unlockedHints, setUnlockedHints] = useState(0);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-slate-900 border border-amber-600 p-4 rounded-lg shadow-2xl max-w-xs animate-fadeIn">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Protocole d'Aide</span>
                        <button onClick={() => setIsOpen(false)}><X size={16} /></button>
                    </div>
                    <div className="space-y-3">
                        {hints.map((hint, idx) => (
                            <div key={idx} className="text-sm">
                                {idx < unlockedHints ? (
                                    <p className="text-slate-300 italic p-2 bg-slate-800 rounded border-l-2 border-emerald-500">{hint.text}</p>
                                ) : (
                                    idx === unlockedHints && (
                                        <button
                                            onClick={() => {
                                                onUseHint();
                                                setUnlockedHints(h => h + 1);
                                            }}
                                            className="w-full py-2 bg-slate-800 hover:bg-red-900/50 border border-dashed border-slate-600 text-xs text-red-400 hover:text-red-200 uppercase tracking-wider transition-colors"
                                        >
                                            Révéler Indice #{idx + 1} (+5 min)
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                        {unlockedHints === hints.length && (
                            <p className="text-[10px] text-center text-slate-500">Aucune autre donnée disponible.</p>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-slate-800 text-amber-600 p-3 rounded-full border border-amber-900 hover:bg-amber-900 hover:text-white transition-all shadow-lg hover:shadow-amber-900/20"
                >
                    <HelpCircle size={24} />
                </button>
            )}
        </div>
    );
}