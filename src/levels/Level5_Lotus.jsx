import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Film, Book, Flower2, MapPin, CheckCircle2, Play, RotateCcw, Heart, AlertTriangle, Keyboard, MousePointer2 } from 'lucide-react';

/**
 * NIVEAU 5 : L'ÉCHO DE L'ORCHESTRE
 * Version optimisée pour mobile et desktop : déclenchement par clic ou touche.
 */
export default function Level5Lotus({ onSolve }) {
    const [gameState, setGameState] = useState('start'); // 'start', 'ready', 'countdown', 'playing', 'complete', 'failed'
    const [countdown, setCountdown] = useState(3);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [revealedSegments, setRevealedSegments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [finalAnswer, setFinalAnswer] = useState('');
    const [error, setError] = useState(false);
    const [activeLanes, setActiveLanes] = useState({});

    const scoreRef = useRef(0);
    const livesRef = useRef(3);
    const comboRef = useRef(0);
    const audioCtx = useRef(null);
    const requestRef = useRef();
    const lastNoteTime = useRef(0);
    const notesRef = useRef([]);
    const keysPressed = useRef({});

    const TARGET_SCORE = 2000;
    const HIT_ZONE_Y = 85;
    const HIT_THRESHOLD = 12;
    const COORDS = "48.4551903, 6.6607153";
    const SEGMENTS = ["48.45", "51903", ", 6.66", "07153"];

    const lanes = [
        { id: 'cinema', icon: <Film size={24} />, color: 'text-blue-400', key: 'D', code: 'KeyD', freq: 523.25 },
        { id: 'music', icon: <Music size={24} />, color: 'text-amber-400', key: 'F', code: 'KeyF', freq: 587.33 },
        { id: 'nature', icon: <Flower2 size={24} />, color: 'text-orange-400', key: 'J', code: 'KeyJ', freq: 659.25 },
        { id: 'reading', icon: <Book size={24} />, color: 'text-emerald-400', key: 'K', code: 'KeyK', freq: 783.99 }
    ];

    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playTone = (freq, volume = 0.15, duration = 0.5) => {
        if (!audioCtx.current) return;
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
        gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
        gain.gain.linearRampToValueAtTime(volume, audioCtx.current.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + duration);
    };

    const handleHit = useCallback((laneIndex) => {
        let hitFound = false;
        const targetNotes = notesRef.current
            .filter(n => n.lane === laneIndex && !n.hit && !n.missed)
            .sort((a, b) => b.y - a.y);

        if (targetNotes.length > 0) {
            const nearestNote = targetNotes[0];
            const distance = Math.abs(nearestNote.y - HIT_ZONE_Y);

            if (distance < HIT_THRESHOLD) {
                hitFound = true;
                nearestNote.hit = true;
                playTone(lanes[laneIndex].freq);
                scoreRef.current += 100 + (comboRef.current * 10);
                comboRef.current += 1;
                setScore(scoreRef.current);
                setCombo(comboRef.current);
                setNotes([...notesRef.current]);
            }
        }
        if (!hitFound) {
            comboRef.current = 0;
            setCombo(0);
        }
    }, [lanes]);

    const prepareGame = () => {
        initAudio();
        setGameState('ready');
    };

    const startCountdown = () => {
        if (gameState !== 'ready') return;
        setGameState('countdown');
        setCountdown(3);
    };

    useEffect(() => {
        if (gameState === 'countdown') {
            if (countdown > 0) {
                playTone(440, 0.05, 0.1);
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                playTone(880, 0.1, 0.3);
                setGameState('playing');
                scoreRef.current = 0;
                livesRef.current = 3;
                comboRef.current = 0;
                notesRef.current = [];
                keysPressed.current = {};
                setScore(0);
                setLives(3);
                setCombo(0);
                setNotes([]);
                setRevealedSegments([]);
                lastNoteTime.current = performance.now();
            }
        }
    }, [gameState, countdown]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const loop = (time) => {
            const spawnRate = Math.max(450, 850 - (scoreRef.current / 12));
            if (time - lastNoteTime.current > spawnRate) {
                const laneIndex = Math.floor(Math.random() * lanes.length);
                notesRef.current.push({ id: Math.random(), lane: laneIndex, y: -10, hit: false, missed: false });
                lastNoteTime.current = time;
            }
            let updatedLives = livesRef.current;
            notesRef.current = notesRef.current.map(n => {
                const nextY = n.y + 0.85;
                if (!n.hit && !n.missed && nextY > HIT_ZONE_Y + HIT_THRESHOLD) {
                    updatedLives -= 1;
                    return { ...n, y: nextY, missed: true };
                }
                return { ...n, y: nextY };
            });
            if (updatedLives !== livesRef.current) {
                livesRef.current = updatedLives;
                setLives(updatedLives);
                comboRef.current = 0;
                setCombo(0);
                if (updatedLives <= 0) { setGameState('failed'); return; }
            }
            notesRef.current = notesRef.current.filter(n => n.y < 110 && !n.hit);
            setNotes([...notesRef.current]);
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, lanes.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (keysPressed.current[e.code]) return;
            keysPressed.current[e.code] = true;
            if (gameState === 'ready') {
                if (lanes.some(l => l.code === e.code)) startCountdown();
                return;
            }
            if (gameState !== 'playing') return;
            const laneIndex = lanes.findIndex(l => l.code === e.code);
            if (laneIndex !== -1) {
                e.preventDefault();
                setActiveLanes(prev => ({ ...prev, [laneIndex]: true }));
                handleHit(laneIndex);
            }
        };
        const handleKeyUp = (e) => {
            keysPressed.current[e.code] = false;
            const laneIndex = lanes.findIndex(l => l.code === e.code);
            if (laneIndex !== -1) setActiveLanes(prev => ({ ...prev, [laneIndex]: false }));
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState, handleHit, lanes]);

    useEffect(() => {
        const segmentCount = Math.floor((score / TARGET_SCORE) * SEGMENTS.length);
        if (segmentCount > revealedSegments.length) setRevealedSegments(SEGMENTS.slice(0, segmentCount));
        if (score >= TARGET_SCORE) setGameState('complete');
    }, [score, revealedSegments.length]);

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const clean = finalAnswer.trim().toLowerCase();
        if (clean === 'bleu' || clean === 'le bleu') onSolve();
        else { setError(true); setTimeout(() => setError(false), 800); }
    };

    const renderOverlay = () => {
        if (gameState === 'ready') {
            return (
                <div
                    onClick={startCountdown}
                    className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl animate-fadeIn cursor-pointer group"
                >
                    <div className="bg-slate-900 border-2 border-amber-500 p-8 rounded-3xl text-center shadow-2xl max-w-sm transition-transform group-hover:scale-105 active:scale-95">
                        <div className="flex justify-center gap-4 mb-4 text-amber-500">
                            <Keyboard size={32} />
                            <MousePointer2 size={32} />
                        </div>
                        <h3 className="text-white text-lg font-bold mb-2 uppercase tracking-tighter">Installation du pupitre</h3>
                        <p className="text-slate-400 mb-6 text-xs leading-relaxed">
                            Place tes mains sur les touches <b>D F J K</b> <br/>
                            ou prépare-toi à tapoter les colonnes.
                        </p>
                        <div className="bg-amber-500 text-slate-950 font-black text-[10px] py-2 px-4 rounded-full animate-pulse uppercase tracking-widest inline-block">
                            Clique ou appuie sur une touche
                        </div>
                    </div>
                </div>
            );
        }
        if (gameState === 'countdown') {
            return (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-3xl">
                    <div className="text-9xl font-black text-amber-500 animate-ping drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                        {countdown > 0 ? countdown : "GO!"}
                    </div>
                </div>
            );
        }
        if (gameState === 'failed') {
            return (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-3xl animate-fadeIn">
                    <div className="text-center p-10">
                        <AlertTriangle className="text-red-500 mx-auto mb-6" size={48} />
                        <h3 className="text-white text-2xl font-bold mb-2 uppercase">Dissonance !</h3>
                        <button onClick={prepareGame} className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest mx-auto hover:bg-amber-500 transition-all shadow-lg">
                            <RotateCcw size={20} /> Réessayer
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 animate-fadeIn select-none font-sans">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-amber-500 uppercase tracking-widest italic">L'Écho de l'Orchestre</h2>
                <div className="flex justify-center gap-10 mt-4">
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase font-bold">Score</p><p className="text-xl font-mono text-white">{score.toLocaleString()}</p></div>
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase font-bold">Vies</p><div className="flex gap-1 mt-1 justify-center">{[...Array(3)].map((_, i) => (<Heart key={i} size={16} className={i < lives ? "fill-red-500 text-red-500" : "text-slate-800"} />))}</div></div>
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase font-bold">Combo</p><p className="text-xl font-mono text-amber-500">x{combo}</p></div>
                </div>
            </div>

            {gameState === 'start' && (
                <div className="bg-slate-900/90 border-2 border-slate-800 p-10 rounded-3xl text-center backdrop-blur-md">
                    <Music className="text-amber-500 mx-auto mb-6" size={48} />
                    <p className="text-slate-300 mb-8 leading-relaxed">Eulalie, la partition défile. <br/> L'audition va bientôt commencer. Prépare ton souffle.</p>
                    <button onClick={prepareGame} className="bg-amber-600 hover:bg-amber-50 text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl transition-all">Entrer en scène</button>
                </div>
            )}

            {(gameState === 'ready' || gameState === 'countdown' || gameState === 'playing' || gameState === 'failed') && (
                <div className="relative flex flex-col gap-6">
                    {renderOverlay()}
                    <div className="flex justify-center gap-2 font-mono text-lg bg-black/60 p-4 rounded-2xl border border-slate-800">
                        {SEGMENTS.map((seg, i) => (<span key={i} className={revealedSegments.includes(seg) ? "text-amber-500 animate-pulse" : "text-slate-800"}>{revealedSegments.includes(seg) ? seg : "???"}</span>))}
                    </div>
                    <div className="relative h-[500px] bg-slate-950 rounded-3xl border-2 border-slate-900 overflow-hidden flex shadow-inner">
                        <div className="absolute left-0 right-0 h-1 bg-red-600/80 shadow-[0_0_15px_rgba(220,38,38,0.7)] z-50 pointer-events-none" style={{ top: `${HIT_ZONE_Y}%` }} />
                        {lanes.map((lane, i) => (
                            <div
                                key={lane.id}
                                onMouseDown={() => { if (gameState === 'playing') { setActiveLanes(p => ({...p, [i]: true})); handleHit(i); } }}
                                onMouseUp={() => setActiveLanes(p => ({...p, [i]: false}))}
                                onMouseLeave={() => setActiveLanes(p => ({...p, [i]: false}))}
                                onTouchStart={(e) => { e.preventDefault(); if (gameState === 'playing') { setActiveLanes(p => ({...p, [i]: true})); handleHit(i); } }}
                                onTouchEnd={() => setActiveLanes(p => ({...p, [i]: false}))}
                                className="flex-1 border-r border-white/5 last:border-r-0 relative group transition-colors cursor-pointer"
                            >
                                <div className={`absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-75 z-10 pointer-events-none ${activeLanes[i] ? 'border-amber-400 bg-amber-400/20 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'border-slate-800 text-slate-700'}`} style={{ top: `${HIT_ZONE_Y}%`, transform: 'translate(-50%, -50%)' }}>
                                    <span className={`text-xs font-black ${activeLanes[i] ? 'text-amber-400' : ''}`}>{lane.key}</span>
                                </div>
                                {notes.filter(n => n.lane === i).map(n => (
                                    <div key={n.id} className={`absolute left-1/2 -translate-x-1/2 z-40 ${lane.color}`} style={{ top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}>
                                        <div className="p-3 bg-slate-900 rounded-full border-2 border-current shadow-lg transform active:scale-95">{lane.icon}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'complete' && (
                <div className="bg-slate-900 border-2 border-amber-500 p-8 rounded-3xl text-center shadow-2xl animate-scaleIn">
                    <MapPin className="text-amber-500 mx-auto mb-6" size={40} />
                    <h3 className="text-white font-black uppercase mb-1 text-xl">Harmonie Atteinte</h3>
                    <div className="text-2xl font-mono text-amber-500 mb-8 bg-black/50 py-4 rounded-xl border border-amber-500/20">{COORDS}</div>
                    <form onSubmit={handleFinalSubmit} className="space-y-4 max-w-sm mx-auto">
                        <label className="block text-amber-500 text-[10px] font-black uppercase tracking-widest text-center">Quelle est la couleur du lotus ?</label>
                        <input type="text" value={finalAnswer} onChange={(e) => setFinalAnswer(e.target.value)} className={`w-full bg-slate-950 border-2 rounded-xl px-4 py-4 text-center text-white outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'border-amber-500/30 focus:border-amber-500'}`} placeholder="Ta réponse..." autoFocus />
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-50 text-white font-bold py-4 rounded-xl uppercase text-sm shadow-lg transition-all">Valider le secret</button>
                    </form>
                </div>
            )}
        </div>
    );
}