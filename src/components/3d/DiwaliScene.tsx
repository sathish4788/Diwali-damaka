/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GameLevel } from '../../types/game';
import {
  createAarav,
  createAnanya,
  createAppa,
  createAmma,
  createShopkeeperUncle,
  AnimatedCharacter,
} from './ProceduralCharacters';
import {
  createCourtyard,
  createDiya,
  createSafetyZone,
  createCrackerShop,
  DiyaObject,
} from './ProceduralEnvironment';
import { FireworksManager } from './FireworksParticleSystem';
import {
  createFlowerPotMesh,
  createAtomBombMesh,
  createSaramLadiMesh,
  createChakraMesh,
  createRocketMesh,
  createAgarbattiMesh,
  createBurntRemnantMesh,
  createFlyingRocketMesh,
} from './ProceduralCrackers';
import { soundManager } from '../../audio/soundManager';

export interface DiwaliSceneHandle {
  triggerFirework: (type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram') => void;
  setSpeakingCharacter: (charId: string | null) => void;
  setCelebrating: (celebrating: boolean) => void;
  placeCracker: (category: string) => void;
  lightPlacedCracker: (category: string, onDetonated?: () => void) => void;
  clearBurntRemnants: () => void;
}

interface DiwaliSceneProps {
  currentLevel: GameLevel;
  reducedFlashing?: boolean;
}

export const DiwaliScene = forwardRef<DiwaliSceneHandle, DiwaliSceneProps>(
  ({ currentLevel, reducedFlashing = false }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const fireworksRef = useRef<FireworksManager | null>(null);
    const charactersRef = useRef<Record<string, AnimatedCharacter>>({});
    const activeSpeakerRef = useRef<string | null>(null);
    const isCelebratingRef = useRef<boolean>(false);
    const cameraShakeRef = useRef<number>(0);
    const targetCameraPos = useRef(new THREE.Vector3(0, 3.2, 8));
    const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
    const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));

    // 3D cracker and Agarbatti references
    const activePlacedCrackerMesh = useRef<THREE.Group | null>(null);
    const burntRemnantMeshRef = useRef<THREE.Group | null>(null);
    const agarbattiMeshRef = useRef<THREE.Group | null>(null);
    const agarbattiTargetPos = useRef(new THREE.Vector3(0.6, 0.6, 3.4));

    // Ascending aerial sky rocket flight tracking
    const flyingRocketRef = useRef<{
      mesh: THREE.Group;
      velocity: THREE.Vector3;
      targetY: number;
      alive: boolean;
      onApex?: () => void;
    } | null>(null);

