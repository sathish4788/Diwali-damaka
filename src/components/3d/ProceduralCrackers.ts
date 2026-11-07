/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Procedural 3D physical models for placed fireworks on the launch pad:
// 1. Flower Pot (Anaar)
// 2. Atom Bomb (Bijili / Green Hydrogen Bomb)
// 3. Saram (Red Ladi Garland)
// 4. Ground Chakra (Zameen Chakra)
// 5. Aerial Rocket (Aakash Baan)
// 6. Agarbatti (Incense Lighting Wand)

// 1. Flower Pot (Anaar) – Styled after festive reference image 2 (Royal purple & gold filigree with teal chevrons)
export function createFlowerPotMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_FlowerPot';

  // Rich royal purple terracotta conical body
  const coneGeo = new THREE.ConeGeometry(0.25, 0.58, 20);
  const purpleMat = new THREE.MeshStandardMaterial({
    color: 0x7e22ce, // Vibrant festive royal purple from reference image 2
    roughness: 0.45,
  });
  const cone = new THREE.Mesh(coneGeo, purpleMat);
  cone.position.y = 0.29;
  cone.castShadow = true;
  group.add(cone);

  // Decorative gold foil filigree bands (as seen in reference image 2)
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.2,
  });
  const tealMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan/teal chevron accent from reference
    roughness: 0.4,
  });

  // Lower gold ring band
  const lowerRingGeo = new THREE.TorusGeometry(0.22, 0.016, 8, 20);
  const lowerRing = new THREE.Mesh(lowerRingGeo, goldMat);
  lowerRing.rotation.x = Math.PI / 2;
  lowerRing.position.y = 0.08;
  group.add(lowerRing);

  // Mid teal decorative stripe
  const midRingGeo = new THREE.TorusGeometry(0.16, 0.018, 8, 20);
  const midRing = new THREE.Mesh(midRingGeo, tealMat);
  midRing.rotation.x = Math.PI / 2;
  midRing.position.y = 0.24;
  group.add(midRing);

  // Upper gold neck wrapper
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.14, 16);
  const neck = new THREE.Mesh(neckGeo, goldMat);
  neck.position.y = 0.5;
  group.add(neck);

  // Sticking out white fuse with golden spark nozzle
  const fuseCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.57, 0),
    new THREE.Vector3(0.05, 0.67, 0.02),
    new THREE.Vector3(0.02, 0.74, 0.04)
  );
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 8, 0.012, 6, false);
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  group.add(fuse);

  return group;
}

// 2. Atom Bomb (Classic Green Jute Twine Bomb)
export function createAtomBombMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_AtomBomb';

  // Core explosive body (Green festival paper)
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.32, 16);
  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Classic forest green
    roughness: 0.6,
  });
  const body = new THREE.Mesh(bodyGeo, greenMat);
  body.position.y = 0.16;
  body.castShadow = true;
  group.add(body);

  // Cross-wrapped natural jute twine bands
  const twineMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Natural jute amber
    roughness: 0.9,
  });

  // Horizontal twine rings
  [-0.08, 0, 0.08].forEach((offsetY) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.182, 0.012, 6, 16), twineMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.16 + offsetY;
    group.add(ring);
  });

  // Vertical twine wrap
  const vertRing = new THREE.Mesh(new THREE.TorusGeometry(0.182, 0.012, 6, 16), twineMat);
  vertRing.position.y = 0.16;
  group.add(vertRing);

  // Red top cap
  const capGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.05, 16);
  const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
  cap.position.y = 0.34;
  group.add(cap);

  // Long twisted white fuse curving outwards
  const fuseCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.36, 0),
    new THREE.Vector3(0.08, 0.46, 0.04),
    new THREE.Vector3(0.14, 0.52, 0.02)
  );
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 8, 0.014, 6, false);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 }));
  group.add(fuse);

  return group;
}

