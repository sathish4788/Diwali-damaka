/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Procedural Pixar-inspired character models for Aarav, Ananya, Appa, Amma, and Shopkeeper Uncle
// Built from 3-12 composite parts with custom PBR materials, expressive faces, traditional Indian attire, and live procedural animation hooks.

export interface AnimatedCharacter {
  group: THREE.Group;
  head: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  mouth: THREE.Mesh;
  eyes: THREE.Object3D[];
  characterId: string;
  update: (time: number, isTalking: boolean, isCelebrating: boolean) => void;
}

// Helper to make warm skin material
function createSkinMaterial(tone = 0xd99b77) {
  return new THREE.MeshStandardMaterial({
    color: tone,
    roughness: 0.65,
    metalness: 0.05,
  });
}

// Helper to create big stylized cartoon eyes
function createEyeGroup() {
  const eyeGroup = new THREE.Group();

  // Eyeball (sclera)
  const scleraGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const sclera = new THREE.Mesh(scleraGeo, scleraMat);
  sclera.scale.set(1, 1.1, 0.6);
  eyeGroup.add(sclera);

  // Iris (warm expressive brown)
  const irisGeo = new THREE.CircleGeometry(0.065, 16);
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.2 });
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.position.set(0, 0, 0.075);
  eyeGroup.add(iris);

  // Pupil
  const pupilGeo = new THREE.CircleGeometry(0.04, 16);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.set(0, 0, 0.078);
  eyeGroup.add(pupil);

  // Specular highlight dot (Pixar spark)
  const sparkGeo = new THREE.CircleGeometry(0.016, 8);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const spark = new THREE.Mesh(sparkGeo, sparkMat);
  spark.position.set(0.02, 0.02, 0.08);
  eyeGroup.add(spark);

  return eyeGroup;
}

// 1. Aarav – 8-year-old enthusiastic boy
export function createAarav(): AnimatedCharacter {
  const group = new THREE.Group();
  group.name = 'Aarav';

  // Base pivot at ground
  const skinMat = createSkinMaterial(0xd8956e);
  const kurtaMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 }); // bright saffron
  const pajamaMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.7 }); // cream
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c140d, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.2 });

  // Body / Kurta
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.75, 16);
  const body = new THREE.Mesh(bodyGeo, kurtaMat);
  body.position.y = 0.85;
  body.castShadow = true;
  group.add(body);

  // Gold trim on Kurta neck
  const trimGeo = new THREE.TorusGeometry(0.14, 0.02, 8, 16);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.7, roughness: 0.2 });
  const trim = new THREE.Mesh(trimGeo, goldMat);
  trim.rotation.x = Math.PI / 2;
  trim.position.set(0, 1.2, 0.02);
  group.add(trim);

  // Legs & Shoes
  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12);
  const leftLeg = new THREE.Mesh(legGeo, pajamaMat);
  leftLeg.position.set(-0.14, 0.35, 0);
  const rightLeg = new THREE.Mesh(legGeo, pajamaMat);
  rightLeg.position.set(0.14, 0.35, 0);
  group.add(leftLeg, rightLeg);

  const shoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.24);
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(-0.14, 0.06, 0.04);
  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0.14, 0.06, 0.04);
  group.add(leftShoe, rightShoe);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.25, 0);

  // Head mesh
  const headGeo = new THREE.SphereGeometry(0.32, 20, 20);
  headGeo.scale(1, 1.1, 1);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Boyish Hair
  const hairGeo = new THREE.SphereGeometry(0.34, 16, 16);
  hairGeo.scale(1.02, 0.7, 1.05);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.16, -0.02);
  headPivot.add(hair);

  // Hair Tuft in front
  const tuftGeo = new THREE.ConeGeometry(0.12, 0.2, 8);
  const tuft = new THREE.Mesh(tuftGeo, hairMat);
  tuft.rotation.x = -0.5;
  tuft.position.set(0.04, 0.32, 0.22);
  headPivot.add(tuft);

  // Eyes
  const leftEye = createEyeGroup();
  leftEye.position.set(-0.11, 0.04, 0.26);
  const rightEye = createEyeGroup();
  rightEye.position.set(0.11, 0.04, 0.26);
  headPivot.add(leftEye, rightEye);

  // Smile / Mouth
  const mouthGeo = new THREE.TorusGeometry(0.07, 0.018, 8, 16, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.rotation.x = Math.PI / 2;
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.12, 0.3);
  headPivot.add(mouth);

  group.add(headPivot);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.28, 1.15, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, kurtaMat);
  leftArmMesh.position.y = -0.2;
  leftArm.add(leftArmMesh);
  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
  leftHand.position.y = -0.42;
  leftArm.add(leftHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.28, 1.15, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, kurtaMat);
  rightArmMesh.position.y = -0.2;
  rightArm.add(rightArmMesh);
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
  rightHand.position.y = -0.42;
  rightArm.add(rightHand);

  group.add(leftArm, rightArm);
  group.scale.set(0.9, 0.9, 0.9);

  return {
    group,
    head: headPivot,
    leftArm,
    rightArm,
    mouth,
    eyes: [leftEye, rightEye],
    characterId: 'aarav',
    update: (time: number, isTalking: boolean, isCelebrating: boolean) => {
      // Breathing & idle bobbing
      headPivot.position.y = 1.25 + Math.sin(time * 2.5) * 0.015;
      headPivot.rotation.z = Math.sin(time * 1.5) * 0.04;

      if (isCelebrating) {
        // High arms waving
        leftArm.rotation.z = Math.PI * 0.75 + Math.sin(time * 8) * 0.25;
        rightArm.rotation.z = -Math.PI * 0.75 - Math.sin(time * 8) * 0.25;
        leftArm.rotation.x = Math.sin(time * 6) * 0.3;
        rightArm.rotation.x = Math.sin(time * 6) * 0.3;
        headPivot.rotation.y = Math.sin(time * 4) * 0.15;
        mouth.scale.set(1.3, 1.4, 1);
      } else if (isTalking) {
        leftArm.rotation.z = 0.2 + Math.sin(time * 4) * 0.15;
        rightArm.rotation.z = -0.3 + Math.sin(time * 5) * 0.2;
        leftArm.rotation.x = -0.2 + Math.sin(time * 3) * 0.15;
        mouth.scale.y = 1 + Math.sin(time * 15) * 0.4;
      } else {
        leftArm.rotation.z = 0.1 + Math.sin(time * 2) * 0.05;
        rightArm.rotation.z = -0.1 - Math.sin(time * 2) * 0.05;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
        mouth.scale.set(1, 1, 1);
      }
    },
  };
}

