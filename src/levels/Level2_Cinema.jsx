import React, { useState } from 'react';
import {
    Zap, X, ArrowLeft, Key, Grid3X3, Search,
    Camera, Film, Clapperboard, Info
} from 'lucide-react';
import table from '../ressources/table.png';
import brad from '../ressources/brad.jpg';
import voiture from '../ressources/voitureThelma.jpg';
import polaroid from '../ressources/thelma_et_louise.jpg';
/**
 * Pour éviter les erreurs de compilation si les fichiers ne sont pas encore
 * parfaitement indexés par le système, nous utilisons des chemins ou des
 * placeholders temporaires qui permettent au code de s'exécuter.
 */
const tableBg = table; // Texture bois sombre
const voitureImg = voiture; // Voiture classique
const bradImg = brad; // Portrait
const polaroidImg = polaroid; // Amies/Retro

/**
 * Système d'indices local pour garantir la compilation sans dépendances externes
 */
const HintSystemLocal = ({ hints, onUseHint }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-black/50 border border-amber-500/50 rounded-full text-amber-500 hover:bg-amber-500 hover:text-black transition-all shadow-lg"
            >
                <Info size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl animate-fadeIn">
                    <p className="text-[10px] text-amber-500 font-bold uppercase mb-2 tracking-widest">Indices disponibles</p>
                    <div className="space-y-2">
                        {hints.map((h, i) => (
                            <p key={i} className="text-[10px] text-slate-300 border-l-2 border-amber-500 pl-3 leading-relaxed">
                                {h.text}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function CinemaLevel({ onSolve, addPenalty }) {
    const [password, setPassword] = useState("");
    const [uvActive, setUvActive] = useState(false);
    const [viewedItem, setViewedItem] = useState(null);

    const hints = [
        { text: "La plaque métallique contient les lettres. Trouvez le masque de Fleissner qui porte le même symbole UV." },
        { text: "Observez le symbole de foudre (Zap) caché sous UV sur le support des lettres." },
        { text: "Le mot de passe est une destination de voyage célèbre au Sud, mentionnée dans le film." }
    ];

    const letterGrid = [
        'A', 'B', 'N', 'M', 'T', 'K',
        'L', 'P', 'S', 'W', 'Z', 'E',
        'H', 'Q', 'V', 'R', 'Y', 'A',
        'U', 'X', 'D', 'I', 'F', 'G',
        'J', 'B', 'S', 'P', 'L', 'T',
        'C', 'K', 'Q', 'W', 'O', 'M'
    ];

    const items = [
        {
            id: 'main_grid',
            label: 'Plaque de Décodage',
            image: null,
            icon: Grid3X3,
            top: '35%',
            left: '30%',
            rot: '2deg',
            desc: "Une grille de lettres gravées dans l'acier, trouvée près du Grand Canyon.",
            isAlwaysVisible: true,
            uvSymbol: Zap
        },
        {
            id: 'stencil_A',
            label: 'Masque "Rebel"',
            image: bradImg,
            top: '10%',
            left: '65%',
            rot: '-12deg',
            desc: "Un portrait corné de J.D. Un symbole de foudre apparaît sous UV.",
            symbol: Zap,
            holes: [3, 11, 19, 21, 30, 34],
            isAlwaysVisible: false
        },
        {
            id: 'stencil_B',
            label: 'Photo de la Thunderbird',
            image: voitureImg,
            top: '60%',
            left: '10%',
            rot: '8deg',
            desc: "La voiture de Louise. Marquage caméra sous UV.",
            symbol: Camera,
            holes: [0, 8, 16, 24, 32],
            isAlwaysVisible: false
        },
        {
            id: 'polaroid',
            label: 'Le Polaroid Final',
            image: polaroidImg,
            top: '15%',
            left: '10%',
            rot: '-5deg',
            desc: "Thelma et Louise, immortalisées juste avant le départ. Marquage clap sous UV.",
            symbol: Clapperboard,
            holes: [1, 2, 4, 6, 7, 9],
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
            if (addPenalty) addPenalty();
        }
    };

    return (
        <div className="w-full max-w-5xl animate-fadeIn relative flex flex-col items-center min-h-[850px] pb-12">
            <HintSystemLocal hints={hints} onUseHint={addPenalty} />

            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 text-amber-500 mb-2">
                    <Film size={32} />
                    <h2 className="text-3xl font-black tracking-[0.2em] uppercase">Mouvement II : Projection</h2>
                </div>
                <p className="text-[10px] text-slate-500 font-mono italic">"Everything is different now."</p>
            </div>

            {/* BARRE D'OUTILS SPECTRE */}
            <div className="w-full flex justify-between items-center mb-6 px-6">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                    <Search size={14} className={uvActive ? 'text-blue-400' : ''} />
                    <span>Mode : {uvActive ? 'Révélation UV' : 'Lumière Naturelle'}</span>
                </div>
                <button
                    onClick={() => setUvActive(!uvActive)}
                    className={`flex items-center gap-3 px-8 py-3 rounded-full border-2 transition-all duration-700 font-black uppercase tracking-widest text-xs ${
                        uvActive
                            ? 'bg-blue-900/40 border-blue-400 text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-amber-500/50'
                    }`}
                >
                    <Zap size={18} className={uvActive ? 'animate-pulse' : ''} />
                    {uvActive ? 'Lampe UV Active' : 'Allumer Lampe UV'}
                </button>
            </div>

            {/* TABLE DE MONTAGE */}
            <div
                className="relative w-full h-[600px] rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl transition-all duration-1000"
                style={{
                    backgroundImage: `url(${tableBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Filtre UV global */}
                <div className={`absolute inset-0 transition-opacity duration-1000 z-10 pointer-events-none ${
                    uvActive ? 'opacity-100 bg-blue-900/30 mix-blend-color-dodge' : 'opacity-0'
                }`}></div>

                {/* Éléments interactifs */}
                {items.map(item => {
                    const isVisible = item.isAlwaysVisible || uvActive;
                    if (!isVisible) return null;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setViewedItem(item)}
                            style={{ top: item.top, left: item.left, transform: `rotate(${item.rot})` }}
                            className={`absolute group p-1 bg-white shadow-2xl transition-all duration-500 hover:scale-110 hover:z-30 z-20 ${
                                item.isAlwaysVisible ? 'border-4 border-slate-800 rounded-xl p-0 overflow-hidden' : 'p-2 rounded-sm'
                            }`}
                        >
                            {item.image ? (
                                <div className="relative">
                                    <img
                                        src={item.image}
                                        alt={item.label}
                                        className={`w-24 h-32 object-cover transition-all ${uvActive ? 'brightness-75 contrast-125' : 'grayscale-[0.3]'}`}
                                    />
                                    {uvActive && item.symbol && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/40 animate-pulse">
                                            <item.symbol size={32} className="text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-48 h-48 bg-slate-800 flex items-center justify-center relative">
                                    <item.icon size={48} className="text-slate-600" />
                                    {uvActive && item.uvSymbol && (
                                        <div className="absolute top-2 right-2 p-1 bg-blue-500 rounded-full shadow-lg">
                                            <item.uvSymbol size={16} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* MODAL D'EXAMEN DES OBJETS */}
            {viewedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fadeIn">
                    <div className="relative bg-slate-900 border-2 border-slate-800 p-12 rounded-[3rem] max-w-xl w-full shadow-2xl overflow-hidden">
                        {/* Décoration UV dans le modal */}
                        {uvActive && <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />}

                        <button
                            onClick={() => setViewedItem(null)}
                            className="absolute top-8 right-8 text-slate-500 hover:text-amber-500 transition-colors z-50"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col items-center relative z-10">
                            <h3 className="text-[10px] font-black text-amber-600 mb-8 uppercase tracking-[0.4em]">{viewedItem.label}</h3>

                            {viewedItem.id === 'main_grid' ? (
                                <div className="grid grid-cols-6 gap-2 bg-black/60 p-6 rounded-2xl border border-slate-800 shadow-inner">
                                    {letterGrid.map((letter, i) => (
                                        <div key={i} className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-300 font-mono text-xl border border-slate-700 rounded-lg">
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    {viewedItem.holes ? (
                                        <div className="relative p-2 bg-slate-800/40 rounded-2xl border border-blue-900/30">
                                            <div className="grid grid-cols-6 gap-2">
                                                {Array.from({ length: 36 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-10 h-10 rounded-lg border-2 ${
                                                            viewedItem.holes.includes(i)
                                                                ? 'bg-transparent border-blue-400 shadow-[inset_0_0_15px_rgba(96,165,250,0.3)]'
                                                                : 'bg-slate-950 border-slate-900'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            {uvActive && viewedItem.symbol && (
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-blue-900 border border-blue-400 rounded-full shadow-xl">
                                                    <viewedItem.symbol size={24} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <img
                                            src={viewedItem.image}
                                            alt=""
                                            className="w-64 h-80 object-cover rounded-2xl shadow-2xl border-4 border-slate-800 mb-6 grayscale-[0.2]"
                                        />
                                    )}
                                    <p className="mt-8 text-slate-400 text-xs italic text-center leading-relaxed px-10">
                                        {viewedItem.desc}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setViewedItem(null)}
                                className="mt-10 flex items-center gap-3 text-[10px] font-black text-slate-600 hover:text-amber-500 transition-colors uppercase tracking-[0.2em]"
                            >
                                <ArrowLeft size={14} /> Revenir à l'enquête
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ZONE DE RÉPONSE FINALE */}
            <div className="mt-12 w-full max-w-sm">
                <form onSubmit={checkPassword} className="relative group">
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="DESTINATION..."
                        className="w-full bg-transparent border-b-2 border-amber-900/30 focus:border-amber-600 py-6 text-center text-3xl text-amber-500 font-mono tracking-[0.3em] focus:outline-none transition-all uppercase placeholder:text-slate-800"
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-slate-700 hover:text-amber-500 transition-colors"
                    >
                        <Key size={32} />
                    </button>
                </form>
            </div>
        </div>
    );
}