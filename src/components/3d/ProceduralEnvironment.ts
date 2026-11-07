/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Procedural environment builder for Diwali Dhamaka
// Generates Courtyard, Shop Shelves, Rangoli, Animated Diyas, Safety Zones, and Starlit Sky.

// Helper to create a procedural circular Rangoli canvas texture
export function createRangoliTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  // Background transparent
  ctx.clearRect(0, 0, size, size);

  // Outer border ring
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = '#f43f5e';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = '#06b6d4';
  ctx.fill();

  // 16 Petals in outer layer
  const petals = 16;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.35, size * 0.05, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#ec4899';
    ctx.fill();
    ctx.restore();
  }

  // Inner Mandala Star
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = '#7e22ce';
  ctx.fill();

  // 8 Flower petals
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.26);
    ctx.quadraticCurveTo(size * 0.08, -size * 0.15, 0, 0);
    ctx.quadraticCurveTo(-size * 0.08, -size * 0.15, 0, -size * 0.26);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.restore();
  }

  // Center Lotus Bud
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#ea580c';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Cracker Box Texture
export function createCrackerBoxTexture(title: string, color: string, icon: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);

  // Gold border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(6, 6, 244, 244);

  // Sparkle stars
  ctx.fillStyle = '#ffffff';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 128, 80);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(title, 128, 160);

  // Badge
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(30, 195, 196, 36);
  ctx.fillStyle = '#1e1b4b';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('DIWALI SPECIAL', 128, 218);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 1. Traditional Indian Courtyard
export function createCourtyard(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Courtyard';

  // Terracotta & sandstone floor tiles
  const floorGeo = new THREE.PlaneGeometry(24, 24);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412, // Warm terracotta
    roughness: 0.8,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // Verandah Stone Platform border
  const platformGeo = new THREE.BoxGeometry(22, 0.25, 6);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xebd5b3, roughness: 0.6 });
  const platform = new THREE.Mesh(platformGeo, stoneMat);
  platform.position.set(0, 0.125, -6);
  platform.receiveShadow = true;
  group.add(platform);

  // Carved Indian Pillars (4 pillars across verandah)
  const pillarGeo = new THREE.CylinderGeometry(0.28, 0.32, 4.2, 16);
  const capitalGeo = new THREE.BoxGeometry(0.75, 0.35, 0.75);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });

  [-7, -2.5, 2.5, 7].forEach((x) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(x, 0.25, -5.5);

    const shaft = new THREE.Mesh(pillarGeo, pillarMat);
    shaft.position.y = 2.1;
    shaft.castShadow = true;
    shaft.receiveShadow = true;

    const base = new THREE.Mesh(capitalGeo, pillarMat);
    base.position.y = 0.175;

    const capital = new THREE.Mesh(capitalGeo, goldTrimMat);
    capital.position.y = 4.2;

    pillarGroup.add(base, shaft, capital);
    group.add(pillarGroup);
  });

  // Verandah Ceiling Beam
  const beamGeo = new THREE.BoxGeometry(22, 0.4, 1.2);
  const beam = new THREE.Mesh(beamGeo, stoneMat);
  beam.position.set(0, 4.45, -5.5);
  group.add(beam);

  // Central Marble Rangoli
  const rangoliGeo = new THREE.PlaneGeometry(4.2, 4.2);
  const rangoliMat = new THREE.MeshStandardMaterial({
    map: createRangoliTexture(512),
    transparent: true,
    roughness: 0.4,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const rangoli = new THREE.Mesh(rangoliGeo, rangoliMat);
  rangoli.rotation.x = -Math.PI / 2;
  rangoli.position.set(0, 0.015, -0.8);
  rangoli.receiveShadow = true;
  group.add(rangoli);

  // Marigold flower torans (hanging arches between pillars)
  const toranCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-2.4, 4.1, -5.4),
    new THREE.Vector3(0, 3.4, -5.4),
    new THREE.Vector3(2.4, 4.1, -5.4)
  );
  const toranGeo = new THREE.TubeGeometry(toranCurve, 20, 0.06, 8, false);
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 });
  const toranCenter = new THREE.Mesh(toranGeo, marigoldMat);
  group.add(toranCenter);

  // Hanging Diwali Kandil (Sky Lantern) in center arch
  const kandilGroup = createKandil();
  kandilGroup.position.set(0, 3.6, -5.3);
  group.add(kandilGroup);

  return group;
}