// 2. Ananya – 6-year-old clever sister
export function createAnanya(): AnimatedCharacter {
  const group = new THREE.Group();
  group.name = 'Ananya';

  const skinMat = createSkinMaterial(0xd69368);
  const lehengaMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 }); // vibrant magenta pink
  const choliMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.5 }); // violet choli
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x140e0a, roughness: 0.8 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });

  // Flared Lehenga Skirt (cone/lathe silhouette)
  const skirtGeo = new THREE.ConeGeometry(0.36, 0.65, 18, 1, true);
  const skirt = new THREE.Mesh(skirtGeo, lehengaMat);
  skirt.position.y = 0.42;
  skirt.castShadow = true;
  group.add(skirt);

  // Skirt golden border
  const skirtBorderGeo = new THREE.TorusGeometry(0.36, 0.02, 8, 18);
  const skirtBorder = new THREE.Mesh(skirtBorderGeo, goldMat);
  skirtBorder.rotation.x = Math.PI / 2;
  skirtBorder.position.y = 0.1;
  group.add(skirtBorder);

  // Choli (upper body)
  const choliGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 16);
  const choli = new THREE.Mesh(choliGeo, choliMat);
  choli.position.y = 0.88;
  choli.castShadow = true;
  group.add(choli);

  // Golden Dupatta Sash across shoulder
  const sashGeo = new THREE.TorusGeometry(0.24, 0.025, 8, 16);
  const sash = new THREE.Mesh(sashGeo, goldMat);
  sash.rotation.z = 0.6;
  sash.rotation.x = 0.4;
  sash.position.set(0, 0.88, 0.02);
  group.add(sash);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.18, 0);

  // Cute rounded head
  const headGeo = new THREE.SphereGeometry(0.29, 20, 20);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Hair with side braids
  const hairGeo = new THREE.SphereGeometry(0.31, 16, 16);
  hairGeo.scale(1.02, 0.8, 1.05);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.12, -0.03);
  headPivot.add(hair);

  // Braids on sides
  const braidGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.35, 8);
  const leftBraid = new THREE.Mesh(braidGeo, hairMat);
  leftBraid.position.set(-0.25, -0.15, 0.02);
  leftBraid.rotation.z = -0.2;
  const rightBraid = new THREE.Mesh(braidGeo, hairMat);
  rightBraid.position.set(0.25, -0.15, 0.02);
  rightBraid.rotation.z = 0.2;
  headPivot.add(leftBraid, rightBraid);

  // Jasmine Gajra (white flower circlet in hair)
  const gajraGeo = new THREE.TorusGeometry(0.14, 0.02, 8, 16);
  const gajraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const gajra = new THREE.Mesh(gajraGeo, gajraMat);
  gajra.position.set(0, 0.24, -0.12);
  headPivot.add(gajra);

  // Tiny red Bindi
  const bindiGeo = new THREE.CircleGeometry(0.02, 8);
  const bindiMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const bindi = new THREE.Mesh(bindiGeo, bindiMat);
  bindi.position.set(0, 0.09, 0.292);
  headPivot.add(bindi);

  // Eyes
  const leftEye = createEyeGroup();
  leftEye.position.set(-0.095, 0.02, 0.25);
  leftEye.scale.set(0.9, 0.9, 0.9);
  const rightEye = createEyeGroup();
  rightEye.position.set(0.095, 0.02, 0.25);
  rightEye.scale.set(0.9, 0.9, 0.9);
  headPivot.add(leftEye, rightEye);

  // Smiling mouth
  const mouthGeo = new THREE.TorusGeometry(0.055, 0.015, 8, 16, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe185d });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.rotation.x = Math.PI / 2;
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.1, 0.28);
  headPivot.add(mouth);

  group.add(headPivot);

  // Arms with golden bangles
  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.38, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.24, 1.02, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.18;
  leftArm.add(leftArmMesh);

  const bangleGeo = new THREE.TorusGeometry(0.052, 0.012, 6, 12);
  const leftBangle = new THREE.Mesh(bangleGeo, goldMat);
  leftBangle.position.y = -0.3;
  leftBangle.rotation.x = Math.PI / 2;
  leftArm.add(leftBangle);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.24, 1.02, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.18;
  rightArm.add(rightArmMesh);

  const rightBangle = new THREE.Mesh(bangleGeo, goldMat);
  rightBangle.position.y = -0.3;
  rightBangle.rotation.x = Math.PI / 2;
  rightArm.add(rightBangle);

  group.add(leftArm, rightArm);
  group.scale.set(0.82, 0.82, 0.82);

  return {
    group,
    head: headPivot,
    leftArm,
    rightArm,
    mouth,
    eyes: [leftEye, rightEye],
    characterId: 'ananya',
    update: (time: number, isTalking: boolean, isCelebrating: boolean) => {
      headPivot.position.y = 1.18 + Math.sin(time * 3) * 0.012;
      headPivot.rotation.z = Math.cos(time * 2) * 0.05;

      if (isCelebrating) {
        leftArm.rotation.z = Math.PI * 0.65 + Math.sin(time * 7) * 0.2;
        rightArm.rotation.z = -Math.PI * 0.65 - Math.sin(time * 7) * 0.2;
        mouth.scale.set(1.2, 1.3, 1);
      } else if (isTalking) {
        // Explaining gesture (counting on fingers)
        leftArm.rotation.z = 0.3 + Math.sin(time * 4) * 0.2;
        leftArm.rotation.x = -0.4;
        rightArm.rotation.z = -0.2;
        mouth.scale.y = 1 + Math.sin(time * 16) * 0.45;
      } else {
        leftArm.rotation.z = 0.12;
        rightArm.rotation.z = -0.12;
        mouth.scale.set(1, 1, 1);
      }
    },
  };
}