// 3. Saram (Red Ladi / Garland 100) – Exact model as shown in attached Reference Image 1
export function createSaramLadiMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_Saram';

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xcc1818, // Authentic deep festive red roll paper
    roughness: 0.45,
  });
  const goldTipMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Gleaming gold foil band near cracker tip (from image 1)
    metalness: 0.85,
    roughness: 0.25,
  });
  const cordMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // White braided string ladder backbone
    roughness: 0.9,
  });

  // Central braided cord spine
  const spineGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.8, 8);
  const spine = new THREE.Mesh(spineGeo, cordMat);
  spine.rotation.x = Math.PI / 2;
  spine.position.set(0, 0.04, 0);
  group.add(spine);

  // 24 tightly packed red cracker rolls arranged along left and right in a herringbone ladder
  const pairs = 12;
  const cylinderGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.28, 10);
  const goldBandGeo = new THREE.CylinderGeometry(0.033, 0.033, 0.04, 10);

  for (let i = 0; i < pairs; i++) {
    const zPos = (i - pairs / 2 + 0.5) * 0.13;

    // Left roll (angled outward like in Image 1)
    const leftRoll = new THREE.Group();
    const leftCyl = new THREE.Mesh(cylinderGeo, redMat);
    const leftBand = new THREE.Mesh(goldBandGeo, goldTipMat);
    leftBand.position.y = 0.09; // Gold foil band near the outer tip!
    leftRoll.add(leftCyl, leftBand);

    leftRoll.rotation.z = Math.PI / 2 - 0.28;
    leftRoll.rotation.y = 0.15;
    leftRoll.position.set(-0.16, 0.04, zPos);
    leftRoll.castShadow = true;
    group.add(leftRoll);

    // Right roll (angled outward like in Image 1)
    const rightRoll = new THREE.Group();
    const rightCyl = new THREE.Mesh(cylinderGeo, redMat);
    const rightBand = new THREE.Mesh(goldBandGeo, goldTipMat);
    rightBand.position.y = 0.09;
    rightRoll.add(rightCyl, rightBand);

    rightRoll.rotation.z = -Math.PI / 2 + 0.28;
    rightRoll.rotation.y = -0.15;
    rightRoll.position.set(0.16, 0.04, zPos);
    rightRoll.castShadow = true;
    group.add(rightRoll);

    // White knot ties linking to center cord
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), cordMat);
    knot.position.set(0, 0.045, zPos);
    group.add(knot);
  }

  // Top Y-Forked Ignition Fuse with sparkling starburst tip (exact detail from Image 1!)
  const forkLeftCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.04, -0.85),
    new THREE.Vector3(-0.06, 0.12, -0.98),
    new THREE.Vector3(-0.08, 0.18, -1.08)
  );
  const forkRightCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.04, -0.85),
    new THREE.Vector3(0.06, 0.12, -0.98),
    new THREE.Vector3(0.08, 0.18, -1.08)
  );
  const fuseTubeGeoL = new THREE.TubeGeometry(forkLeftCurve, 6, 0.01, 6, false);
  const fuseTubeGeoR = new THREE.TubeGeometry(forkRightCurve, 6, 0.01, 6, false);
  const sparkFuseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  group.add(new THREE.Mesh(fuseTubeGeoL, sparkFuseMat), new THREE.Mesh(fuseTubeGeoR, sparkFuseMat));

  // Golden spark starburst ornament at the top fuse tip
  const starburstMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  for (let s = 0; s < 8; s++) {
    const angle = (s * Math.PI * 2) / 8;
    const rayGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.12, 4);
    const ray = new THREE.Mesh(rayGeo, starburstMat);
    ray.position.set(Math.cos(angle) * 0.04, 0.18, -1.08 + Math.sin(angle) * 0.04);
    ray.rotation.z = angle;
    group.add(ray);
  }

  return group;
}

