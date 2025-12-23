// src/levels/IntroScreen.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function IntroScreen({ onStart }) {
    return (
        <div className="flex flex-col items-center text-center space-y-8 animate-fadeIn px-4">
            <div className="border-b-2 border-amber-600 pb-4 mb-8 relative">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-700 drop-shadow-lg">
                    SILENTIUM
                </h1>
                <div className="absolute -right-4 -top-4 text-xs text-emerald-500 font-mono border border-emerald-500 px-1 rounded animate-pulse">
                    ACCÈS: AUTORISÉ
                </div>
            </div>

            <div className="max-w-xl text-lg leading-relaxed text-slate-300 space-y-6 bg-slate-900/80 p-10 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                <p className="font-serif italic text-2xl text-amber-500/80">"L'art n'est pas un miroir, c'est un marteau."</p>

                <div className="space-y-4 text-sm md:text-base font-light tracking-wide">
                    <p>Chère <strong className="text-amber-100">Eulalie</strong>,</p>
                    <p>
                        Tu as l'oreille absolue, mais as-tu l'œil absolu ? L'Orchestre ne cherche pas seulement des exécutants, mais des décrypteurs.
                    </p>
                    <p>
                        Ce qui suit est un test de résilience. Trois mouvements. Trois époques.
                        Tu devras utiliser tes connaissances sur <strong>Bach</strong>, ta perception des détails cinématographiques et ta logique pure.
                    </p>
                    <div className="p-4 bg-black/40 rounded border border-red-900/30 text-red-200 text-xs font-mono mt-4">
                        <AlertTriangle size={14} className="inline mr-2" />
                        ATTENTION : Le temps tourne. Chaque indice demandé ajoutera 5 minutes de pénalité à ton score final.
                    </div>
                </div>
            </div>

            <button
                onClick={onStart}
                className="group relative px-10 py-5 bg-transparent border border-amber-600 text-amber-500 hover:text-slate-900 transition-colors duration-500 uppercase tracking-[0.3em] font-bold mt-8 overflow-hidden"
            >
                <span className="relative z-10">Commencer l'Audition</span>
                <div className="absolute inset-0 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></div>
            </button>
        </div>
    );
}