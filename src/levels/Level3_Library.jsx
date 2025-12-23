// src/levels/Level3_Library.jsx
import React, { useState, useEffect } from 'react';
import { Book, ChevronUp, ChevronDown, CheckCircle2, Palette, Info } from 'lucide-react';
import pierrotImg from '../ressources/pierrot.JPG';
import parcImg from '../ressources/parc.JPG';
import duckworthImg from '../ressources/MrsHerbertDuckworth.jpg';
import modeleRougeImg from '../ressources/modeleRouge.jpg';
import montagneImg from '../ressources/montagneSainteVictoire.jpg';

/**
 * NOTE : Importation du système d'indices.
 * Si le fichier n'est pas trouvé dans l'environnement de test,
 * un composant vide est utilisé pour éviter le crash.
 */
let HintSystem;
try {
    // Tentative d'importation réelle
    // import HintSystemComponent from '../components/HintSystem.jsx';
    // HintSystem = HintSystemComponent;

    // Pour l'environnement de prévisualisation, nous utilisons un mock
    HintSystem = ({ hints }) => null;
} catch (e) {
    HintSystem = ({ hints }) => null;
}

// --- CONFIGURATION DES ŒUVRES ---
// Remplacez les chaînes vides dans "imageUrl" par vos chemins de fichiers (ex: "/images/watteau.jpg")
const ARTWORKS_DATA = [
    {
        id: 'watteau',
        title: 'Pierrot',
        author: 'Antoine Watteau',
        imageUrl: pierrotImg
    },
    {
        id: 'gainsborough',
        title: 'Conversation dans un parc',
        author: 'Thomas Gainsborough',
        imageUrl: parcImg
    },
    {
        id: 'cameron',
        title: 'Mrs Herbert Duckworth',
        author: 'Julia Margaret Cameron',
        imageUrl: duckworthImg
    },
    {
        id: 'magritte',
        title: 'Le modèle rouge',
        author: 'René Magritte',
        imageUrl: modeleRougeImg
    },
    {
        id: 'cezanne',
        title: 'La montagne Sainte-Victoire',
        author: 'Paul Cézanne',
        imageUrl: montagneImg
    }
];

