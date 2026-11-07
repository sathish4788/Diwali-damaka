/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// High-performance procedural fireworks particle engine in Three.js
// Simulates:
// 1. Flower Pots (Anaar) - Golden fountain shower with vertical velocity and gravity spray
// 2. Ground Chakras (Zameen Chakra) - High-speed whirling ring of emerald/gold sparks
// 3. Sparklers (Phuljhadi) - Handheld sparkle spray
// 4. Aerial Starburst Rockets - Launch ascent + colorful spherical peony bursts
// 5. Grand Sky Message ("HAPPY DIWALI!") - Text-arranged starlight particles

export interface ActiveFirework {
  type: 'flowerpot' | 'chakra' | 'sparkler' | 'aerial' | 'text' | 'bomb' | 'saram' | 'fuse';
  points: THREE.Points;
  positions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  lifetimes: Float32Array;
  maxLifetimes: Float32Array;
  origin: THREE.Vector3;
  light?: THREE.PointLight;
  age: number;
  duration: number;
  isAlive: boolean;
}

export class FireworksManager {
  private scene: THREE.Scene;
  private fireworks: ActiveFirework[] = [];
  private particleTexture: THREE.CanvasTexture;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.particleTexture = this.createSparkleTexture();
  }

  // Create soft circular glowing dot texture
  private createSparkleTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 220, 100, 0.85)');
    grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // 1. Launch Flower Pot (Anaar)
  public triggerFlowerPot(position = new THREE.Vector3(0, 0.1, 2.8), durationSec = 8) {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const palette = [
      new THREE.Color(0xfef08a), // gold-white
      new THREE.Color(0xfbbf24), // amber
      new THREE.Color(0xf59e0b), // orange
      new THREE.Color(0xef4444), // ruby
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      // Cone spray upwards
      const theta = Math.random() * Math.PI * 2;
      const spread = (Math.random() * 0.35 + 0.05);
      const speed = 4.5 + Math.random() * 5.0;

      velocities[i * 3] = Math.cos(theta) * spread * speed;
      velocities[i * 3 + 1] = speed;
      velocities[i * 3 + 2] = Math.sin(theta) * spread * speed;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Staggered birth
      lifetimes[i] = -Math.random() * durationSec;
      maxLifetimes[i] = 1.0 + Math.random() * 0.6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.16,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    // Dynamic light
    const light = new THREE.PointLight(0xfbbf24, 3, 10);
    light.position.copy(position).add(new THREE.Vector3(0, 1.5, 0));
    this.scene.add(light);

    this.fireworks.push({
      type: 'flowerpot',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: durationSec,
      isAlive: true,
    });
  }

  // 2. Launch Ground Chakra (Zameen Chakra)
  public triggerGroundChakra(position = new THREE.Vector3(0, 0.08, 2.8), durationSec = 7) {
    const count = 900;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const palette = [
      new THREE.Color(0x10b981), // Emerald green
      new THREE.Color(0xfbbf24), // Amber gold
      new THREE.Color(0x06b6d4), // Cyan
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      lifetimes[i] = -Math.random() * durationSec;
      maxLifetimes[i] = 0.6 + Math.random() * 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0x10b981, 2.5, 8);
    light.position.copy(position).add(new THREE.Vector3(0, 0.5, 0));
    this.scene.add(light);

    this.fireworks.push({
      type: 'chakra',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: durationSec,
      isAlive: true,
    });
  }

  // 3. Launch Dazzling Aerial Rocket Chrysanthemum/Peony Sky Burst
  public triggerAerialRocket(targetBurst = new THREE.Vector3(0, 14, -1)) {
    const count = 1600; // Double density for spectacular sky illumination
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    // Multi-coloured vibrant festival palette (Gold, Magenta, Emerald, Cyan, Coral)
    const baseHue = Math.random();
    const colorPeony1 = new THREE.Color().setHSL(baseHue, 1, 0.65);
    const colorPeony2 = new THREE.Color().setHSL((baseHue + 0.35) % 1, 1, 0.65);
    const colorGoldWillow = new THREE.Color(0xfde047); // Golden weeping willow glitter
    const colorGlitterCore = new THREE.Color(0xffffff); // Strobe white

    for (let i = 0; i < count; i++) {
      positions[i * 3] = targetBurst.x;
      positions[i * 3 + 1] = targetBurst.y;
      positions[i * 3 + 2] = targetBurst.z;

      // Spherical uniform shell explosion
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      // Layer 1: Fast expanding outer peony shell (60% of particles)
      // Layer 2: Slow drifting glittering willow trails (40% of particles)
      const isWillow = i >= count * 0.6;
      const speed = isWillow ? 3.0 + Math.random() * 4.0 : 6.0 + Math.random() * 6.5;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      let c: THREE.Color;
      if (isWillow) {
        c = Math.random() > 0.3 ? colorGoldWillow : colorGlitterCore;
      } else {
        c = Math.random() > 0.5 ? colorPeony1 : colorPeony2;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      lifetimes[i] = 0;
      maxLifetimes[i] = isWillow ? 2.6 + Math.random() * 1.2 : 2.0 + Math.random() * 0.8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    // Dazzling sky flash illuminating the courtyard
    const light = new THREE.PointLight(colorPeony1, 12, 45);
    light.position.copy(targetBurst);
    this.scene.add(light);

    this.fireworks.push({
      type: 'aerial',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: targetBurst.clone(),
      light,
      age: 0,
      duration: 4.2,
      isAlive: true,
    });
  }

  // 3b. Ascending Rocket Spark Trail (Fiery exhaust trail streaking into the sky)
  public triggerRocketTrailSparks(position: THREE.Vector3) {
    const count = 40;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = position.y - Math.random() * 0.15;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.08;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = -1.8 - Math.random() * 2.5; // Downward exhaust spray
      velocities[i * 3 + 2] = Math.sin(angle) * speed;

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.55 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.1;

      lifetimes[i] = 0;
      maxLifetimes[i] = 0.4 + Math.random() * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.18,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.fireworks.push({
      type: 'sparkler',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      age: 0,
      duration: 0.6,
      isAlive: true,
    });
  }

  // 3c. Giant Sapphire Blue Peony Burst (Iconic left-side blue shell from Reference Image 3)
  public triggerSapphireBluePeony(targetBurst = new THREE.Vector3(-4.2, 14.2, -2)) {
    const count = 1100;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const bluePalette = [
      new THREE.Color(0x2563eb), // Deep Royal Sapphire Blue
      new THREE.Color(0x38bdf8), // Luminous Sky Cyan
      new THREE.Color(0x60a5fa), // Electric Blue
      new THREE.Color(0xffffff), // Glittering White Core
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = targetBurst.x;
      positions[i * 3 + 1] = targetBurst.y;
      positions[i * 3 + 2] = targetBurst.z;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 4.8 + Math.random() * 6.2;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      const c = bluePalette[Math.floor(Math.random() * bluePalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      lifetimes[i] = 0;
      maxLifetimes[i] = 2.4 + Math.random() * 0.8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.32,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0x38bdf8, 10, 38);
    light.position.copy(targetBurst);
    this.scene.add(light);

    this.fireworks.push({
      type: 'aerial',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: targetBurst.clone(),
      light,
      age: 0,
      duration: 3.8,
      isAlive: true,
    });
  }

  // 3d. White-Silver Chrysanthemum & Golden Willow Arch (Panoramic canopy from Reference Image 3)
  public triggerSilverChrysanthemumArch(targetBurst = new THREE.Vector3(1.5, 15.0, -2)) {
    const count = 1500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const silverWhite = new THREE.Color(0xffffff);
    const brightPlatinum = new THREE.Color(0xf1f5f9);
    const goldGlitter = new THREE.Color(0xfde047);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = targetBurst.x + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = targetBurst.y;
      positions[i * 3 + 2] = targetBurst.z;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const isWillow = i >= count * 0.5;
      const speed = isWillow ? 3.5 + Math.random() * 4.2 : 6.5 + Math.random() * 7.0;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed * 1.2;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      const c = isWillow ? goldGlitter : (Math.random() > 0.3 ? silverWhite : brightPlatinum);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      lifetimes[i] = 0;
      maxLifetimes[i] = isWillow ? 3.4 + Math.random() * 1.0 : 2.2 + Math.random() * 0.6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.3,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0xffffff, 12, 42);
    light.position.copy(targetBurst);
    this.scene.add(light);

    this.fireworks.push({
      type: 'aerial',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: targetBurst.clone(),
      light,
      age: 0,
      duration: 4.5,
      isAlive: true,
    });
  }

  // 3e. Radiant Comet Fan Fountains (Lower ground-tier fan sheaves from Reference Image 3)
  public triggerCometFanFountain(origin = new THREE.Vector3(0, 0.2, -2)) {
    const rays = 9;
    const particlesPerRay = 90;
    const count = rays * particlesPerRay;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const fanAngles = [-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6]; // Fan spread in radians

    let pIdx = 0;
    for (let r = 0; r < rays; r++) {
      const angle = fanAngles[r];
      const startX = origin.x + (r - 4) * 0.6;

      for (let p = 0; p < particlesPerRay; p++) {
        positions[pIdx * 3] = startX;
        positions[pIdx * 3 + 1] = origin.y;
        positions[pIdx * 3 + 2] = origin.z;

        const jitter = (Math.random() - 0.5) * 0.08;
        const speed = 7.5 + Math.random() * 4.5;
        velocities[pIdx * 3] = Math.sin(angle + jitter) * speed;
        velocities[pIdx * 3 + 1] = Math.cos(angle + jitter) * speed;
        velocities[pIdx * 3 + 2] = (Math.random() - 0.5) * 0.8;

        colors[pIdx * 3] = 1.0;
        colors[pIdx * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[pIdx * 3 + 2] = 0.6; // Radiant golden-white comet sheaves

        lifetimes[pIdx] = -Math.random() * 0.3;
        maxLifetimes[pIdx] = 1.6 + Math.random() * 0.5;
        pIdx++;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0xfef08a, 6, 20);
    light.position.set(origin.x, origin.y + 2, origin.z);
    this.scene.add(light);

    this.fireworks.push({
      type: 'flowerpot',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: origin.clone(),
      light,
      age: 0,
      duration: 2.2,
      isAlive: true,
    });
  }

  // 3f. Grand Panoramic Sky Celebration (Full multi-tiered show from Reference Image 3)
  public triggerGrandPanoramicSkyShow() {
    // Tier 1: Lower radiant fan comet fountains shoot up from courtyard edge
    this.triggerCometFanFountain(new THREE.Vector3(0, 0.2, -3));

    // Tier 2: Giant Sapphire Blue Peony bursts majestically on the left
    setTimeout(() => {
      this.triggerSapphireBluePeony(new THREE.Vector3(-4.5, 14.5, -2));
    }, 450);

    // Tier 3: Arched white-silver chrysanthemum canopy with golden willow rain spans center & right
    setTimeout(() => {
      this.triggerSilverChrysanthemumArch(new THREE.Vector3(1.8, 15.2, -2));
    }, 850);

    // Tier 4: Second cascading burst on the right
    setTimeout(() => {
      this.triggerAerialRocket(new THREE.Vector3(4.8, 13.8, -1));
    }, 1300);
  }

  // 4. Trigger Sparkler (Phuljhadi) held safely by stick
  public triggerSparkler(position = new THREE.Vector3(1.2, 1.1, 0.4), durationSec = 6) {
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 1.2 + Math.random() * 2.2;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 0.7;

      lifetimes[i] = -Math.random() * durationSec;
      maxLifetimes[i] = 0.4 + Math.random() * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.1,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0xfef08a, 1.2, 3);
    light.position.copy(position);
    this.scene.add(light);

    this.fireworks.push({
      type: 'sparkler',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: durationSec,
      isAlive: true,
    });
  }

  // 5. Sky Message Finale ("HAPPY DIWALI!")
  public triggerSkyMessageText() {
    // Generate raster dot grid of "HAPPY DIWALI"
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 300;
    textCanvas.height = 80;
    const ctx = textCanvas.getContext('2d')!;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 300, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HAPPY DIWALI', 150, 40);

    const imgData = ctx.getImageData(0, 0, 300, 80);
    const dots: { x: number; y: number }[] = [];

    for (let y = 0; y < 80; y += 3) {
      for (let x = 0; x < 300; x += 3) {
        const idx = (y * 300 + x) * 4;
        if (imgData.data[idx] > 180) {
          dots.push({
            x: (x - 150) * 0.08,
            y: (40 - y) * 0.08 + 18,
          });
        }
      }
    }

    const count = dots.length;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start near launch pad, fly up into place
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.5;
      positions[i * 3 + 2] = -4;

      velocities[i * 3] = dots[i].x;
      velocities[i * 3 + 1] = dots[i].y;
      velocities[i * 3 + 2] = -8 + (Math.random() - 0.5) * 0.5;

      colors[i * 3] = 0.98; // Gold & Amber
      colors[i * 3 + 1] = 0.75 + (i % 2) * 0.2;
      colors[i * 3 + 2] = 0.15;

      lifetimes[i] = 0;
      maxLifetimes[i] = 12; // lingers in sky
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.32,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.fireworks.push({
      type: 'text',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: new THREE.Vector3(0, 18, -8),
      age: 0,
      duration: 12,
      isAlive: true,
    });
  }

  // 6. Trigger Atom Bomb (Bijili / Green Hydrogen Bomb) explosion
  public triggerAtomBomb(position = new THREE.Vector3(0, 0.12, 2.8)) {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const palette = [
      new THREE.Color(0xffffff), // Flash core
      new THREE.Color(0xfbbf24), // Fiery amber
      new THREE.Color(0xef4444), // Red flame
      new THREE.Color(0x22c55e), // Green jute bits
      new THREE.Color(0x78350f), // Twine brown
      new THREE.Color(0x94a3b8), // Smoke cloud
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y + 0.1;
      positions[i * 3 + 2] = position.z;

      // Hemispherical ground explosion
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; // upwards and outwards
      const speed = 3.0 + Math.random() * 8.5;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed * 1.2;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      lifetimes[i] = 0;
      maxLifetimes[i] = 0.8 + Math.random() * 1.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    // Blinding ground explosion flash
    const light = new THREE.PointLight(0xffedd5, 12, 22);
    light.position.copy(position).add(new THREE.Vector3(0, 0.8, 0));
    this.scene.add(light);

    this.fireworks.push({
      type: 'bomb',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: 2.2,
      isAlive: true,
    });
  }

  // 7. Trigger Saram (Red Ladi / Garland 100) continuous bursting string
  public triggerSaramLadi(position = new THREE.Vector3(0, 0.05, 2.8), durationSec = 5) {
    const count = 900;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    const redColor = new THREE.Color(0xef4444);
    const goldColor = new THREE.Color(0xfbbf24);
    const smokeColor = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < count; i++) {
      // Stagger along a 2-meter garland string line
      const lineProgress = (i % 20) / 20;
      const offsetX = (lineProgress - 0.5) * 2.2;

      positions[i * 3] = position.x + offsetX;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      const theta = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 4.2;

      velocities[i * 3] = Math.cos(theta) * speed;
      velocities[i * 3 + 1] = 1.5 + Math.random() * 3.5;
      velocities[i * 3 + 2] = Math.sin(theta) * speed;

      const pick = Math.random();
      const col = pick < 0.65 ? redColor : pick < 0.85 ? goldColor : smokeColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Staggered pop timing
      lifetimes[i] = -lineProgress * durationSec * 0.85;
      maxLifetimes[i] = 0.5 + Math.random() * 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.18,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0xef4444, 4, 12);
    light.position.copy(position).add(new THREE.Vector3(0, 0.4, 0));
    this.scene.add(light);

    this.fireworks.push({
      type: 'saram',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: durationSec,
      isAlive: true,
    });
  }

  // 8. Trigger Fuse Sparks (Sizzling sparks at fuse tip)
  public triggerFuseSparks(position = new THREE.Vector3(0, 0.35, 2.8), durationSec = 1.5) {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      const theta = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.2;

      velocities[i * 3] = Math.cos(theta) * speed;
      velocities[i * 3 + 1] = 0.6 + Math.random() * 1.2;
      velocities[i * 3 + 2] = Math.sin(theta) * speed;

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.7;
      colors[i * 3 + 2] = 0.2;

      lifetimes[i] = -Math.random() * durationSec;
      maxLifetimes[i] = 0.25;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const light = new THREE.PointLight(0xf59e0b, 1.2, 3);
    light.position.copy(position);
    this.scene.add(light);

    this.fireworks.push({
      type: 'fuse',
      points,
      positions,
      velocities,
      colors,
      lifetimes,
      maxLifetimes,
      origin: position.clone(),
      light,
      age: 0,
      duration: durationSec,
      isAlive: true,
    });
  }

  // Update loop for all active firework simulations
  public update(dt: number) {
    const clampedDt = Math.min(dt, 0.05);

    for (let f = this.fireworks.length - 1; f >= 0; f--) {
      const fw = this.fireworks[f];
      fw.age += clampedDt;

      const posAttr = fw.points.geometry.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = fw.points.geometry.getAttribute('color') as THREE.BufferAttribute;
      const count = fw.lifetimes.length;

      if (fw.type === 'flowerpot') {
        const gravity = -9.8;
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;

          // Respawn while effect active
          if (fw.lifetimes[i] > fw.maxLifetimes[i] && fw.age < fw.duration) {
            fw.lifetimes[i] = 0;
            fw.positions[i * 3] = fw.origin.x;
            fw.positions[i * 3 + 1] = fw.origin.y;
            fw.positions[i * 3 + 2] = fw.origin.z;

            const theta = Math.random() * Math.PI * 2;
            const spread = (Math.random() * 0.38 + 0.04);
            const speed = 4.8 + Math.random() * 5.2;
            fw.velocities[i * 3] = Math.cos(theta) * spread * speed;
            fw.velocities[i * 3 + 1] = speed;
            fw.velocities[i * 3 + 2] = Math.sin(theta) * spread * speed;
          }

          if (fw.lifetimes[i] >= 0 && fw.lifetimes[i] <= fw.maxLifetimes[i]) {
            fw.velocities[i * 3 + 1] += gravity * clampedDt;
            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] += fw.velocities[i * 3 + 1] * clampedDt;
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;

            // Bounce off ground
            if (fw.positions[i * 3 + 1] < 0.05) {
              fw.positions[i * 3 + 1] = 0.05;
              fw.velocities[i * 3 + 1] *= -0.3;
            }
          }
        }

        if (fw.light) {
          fw.light.intensity = fw.age < fw.duration ? 3.0 + Math.sin(fw.age * 20) * 1.0 : Math.max(0, 3.0 * (1 - (fw.age - fw.duration) / 0.8));
        }
      } else if (fw.type === 'chakra') {
        const spinSpeed = 16.0;
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;

          if (fw.lifetimes[i] > fw.maxLifetimes[i] && fw.age < fw.duration) {
            fw.lifetimes[i] = 0;
            const angle = fw.age * spinSpeed + (i * 0.2);
            fw.positions[i * 3] = fw.origin.x;
            fw.positions[i * 3 + 1] = fw.origin.y;
            fw.positions[i * 3 + 2] = fw.origin.z;

            const radiusSpeed = 3.5 + Math.random() * 2.5;
            fw.velocities[i * 3] = Math.cos(angle) * radiusSpeed;
            fw.velocities[i * 3 + 1] = 0.3 + Math.random() * 0.5;
            fw.velocities[i * 3 + 2] = Math.sin(angle) * radiusSpeed;
          }

          if (fw.lifetimes[i] >= 0 && fw.lifetimes[i] <= fw.maxLifetimes[i]) {
            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] += fw.velocities[i * 3 + 1] * clampedDt;
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;
          }
        }
      } else if (fw.type === 'aerial') {
        const gravity = -3.5;
        const drag = 0.96;
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;
          const lifeFrac = fw.lifetimes[i] / fw.maxLifetimes[i];

          if (lifeFrac <= 1) {
            fw.velocities[i * 3] *= drag;
            fw.velocities[i * 3 + 1] = fw.velocities[i * 3 + 1] * drag + gravity * clampedDt;
            fw.velocities[i * 3 + 2] *= drag;

            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] += fw.velocities[i * 3 + 1] * clampedDt;
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;

            // Fade alpha / brightness
            const alpha = 1.0 - lifeFrac;
            fw.colors[i * 3] = Math.max(0, fw.colors[i * 3] * alpha);
            fw.colors[i * 3 + 1] = Math.max(0, fw.colors[i * 3 + 1] * alpha);
            fw.colors[i * 3 + 2] = Math.max(0, fw.colors[i * 3 + 2] * alpha);
          }
        }

        if (fw.light) {
          fw.light.intensity = Math.max(0, 6.0 * (1.0 - fw.age / 1.5));
        }
      } else if (fw.type === 'sparkler') {
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;
          if (fw.lifetimes[i] > fw.maxLifetimes[i] && fw.age < fw.duration) {
            fw.lifetimes[i] = 0;
            fw.positions[i * 3] = fw.origin.x;
            fw.positions[i * 3 + 1] = fw.origin.y;
            fw.positions[i * 3 + 2] = fw.origin.z;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 1.4 + Math.random() * 2.0;
            fw.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            fw.velocities[i * 3 + 1] = Math.cos(phi) * speed;
            fw.velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
          }

          if (fw.lifetimes[i] >= 0) {
            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] += (fw.velocities[i * 3 + 1] - 2.5 * fw.lifetimes[i]) * clampedDt;
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;
          }
        }
      } else if (fw.type === 'bomb') {
        const gravity = -6.5;
        const drag = 0.94;
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;
          const lifeFrac = fw.lifetimes[i] / fw.maxLifetimes[i];

          if (lifeFrac <= 1) {
            fw.velocities[i * 3] *= drag;
            fw.velocities[i * 3 + 1] = fw.velocities[i * 3 + 1] * drag + gravity * clampedDt;
            fw.velocities[i * 3 + 2] *= drag;

            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] = Math.max(0.04, fw.positions[i * 3 + 1] + fw.velocities[i * 3 + 1] * clampedDt);
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;

            const alpha = 1.0 - lifeFrac;
            fw.colors[i * 3] = Math.max(0, fw.colors[i * 3] * alpha);
            fw.colors[i * 3 + 1] = Math.max(0, fw.colors[i * 3 + 1] * alpha);
            fw.colors[i * 3 + 2] = Math.max(0, fw.colors[i * 3 + 2] * alpha);
          }
        }
        if (fw.light) {
          fw.light.intensity = Math.max(0, 12.0 * Math.exp(-fw.age * 8.0));
        }
      } else if (fw.type === 'saram') {
        const gravity = -4.0;
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;
          if (fw.lifetimes[i] >= 0 && fw.lifetimes[i] <= fw.maxLifetimes[i]) {
            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] = Math.max(0.04, fw.positions[i * 3 + 1] + (fw.velocities[i * 3 + 1] + gravity * fw.lifetimes[i]) * clampedDt);
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;
          }
        }
        if (fw.light) {
          fw.light.intensity = fw.age < fw.duration ? 2.5 + Math.sin(fw.age * 30) * 1.5 : Math.max(0, 2.5 * (1 - (fw.age - fw.duration) / 0.5));
        }
      } else if (fw.type === 'fuse') {
        for (let i = 0; i < count; i++) {
          fw.lifetimes[i] += clampedDt;
          if (fw.lifetimes[i] > fw.maxLifetimes[i] && fw.age < fw.duration) {
            fw.lifetimes[i] = 0;
            fw.positions[i * 3] = fw.origin.x;
            fw.positions[i * 3 + 1] = fw.origin.y;
            fw.positions[i * 3 + 2] = fw.origin.z;
          }
          if (fw.lifetimes[i] >= 0) {
            fw.positions[i * 3] += fw.velocities[i * 3] * clampedDt;
            fw.positions[i * 3 + 1] += fw.velocities[i * 3 + 1] * clampedDt;
            fw.positions[i * 3 + 2] += fw.velocities[i * 3 + 2] * clampedDt;
          }
        }
        if (fw.light) {
          fw.light.intensity = fw.age < fw.duration ? 1.5 + Math.random() * 0.8 : 0;
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Remove finished fireworks
      if (fw.age > fw.duration + 2.0) {
        this.scene.remove(fw.points);
        fw.points.geometry.dispose();
        (fw.points.material as THREE.Material).dispose();
        if (fw.light) this.scene.remove(fw.light);
        this.fireworks.splice(f, 1);
      }
    }
  }

  public dispose() {
    for (const fw of this.fireworks) {
      this.scene.remove(fw.points);
      fw.points.geometry.dispose();
      (fw.points.material as THREE.Material).dispose();
      if (fw.light) this.scene.remove(fw.light);
    }
    this.fireworks = [];
    this.particleTexture.dispose();
  }
}
