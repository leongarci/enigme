import React, { useEffect, useRef, useState } from 'react';
import oeillet from '../ressources/oeillet.jpg';
/**
 * NIVEAU 4 : L'ANAMORPHOSE (Version Canvas 2D)
 * Version haute sensibilité pour une précision chirurgicale.
 * Correction de l'erreur d'importation de ressources.
 */
export default function Level4Shadows({ onSolve }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const [isNear, setIsNear] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Paramètres de l'énigme - Cible déplacée pour être moins évidente
    const targetX = 0.75;
    const targetY = 0.25;

    // Position de départ éloignée de la cible
    const startX = 0.15;
    const startY = 0.85;

    const mousePos = useRef({ x: startX, y: startY });
    const currentView = useRef({ x: startX, y: startY });

    // Utilisation d'un chemin relatif en chaîne de caractères pour éviter les erreurs de résolution au build
    const IMAGE_SRC = oeillet;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // On tente de charger l'image locale via le chemin relatif standard
        img.src = IMAGE_SRC;

        img.onerror = () => {
            console.warn("Image locale non trouvée à l'exécution, génération d'un substitut visuel.");
            createFallbackPattern();
        };

        const createFallbackPattern = () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 400;
            tempCanvas.height = 400;
            const tCtx = tempCanvas.getContext('2d');

            // Fond sombre
            tCtx.fillStyle = '#0f172a';
            tCtx.fillRect(0, 0, 400, 400);

            // Dessin d'un oeillet stylisé (orange et rouge)
            tCtx.fillStyle = '#f97316';
            for(let i=0; i<16; i++) {
                tCtx.beginPath();
                tCtx.ellipse(200, 200, 140, 50, (i * Math.PI) / 8, 0, Math.PI * 2);
                tCtx.fill();
            }
            tCtx.fillStyle = '#7c2d12';
            tCtx.beginPath();
            tCtx.arc(200, 200, 45, 0, Math.PI * 2);
            tCtx.fill();

            img.src = tempCanvas.toDataURL();
        };

        img.onload = () => {
            setImageLoaded(true);
        };

        const shards = [];
        const gridSize = 12;

        // Initialisation des fragments avec des profondeurs (Z) variées
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                shards.push({
                    u: x / gridSize,
                    v: y / gridSize,
                    w: 1 / gridSize,
                    h: 1 / gridSize,
                    z: (Math.random() - 0.5) * 800
                });
            }
        }

        let animationFrameId;

        const render = () => {
            if (!containerRef.current || !canvas) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // Amortissement du mouvement pour un feeling fluide
            currentView.current.x += (mousePos.current.x - currentView.current.x) * 0.08;
            currentView.current.y += (mousePos.current.y - currentView.current.y) * 0.08;

            ctx.clearRect(0, 0, width, height);

            // Calcul de la distance à la cible
            const dx = currentView.current.x - targetX;
            const dy = currentView.current.y - targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Zone de succès très précise
            const successThreshold = 0.018;
            setIsNear(dist < successThreshold);

            const centerX = width / 2;
            const centerY = height / 2;
            const baseSize = Math.min(width, height) * 0.65;

            // Dessin des fragments
            shards.forEach(shard => {
                const sensitivity = 5.0;
                const perspectiveFactor = dist * shard.z * sensitivity;

                const drawX = centerX + (shard.u - 0.5) * baseSize + (currentView.current.x - targetX) * perspectiveFactor;
                const drawY = centerY + (shard.v - 0.5) * baseSize + (currentView.current.y - targetY) * perspectiveFactor;

                const sW = shard.w * baseSize;
                const sH = shard.h * baseSize;

                ctx.save();
                ctx.translate(drawX + sW/2, drawY + sH/2);

                // La rotation dépend aussi de la distance à la cible
                ctx.rotate(dist * (shard.z / 60));

                if (imageLoaded) {
                    ctx.drawImage(
                        img,
                        shard.u * img.width, shard.v * img.height, shard.w * img.width, shard.h * img.height,
                        -sW/2, -sH/2, sW + 0.5, sH + 0.5
                    );
                } else {
                    ctx.fillStyle = `rgba(249, 115, 22, ${0.4 + Math.random() * 0.3})`;
                    ctx.fillRect(-sW/2, -sH/2, sW, sH);
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        const handleMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            mousePos.current = {
                x: (x - rect.left) / rect.width,
                y: (y - rect.top) / rect.height
            };
        };

        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('touchmove', handleMove, { passive: false });

        render();

        return () => {
            canvas.removeEventListener('mousemove', handleMove);
            canvas.removeEventListener('touchmove', handleMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [imageLoaded]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = answer.trim().toLowerCase();
        if (['oeillet', "oeillet d'inde", "œillet", "oeillets d'inde", "oeillet dinde"].includes(val)) {
            onSolve();
        } else {
            setError(true);
            setTimeout(() => setError(false), 600);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-[600px] bg-slate-950 relative flex flex-col overflow-hidden rounded-3xl border-4 border-slate-800 shadow-2xl">
            {/* Feedback visuel de succès imminent */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 bg-amber-500/10 ${isNear ? 'opacity-100' : 'opacity-0'}`} />

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4 pointer-events-none select-none">
                <h3 className="text-amber-500 font-black uppercase tracking-[0.4em] text-sm mb-1">Mouvement IV : Perspective</h3>
                <p className="text-slate-500 text-[10px] uppercase font-mono italic">"Ajustez votre regard pour aligner les fragments de l'esprit."</p>
            </div>

            <canvas
                ref={canvasRef}
                className="flex-1 cursor-none touch-none"
            />

            {/* Curseur personnalisé */}
            {!isNear && (
                <div
                    className="absolute pointer-events-none z-40 w-4 h-4 border border-amber-500/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                    style={{ left: `${mousePos.current.x * 100}%`, top: `${mousePos.current.y * 100}%` }}
                />
            )}

            <form
                onSubmit={handleSubmit}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-6"
            >
                <div className="relative group">
                    <input
                        type="text"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Quel objet se reforme ?"
                        className={`w-full bg-slate-900/95 text-amber-50 border-2 px-8 py-4 rounded-2xl text-center text-lg tracking-widest outline-none shadow-2xl transition-all ${error ? 'border-red-500 animate-shake' : 'border-amber-900/50 focus:border-amber-500'}`}
                    />
                    {isNear && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter whitespace-nowrap">Focus Absolu !</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}