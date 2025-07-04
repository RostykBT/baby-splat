"use client";

import { useEffect, useRef } from 'react';
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    Color4,
    SceneLoader
} from '@babylonjs/core';
import { AdvancedDynamicTexture, Grid, Button, Control } from '@babylonjs/gui';
import '@babylonjs/loaders/glTF';

interface GaussianSplattingSceneProps {
    className?: string;
}

const GaussianSplattingScene = ({ className = "w-full h-full" }: GaussianSplattingSceneProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const createScene = async function () {
            const canvas = canvasRef.current!;
            const engine = new Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
            engineRef.current = engine;

            // This creates a basic Babylon Scene object (non-mesh)
            const scene = new Scene(engine);
            sceneRef.current = scene;
            scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

            // This creates and positions a free camera (non-mesh)
            const camera = new ArcRotateCamera("camera1", -0.8, 1.2, 10, new Vector3(0, 0, 0), scene);
            camera.wheelPrecision = 100;
            camera.inertia = 0.97;

            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);

            let gs: any;
            let index = 0;
            const loadGS = async function () {
                gs?.dispose();

                const scenes = [
                    "gs_Sqwakers_trimed.splat",
                    "gs_Skull.splat",
                    "gs_Plants.splat",
                    "gs_Fire_Pit.splat"
                ];
                const cameraRadii = [5, 5, 7, 9];
                const cameraAlphas = [-0.8, 2.9, -0.9, 0.8];

                try {
                    const result = await SceneLoader.ImportMeshAsync(
                        null,
                        "https://assets.babylonjs.com/splats/",
                        scenes[index],
                        scene
                    );
                    gs = result.meshes[0];
                    camera.radius = cameraRadii[index];
                    camera.alpha = cameraAlphas[index];
                } catch (error) {
                    console.error("Error loading Gaussian Splat:", error);
                }
            };

            await loadGS();

            // GUI
            const guiLayer = AdvancedDynamicTexture.CreateFullscreenUI("guiLayer");
            const guiContainer = new Grid();
            guiContainer.name = "uiGrid";
            guiContainer.addRowDefinition(1, false);
            guiContainer.addColumnDefinition(1 / 3, false);
            guiContainer.addColumnDefinition(1 / 3, false);
            guiContainer.addColumnDefinition(1 / 3, false);
            guiContainer.paddingTop = "50px";
            guiContainer.paddingLeft = "50px";
            guiContainer.paddingRight = "50px";
            guiContainer.paddingBottom = "50px";
            guiLayer.addControl(guiContainer);

            const leftBtn = Button.CreateImageOnlyButton(
                "left",
                "https://models.babylonjs.com/Demos/weaponsDemo/textures/leftButton.png"
            );
            leftBtn.width = "55px";
            leftBtn.height = "55px";
            leftBtn.thickness = 0;
            leftBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            leftBtn.onPointerClickObservable.add(() => {
                index += 3;
                index %= 4;
                loadGS();
            });

            const rightBtn = Button.CreateImageOnlyButton(
                "right",
                "https://models.babylonjs.com/Demos/weaponsDemo/textures/rightButton.png"
            );
            rightBtn.width = "55px";
            rightBtn.height = "55px";
            rightBtn.thickness = 0;
            rightBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            rightBtn.onPointerClickObservable.add(() => {
                index++;
                index %= 4;
                loadGS();
            });

            // add button to GUI
            guiContainer.addControl(leftBtn, 0, 0);
            guiContainer.addControl(rightBtn, 0, 2);

            // display loading screen while loading assets
            engine.displayLoadingUI();
            scene.executeWhenReady(function () {
                engine.hideLoadingUI();
            });

            scene.onBeforeRenderObservable.add(() => {
                camera.beta = Math.min(camera.beta, 1.45);
                camera.radius = Math.max(camera.radius, 3.);
                camera.radius = Math.min(camera.radius, 6.);
            });

            // Start render loop
            engine.runRenderLoop(() => {
                scene.render();
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
            if (sceneRef.current) {
                sceneRef.current.dispose();
            }
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ outline: 'none' }}
        />
    );
};

export default GaussianSplattingScene;