// 4. Ground Chakra (Zameen Chakra) – 12-Petaled Starburst Flower Wheel (from reference image 2)
export function createChakraMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_Chakra';

  // Golden-orange radial starburst petals (as shown in reference image 2)
  const petalCount = 12;
  const goldPetalMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Radiant amber-gold
    metalness: 0.7,
    roughness: 0.25,
  });
  const orangePetalMat = new THREE.MeshStandardMaterial({
    color: 0xea580c, // Fire orange inner core
    roughness: 0.4,
  });
  const purpleCoreMat = new THREE.MeshStandardMaterial({
    color: 0x9333ea, // Violet floral core
    roughness: 0.35,
  });

  // Base rotating plate
  const baseGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24);
  const base = new THREE.Mesh(baseGeo, goldPetalMat);
  base.position.y = 0.02;
  base.castShadow = true;
  group.add(base);

  // 12 pointed starburst petals radiating outward
  const petalGeo = new THREE.ConeGeometry(0.065, 0.24, 6);
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * Math.PI * 2) / petalCount;
    const petal = new THREE.Mesh(petalGeo, i % 2 === 0 ? goldPetalMat : orangePetalMat);
    petal.rotation.x = Math.PI / 2;
    petal.rotation.z = -angle - Math.PI / 2;
    petal.position.set(Math.cos(angle) * 0.22, 0.035, Math.sin(angle) * 0.22);
    group.add(petal);
  }

  // Inner multi-colored ring
  const innerRingGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 20);
  const innerRing = new THREE.Mesh(innerRingGeo, purpleCoreMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.045;
  group.add(innerRing);

  // Center sparkling spinner jewel
  const rubyCoreGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const rubyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.2 });
  const ruby = new THREE.Mesh(rubyCoreGeo, rubyMat);
  ruby.position.y = 0.06;
  group.add(ruby);

  // Tangential ignition fuse
  const nozzleCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.24, 0.03, 0),
    new THREE.Vector3(0.32, 0.08, 0.04),
    new THREE.Vector3(0.36, 0.12, 0.06)
  );
  const nozzle = new THREE.Mesh(
    new THREE.TubeGeometry(nozzleCurve, 6, 0.012, 6, false),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  group.add(nozzle);

  return group;
}

// 5. Aerial Rocket (Aakash Baan) – Striped festival rocket with golden bands (from reference image 2)
export function createRocketMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_Rocket';

  // Wooden launch guide stick
  const stickGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.85, 6);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(0, 0.42, 0);
  group.add(stick);

  // Festive color-blocked rocket body tube (Magenta & Cyan stripes from image 2)
  const tubeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.38, 14);
  const magentaMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
  const tube = new THREE.Mesh(tubeGeo, magentaMat);
  tube.position.set(0, 0.62, 0.04);
  group.add(tube);

  // Gold foil decorative bands
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
  [-0.08, 0.08].forEach((offsetY) => {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.057, 0.008, 6, 14), goldMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, 0.62 + offsetY, 0.04);
    group.add(band);
  });

  // Pointed golden nose cone (from reference image 2)
  const noseGeo = new THREE.ConeGeometry(0.062, 0.18, 14);
  const nose = new THREE.Mesh(noseGeo, goldMat);
  nose.position.set(0, 0.89, 0.04);
  group.add(nose);

  // Downward fuse at rocket base
  const fuseGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 6);
  const fuse = new THREE.Mesh(fuseGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
  fuse.position.set(0, 0.38, 0.04);
  group.add(fuse);

  return group;
}

// 6. Agarbatti (Incense Lighting Wand)
export function createAgarbattiMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AgarbattiWand';

  // Slender bamboo stick
  const stickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.7, 8);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.y = 0.35;
  group.add(stick);

  // Glowing red ember tip
  const tipGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 0.7;
  group.add(tip);

  // Subtle warm point light from ember
  const light = new THREE.PointLight(0xff4500, 1.2, 1.5);
  light.position.y = 0.7;
  group.add(light);

  return group;
}

