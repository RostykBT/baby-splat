"use client";

import { useEffect, useRef } from 'react';
import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    MeshBuilder,
    SceneLoader,
    Color4
} from '@babylonjs/core';
import '@babylonjs/loaders';
import Stats from 'stats.js';

const GaussianPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const statsRef = useRef<Stats | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const createScene = async function () {
            const canvas = canvasRef.current!;
            const engine = new Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
            engineRef.current = engine;

            // Initialize Stats.js
            const stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '0px';
            stats.dom.style.top = '0px';
            stats.dom.style.zIndex = '100';
            document.body.appendChild(stats.dom);
            statsRef.current = stats;

            // This creates a basic Babylon Scene object (non-mesh)
            const scene = new Scene(engine);
            sceneRef.current = scene;
            scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

            // This creates and positions a free camera (non-mesh)
            const camera = new ArcRotateCamera("camera1", -1, 1, 10, new Vector3(0, 0, 0), scene);

            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            // const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

            // Default intensity is 1. Let's dim the light a small amount
            // light.intensity = 0.7;

            // Our built-in 'sphere' shape.
            const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1, segments: 32 }, scene);

            // Move the sphere upward 1/2 its height
            sphere.position.y = 0.5;
            sphere.position.z = -1;

            // Our built-in 'ground' shape.
            const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

            // Gaussian Splatting - using local file from public folder
            try {
                const result = await SceneLoader.ImportMeshAsync(null, "/", "input.splat", scene); if (result.meshes && result.meshes.length > 0) {
                    result.meshes[0].position.y = 1.7;
                    result.meshes[0].rotation.x = Math.PI / 2 * 3; // 90 degrees rotation along X-axis
                    // result.meshes[0].rotation.z = Math.PI; // 180 degrees rotation along Y-axis

                    console.log("Gaussian splat loaded successfully!");
                }
            } catch (error) {
                console.error("Error loading Gaussian splat:", error);
                // Fallback to online splat if local file fails
                try {
                    const fallbackResult = await SceneLoader.ImportMeshAsync(
                        null,
                        "https://raw.githubusercontent.com/CedricGuillemet/dump/master/",
                        "Halo_Believe.splat",
                        scene
                    );
                    if (fallbackResult.meshes && fallbackResult.meshes.length > 0) {
                        fallbackResult.meshes[0].position.y = 1.7;
                        fallbackResult.meshes[0].rotation.x = Math.PI / 2; // 90 degrees rotation along X-axis
                        // fallbackResult.meshes[0].rotation.z = Math.PI; // 180 degrees rotation along Y-axis
                        console.log("Fallback splat loaded successfully!");
                    }
                } catch (fallbackError) {
                    console.error("Error loading fallback splat:", fallbackError);
                }
            }

            // Start render loop
            engine.runRenderLoop(() => {
                stats.begin();
                scene.render();
                stats.end();
            });

            return scene;
        };

        createScene();

        // Handle window resize
        const handleResize = () => {
            if (engineRef.current) {
                engineRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (statsRef.current) {
                document.body.removeChild(statsRef.current.dom);
            }
            if (sceneRef.current) {
                sceneRef.current.dispose();
            }
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
    }, []);

    return (
        <div className="w-full h-screen">
            <canvas
                ref={canvasRef}
                className="w-full h-full outline-none"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default GaussianPage;