    // Expose control methods to parent React UI
    useImperativeHandle(ref, () => ({
      triggerFirework: (type) => {
        if (!fireworksRef.current) return;
        if (type === 'flowerpot') {
          fireworksRef.current.triggerFlowerPot(new THREE.Vector3(0, 0.12, 2.8), 10);
        } else if (type === 'chakra') {
          fireworksRef.current.triggerGroundChakra(new THREE.Vector3(0, 0.1, 2.8), 8);
        } else if (type === 'sparkler') {
          fireworksRef.current.triggerSparkler(new THREE.Vector3(1.2, 1.1, 0.4), 8);
        } else if (type === 'aerial') {
          fireworksRef.current.triggerGrandPanoramicSkyShow();
        } else if (type === 'bomb') {
          fireworksRef.current.triggerAtomBomb(new THREE.Vector3(0, 0.14, 2.8));
          cameraShakeRef.current = 0.4;
        } else if (type === 'saram') {
          fireworksRef.current.triggerSaramLadi(new THREE.Vector3(0, 0.06, 2.8), 5.5);
          cameraShakeRef.current = 0.15;
        } else if (type === 'text') {
          fireworksRef.current.triggerSkyMessageText();
        }
      },
      setSpeakingCharacter: (charId) => {
        activeSpeakerRef.current = charId;
      },
      setCelebrating: (celebrating) => {
        isCelebratingRef.current = celebrating;
      },
      clearBurntRemnants: () => {
        if (burntRemnantMeshRef.current && sceneRef.current) {
          sceneRef.current.remove(burntRemnantMeshRef.current);
          burntRemnantMeshRef.current = null;
        }
      },
      placeCracker: (category: string) => {
        const scene = sceneRef.current;
        if (!scene) return;

        // Clear existing burnt remnants when placing a new cracker
        if (burntRemnantMeshRef.current) {
          scene.remove(burntRemnantMeshRef.current);
          burntRemnantMeshRef.current = null;
        }

        // Remove previously placed cracker mesh if any
        if (activePlacedCrackerMesh.current) {
          scene.remove(activePlacedCrackerMesh.current);
          activePlacedCrackerMesh.current = null;
        }

        let mesh: THREE.Group | null = null;
        if (category === 'flowerpot' || category === 'fountain') {
          mesh = createFlowerPotMesh();
        } else if (category === 'bomb') {
          mesh = createAtomBombMesh();
        } else if (category === 'saram') {
          mesh = createSaramLadiMesh();
        } else if (category === 'chakra') {
          mesh = createChakraMesh();
        } else if (category === 'aerial') {
          mesh = createRocketMesh();
        }

        if (mesh) {
          mesh.position.set(0, 0.12, 2.8);
          scene.add(mesh);
          activePlacedCrackerMesh.current = mesh;
        }
      },
      lightPlacedCracker: (category: string, onDetonated?: () => void) => {
        // Animate Agarbatti forward to touch fuse
        agarbattiTargetPos.current.set(0.12, 0.48, 2.85);

        // Fuse sizzle sound and sparks
        soundManager.playFuseBurning(1.5);
        if (fireworksRef.current) {
          fireworksRef.current.triggerFuseSparks(new THREE.Vector3(0.05, 0.45, 2.8), 1.4);
        }

        // After 1.4s, agarbatti retreats and cracker explodes
        setTimeout(() => {
          agarbattiTargetPos.current.set(0.8, 0.7, 3.8); // retreat

          // Remove physical unexploded mesh
          if (activePlacedCrackerMesh.current && sceneRef.current) {
            sceneRef.current.remove(activePlacedCrackerMesh.current);
            activePlacedCrackerMesh.current = null;
          }

          // If Sky Cracker (Aerial Rocket), launch upward into the sky with camera tilt!
          if (category === 'aerial') {
            // 1. Play ascending thrust whistle
            soundManager.playAerialRocket();

            // 2. Spawn flying rocket projectile with fiery exhaust
            const flyingRocket = createFlyingRocketMesh();
            flyingRocket.position.set(0, 0.45, 2.8);
            sceneRef.current?.add(flyingRocket);

            // 3. Smoothly tilt camera upward to track rocket climbing into the stars!
            targetCameraPos.current.set(0, 3.0, 7.2);
            targetLookAt.current.set(0, 10.5, 0.5);

            flyingRocketRef.current = {
              mesh: flyingRocket,
              velocity: new THREE.Vector3(0, 10.5, -1.8),
              targetY: 13.5,
              alive: true,
              onApex: () => {
                // Detonate in the night sky with grand panoramic multi-tier display!
                fireworksRef.current?.triggerGrandPanoramicSkyShow();
                soundManager.playCelebratoryBoom();
                soundManager.playCrowdExcitement();
                cameraShakeRef.current = 0.35;

                // Place burnt rocket stick on the ground pad
                if (sceneRef.current) {
                  if (burntRemnantMeshRef.current) {
                    sceneRef.current.remove(burntRemnantMeshRef.current);
                  }
                  const burnt = createBurntRemnantMesh('aerial');
                  burnt.position.set(0, 0.12, 2.8);
                  sceneRef.current.add(burnt);
                  burntRemnantMeshRef.current = burnt;
                }

                // After 3.6s of admiring the cascading golden willow stars, smoothly return camera to ground pad
                setTimeout(() => {
                  if (currentLevel === 5) {
                    targetCameraPos.current.set(0, 2.5, 5.8);
                    targetLookAt.current.set(0, 0.9, 2.6);
                  }
                }, 3600);
              },
            };

            if (onDetonated) onDetonated();
            return;
          }

          // Ground crackers (Atom Bomb, Saram 100 Ladi, Flower Pot, Ground Chakra)
          if (category === 'bomb') {
            fireworksRef.current?.triggerAtomBomb(new THREE.Vector3(0, 0.14, 2.8));
            soundManager.playAtomBombExplosion();
            cameraShakeRef.current = 0.45;
          } else if (category === 'saram') {
            fireworksRef.current?.triggerSaramLadi(new THREE.Vector3(0, 0.06, 2.8), 5.5);
            soundManager.playLadiPop(36);
            cameraShakeRef.current = 0.18;
          } else if (category === 'flowerpot' || category === 'fountain') {
            fireworksRef.current?.triggerFlowerPot(new THREE.Vector3(0, 0.12, 2.8), 9);
            soundManager.playFountainShower(8);
          } else if (category === 'chakra') {
            fireworksRef.current?.triggerGroundChakra(new THREE.Vector3(0, 0.1, 2.8), 7);
            soundManager.playChakraSpin(7);
          } else {
            fireworksRef.current?.triggerSparkler(new THREE.Vector3(1.2, 1.1, 0.4), 8);
            soundManager.playSparklerCrackle(6);
          }

          // After burst finishes, place realistic charred burnt remnants on the pad!
          const burntDelay = category === 'bomb' ? 1200 : category === 'saram' ? 4200 : 3200;
          setTimeout(() => {
            if (sceneRef.current) {
              if (burntRemnantMeshRef.current) {
                sceneRef.current.remove(burntRemnantMeshRef.current);
              }
              const burnt = createBurntRemnantMesh(category);
              burnt.position.set(0, 0.12, 2.8);
              sceneRef.current.add(burnt);
              burntRemnantMeshRef.current = burnt;
            }
          }, burntDelay);

          if (onDetonated) onDetonated();
        }, 1400);
      },
    }));

