import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import oeillet from '../ressources/oeillet.jpg';

const OEILLET_IMAGE_URL = oeillet;

export default function Level4Shadows({ onSolve }) {
    const containerRef = useRef(null);

    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        /* =====================
           SCÈNE & CAMÉRA
        ====================== */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f8fafc');

        const perfectEye = new THREE.Vector3(18, 10, 42);
        const startEye   = new THREE.Vector3(-40, 25, 30);
        const imagePlaneZ = 25;

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 300);
        camera.position.copy(startEye);
        camera.lookAt(0, 0, imagePlaneZ);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.target.set(0, 0, imagePlaneZ);

        /* =====================
           LUMIÈRES
        ====================== */
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(1, 1, 1);
        scene.add(keyLight);

        /* =====================
           ANAMORPHOSE CORRIGÉE
           (pas de trous, pas de traversée)
        ====================== */
        const loader = new THREE.TextureLoader();
        loader.load(OEILLET_IMAGE_URL, texture => {
            const size = 16;          // densité suffisante
            const spacing = 1.0;      // pas de trou entre fragments

            // Géométrie PLANE pour garantir la continuité visuelle
            const geo = new THREE.PlaneGeometry(0.95, 0.95);

            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {

                    const target = new THREE.Vector3(
                        (col - size / 2) * spacing,
                        (row - size / 2) * spacing,
                        imagePlaneZ
                    );

                    const dir = target.clone().sub(perfectEye).normalize();

                    // profondeur contrôlée → pas de "couloir" vide
                    const t = THREE.MathUtils.lerp(0.45, 1.0, Math.random());
                    const position = perfectEye.clone().add(dir.multiplyScalar(45 * t));

                    const tex = texture.clone();
                    tex.needsUpdate = true;
                    tex.repeat.set(1 / size, 1 / size);
                    tex.offset.set(col / size, 1 - (row + 1) / size);

                    const mat = new THREE.MeshStandardMaterial({
                        map: tex,
                        transparent: true,
                        alphaTest: 0.05,   // évite les trous de transparence
                        side: THREE.DoubleSide,
                        roughness: 0.4,
                        metalness: 0.0
                    });

                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.copy(position);
                    mesh.lookAt(perfectEye);

                    scene.add(mesh);
                }
            }
        });

        /* =====================
           ANIMATION
        ====================== */
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        /* =====================
           CLEANUP
        ====================== */
        const handleResize = () => {
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            controls.dispose();
            cancelAnimationFrame(animationId);
            if (containerRef.current) containerRef.current.innerHTML = '';
            renderer.dispose();
        };
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === 'oeillet') {
            onSolve && onSolve();
        } else {
            setError(true);
            setTimeout(() => setError(false), 600);
        }
    };

    return (
        <div className="w-full h-screen bg-[#f8fafc] relative flex flex-col overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
            <div ref={containerRef} className="flex-1 cursor-grab active:cursor-grabbing" />

            <form
                onSubmit={handleSubmit}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-6"
            >
                <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Identifier l'objet…"
                    className={`w-full bg-white text-slate-800 border-2 px-8 py-4 rounded-2xl text-center text-lg tracking-widest outline-none shadow-xl transition-all ${error ? 'border-red-400 animate-shake' : 'border-slate-300 focus:border-slate-600'}`}
                />
            </form>
        </div>
    );
}
