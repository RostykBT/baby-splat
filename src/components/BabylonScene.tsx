"use client";

import { useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, StandardMaterial, Color3, DirectionalLight, ShadowGenerator, Color4 } from '@babylonjs/core';

const BabylonScene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const cubeRef = useRef<any>(null);
    const [isRotating, setIsRotating] = useState(true);
    const [cubeColor, setCubeColor] = useState('#ff8000');

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create engine
        const engine = new Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        engineRef.current = engine;

        // Create scene
        const scene = new Scene(engine);
        sceneRef.current = scene;
        scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

        // Create camera
        const camera = new ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2.5,
            10,
            Vector3.Zero(),
            scene
        );

        // Attach camera controls to canvas
        camera.attachControl(canvasRef.current);
        camera.wheelDeltaPercentage = 0.01;
        camera.panningSensibility = 1000;

        // Create lights
        const hemisphericLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.4;

        const directionalLight = new DirectionalLight("dirLight", new Vector3(-1, -1, -1), scene);
        directionalLight.position = new Vector3(10, 10, 10);
        directionalLight.intensity = 0.8;

        // Create shadow generator
        const shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        // Create a cube with better geometry
        const cube = MeshBuilder.CreateBox("cube", { size: 2 }, scene);
        cube.position.y = 1;
        cubeRef.current = cube;

        // Create cube material
        const cubeMaterial = new StandardMaterial("cubeMaterial", scene);
        cubeMaterial.diffuseColor = Color3.FromHexString(cubeColor);
        cubeMaterial.specularColor = new Color3(0.8, 0.8, 0.8);
        cubeMaterial.roughness = 0.3;
        cube.material = cubeMaterial;

        // Add cube to shadow generator
        shadowGenerator.getShadowMap()!.renderList!.push(cube);

        // Create ground with better material
        const ground = MeshBuilder.CreateGround("ground", { width: 15, height: 15 }, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.3, 0.3, 0.4);
        groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        groundMaterial.roughness = 0.8;
        ground.material = groundMaterial;
        ground.receiveShadows = true;

        // Create some additional objects for visual interest
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);
        sphere.position = new Vector3(-3, 0.75, 2);
        const sphereMaterial = new StandardMaterial("sphereMaterial", scene);
        sphereMaterial.diffuseColor = new Color3(0.2, 0.7, 1);
        sphereMaterial.specularColor = new Color3(0.9, 0.9, 0.9);
        sphere.material = sphereMaterial;
        shadowGenerator.getShadowMap()!.renderList!.push(sphere);

        const cylinder = MeshBuilder.CreateCylinder("cylinder", { height: 2, diameter: 1 }, scene);
        cylinder.position = new Vector3(3, 1, -1);
        const cylinderMaterial = new StandardMaterial("cylinderMaterial", scene);
        cylinderMaterial.diffuseColor = new Color3(0.8, 0.2, 0.8);
        cylinderMaterial.specularColor = new Color3(0.7, 0.7, 0.7);
        cylinder.material = cylinderMaterial;
        shadowGenerator.getShadowMap()!.renderList!.push(cylinder);

        // Animation loop
        engine.runRenderLoop(() => {
            if (isRotating && cubeRef.current) {
                cubeRef.current.rotation.x += 0.01;
                cubeRef.current.rotation.y += 0.01;
            }

            // Gentle float animation for sphere
            sphere.position.y = 0.75 + Math.sin(Date.now() * 0.003) * 0.3;

            // Gentle rotation for cylinder
            cylinder.rotation.y += 0.005;

            scene.render();
        });

        // Handle window resize
        const handleResize = () => {
            engine.resize();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    // Update cube color when state changes
    useEffect(() => {
        if (cubeRef.current && sceneRef.current) {
            const material = cubeRef.current.material as StandardMaterial;
            if (material) {
                material.diffuseColor = Color3.FromHexString(cubeColor);
            }
        }
    }, [cubeColor]);

    // Toggle rotation
    const toggleRotation = () => {
        setIsRotating(!isRotating);
    };

    // Reset camera position
    const resetCamera = () => {
        if (sceneRef.current) {
            const camera = sceneRef.current.activeCamera as ArcRotateCamera;
            if (camera) {
                camera.setTarget(Vector3.Zero());
                camera.alpha = -Math.PI / 2;
                camera.beta = Math.PI / 2.5;
                camera.radius = 10;
            }
        }
    };

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full outline-none"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Control Panel */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                <h3 className="font-semibold mb-3">Scene Controls</h3>
                <div className="space-y-3">
                    <button
                        onClick={toggleRotation}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${isRotating
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        {isRotating ? 'Pause' : 'Play'} Rotation
                    </button>

                    <button
                        onClick={resetCamera}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                    >
                        Reset Camera
                    </button>

                    <div className="flex flex-col">
                        <label className="text-xs mb-1">Cube Color:</label>
                        <input
                            type="color"
                            value={cubeColor}
                            onChange={(e) => setCubeColor(e.target.value)}
                            className="w-16 h-8 rounded border-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BabylonScene;