    // Update camera targets based on active game level
    useEffect(() => {
      if (currentLevel === 1) {
        // Family Budget dialogue in verandah
        targetCameraPos.current.set(0, 2.2, 4.6);
        targetLookAt.current.set(0, 1.3, -1.0);
      } else if (currentLevel === 2) {
        // Cracker Shop counter
        targetCameraPos.current.set(0, 2.0, 3.8);
        targetLookAt.current.set(0, 1.5, -0.2);
      } else if (currentLevel === 3) {
        // Courtyard preparation perspective
        targetCameraPos.current.set(0, 5.0, 8.5);
        targetLookAt.current.set(0, 0.8, 1.5);
      } else if (currentLevel === 4) {
        // Firework Safety test arena
        targetCameraPos.current.set(0, 2.8, 6.2);
        targetLookAt.current.set(0, 0.8, 2.8);
      } else if (currentLevel === 5) {
        // Fireworks celebration view (crystal clear view of launch pad & cracker)
        targetCameraPos.current.set(0, 2.5, 5.8);
        targetLookAt.current.set(0, 0.9, 2.6);
      } else if (currentLevel === 6) {
        // Grand Finale wide sky crane
        targetCameraPos.current.set(0, 8.5, 14.0);
        targetLookAt.current.set(0, 6.0, -1.0);
      }
    }, [currentLevel]);

    useEffect(() => {
      const mount = mountRef.current;
      if (!mount) return;

      // 1. Detect software WebGL
      const isSoftwareGl = (() => {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      })();

      // 2. Initialize Three.js Scene, Camera, Renderer
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x0c081e); // Deep midnight sky
      scene.fog = new THREE.FogExp2(0x0c081e, 0.025);

      const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
      camera.position.copy(targetCameraPos.current);
      currentLookAt.current.copy(targetLookAt.current);
      camera.lookAt(currentLookAt.current);

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      mount.appendChild(renderer.domElement);

      // 3. Studio Environment Map (PMREM)
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();

      // 4. Lighting Rig
      // Ambient / Cool hemisphere fill
      const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x1e1b4b, 0.6);
      scene.add(hemiLight);