// 3. Appa – Father
export function createAppa(): AnimatedCharacter {
  const group = new THREE.Group();
  group.name = 'Appa';

  const skinMat = createSkinMaterial(0xc9865c);
  const kurtaMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }); // Royal Navy Blue
  const pajamaMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.8 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.34, 1.1, 16);
  const body = new THREE.Mesh(bodyGeo, kurtaMat);
  body.position.y = 1.25;
  body.castShadow = true;
  group.add(body);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.75, 12);
  const leftLeg = new THREE.Mesh(legGeo, pajamaMat);
  leftLeg.position.set(-0.16, 0.45, 0);
  const rightLeg = new THREE.Mesh(legGeo, pajamaMat);
  rightLeg.position.set(0.16, 0.45, 0);
  group.add(leftLeg, rightLeg);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.95, 0);

  const headGeo = new THREE.SphereGeometry(0.35, 20, 20);
  headGeo.scale(1, 1.15, 1);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Neat hair + sideburns
  const hairGeo = new THREE.SphereGeometry(0.37, 16, 16);
  hairGeo.scale(1.02, 0.6, 1.05);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.22, -0.02);
  headPivot.add(hair);

  // Glasses (thin gold wireframes)
  const glassRimGeo = new THREE.TorusGeometry(0.08, 0.012, 8, 16);
  const leftGlass = new THREE.Mesh(glassRimGeo, goldMat);
  leftGlass.position.set(-0.12, 0.04, 0.35);
  const rightGlass = new THREE.Mesh(glassRimGeo, goldMat);
  rightGlass.position.set(0.12, 0.04, 0.35);
  const bridgeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08);
  const bridge = new THREE.Mesh(bridgeGeo, goldMat);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.04, 0.36);
  headPivot.add(leftGlass, rightGlass, bridge);

  // Eyes
  const leftEye = createEyeGroup();
  leftEye.position.set(-0.12, 0.04, 0.3);
  const rightEye = createEyeGroup();
  rightEye.position.set(0.12, 0.04, 0.3);
  headPivot.add(leftEye, rightEye);

  // Friendly smile
  const mouthGeo = new THREE.TorusGeometry(0.08, 0.018, 8, 16, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x881337 });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.rotation.x = Math.PI / 2;
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.15, 0.34);
  headPivot.add(mouth);

  group.add(headPivot);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.38, 1.68, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, kurtaMat);
  leftArmMesh.position.y = -0.28;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.38, 1.68, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, kurtaMat);
  rightArmMesh.position.y = -0.28;
  rightArm.add(rightArmMesh);

  group.add(leftArm, rightArm);
  group.scale.set(1.1, 1.1, 1.1);

  return {
    group,
    head: headPivot,
    leftArm,
    rightArm,
    mouth,
    eyes: [leftEye, rightEye],
    characterId: 'appa',
    update: (time: number, isTalking: boolean, isCelebrating: boolean) => {
      headPivot.position.y = 1.95 + Math.sin(time * 2) * 0.01;

      if (isCelebrating) {
        leftArm.rotation.z = 0.4;
        rightArm.rotation.z = -0.4;
        rightArm.rotation.x = -0.5 + Math.sin(time * 5) * 0.2;
        mouth.scale.set(1.2, 1.2, 1);
      } else if (isTalking) {
        rightArm.rotation.z = -0.3 + Math.sin(time * 3) * 0.15;
        rightArm.rotation.x = -0.3;
        mouth.scale.y = 1 + Math.sin(time * 14) * 0.35;
      } else {
        leftArm.rotation.z = 0.08;
        rightArm.rotation.z = -0.08;
        mouth.scale.set(1, 1, 1);
      }
    },
  };
}