// Procedural Hanging Kandil (traditional lantern)
function createKandil(): THREE.Group {
  const group = new THREE.Group();

  // Core octahedron / lantern diamond
  const lanternGeo = new THREE.OctahedronGeometry(0.35, 0);
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    emissive: 0xdb2777,
    emissiveIntensity: 0.4,
    roughness: 0.3,
  });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.y = 0;
  group.add(lantern);

  // Hanging streamer tails (frills)
  const frillGeo = new THREE.CylinderGeometry(0.015, 0.04, 0.6, 6);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.5 });
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const frill = new THREE.Mesh(frillGeo, goldMat);
    frill.position.set(Math.cos(angle) * 0.15, -0.45, Math.sin(angle) * 0.15);
    group.add(frill);
  }

  // Inner warm light
  const light = new THREE.PointLight(0xf59e0b, 1.2, 5);
  light.position.set(0, 0, 0);
  group.add(light);

  return group;
}

// 2. Animated Brass Diya Lamp with flickering point light
export interface DiyaObject {
  group: THREE.Group;
  light: THREE.PointLight;
  flameMesh: THREE.Mesh;
  update: (time: number) => void;
}

export function createDiya(x: number, y: number, z: number): DiyaObject {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Clay / Brass Lamp Bowl
  const bowlGeo = new THREE.CylinderGeometry(0.14, 0.06, 0.08, 12);
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6, metalness: 0.2 });
  const bowl = new THREE.Mesh(bowlGeo, clayMat);
  bowl.position.y = 0.04;
  group.add(bowl);

  // Flame teardrop
  const flameGeo = new THREE.ConeGeometry(0.04, 0.12, 8);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0, 0.12, 0);
  group.add(flame);

  // Flickering Diya Light
  const light = new THREE.PointLight(0xf59e0b, 0.8, 2.5);
  light.position.set(0, 0.14, 0);
  group.add(light);

  return {
    group,
    light,
    flameMesh: flame,
    update: (time: number) => {
      const flicker = Math.sin(time * 12 + x * 5) * 0.15 + Math.cos(time * 8 + z * 3) * 0.1;
      light.intensity = 0.8 + flicker;
      flame.scale.set(1 + flicker * 0.5, 1 + flicker * 0.7, 1 + flicker * 0.5);
    },
  };
}

// 3. Approved Firework Safety Zone (Launch pad, spectator line, water buckets, first aid)
export function createSafetyZone(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'SafetyZone';

  // 1. Approved Brick Launch Pad (elevated safe square)
  const padGeo = new THREE.BoxGeometry(1.6, 0.12, 1.6);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(0, 0.06, 2.8);
  pad.receiveShadow = true;
  group.add(pad);

  // Yellow & Black hazard border around launch pad
  const hazardBorderGeo = new THREE.TorusGeometry(1.2, 0.04, 6, 4);
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const hazardBorder = new THREE.Mesh(hazardBorderGeo, yellowMat);
  hazardBorder.rotation.x = Math.PI / 2;
  hazardBorder.rotation.z = Math.PI / 4;
  hazardBorder.position.set(0, 0.07, 2.8);
  group.add(hazardBorder);

  // "SAFE LAUNCH PAD" text/marker ring
  const ringGeo = new THREE.RingGeometry(0.9, 1.05, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.13, 2.8);
  group.add(ring);

  // 2. Spectator Boundary Line (5 meters back)
  const boundaryGeo = new THREE.CylinderGeometry(0.04, 0.04, 9, 8);
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
  const rope = new THREE.Mesh(boundaryGeo, ropeMat);
  rope.rotation.z = Math.PI / 2;
  rope.position.set(0, 0.5, 6.2);
  group.add(rope);

  // Stanchions (posts) holding the boundary line
  const postGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 12);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
  [-4.2, -1.4, 1.4, 4.2].forEach((x) => {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x, 0.4, 6.2);
    post.castShadow = true;
    group.add(post);
  });

  // 3. Water Bucket & Sand Bucket Station (Left side of launch pad)
  const stationGroup = new THREE.Group();
  stationGroup.position.set(-2.6, 0, 2.8);

  // Stand table
  const tableGeo = new THREE.BoxGeometry(1.4, 0.35, 0.8);
  const table = new THREE.Mesh(tableGeo, new THREE.MeshStandardMaterial({ color: 0x78350f }));
  table.position.y = 0.175;
  stationGroup.add(table);

  // Water Bucket (Blue)
  const bucketGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.35, 16);
  const waterBucket = new THREE.Mesh(bucketGeo, new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 }));
  waterBucket.position.set(-0.35, 0.525, 0);
  const waterSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 16),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
  );
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.set(-0.35, 0.68, 0);
  stationGroup.add(waterBucket, waterSurface);

  // Sand Bucket (Orange/Yellow)
  const sandBucket = new THREE.Mesh(bucketGeo, new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
  sandBucket.position.set(0.35, 0.525, 0);
  const sandSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 16),
    new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.9 })
  );
  sandSurface.rotation.x = -Math.PI / 2;
  sandSurface.position.set(0.35, 0.68, 0);
  stationGroup.add(sandBucket, sandSurface);

  group.add(stationGroup);

  // 4. First Aid Kit Station (Right side of launch pad)
  const firstAidGroup = new THREE.Group();
  firstAidGroup.position.set(2.6, 0, 2.8);

  const faTable = new THREE.Mesh(tableGeo, new THREE.MeshStandardMaterial({ color: 0x78350f }));
  faTable.position.y = 0.175;
  firstAidGroup.add(faTable);

  // White box with Red Cross
  const boxGeo = new THREE.BoxGeometry(0.45, 0.25, 0.32);
  const box = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
  box.position.set(0, 0.475, 0);
  firstAidGroup.add(box);

  // Red cross marker
  const crossGeo1 = new THREE.BoxGeometry(0.16, 0.05, 0.01);
  const crossGeo2 = new THREE.BoxGeometry(0.05, 0.16, 0.01);
  const redMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const cross1 = new THREE.Mesh(crossGeo1, redMat);
  cross1.position.set(0, 0.48, 0.165);
  const cross2 = new THREE.Mesh(crossGeo2, redMat);
  cross2.position.set(0, 0.48, 0.165);
  firstAidGroup.add(cross1, cross2);

  group.add(firstAidGroup);

  return group;
}

