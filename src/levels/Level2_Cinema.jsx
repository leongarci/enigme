// src/levels/Level2_Cinema.jsx
import React, { useState } from 'react';
import {
    Film, Zap, X, ArrowLeft, Key, Grid3X3, Search,
    Clapperboard, Camera, Image, FileText, Car
} from 'lucide-react';

/**
 * Système d'indices (Mock local pour assurer la compilation dans l'aperçu)
 * Dans votre projet local, vous pouvez utiliser l'import réel :
 * import HintSystem from '../components/HintSystem';
 */
const HintSystem = ({ hints, onUseHint }) => null;

export default function CinemaLevel({ onSolve, addPenalty }) {
    const [password, setPassword] = useState("");
    const [uvActive, setUvActive] = useState(false);
    const [viewedItem, setViewedItem] = useState(null);

    // Indices (utilisés par le système global)
    const hints = [
        { text: "La plaque de métal contient les lettres. Trouvez le masque de Fleissner qui lui correspond." },
        { text: "Cherchez un symbole caché sous UV sur le support des lettres. Seul l'un des masques porte le même signe." },
        { text: "Le mot de passe est une destination de voyage célèbre au Sud." }
    ];

    // Grille 6x6 avec "MEXICO" dispersé de manière disparate
    // M=3, E=11, X=19, I=21, C=30, O=34
    const letterGrid = [
        'A', 'B', 'N', 'M', 'T', 'K', // 0-5 (M à l'index 3)
        'L', 'P', 'S', 'W', 'Z', 'E', // 6-11 (E à l'index 11)
        'H', 'Q', 'V', 'R', 'Y', 'A', // 12-17
        'U', 'X', 'D', 'I', 'F', 'G', // 18-23 (X à 19, I à 21)
        'J', 'B', 'S', 'P', 'L', 'T', // 24-29
        'C', 'K', 'Q', 'W', 'O', 'M'  // 30-35 (C à 30, O à 34)
    ];

    // Objets de la scène (Ambiance Road Trip / Thelma & Louise)
    const items = [
        {
            id: 'main_grid',
            label: 'Support de Lettres',
            icon: Grid3X3,
            top: '40%',
            left: '35%',
            rot: '0deg',
            desc: "Une plaque métallique poussiéreuse trouvée dans le coffre d'une Thunderbird 1966.",
            isAlwaysVisible: true,
            uvSymbol: Zap // Symbole de synchronisation : La foudre
        },
        {
            id: 'stencil_A',
            label: 'Masque de Fleissner (Alpha)',
            icon: Grid3X3,
            top: '12%',
            left: '10%',
            rot: '-10deg',
            desc: "Un masque perforé en carton rigide. Un symbole de foudre est visible sous UV.",
            symbol: Zap, // LE BON MASQUE (MEXICO)
            holes: [3, 11, 19, 21, 30, 34],
            isAlwaysVisible: false
        },
        {
            id: 'stencil_B',
            label: 'Masque de Fleissner (Bêta)',
            icon: Grid3X3,
            top: '15%',
            left: '70%',
            rot: '12deg',
            desc: "Un masque métallique noirci. Marquage caméra sous UV.",
            symbol: Camera,
            holes: [0, 8, 16, 24, 32],
            isAlwaysVisible: false
        },
        {
            id: 'stencil_C',
            label: 'Masque de Fleissner (Gamma)',
            icon: Grid3X3,
            top: '65%',
            left: '15%',
            rot: '5deg',
            desc: "Une plaque perforée translucide. Marquage bobine sous UV.",
            symbol: Film,
            holes: [5, 10, 15, 20, 25, 30],
            isAlwaysVisible: false
        },
        {
            id: 'stencil_D',
            label: 'Masque de Fleissner (Delta)',
            icon: Grid3X3,
            top: '70%',
            left: '60%',
            rot: '-5deg',
            desc: "Un masque de décodage endommagé. Marquage clap sous UV.",
            symbol: Clapperboard,
            holes: [1, 2, 4, 6, 7, 9],
            isAlwaysVisible: false
        },
        {
            id: 'polaroid',
            label: 'Photo Polaroid',
            icon: Image,
            top: '45%',
            left: '75%',
            rot: '-15deg',
            desc: "Deux femmes souriantes devant un canyon. 'Pas de retour en arrière' est écrit au dos.",
            isAlwaysVisible: false
        },
        {
            id: 'keys',
            label: 'Clés de Voiture',
            icon: Car,
            top: '35%',
            left: '15%',
            rot: '25deg',
            desc: "Un trousseau de clés Ford avec un porte-clé du Grand Canyon.",
            isAlwaysVisible: false
        }
    ];

    const checkPassword = (e) => {
        e.preventDefault();
        if (password.toUpperCase() === "MEXICO") {
            onSolve();
        } else {
            const form = e.target;
            form.classList.add('animate-shake');
            setTimeout(() => form.classList.remove('animate-shake'), 500);
        }
    };

    return (
        <div className="w-full max-w-5xl animate-fadeIn relative flex flex-col items-center">
            <HintSystem hints={hints} onUseHint={addPenalty} />

            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 text-amber-500 mb-2">
                    <Film size={32} />
                    <h2 className="text-3xl font-bold tracking-widest uppercase">Mouvement II : Projection</h2>
                </div>
                <div className="h-0.5 w-16 bg-amber-700 mx-auto opacity-20"></div>
                <p className="text-[10px] text-slate-500 mt-2 font-mono italic">"Everything is different now."</p>
            </div>

            {/* BARRE D'OUTILS SPECTRE */}
            <div className="w-full flex justify-between items-center mb-6 px-4">
                <div className="flex items-center gap-2 text-slate-600 font-mono text-[10px] uppercase tracking-widest">
                    <Search size={14} />
                    <span>Scan : {uvActive ? 'Ultraviolet' : 'Lumière Naturelle'}</span>
                </div>
                <button
                    onClick={() => setUvActive(!uvActive)}
                    className={`flex items-center gap-3 px-8 py-3 rounded-full border-2 transition-all duration-700 ${
                        uvActive
                            ? 'bg-blue-900/40 border-blue-400 text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <Zap size={18} className={uvActive ? 'animate-pulse' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">
                        {uvActive ? 'Spectre Actif' : 'Activer UV'}
                    </span>
                </button>
            </div>

            {/* TABLE DE MONTAGE */}
            <div className={`relative w-full h-[580px] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-1000 ${
                uvActive ? 'bg-[#05051a]' : 'bg-[#1a1816]'
            }`}>
                <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 z-10 ${
                    uvActive ? 'opacity-100 bg-radial-gradient from-blue-500/10 via-transparent to-transparent' : 'opacity-0'
                }`}></div>

                {items.map(item => {
                    const isVisible = item.isAlwaysVisible || uvActive;
                    if (!isVisible) return null;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setViewedItem(item)}
                            style={{ top: item.top, left: item.left, transform: `rotate(${item.rot})` }}
                            className={`absolute group p-5 backdrop-blur-md rounded-xl transition-all duration-500 hover:scale-110 z-20 ${
                                item.isAlwaysVisible
                                    ? 'bg-amber-950/10 border border-amber-900/20'
                                    : 'bg-blue-900/10 border border-blue-500/20 animate-fadeIn'
                            }`}
                        >
                            <item.icon size={42} className={item.isAlwaysVisible ? 'text-amber-800/60' : 'text-blue-400/60'} />

                            {/* Symbole de synchro sous UV */}
                            {uvActive && item.uvSymbol && (
                                <div className="absolute -top-3 -right-3 p-2 bg-blue-950 border border-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                                    <item.uvSymbol size={16} className="text-blue-400" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* MODAL D'EXAMEN */}
            {viewedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 animate-fadeIn">
                    <div className={`relative bg-slate-900 border-2 p-12 rounded-[2.5rem] max-w-lg w-full transition-all duration-700 ${
                        uvActive ? 'border-blue-500/50 shadow-2xl' : 'border-slate-800'
                    }`}>
                        <button
                            onClick={() => setViewedItem(null)}
                            className="absolute top-8 right-8 text-slate-500 hover:text-white"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col items-center">
                            <h3 className="text-xs font-black text-amber-600 mb-10 uppercase tracking-[0.4em]">{viewedItem.label}</h3>

                            {viewedItem.id === 'main_grid' ? (
                                <div className="grid grid-cols-6 gap-2 bg-black/40 p-6 rounded-2xl border border-slate-800 shadow-inner">
                                    {letterGrid.map((letter, i) => (
                                        <div key={i} className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-300 font-mono text-xl border border-slate-700 rounded-lg">
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                            ) : viewedItem.id.startsWith('stencil') ? (
                                <div className="flex flex-col items-center">
                                    <div className="grid grid-cols-6 gap-2 bg-slate-800/20 p-6 rounded-2xl border border-blue-900/50 relative">
                                        {Array.from({ length: 36 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-10 h-10 rounded-lg border-2 ${
                                                    viewedItem.holes.includes(i)
                                                        ? 'bg-transparent border-blue-400 shadow-[inset_0_0_15px_rgba(96,165,250,0.4)]'
                                                        : 'bg-slate-950 border-slate-900'
                                                }`}
                                            ></div>
                                        ))}
                                        {/* Symbole du masque visible si UV */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-3 bg-blue-950 border border-blue-500 rounded-full shadow-lg">
                                            <viewedItem.symbol size={28} className="text-blue-300" />
                                        </div>
                                    </div>
                                    <p className="mt-10 text-slate-500 text-xs italic text-center leading-relaxed px-6">
                                        {viewedItem.desc}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <viewedItem.icon size={80} className="mx-auto mb-8 text-slate-700" />
                                    <p className="text-slate-400 italic text-lg mb-10 px-6 leading-relaxed">{viewedItem.desc}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setViewedItem(null)}
                                className="mt-10 flex items-center gap-3 text-[10px] font-black text-slate-600 hover:text-amber-500 transition-colors uppercase tracking-[0.2em]"
                            >
                                <ArrowLeft size={14} /> Retour à l'Atelier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TERMINAL DE DÉCRYPTAGE */}
            <div className="mt-12 w-full max-w-sm">
                <form onSubmit={checkPassword} className="relative group">
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="DESTINATION..."
                        className="w-full bg-transparent border-b-2 border-amber-900/30 focus:border-amber-600 py-6 text-center text-4xl text-amber-500 font-mono tracking-[0.4em] focus:outline-none transition-all uppercase placeholder:text-slate-900"
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-slate-800 hover:text-amber-500"
                    >
                        <Key size={32} />
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-[8px] text-slate-700 font-black uppercase tracking-[0.3em]">Cinéma-Logic // Protocol Road-Trip 1.0</span>
                </div>
            </div>
        </div>
    );
}