      // Warm festive Key Light
      const keyLight = new THREE.DirectionalLight(0xfef08a, 1.4);
      keyLight.position.set(5, 10, 6);
      keyLight.castShadow = !isSoftwareGl;
      if (!isSoftwareGl) {
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 30;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.normalBias = 0.02;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
      }
      scene.add(keyLight);

      // Back / Rim festive magenta light
      const rimLight = new THREE.DirectionalLight(0xec4899, 0.5);
      rimLight.position.set(-6, 8, -6);
      scene.add(rimLight);

      // 5. Build Environments
      const courtyard = createCourtyard();
      scene.add(courtyard);

      const safetyZone = createSafetyZone();
      scene.add(safetyZone);

      const shop = createCrackerShop();
      shop.position.set(0, 0, 0);
      scene.add(shop);

      // Diya Lamps along verandah platform and steps
      const diyas: DiyaObject[] = [];
      const diyaPositions = [
        [-5.5, 0.28, -3.2],
        [-3.2, 0.28, -3.2],
        [-1.0, 0.28, -3.2],
        [1.0, 0.28, -3.2],
        [3.2, 0.28, -3.2],
        [5.5, 0.28, -3.2],
        [-2.0, 0.02, 0.8],
        [2.0, 0.02, 0.8],
      ];

      diyaPositions.forEach(([dx, dy, dz]) => {
        const diya = createDiya(dx, dy, dz);
        scene.add(diya.group);
        diyas.push(diya);
      });

      // 6. Spawn Pixar-style Characters
      const aarav = createAarav();
      aarav.group.position.set(-1.2, 0.25, -2.2);
      scene.add(aarav.group);

      const ananya = createAnanya();
      ananya.group.position.set(-0.3, 0.25, -2.0);
      scene.add(ananya.group);

      const appa = createAppa();
      appa.group.position.set(1.4, 0.25, -2.4);
      scene.add(appa.group);

      const amma = createAmma();
      amma.group.position.set(2.8, 0.25, -2.6);
      scene.add(amma.group);

      const uncle = createShopkeeperUncle();
      uncle.group.position.set(0, 0, -1.0);
      scene.add(uncle.group);

      charactersRef.current = {
        aarav,
        ananya,
        appa,
        amma,
        uncle,
      };

      // 7. Initialize Fireworks Engine
      const fireworksManager = new FireworksManager(scene);
      fireworksRef.current = fireworksManager;

