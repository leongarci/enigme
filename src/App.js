// src/App.jsx
import React, { useState, useEffect } from 'react';

/**
 * IMPORTATION DES NIVEAUX
 * Note : Si vous rencontrez des erreurs de résolution dans WebStorm,
 * vérifiez que les fichiers existent bien dans le dossier 'src/levels/'.
 */
import IntroScreen from './levels/IntroScreen';
import OscilloscopeLevel from './levels/Level1_Oscillo';
import CinemaLevel from './levels/Level2_Cinema';
import LibraryLevel from './levels/Level3_Library';
import Level4Shadows from './levels/Level4_Shadows';
import FinalScreen from './levels/FinalScreen';

// Importation des constantes de configuration
import { COLORS, LEVELS } from './data/constants';

export default function App() {
    const [level, setLevel] = useState(LEVELS.INTRO);
    const [gameTime, setGameTime] = useState(0);
    const [penalty, setPenalty] = useState(0);

    // Timer global actif entre l'intro et l'écran final
    useEffect(() => {
        let timer;
        if (level > LEVELS.INTRO && level < LEVELS.FINAL) {
            timer = setInterval(() => setGameTime(t => t + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [level]);

    // Formatage du temps avec ajout des pénalités (5 minutes par erreur)
    const formatTime = (seconds) => {
        const totalSecs = seconds + (penalty * 300);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const nextLevel = () => {
        setLevel(l => l + 1);
        window.scrollTo(0, 0);
    };

    const addPenalty = () => {
        setPenalty(p => p + 1);
    };

    return (
        <div className={`min-h-screen ${COLORS.bg} ${COLORS.text} font-sans selection:bg-amber-900 selection:text-white flex flex-col items-center justify-center p-4 overflow-x-hidden`}>

            {/* AFFICHAGE DU HUD (Heads-Up Display) */}
            <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-40 flex justify-between items-start p-6 pointer-events-none">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Candidat</span>
                    <span className="text-sm font-bold text-amber-500">EULALIE</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                        Chrono {penalty > 0 && <span className="text-red-500">(+{penalty * 5}m)</span>}
                    </span>
                    <span className={`text-xl font-mono font-bold ${penalty > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {formatTime(gameTime)}
                    </span>
                </div>
            </div>

            {/* CONTENEUR PRINCIPAL DES NIVEAUX */}
            <main className="w-full max-w-6xl flex justify-center py-24">
                {level === LEVELS.INTRO && (
                    <IntroScreen onStart={nextLevel} />
                )}

                {level === LEVELS.OSCILLO && (
                    <OscilloscopeLevel onSolve={nextLevel} addPenalty={addPenalty} />
                )}

                {level === LEVELS.CINEMA && (
                    <CinemaLevel onSolve={nextLevel} addPenalty={addPenalty} />
                )}

                {level === LEVELS.LIBRARY && (
                    <LibraryLevel onSolve={nextLevel} addPenalty={addPenalty} />
                )}

                {level === LEVELS.SHADOWS && (
                    <Level4Shadows onSolve={nextLevel} addPenalty={addPenalty} />
                )}

                {level === LEVELS.FINAL && (
                    <FinalScreen timeDisplay={formatTime(gameTime)} />
                )}
            </main>

            {/* Décoration de bas de page */}
            <div className="fixed bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent"></div>
        </div>
    );
}