// 4. Cracker Store Scene (for Level 2)
export function createCrackerShop(): THREE.Group {
  const shopGroup = new THREE.Group();
  shopGroup.name = 'CrackerShop';

  // Wooden Counter table
  const counterGeo = new THREE.BoxGeometry(6.5, 1.1, 1.2);
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 });
  const counter = new THREE.Mesh(counterGeo, woodMat);
  counter.position.set(0, 0.55, 0);
  counter.castShadow = true;
  shopGroup.add(counter);

  // Brass scale on counter
  const scaleGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.1, 16);
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
  const scale = new THREE.Mesh(scaleGeo, brassMat);
  scale.position.set(1.8, 1.15, 0);
  shopGroup.add(scale);

  // Shelves behind counter
  const backShelfGeo = new THREE.BoxGeometry(8, 3.8, 0.8);
  const shelfWoodMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.6 });
  const shelf = new THREE.Mesh(backShelfGeo, shelfWoodMat);
  shelf.position.set(0, 1.9, -1.8);
  shopGroup.add(shelf);

  // Shelf divider levels
  [-0.6, 0.5, 1.6].forEach((y) => {
    const divider = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.08, 0.75), woodMat);
    divider.position.set(0, 1.9 + y, -1.75);
    shopGroup.add(divider);
  });

  // Display Cracker Boxes on shelves
  const boxConfigs = [
    { title: 'Sparkler', color: '#f59e0b', icon: '✨', x: -2.8, y: 1.6 },
    { title: 'Flower Pot', color: '#ef4444', icon: '🌋', x: -1.0, y: 1.6 },
    { title: 'Chakra', color: '#10b981', icon: '🌀', x: 1.0, y: 1.6 },
    { title: 'Fountain', color: '#8b5cf6', icon: '🎆', x: 2.8, y: 1.6 },
    { title: 'Aerial', color: '#ec4899', icon: '🚀', x: -2.0, y: 2.7 },
    { title: 'Family Pack', color: '#3b82f6', icon: '🎁', x: 0.8, y: 2.7 },
  ];

  boxConfigs.forEach((cfg) => {
    const boxGeo = new THREE.BoxGeometry(0.85, 0.65, 0.5);
    const boxMat = new THREE.MeshStandardMaterial({
      map: createCrackerBoxTexture(cfg.title, cfg.color, cfg.icon),
      roughness: 0.35,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(cfg.x, cfg.y, -1.5);
    boxMesh.castShadow = true;
    shopGroup.add(boxMesh);
  });

  // Hanging festive buntings in shop
  const garlandGeo = new THREE.TorusGeometry(3.2, 0.04, 6, 24, Math.PI);
  const garland = new THREE.Mesh(garlandGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 }));
  garland.rotation.z = Math.PI;
  garland.position.set(0, 3.7, -0.6);
  shopGroup.add(garland);

  return shopGroup;
}
