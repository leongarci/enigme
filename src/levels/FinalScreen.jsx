// src/levels/FinalScreen.jsx
import React from 'react';
import { Music } from 'lucide-react';

export default function FinalScreen({ timeDisplay }) {
    return (
        <div className="flex flex-col items-center text-center animate-fadeIn duration-1000 px-4">
            <div className="relative mb-8">
                <div className="absolute -inset-4 bg-amber-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-slate-900 p-8 rounded-full border-4 border-amber-500 shadow-2xl">
                    <Music size={64} className="text-amber-500" />
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-amber-500 mb-6 tracking-tighter">
                CHAMPIONNE
            </h1>

            <div className="max-w-2xl bg-slate-900/90 p-10 rounded-xl border border-slate-800 shadow-2xl">
                <p className="text-xl text-slate-200 mb-6 font-serif leading-relaxed">
                    Félicitations ma belle :)
                </p>
                <p className="text-slate-400 mb-8">
                    T'as prouvé que tu pouvais réflechir sans te briser le cerveau et j'avoue que je pensais pas que ça
                    serait possible... Je suis franchement impressionné. Bien joué mon ange j'espère que ça t'aura un
                    peu amusé :) En tous cas je pense à toi et je te souhaite de joyeuses fêtes ❤️
                </p>

                <div className="py-6 border-t border-b border-slate-800 mb-8">
                    <span className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Temps total de résolution</span>
                    <span className="text-4xl font-mono text-emerald-400 font-bold">{timeDisplay}</span>
                </div>

                <p className="text-amber-500 italic font-serif text-lg">
                    "Le but de la musique n'est autre que la gloire de Dieu et le délassement de l'âme." - J.S. Bach
                </p>

                <div className="mt-8">
                    <button onClick={() => alert("Boloss t'as cru quoi ya rien du tout 🦕")} className="bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold py-4 px-10 rounded shadow-lg transition-transform hover:scale-105 uppercase tracking-widest">
                        Réclamer la récompense
                    </button>
                </div>
            </div>
        </div>
    );
}