export default function LibraryLevel({ onSolve, addPenalty }) {
    // État global du niveau
    const [isCryptexOpen, setIsCryptexOpen] = useState(false);
    const [code, setCode] = useState(['A', 'A', 'A', 'A']);

    // États pour le Quizz d'Art
    const [selectedImage, setSelectedImage] = useState(null);
    const [placements, setPlacements] = useState({
        frame1: null, frame2: null, frame3: null, frame4: null, frame5: null
    });
    const [shuffledImages, setShuffledImages] = useState([]);
    const [isWrong, setIsWrong] = useState(false);

    const hints = [
        { text: "Le Cryptex : Un terme musical essentiel chez Bach. 4 Lettres. 'FUGA'." },
        { text: "Galerie : Observez bien le style de chaque peintre. Magritte est surréaliste, Cézanne joue sur les formes géométriques." },
        { text: "Associez les images aux cadres en cliquant d'abord sur l'œuvre puis sur l'emplacement." }
    ];

    // Mélange initial des images pour la réserve
    useEffect(() => {
        setShuffledImages([...ARTWORKS_DATA].sort(() => Math.random() - 0.5));
    }, []);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const rotate = (index, dir) => {
        const newCode = [...code];
        let i = alphabet.indexOf(newCode[index]);
        if (dir === 1) i = (i + 1) % 26;
        else i = (i - 1 + 26) % 26;
        newCode[index] = alphabet[i];
        setCode(newCode);
    };

    const checkCryptex = () => {
        if (code.join("") === "FUGA") {
            setIsCryptexOpen(true);
        }
    };

    // --- LOGIQUE DU QUIZZ ---
    const handleFrameClick = (frameId) => {
        if (selectedImage) {
            // On place l'image sélectionnée dans le cadre
            const oldImage = placements[frameId];
            setPlacements(prev => ({ ...prev, [frameId]: selectedImage }));

            // On la retire de la réserve
            setShuffledImages(prev => {
                const filtered = prev.filter(img => img.id !== selectedImage.id);
                // Si le cadre avait déjà une image, on remet l'ancienne dans la réserve
                return oldImage ? [...filtered, oldImage] : filtered;
            });

            setSelectedImage(null);
        } else if (placements[frameId]) {
            // On retire l'image du cadre pour la remettre en réserve
            setShuffledImages(prev => [...prev, placements[frameId]]);
            setPlacements(prev => ({ ...prev, [frameId]: null }));
        }
    };

    const validateGallery = () => {
        // Ordre attendu par cadre (frame1 à frame5)
        const correct =
            placements.frame1?.id === 'watteau' &&
            placements.frame2?.id === 'gainsborough' &&
            placements.frame3?.id === 'cameron' &&
            placements.frame4?.id === 'magritte' &&
            placements.frame5?.id === 'cezanne';

        if (correct) {
            onSolve();
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 1000);
        }
    };

    return (
        <div className="w-full max-w-6xl animate-fadeIn flex flex-col items-center">
            <HintSystem hints={hints} onUseHint={addPenalty} />

            <div className="flex items-center gap-3 text-amber-500 mb-12">
                <Book size={40} />
                <h2 className="text-4xl font-bold tracking-[0.2em] uppercase">Mouvement III : La Bibliothèque</h2>
            </div>

            {!isCryptexOpen ? (
                /* --- SECTION 1 : LE CRYPTEX --- */
                <div className="flex flex-col items-center bg-slate-900/50 p-12 rounded-3xl border border-amber-900/30 backdrop-blur-xl shadow-2xl">
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-10 rounded-xl shadow-inner border-y-4 border-amber-700 mb-8">
                        <div className="flex gap-4">
                            {code.map((char, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <button onClick={() => rotate(idx, -1)} className="text-amber-700 hover:text-amber-400 transition-colors mb-2"><ChevronUp size={32}/></button>
                                    <div className="w-16 h-24 bg-amber-50 text-slate-900 font-serif text-5xl font-bold flex items-center justify-center border-x-2 border-amber-200/50 shadow-xl rounded-sm">
                                        {char}
                                    </div>
                                    <button onClick={() => rotate(idx, 1)} className="text-amber-700 hover:text-amber-400 transition-colors mt-2"><ChevronDown size={32}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={checkCryptex}
                        className="px-12 py-4 bg-amber-700 hover:bg-amber-600 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-lg hover:scale-105"
                    >
                        Ouvrir le Grimoire
                    </button>
                    <p className="mt-8 text-slate-500 font-serif italic text-lg opacity-60">"Une fugue vers la connaissance..."</p>
                </div>
            ) : (
                /* --- SECTION 2 : LE QUIZZ D'ART --- */
                <div className="w-full space-y-12 animate-fadeIn pb-20">

                    <div className="text-center bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20 max-w-3xl mx-auto">
                        <p className="text-amber-200 font-serif text-xl italic leading-relaxed">
                            "Le grimoire s'est ouvert sur la Galerie Silencieuse. <br/>
                            Placez chaque chef-d'œuvre dans son cadre attitré."
                        </p>
                    </div>

                    {/* GRILLE DES CADRES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {ARTWORKS_DATA.map((art, idx) => {
                            const frameKey = `frame${idx + 1}`;
                            const isSelectedTarget = selectedImage !== null && placements[frameKey] === null;

                            return (
                                <div key={frameKey} className="flex flex-col items-center">
                                    <div
                                        onClick={() => handleFrameClick(frameKey)}
                                        className={`w-full aspect-[3/4] border-8 rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center justify-center
                                            ${placements[frameKey] ? 'border-[#3d2b1f] shadow-2xl bg-black' : 'border-slate-800 border-dashed bg-slate-900/50 hover:border-amber-900'}
                                            ${isSelectedTarget ? 'ring-4 ring-amber-500 bg-amber-900/20 scale-[1.02]' : ''}
                                            ${isWrong ? 'animate-shake border-red-900' : ''}`}
                                    >
                                        {placements[frameKey] ? (
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={placements[frameKey].imageUrl}
                                                    alt={placements[frameKey].title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=IMAGE+MANQUANTE'; }}
                                                />
                                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                                            </div>
                                        ) : (
                                            <Palette className="text-slate-800 opacity-20" size={48} />
                                        )}
                                    </div>
                                    <div className="mt-4 text-center bg-amber-100/5 p-2 rounded w-full">
                                        <p className="text-amber-500 font-bold text-xs uppercase tracking-tighter leading-tight">{art.title}</p>
                                        <p className="text-slate-500 text-[9px] font-mono uppercase mt-1">{art.author}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RÉSERVE D'IMAGES */}
                    <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"></div>

                        <div className="flex items-center gap-2 mb-6 text-slate-500">
                            <Info size={16} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Réserve d'œuvres (Sélectionnez une image puis un cadre)</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {shuffledImages.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-32 h-40 rounded-sm overflow-hidden transition-all hover:translate-y-[-5px] border-2 
                                        ${selectedImage?.id === img.id ? 'border-amber-500 ring-4 ring-amber-500/20 scale-110 z-10' : 'border-slate-800 hover:border-slate-500'}`}
                                >
                                    <img
                                        src={img.imageUrl}
                                        alt="Candidat"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=IMG'; }}
                                    />
                                </button>
                            ))}
                            {shuffledImages.length === 0 && (
                                <p className="text-slate-600 text-xs italic py-10 uppercase tracking-widest animate-pulse">Tous les tableaux sont exposés.</p>
                            )}
                        </div>
                    </div>

                    {/* BOUTON FINAL */}
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={validateGallery}
                            disabled={Object.values(placements).includes(null)}
                            className="group flex items-center gap-4 px-16 py-6 bg-amber-700 disabled:bg-slate-800 text-white disabled:text-slate-600 font-black uppercase tracking-[0.4em] rounded-sm transition-all hover:bg-amber-600 shadow-2xl disabled:shadow-none hover:tracking-[0.5em]"
                        >
                            <CheckCircle2 size={24} />
                            Fermer le Grimoire
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}