// 7. Realistic 3D Burnt-Out Cracker Remnants (Post-Burst Satisfaction)
export function createBurntRemnantMesh(category: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cracker_BurntRemnants';

  const ashMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917, // Charred black ash
    roughness: 0.95,
  });
  const sootMat = new THREE.MeshStandardMaterial({
    color: 0x292524, // Dark soot
    roughness: 0.9,
  });
  const scorchMat = new THREE.MeshBasicMaterial({
    color: 0x09090b,
    transparent: true,
    opacity: 0.65,
  });

  // Circular scorch mark on the launch pad
  const scorchGeo = new THREE.CircleGeometry(0.35, 16);
  const scorch = new THREE.Mesh(scorchGeo, scorchMat);
  scorch.rotation.x = -Math.PI / 2;
  scorch.position.y = 0.015;
  group.add(scorch);

  if (category === 'flowerpot' || category === 'fountain') {
    // Charred hollow earthen cone with burnt top
    const burntConeGeo = new THREE.ConeGeometry(0.24, 0.42, 16);
    const burntCone = new THREE.Mesh(burntConeGeo, ashMat);
    burntCone.position.y = 0.21;
    group.add(burntCone);

    // Black ash crater at nozzle
    const craterGeo = new THREE.CylinderGeometry(0.09, 0.06, 0.06, 12);
    const crater = new THREE.Mesh(craterGeo, sootMat);
    crater.position.y = 0.42;
    group.add(crater);
  } else if (category === 'bomb') {
    // Shredded green and brown jute twine bits scattered around
    const shredGeo = new THREE.BoxGeometry(0.08, 0.015, 0.06);
    const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
    const twineBurntMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + Math.random() * 0.4;
      const radius = 0.12 + Math.random() * 0.18;
      const shred = new THREE.Mesh(shredGeo, i % 2 === 0 ? darkGreenMat : twineBurntMat);
      shred.rotation.y = Math.random() * Math.PI;
      shred.rotation.z = (Math.random() - 0.5) * 0.4;
      shred.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
      group.add(shred);
    }
  } else if (category === 'saram') {
    // Scorched black line with red paper shreds
    const redShredMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
    for (let i = 0; i < 12; i++) {
      const offsetX = (i - 6) * 0.18 + (Math.random() - 0.5) * 0.08;
      const scrap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, 0.04), i % 3 === 0 ? ashMat : redShredMat);
      scrap.rotation.y = Math.random() * Math.PI;
      scrap.position.set(offsetX, 0.015, (Math.random() - 0.5) * 0.1);
      group.add(scrap);
    }
  } else if (category === 'chakra') {
    // Blackened circular ring impression
    const ringGeo = new THREE.TorusGeometry(0.22, 0.025, 4, 16);
    const ring = new THREE.Mesh(ringGeo, ashMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    group.add(ring);
  } else {
    // Burnt rocket stick or sparkler wire
    const wireGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.5, 6);
    const wire = new THREE.Mesh(wireGeo, ashMat);
    wire.rotation.z = Math.PI / 3;
    wire.position.set(0.1, 0.08, 0);
    group.add(wire);
  }

  // Soft residual smoke wisps rising from burnt cracker
  const smokeMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.35,
  });
  const smokePuff1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), smokeMat);
  smokePuff1.position.set(0, 0.28, 0);
  const smokePuff2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), smokeMat);
  smokePuff2.position.set(0.04, 0.42, -0.02);
  group.add(smokePuff1, smokePuff2);

  return group;
}

// 8. Flying Rocket Projectile with fiery exhaust flame for ascending sky launch
export function createFlyingRocketMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Flying_Rocket_Projectile';

  // Rocket body tube
  const tubeGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.45, 12);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xec4899, // Bright festive magenta
    roughness: 0.3,
  });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.position.y = 0.22;
  group.add(tube);

  // Conical nose cone
  const noseGeo = new THREE.ConeGeometry(0.07, 0.2, 12);
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Gleaming gold
    metalness: 0.7,
    roughness: 0.2,
  });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.y = 0.52;
  group.add(nose);

  // Wooden stabilizer guide stick
  const stickGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.85, 6);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(-0.045, -0.2, 0);
  group.add(stick);

  // Fiery rocket exhaust flame & glow
  const flameGeo = new THREE.ConeGeometry(0.05, 0.28, 8);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.rotation.x = Math.PI;
  flame.position.y = -0.14;
  group.add(flame);

  const flameCoreGeo = new THREE.ConeGeometry(0.028, 0.18, 8);
  const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xfff066 });
  const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
  flameCore.rotation.x = Math.PI;
  flameCore.position.y = -0.09;
  group.add(flameCore);

  // Dynamic warm thrust light illuminating the night sky and ground below
  const thrustLight = new THREE.PointLight(0xff5500, 3.5, 6);
  thrustLight.position.y = -0.15;
  group.add(thrustLight);

  return group;
}
