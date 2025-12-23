// src/levels/Level1_Oscillo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, Grid3X3 } from 'lucide-react';
// Correction de l'importation pour assurer la résolution du chemin dans votre environnement local
import HintSystem from '../components/HintSystem.jsx';

export default function OscilloscopeLevel({ onSolve, addPenalty }) {
    const [password, setPassword] = useState("");
    const [frequency, setFrequency] = useState(440);
    const [taquinSolved, setTaquinSolved] = useState(false);
    const [manualUnlocked, setManualUnlocked] = useState(false);
    const [activeTab, setActiveTab] = useState("taquin");
    const [showSuccess, setShowSuccess] = useState(false);

    const hints = [
        { text: "Le taquin révèle la fréquence de résonance (622 Hz)." },
        { text: "Le câblage (grille 3x3) purifie le signal. Toutes les lampes doivent être allumées simultanément." },
        { text: "Observez les paquets de pics immobiles sur l'écran : comptez combien de crêtes apparaissent dans chaque groupe distinct." }
    ];

    // --- LOGIQUE DU TAQUIN (Mouvement I) ---
    const [grid, setGrid] = useState([2, 5, 1, 3, 4, 7, null, 8, 6]);

    const moveTile = (index) => {
        if (taquinSolved) return;
        const emptyIndex = grid.indexOf(null);
        const isAdjacent =
            (index === emptyIndex - 1 && emptyIndex % 3 !== 0) ||
            (index === emptyIndex + 1 && emptyIndex % 3 !== 2) ||
            (index === emptyIndex - 3) ||
            (index === emptyIndex + 3);

        if (isAdjacent) {
            const newGrid = [...grid];
            newGrid[emptyIndex] = newGrid[index];
            newGrid[index] = null;
            setGrid(newGrid);
            if (JSON.stringify(newGrid) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, null])) setTaquinSolved(true);
        }
    };

    // --- LOGIQUE DU CÂBLAGE (Lights Out 3x3) ---
    // Configuration initiale : mélange spécifique pour garantir la résolution
    const [lights, setLights] = useState([false, true, false, true, true, true, false, true, false]);

    const toggleLight = (index) => {
        if (manualUnlocked) return;

        const newLights = [...lights];
        const toggle = (i) => { if (i >= 0 && i < 9) newLights[i] = !newLights[i]; };

        // Inverse l'état de la cellule cliquée
        toggle(index);

        // Inverse les voisins directs (Haut, Bas, Gauche, Droite)
        toggle(index - 3);
        toggle(index + 3);
        if (index % 3 !== 0) toggle(index - 1);
        if (index % 3 !== 2) toggle(index + 1);

        setLights(newLights);

        // Vérification de la condition de victoire (tous allumés)
        if (newLights.every(light => light === true)) {
            setManualUnlocked(true);
        }
    };

    // --- CANVAS DE L'OSCILLOSCOPE ---
    const canvasRef = useRef(null);
    const showSuccessRef = useRef(showSuccess);
    useEffect(() => { showSuccessRef.current = showSuccess; }, [showSuccess]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frameId;
        let t = 0;

        const render = () => {
            t += 0.1;
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (showSuccessRef.current) {
                const scale = 1 + Math.sin(t * 0.5) * 0.05;
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(scale, scale);
                ctx.fillStyle = '#ec4899';
                ctx.shadowColor = '#ec4899';
                ctx.shadowBlur = 20;
                ctx.font = 'bold 44px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("I LOVE YOU TOO", 0, 0);
                ctx.font = '40px sans-serif';
                ctx.fillText("❤️", 0, 60);
                ctx.restore();
            } else {
                // Grille de fond (CRT)
                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 0; i < canvas.width; i += 20) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
                for (let i = 0; i < canvas.height; i += 20) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
                ctx.stroke();

                const isClose = Math.abs(frequency - 622) < 5;
                ctx.strokeStyle = isClose ? '#10b981' : '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();

                const vFreq = 0.18;
                const period = (2 * Math.PI) / vFreq;

                for (let x = 0; x < canvas.width; x++) {
                    const centerY = canvas.height / 2;
                    let currentGain = 15;
                    let localX = x;

                    if (isClose && manualUnlocked) {
                        // Séquence 1-4-3 positionnée pour la visibilité
                        const start1 = 80;
                        const end1 = start1 + period;
                        const start2 = end1 + 45;
                        const end2 = start2 + period * 4;
                        const start3 = end2 + 45;
                        const end3 = start3 + period * 3;

                        if (x >= start1 && x <= end1) {
                            currentGain = 75;
                            localX = x - start1;
                        } else if (x >= start2 && x <= end2) {
                            currentGain = 75;
                            localX = x - start2;
                        } else if (x >= start3 && x <= end3) {
                            currentGain = 75;
                            localX = x - start3;
                        } else {
                            currentGain = 2;
                        }
                    }

                    // Effet de micro-vibrations analogiques
                    const jitter = (Math.random() - 0.5) * 2;
                    const instability = isClose ? 0 : (Math.random() - 0.5) * 15 * (Math.abs(frequency - 622) / 40);
                    const finalFreq = (isClose && manualUnlocked) ? vFreq : frequency / 1000;

                    // L'onde est immobile horizontalement pour faciliter le comptage
                    const wave = Math.sin(localX * finalFreq) * currentGain;

                    ctx.lineTo(x, centerY + wave + jitter + instability);
                }
                ctx.stroke();

                if (isClose) {
                    ctx.fillStyle = '#10b981';
                    ctx.font = '10px monospace';
                    ctx.fillText(manualUnlocked ? "SIGNAL FIXÉ : COMPTAGE DES CRÊTES POSSIBLE" : "SIGNAL STABILISÉ - FILTRAGE REQUIS", 10, 20);
                }
            }

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [frequency, manualUnlocked]);

    const checkPassword = (e) => {
        e.preventDefault();
        // Le code 143 dérive du nombre de pics (1, 4, puis 3)
        if (password === "143") {
            setShowSuccess(true);
            setTimeout(onSolve, 4500);
        }
    };

    return (
        <div className="w-full max-w-5xl animate-fadeIn relative">
            <HintSystem hints={hints} onUseHint={addPenalty} />

            <div className="flex items-center gap-4 mb-6 text-amber-500 border-b border-amber-900/30 pb-4">
                <Activity size={32} />
                <div>
                    <h2 className="text-3xl font-bold tracking-widest uppercase text-amber-500">Mouvement I : Résonance</h2>
                    <p className="text-xs text-slate-400 font-mono italic">Analysez la structure du signal harmonique purifié.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* PANNEAU DE CONTRÔLE */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                    <div className="flex border-b border-slate-700">
                        <button onClick={() => setActiveTab('taquin')} className={`flex-1 py-4 text-xs font-bold uppercase transition-colors ${activeTab === 'taquin' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}>Calibrage</button>
                        <button onClick={() => setActiveTab('manual')} className={`flex-1 py-4 text-xs font-bold uppercase transition-colors ${activeTab === 'manual' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}>Câblage</button>
                    </div>

                    <div className="flex-1 p-4 flex flex-col items-center justify-center bg-black/20">
                        {activeTab === 'taquin' && (
                            <div className="w-full max-w-[200px]">
                                {taquinSolved ? (
                                    <div className="text-center animate-fadeIn">
                                        <div className="text-emerald-500 font-mono text-xl mb-2 tracking-tighter uppercase font-bold">Cible: 622 Hz</div>
                                        <p className="text-[10px] text-slate-500">Fréquence de résonance identifiée.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded shadow-inner">
                                        {grid.map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => moveTile(i)}
                                                className={`h-16 flex items-center justify-center font-bold text-xl transition-all rounded ${t ? 'bg-amber-700 hover:bg-amber-600 text-white shadow' : 'bg-transparent cursor-default'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'manual' && (
                            <div className="flex flex-col items-center text-center p-2 w-full">
                                <Grid3X3 size={24} className={`mb-4 ${manualUnlocked ? 'text-emerald-500' : 'text-slate-600'}`} />
                                <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-[180px]">
                                    {lights.map((isOn, i) => (
                                        <button
                                            key={i}
                                            onClick={() => toggleLight(i)}
                                            className={`h-12 rounded transition-all duration-300 border-2 ${
                                                isOn
                                                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="text-[10px] font-mono uppercase tracking-widest h-12 leading-relaxed px-2">
                                    {manualUnlocked ? (
                                        <span className="text-emerald-400 animate-pulse font-bold">Signal purifié.<br/>Comptez les pics d'amplitude.</span>
                                    ) : (
                                        <span className="text-slate-500 italic">Rétablissez toutes les connexions lumineuses pour stabiliser le signal.</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ÉCRAN OSCILLOSCOPE */}
                <div className="lg:col-span-2 bg-black border-4 border-slate-800 rounded-xl relative overflow-hidden flex flex-col shadow-2xl">
                    <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-cover" />

                    {!showSuccess && (
                        <div className="absolute bottom-0 left-0 w-full bg-slate-900/95 border-t border-slate-700 p-4 grid grid-cols-2 gap-4 backdrop-blur-sm">
                            <div>
                                <label className="text-[10px] text-amber-500 font-mono block mb-1 uppercase tracking-tighter">Porteuse (Hz)</label>
                                <input type="range" min="300" max="800" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-mono uppercase"><span>Min</span><span>Max</span></div>
                            </div>
                            <div>
                                <form onSubmit={checkPassword} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        maxLength={3}
                                        placeholder="CODE"
                                        className="w-full bg-black border border-slate-600 text-emerald-500 font-mono text-center text-lg focus:outline-none focus:border-emerald-500 placeholder:text-slate-800"
                                    />
                                    <button type="submit" className="px-4 bg-slate-700 text-white text-[10px] font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest rounded">OK</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}