// 4. Amma – Mother
export function createAmma(): AnimatedCharacter {
  const group = new THREE.Group();
  group.name = 'Amma';

  const skinMat = createSkinMaterial(0xd7966b);
  const sareeMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.35 }); // Golden Mustard Silk
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }); // Crimson Red border
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });

  // Elegant flowing Saree dress
  const sareeGeo = new THREE.CylinderGeometry(0.24, 0.42, 1.35, 18);
  const saree = new THREE.Mesh(sareeGeo, sareeMat);
  saree.position.y = 0.75;
  saree.castShadow = true;
  group.add(saree);

  // Saree Pallu drape across chest
  const palluGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 16);
  const pallu = new THREE.Mesh(palluGeo, borderMat);
  pallu.rotation.z = 0.8;
  pallu.rotation.x = 0.3;
  pallu.position.set(-0.02, 1.15, 0.04);
  group.add(pallu);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.62, 0);

  const headGeo = new THREE.SphereGeometry(0.32, 20, 20);
  headGeo.scale(1, 1.1, 1);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Full traditional Indian hairstyle for Amma (visible from front, sides, and back)
  // 1. Sleek glossy black hair crown covering top, crown, and sides
  const hairCrownGeo = new THREE.SphereGeometry(0.332, 20, 20);
  hairCrownGeo.scale(1.02, 1.08, 1.02);
  const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
  hairCrown.position.set(0, 0.07, -0.04);
  headPivot.add(hairCrown);

  // 2. Center-parted frontal hairline waves (left & right) framing forehead
  const frontHairLeftGeo = new THREE.SphereGeometry(0.18, 14, 14);
  frontHairLeftGeo.scale(1.2, 0.65, 0.7);
  const frontHairLeft = new THREE.Mesh(frontHairLeftGeo, hairMat);
  frontHairLeft.position.set(-0.16, 0.18, 0.18);
  frontHairLeft.rotation.set(0.2, 0.4, -0.3);

  const frontHairRightGeo = new THREE.SphereGeometry(0.18, 14, 14);
  frontHairRightGeo.scale(1.2, 0.65, 0.7);
  const frontHairRight = new THREE.Mesh(frontHairRightGeo, hairMat);
  frontHairRight.position.set(0.16, 0.18, 0.18);
  frontHairRight.rotation.set(0.2, -0.4, 0.3);
  headPivot.add(frontHairLeft, frontHairRight);

  // 3. Side locks covering ears and neatly sweeping into the bun
  const sideLockGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.35, 10);
  const leftSideLock = new THREE.Mesh(sideLockGeo, hairMat);
  leftSideLock.position.set(-0.31, 0.02, -0.05);
  leftSideLock.rotation.z = 0.2;

  const rightSideLock = new THREE.Mesh(sideLockGeo, hairMat);
  rightSideLock.position.set(0.31, 0.02, -0.05);
  rightSideLock.rotation.z = -0.2;
  headPivot.add(leftSideLock, rightSideLock);

  // 4. Elegant gold Maang Tikka jewel hanging on forehead parting
  const tikkaChainGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.14);
  const tikkaChain = new THREE.Mesh(tikkaChainGeo, goldMat);
  tikkaChain.position.set(0, 0.21, 0.28);
  tikkaChain.rotation.x = 0.45;

  const tikkaPendantGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const tikkaPendant = new THREE.Mesh(tikkaPendantGeo, goldMat);
  tikkaPendant.position.set(0, 0.14, 0.32);
  headPivot.add(tikkaChain, tikkaPendant);

  // 5. Traditional low hair bun at the back
  const bunGeo = new THREE.SphereGeometry(0.21, 18, 18);
  const bun = new THREE.Mesh(bunGeo, hairMat);
  bun.position.set(0, 0.02, -0.31);
  headPivot.add(bun);

  // 6. Double layered fragrant white Jasmine Gajra garland
  const gajraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const gajraGeo1 = new THREE.TorusGeometry(0.2, 0.035, 8, 18);
  const gajra1 = new THREE.Mesh(gajraGeo1, gajraMat);
  gajra1.position.set(0, 0.02, -0.3);

  const gajraGeo2 = new THREE.TorusGeometry(0.14, 0.03, 8, 18);
  const gajra2 = new THREE.Mesh(gajraGeo2, gajraMat);
  gajra2.position.set(0, 0.02, -0.34);
  headPivot.add(gajra1, gajra2);

  // 7. Golden hair brooch ornament at the center of the bun
  const hairBroochGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 10);
  const hairBrooch = new THREE.Mesh(hairBroochGeo, goldMat);
  hairBrooch.rotation.x = Math.PI / 2;
  hairBrooch.position.set(0, 0.02, -0.42);
  headPivot.add(hairBrooch);

  // Red round Bindi
  const bindiGeo = new THREE.CircleGeometry(0.025, 8);
  const bindi = new THREE.Mesh(bindiGeo, new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
  bindi.position.set(0, 0.08, 0.322);
  headPivot.add(bindi);

  // Jhumka Earrings
  const jhumkaGeo = new THREE.ConeGeometry(0.04, 0.08, 8);
  const leftJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
  leftJhumka.position.set(-0.33, -0.06, 0);
  const rightJhumka = new THREE.Mesh(jhumkaGeo, goldMat);
  rightJhumka.position.set(0.33, -0.06, 0);
  headPivot.add(leftJhumka, rightJhumka);

  // Eyes
  const leftEye = createEyeGroup();
  leftEye.position.set(-0.11, 0.02, 0.28);
  const rightEye = createEyeGroup();
  rightEye.position.set(0.11, 0.02, 0.28);
  headPivot.add(leftEye, rightEye);

  // Warm gentle smile
  const mouthGeo = new THREE.TorusGeometry(0.07, 0.016, 8, 16, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, new THREE.MeshBasicMaterial({ color: 0x991b1b }));
  mouth.rotation.x = Math.PI / 2;
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.12, 0.31);
  headPivot.add(mouth);

  group.add(headPivot);

  // Arms with gold glass bangles
  const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.5, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.32, 1.38, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
  leftArmMesh.position.y = -0.22;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.32, 1.38, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
  rightArmMesh.position.y = -0.22;
  rightArm.add(rightArmMesh);

  group.add(leftArm, rightArm);
  group.scale.set(1.0, 1.0, 1.0);

  return {
    group,
    head: headPivot,
    leftArm,
    rightArm,
    mouth,
    eyes: [leftEye, rightEye],
    characterId: 'amma',
    update: (time: number, isTalking: boolean, isCelebrating: boolean) => {
      headPivot.position.y = 1.62 + Math.sin(time * 2.2) * 0.01;

      if (isCelebrating) {
        leftArm.rotation.z = 0.3 + Math.sin(time * 5) * 0.15;
        rightArm.rotation.z = -0.3 - Math.sin(time * 5) * 0.15;
        mouth.scale.set(1.15, 1.2, 1);
      } else if (isTalking) {
        leftArm.rotation.z = 0.2 + Math.sin(time * 3) * 0.1;
        mouth.scale.y = 1 + Math.sin(time * 14) * 0.3;
      } else {
        leftArm.rotation.z = 0.08;
        rightArm.rotation.z = -0.08;
        mouth.scale.set(1, 1, 1);
      }
    },
  };
}