      // 8. Starlit Night Sky Dome (instanced stars)
      const starCount = 300;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let s = 0; s < starCount; s++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.45;
        const r = 35 + Math.random() * 10;
        starPos[s * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[s * 3 + 1] = r * Math.cos(phi) + 5;
        starPos[s * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.25,
        transparent: true,
        opacity: 0.8,
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // 9. Interactive 3D Agarbatti Lighting Wand
      const agarbatti = createAgarbattiMesh();
      agarbatti.position.set(0.8, 0.7, 3.8);
      scene.add(agarbatti);
      agarbattiMeshRef.current = agarbatti;

      // 10. Resize Handler
      const handleResize = () => {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // 10. Main 60fps Animation Loop with Frame Delta & Software WebGL pacing
      let frameId = 0;
      let clock = new THREE.Clock();

      function afterDraw(cb: () => void) {
        const glCtx = renderer.getContext() as WebGL2RenderingContext;
        const sync = glCtx.fenceSync(glCtx.SYNC_GPU_COMMANDS_COMPLETE, 0);
        glCtx.flush();
        const poll = () => {
          const state = sync && glCtx.getSyncParameter(sync, glCtx.SYNC_STATUS);
          if (state === glCtx.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            glCtx.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      }

      function tick() {
        const dt = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // Smooth Camera interpolation (exponential damping)
        camera.position.lerp(targetCameraPos.current, 0.05);
        currentLookAt.current.lerp(targetLookAt.current, 0.05);

        // Apply decaying camera shake on heavy explosions (Atom Bomb)
        if (cameraShakeRef.current > 0.002) {
          camera.position.x += (Math.random() - 0.5) * cameraShakeRef.current;
          camera.position.y += (Math.random() - 0.5) * cameraShakeRef.current;
          cameraShakeRef.current *= 0.88;
        }

        camera.lookAt(currentLookAt.current);

        // Animate Agarbatti wand position and subtle breathing
        if (agarbattiMeshRef.current) {
          agarbattiMeshRef.current.position.lerp(agarbattiTargetPos.current, 0.08);
          agarbattiMeshRef.current.rotation.z = Math.sin(time * 3) * 0.05 - 0.25;
        }

        // Animate Ascending Aerial Sky Rocket Projectile
        if (flyingRocketRef.current && flyingRocketRef.current.alive) {
          const r = flyingRocketRef.current;
          r.mesh.position.y += r.velocity.y * dt;
          r.mesh.position.z += r.velocity.z * dt;
          r.velocity.y += 14.0 * dt; // accelerating thrust

          // Emit trailing fiery exhaust sparks in the night sky
          if (fireworksRef.current && Math.random() < 0.7) {
            fireworksRef.current.triggerRocketTrailSparks(r.mesh.position);
          }

          // Detonate at apex in the night sky
          if (r.mesh.position.y >= r.targetY) {
            r.alive = false;
            if (sceneRef.current) {
              sceneRef.current.remove(r.mesh);
            }
            if (r.onApex) r.onApex();
            flyingRocketRef.current = null;
          }
        }

        // Update Diyas flickering
        for (let d = 0; d < diyas.length; d++) {
          diyas[d].update(time);
        }

        // Adjust visibility according to active stage
        if (currentLevel === 2) {
          shop.visible = true;
          uncle.group.visible = true;
          aarav.group.position.set(-1.4, 0, 1.2);
          ananya.group.position.set(-0.6, 0, 1.3);
          aarav.group.rotation.y = Math.PI * 0.15;
          ananya.group.rotation.y = -Math.PI * 0.1;
          appa.group.visible = false;
          amma.group.visible = false;
          safetyZone.visible = false;
        } else {
          shop.visible = false;
          uncle.group.visible = false;
          safetyZone.visible = true;
          appa.group.visible = true;
          amma.group.visible = true;

          // Positions for courtyard / celebration
          if (currentLevel >= 4) {
            // Stand behind the safety spectator line (z = 6.2)
            aarav.group.position.set(-1.0, 0, 6.8);
            ananya.group.position.set(-0.2, 0, 6.7);
            appa.group.position.set(0.9, 0, 6.9);
            amma.group.position.set(1.9, 0, 6.8);

            aarav.group.rotation.y = Math.PI;
            ananya.group.rotation.y = Math.PI;
            appa.group.rotation.y = Math.PI;
            amma.group.rotation.y = Math.PI;
          } else {
            aarav.group.position.set(-1.2, 0.25, -2.2);
            ananya.group.position.set(-0.3, 0.25, -2.0);
            appa.group.position.set(1.4, 0.25, -2.4);
            amma.group.position.set(2.8, 0.25, -2.6);

            aarav.group.rotation.y = 0.2;
            ananya.group.rotation.y = 0.1;
            appa.group.rotation.y = -0.3;
            amma.group.rotation.y = -0.4;
          }
        }

        // Animate Characters
        const speaker = activeSpeakerRef.current;
        const celebrating = isCelebratingRef.current;

        aarav.update(time, speaker === 'aarav', celebrating);
        ananya.update(time, speaker === 'ananya', celebrating);
        appa.update(time, speaker === 'appa', celebrating);
        amma.update(time, speaker === 'amma', celebrating);
        uncle.update(time, speaker === 'uncle', celebrating);

        // Update Fireworks particle systems
        if (fireworksManager) {
          fireworksManager.update(dt);
        }

        // Render scene
        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }

      tick();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        fireworksManager.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div
        ref={mountRef}
        className="w-full h-full absolute inset-0 overflow-hidden pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
    );
  }
);