// 5. Shopkeeper Uncle (Murugan Uncle)
export function createShopkeeperUncle(): AnimatedCharacter {
  const group = new THREE.Group();
  group.name = 'ShopkeeperUncle';

  const skinMat = createSkinMaterial(0xbf784a);
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 }); // Maroon Nehru vest
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 }); // Cream kurta
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x262626, roughness: 0.85 });

  // Jolly stout torso
  const torsoGeo = new THREE.CylinderGeometry(0.36, 0.42, 1.0, 16);
  const torso = new THREE.Mesh(torsoGeo, vestMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  // Shirt collar
  const collarGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 16);
  const collar = new THREE.Mesh(collarGeo, shirtMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 1.62, 0.02);
  group.add(collar);

  // Head Pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.85, 0);

  const headGeo = new THREE.SphereGeometry(0.36, 20, 20);
  headGeo.scale(1.1, 1.1, 1);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Jolly thick South-Indian mustache
  const stacheGeo = new THREE.TorusGeometry(0.12, 0.032, 8, 16, Math.PI);
  const stache = new THREE.Mesh(stacheGeo, hairMat);
  stache.rotation.z = Math.PI;
  stache.position.set(0, -0.08, 0.36);
  headPivot.add(stache);

  // Big smiling mouth
  const mouthGeo = new THREE.TorusGeometry(0.09, 0.02, 8, 16, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, new THREE.MeshBasicMaterial({ color: 0x450a0a }));
  mouth.rotation.x = Math.PI / 2;
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.16, 0.34);
  headPivot.add(mouth);

  // Eyes
  const leftEye = createEyeGroup();
  leftEye.position.set(-0.13, 0.06, 0.32);
  const rightEye = createEyeGroup();
  rightEye.position.set(0.13, 0.06, 0.32);
  headPivot.add(leftEye, rightEye);

  group.add(headPivot);

  // Welcoming arms
  const armGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.55, 12);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.44, 1.5, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
  leftArmMesh.position.y = -0.25;
  leftArm.add(leftArmMesh);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.44, 1.5, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
  rightArmMesh.position.y = -0.25;
  rightArm.add(rightArmMesh);

  group.add(leftArm, rightArm);
  group.scale.set(1.05, 1.05, 1.05);

  return {
    group,
    head: headPivot,
    leftArm,
    rightArm,
    mouth,
    eyes: [leftEye, rightEye],
    characterId: 'uncle',
    update: (time: number, isTalking: boolean, isCelebrating?: boolean) => {
      headPivot.position.y = 1.85 + Math.sin(time * 2) * 0.015;
      if (isCelebrating) {
        leftArm.rotation.z = 0.5 + Math.sin(time * 5) * 0.2;
        rightArm.rotation.z = -0.5 - Math.sin(time * 5) * 0.2;
        mouth.scale.set(1.2, 1.2, 1);
      } else if (isTalking) {
        leftArm.rotation.z = 0.4 + Math.sin(time * 3) * 0.15;
        rightArm.rotation.z = -0.4 - Math.sin(time * 3) * 0.15;
        mouth.scale.y = 1 + Math.sin(time * 12) * 0.4;
      } else {
        leftArm.rotation.z = 0.2;
        rightArm.rotation.z = -0.2;
        mouth.scale.set(1, 1, 1);
      }
    },
  };
}
