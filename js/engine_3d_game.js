// =========================================================================
// 3. CACHÉ GLOBAL DE GEOMETRÍAS Y TEXTURAS (OPTIMIZACIÓN REDMI NOTE 8 / 13)
// =========================================================================
const GEO_CACHE = {
  wheelTire: new THREE.CylinderGeometry(0.40, 0.40, 0.36, 12),
  wheelRim: new THREE.CylinderGeometry(0.26, 0.26, 0.38, 8),
  wheelSpoke: new THREE.BoxGeometry(0.40, 0.07, 0.44),
  post: new THREE.BoxGeometry(0.34, 1.05, 0.34),
  pillar: new THREE.CylinderGeometry(1.3, 1.7, 1, 8),
  boulder: new THREE.DodecahedronGeometry(1.45, 0),
  particle: new THREE.SphereGeometry(0.28, 5, 5),
  ringWarn: new THREE.RingGeometry(1.2, 2.1, 16),
  skyRing: new THREE.TorusGeometry(6.8, 0.48, 8, 24),
  donutArch: new THREE.TorusGeometry(11.5, 2.8, 12, 28),
  dangoBall: new THREE.SphereGeometry(2.6, 10, 10)
};
GEO_CACHE.wheelTire.rotateZ(Math.PI / 2);
GEO_CACHE.wheelRim.rotateZ(Math.PI / 2);
GEO_CACHE.ringWarn.rotateX(-Math.PI / 2);

const MAT_CACHE = {
  carbon: new THREE.MeshLambertMaterial({ color: 0x111827 }),
  glass: new THREE.MeshLambertMaterial({ color: 0x090d16 }),
  tire: new THREE.MeshLambertMaterial({ color: 0x0f172a }),
  rim: new THREE.MeshLambertMaterial({ color: 0xe2e8f0 }),
  headlight: new THREE.MeshBasicMaterial({ color: 0xe0f2fe }),
  exhaust: new THREE.MeshLambertMaterial({ color: 0x94a3b8 }),
  pillar: new THREE.MeshLambertMaterial({ color: 0x334155 }),
  snow: new THREE.MeshBasicMaterial({ color: 0xf8fafc })
};

function createRoadTexture(trackCfg) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = trackCfg.roadPrimary;
  ctx.fillRect(0, 0, 256, 256);

  const stripeCount = 8;
  const stripeH = 256 / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? trackCfg.kerbColorA : trackCfg.kerbColorB;
    ctx.fillRect(0, i * stripeH, 16, stripeH);
    ctx.fillRect(256 - 16, i * stripeH, 16, stripeH);
  }

  ctx.fillStyle = trackCfg.roadLineColor;
  ctx.fillRect(20, 0, 5, 256);
  ctx.fillRect(256 - 25, 0, 5, 256);

  ctx.fillStyle = trackCfg.sceneryType === 'candy' ? 'rgba(255, 241, 242, 0.92)' : 'rgba(248, 250, 252, 0.8)';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(86, i * 64 + 10, 4, 34);
    ctx.fillRect(166, i * 64 + 10, 4, 34);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, trackCfg.totalLaps === 1 ? 150 : 85);
  return texture;
}

function createCheckeredTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const sq = 8;
  for (let y = 0; y < 32 / sq; y++) {
    for (let x = 0; x < 128 / sq; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#0f172a';
      ctx.fillRect(x * sq, y * sq, sq, sq);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Procedural Narutomaki Swirl Texture (🍥)
let _cachedNarutoTex = null;
function getNarutoSwirlTexture() {
  if (_cachedNarutoTex) return _cachedNarutoTex;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff1f2';
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 5.2; a += 0.12) {
    const r = a * 3.1;
    const x = 64 + Math.cos(a) * r;
    const y = 64 + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  _cachedNarutoTex = new THREE.CanvasTexture(canvas);
  return _cachedNarutoTex;
}

// Procedural Cyberpunk Street Mural Texture ("Murales")
let _cachedMuralTextures = null;
function getCyberMuralTextures() {
  if (_cachedMuralTextures) return _cachedMuralTextures;
  const palettes = [
    { bg: '#090418', c1: '#f72585', c2: '#00f5d4', c3: '#fde047', title: 'CYBER VALKYRIE' },
    { bg: '#040d1a', c1: '#4cc9f0', c2: '#a855f7', c3: '#f43f5e', title: 'NEON SAMURAI' },
    { bg: '#0f051d', c1: '#fbbf24', c2: '#ec4899', c3: '#22d3ee', title: 'DATA NEXUS 99' }
  ];
  _cachedMuralTextures = palettes.map((pal) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = pal.c2;
    ctx.lineWidth = 2;
    for (let x = 16; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 128);
      ctx.stroke();
    }

    const grad = ctx.createLinearGradient(0, 12, 0, 110);
    grad.addColorStop(0, pal.c1);
    grad.addColorStop(1, pal.c3);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 64, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(85, 52);
    ctx.lineTo(171, 52);
    ctx.lineTo(155, 76);
    ctx.lineTo(101, 76);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = pal.c2;
    ctx.fillRect(96, 58, 64, 7);

    ctx.strokeStyle = pal.c1;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 122);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pal.title, 128, 114);

    return new THREE.CanvasTexture(canvas);
  });
  return _cachedMuralTextures;
}

let _cachedDataTexture = null;
function getCyberDataStreamTexture() {
  if (_cachedDataTexture) return _cachedDataTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 128, 256);

  const glyphs = ['01', '10', 'FF', 'A9', 'C4', '7E', '00', '11'];
  ctx.font = 'bold 14px monospace';
  for (let col = 0; col < 6; col++) {
    ctx.fillStyle = col % 2 === 0 ? '#00f5d4' : '#e879f9';
    for (let row = 0; row < 16; row++) {
      const g = glyphs[(col * 7 + row * 3) % glyphs.length];
      ctx.fillText(g, 8 + col * 20, 16 + row * 15);
    }
  }
  _cachedDataTexture = new THREE.CanvasTexture(canvas);
  _cachedDataTexture.wrapS = THREE.RepeatWrapping;
  _cachedDataTexture.wrapT = THREE.RepeatWrapping;
  return _cachedDataTexture;
}

// =========================================================================
// 4. ETIQUETA 3D FLOTANTE NO INTRUSIVA ARRIBA DEL COCHE + 8 COCHES ÚNICOS
// =========================================================================
function createCarNameSpriteTexture(pilotName, hexColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 256, 64);

  // Subtle, non-intrusive dark pill
  ctx.fillStyle = 'rgba(8, 13, 26, 0.66)';
  ctx.strokeStyle = hexColor || '#38bdf8';
  ctx.lineWidth = 3;

  const rx = 18, ry = 12, rw = 220, rh = 38, rad = 18;
  ctx.beginPath();
  ctx.moveTo(rx + rad, ry);
  ctx.lineTo(rx + rw - rad, ry);
  ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
  ctx.lineTo(rx + rw, ry + rh - rad);
  ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
  ctx.lineTo(rx + rad, ry + rh);
  ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
  ctx.lineTo(rx, ry + rad);
  ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Player Paint Color Dot
  ctx.fillStyle = hexColor || '#38bdf8';
  ctx.beginPath();
  ctx.arc(42, 31, 8, 0, Math.PI * 2);
  ctx.fill();

  // Pilot Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const cleanName = String(pilotName || 'Piloto').slice(0, 14);
  ctx.fillText(cleanName, 58, 32);

  return new THREE.CanvasTexture(canvas);
}

function buildCarNameSprite(pilotName, hexColor) {
  const tex = createCarNameSpriteTexture(pilotName, hexColor);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(mat);
  // Positioned right above the car roof, small and unobtrusive
  sprite.position.set(0, 1.72, 0);
  sprite.scale.set(2.15, 0.54, 1);
  return sprite;
}

function updateCarMeshColorAndLabel(carMesh, hexColor, pilotName) {
  if (!carMesh || !carMesh.userData) return;
  const ud = carMesh.userData;
  if (hexColor && ud.paintMat) {
    ud.paintMat.color.set(hexColor);
  }
  if (hexColor && ud.glowPlaneMat) {
    ud.glowPlaneMat.color.set(hexColor);
  }
  if (pilotName) {
    if (!ud.nameSprite) {
      const sp = buildCarNameSprite(pilotName, hexColor || '#38bdf8');
      carMesh.add(sp);
      ud.nameSprite = sp;
    } else {
      if (ud.nameSprite.material.map) ud.nameSprite.material.map.dispose();
      ud.nameSprite.material.map = createCarNameSpriteTexture(pilotName, hexColor || '#38bdf8');
      ud.nameSprite.material.needsUpdate = true;
    }
  }
}

function buildDetailedCarMesh(carConfig, customHexColor, isPlayer = false, labelName = null) {
  const carGroup = new THREE.Group();
  const bodyColor = new THREE.Color(customHexColor || carConfig.defaultColor);
  const accentColor = new THREE.Color(carConfig.accentColor || '#38bdf8');

  const paintMat = new THREE.MeshLambertMaterial({ color: bodyColor });
  const accentMat = new THREE.MeshBasicMaterial({ color: accentColor });

  const bStyle = carConfig.bodyStyle || 'coupe';

  if (bStyle === 'formula_x') {
    // Open-wheel Formula Zero chassis
    const noseCone = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.34, 4.7), paintMat);
    noseCone.position.set(0, 0.48, 0);
    const sidePods = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.42, 2.2), paintMat);
    sidePods.position.set(0, 0.48, 0.35);
    const frontWing = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.08, 0.55), MAT_CACHE.carbon);
    frontWing.position.set(0, 0.25, -2.25);
    const haloCockpit = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.38, 1.1), MAT_CACHE.glass);
    haloCockpit.position.set(0, 0.80, 0.1);
    const airbox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.9), paintMat);
    airbox.position.set(0, 0.95, 0.75);
    carGroup.add(noseCone, sidePods, frontWing, haloCockpit, airbox);
  } else if (bStyle === 'monster_6x6') {
    // Tall 6x6 Off-Road Pickup Beast
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.62, 4.95), paintMat);
    chassis.position.y = 0.68;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.58, 2.15), MAT_CACHE.glass);
    cabin.position.set(0, 1.18, -0.35);
    const roofLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.14, 0.22), accentMat);
    roofLightBar.position.set(0, 1.52, -1.25);
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.42, 0.25), MAT_CACHE.carbon);
    bullBar.position.set(0, 0.62, -2.52);
    carGroup.add(chassis, cabin, roofLightBar, bullBar);
  } else if (bStyle === 'candy_kart') {
    // Rounded Sweet Candy Kart with Pastel Stripes
    const tub = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.48, 4.35), paintMat);
    tub.position.y = 0.50;
    const creamStripe = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 4.38), new THREE.MeshBasicMaterial({ color: 0xfff1f2 }));
    creamStripe.position.y = 0.51;
    const bubbleVisor = new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), MAT_CACHE.glass);
    bubbleVisor.scale.set(1.0, 0.62, 1.25);
    bubbleVisor.position.set(0, 0.86, -0.1);
    carGroup.add(tub, creamStripe, bubbleVisor);
  } else {
    // Standard Hyper GT / Wedge / Hover GT / Exotic / Prototype
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.16, 4.75), MAT_CACHE.carbon);
    floorMesh.position.y = 0.26;
    carGroup.add(floorMesh);

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.52, 4.55), paintMat);
    bodyMesh.position.y = 0.56;
    carGroup.add(bodyMesh);

    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.34, 1.35), paintMat);
    noseMesh.position.set(0, 0.52, -1.75);
    noseMesh.rotation.x = 0.14;
    carGroup.add(noseMesh);

    const fenderGeo = new THREE.BoxGeometry(2.30, 0.42, 1.5);
    const frontFender = new THREE.Mesh(fenderGeo, paintMat);
    frontFender.position.set(0, 0.55, -1.35);
    const rearFender = new THREE.Mesh(fenderGeo, paintMat);
    rearFender.position.set(0, 0.60, 1.35);
    carGroup.add(frontFender, rearFender);

    const sideStrip = new THREE.Mesh(new THREE.BoxGeometry(2.33, 0.08, 2.9), accentMat);
    sideStrip.position.set(0, 0.32, 0);
    carGroup.add(sideStrip);

    const cabinWidth = bStyle === 'prototype' ? 1.45 : 1.68;
    const cabinLength = bStyle === 'wedge' ? 2.25 : 1.95;
    const cabinMesh = new THREE.Mesh(new THREE.BoxGeometry(cabinWidth, 0.46, cabinLength), MAT_CACHE.glass);
    cabinMesh.position.set(0, 0.96, -0.1);
    carGroup.add(cabinMesh);

    const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(cabinWidth * 0.86, 0.08, cabinLength * 0.72), paintMat);
    roofMesh.position.set(0, 1.20, -0.05);
    carGroup.add(roofMesh);
  }

  // Unique Spoilers & Rear Wings
  const spStyle = carConfig.spoilerStyle;
  if (spStyle === 'donut_wing') {
    const donutMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.22, 8, 16),
      new THREE.MeshLambertMaterial({ color: 0xf472b6 })
    );
    donutMesh.position.set(0, 1.15, 1.95);
    donutMesh.rotation.x = 0.35;
    carGroup.add(donutMesh);
  } else if (spStyle === 'halo_wing') {
    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.08, 6, 20),
      accentMat
    );
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.set(0, 1.05, 1.65);
    carGroup.add(haloRing);
  } else if (spStyle === 'gt_wing' || spStyle === 'lmp_wing' || spStyle === 'f1_wing') {
    const strutGeo = new THREE.BoxGeometry(0.08, 0.42, 0.32);
    const strutL = new THREE.Mesh(strutGeo, MAT_CACHE.carbon);
    strutL.position.set(-0.68, 0.98, 2.02);
    const strutR = new THREE.Mesh(strutGeo, MAT_CACHE.carbon);
    strutR.position.set(0.68, 0.98, 2.02);
    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.08, 0.50), spStyle === 'f1_wing' ? paintMat : MAT_CACHE.carbon);
    wingBlade.position.set(0, 1.18, 2.08);
    wingBlade.rotation.x = -0.12;
    carGroup.add(strutL, strutR, wingBlade);

    if (spStyle === 'lmp_wing' || spStyle === 'f1_wing') {
      const sharkFin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 1.25), paintMat);
      sharkFin.position.set(0, 1.06, 1.28);
      carGroup.add(sharkFin);
    }
  } else if (spStyle === 'twin_fin') {
    const finGeo = new THREE.BoxGeometry(0.1, 0.45, 0.85);
    const finL = new THREE.Mesh(finGeo, paintMat);
    finL.position.set(-0.88, 0.96, 1.85);
    const finR = new THREE.Mesh(finGeo, paintMat);
    finR.position.set(0.88, 0.96, 1.85);
    const lightBridge = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.06, 0.25), accentMat);
    lightBridge.position.set(0, 1.12, 2.02);
    carGroup.add(finL, finR, lightBridge);
  } else if (spStyle !== 'roof_rack') {
    const duckMesh = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.22, 0.42), paintMat);
    duckMesh.position.set(0, 0.86, 2.12);
    duckMesh.rotation.x = 0.28;
    carGroup.add(duckMesh);
  }

  // Headlights & Taillights
  const hlGeo = new THREE.BoxGeometry(0.46, 0.12, 0.1);
  const hlLeft = new THREE.Mesh(hlGeo, MAT_CACHE.headlight);
  hlLeft.position.set(-0.74, 0.56, -2.36);
  const hlRight = new THREE.Mesh(hlGeo, MAT_CACHE.headlight);
  hlRight.position.set(0.74, 0.56, -2.36);
  carGroup.add(hlLeft, hlRight);

  const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.14, 0.1), tailLightMat);
  tailBar.position.set(0, 0.64, 2.29);
  carGroup.add(tailBar);

  const pipeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.3, 8);
  pipeGeo.rotateX(Math.PI / 2);
  const pipeL = new THREE.Mesh(pipeGeo, MAT_CACHE.exhaust);
  pipeL.position.set(-0.48, 0.32, 2.34);
  const pipeR = new THREE.Mesh(pipeGeo, MAT_CACHE.exhaust);
  pipeR.position.set(0.48, 0.32, 2.34);
  carGroup.add(pipeL, pipeR);

  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.0
  });
  const flameGeo = new THREE.ConeGeometry(0.18, 1.05, 8);
  flameGeo.rotateX(Math.PI / 2);
  const flameL = new THREE.Mesh(flameGeo, flameMat);
  flameL.position.set(-0.48, 0.32, 2.85);
  const flameR = new THREE.Mesh(flameGeo, flameMat);
  flameR.position.set(0.48, 0.32, 2.85);
  carGroup.add(flameL, flameR);

  // Wheels (6 wheels for GOLIATH 6x6 BAJA, 4 wheels for others)
  const wheelPositions = bStyle === 'monster_6x6'
    ? [
        { x: -1.18, y: 0.44, z: -1.55, isFront: true },
        { x:  1.18, y: 0.44, z: -1.55, isFront: true },
        { x: -1.18, y: 0.44, z:  0.45, isFront: false },
        { x:  1.18, y: 0.44, z:  0.45, isFront: false },
        { x: -1.18, y: 0.44, z:  1.65, isFront: false },
        { x:  1.18, y: 0.44, z:  1.65, isFront: false }
      ]
    : [
        { x: -1.12, y: 0.40, z: -1.42, isFront: true },
        { x:  1.12, y: 0.40, z: -1.42, isFront: true },
        { x: -1.12, y: 0.42, z:  1.42, isFront: false },
        { x:  1.12, y: 0.42, z:  1.42, isFront: false }
      ];

  const frontWheelPivots = [];
  const wheelSpinMeshes = [];

  wheelPositions.forEach((wp) => {
    const pivot = new THREE.Group();
    pivot.position.set(wp.x, wp.y, wp.z);

    const spinGroup = new THREE.Group();
    spinGroup.add(new THREE.Mesh(GEO_CACHE.wheelTire, MAT_CACHE.tire));
    spinGroup.add(new THREE.Mesh(GEO_CACHE.wheelRim, MAT_CACHE.rim));
    spinGroup.add(new THREE.Mesh(GEO_CACHE.wheelSpoke, accentMat));

    pivot.add(spinGroup);
    carGroup.add(pivot);

    if (wp.isFront) frontWheelPivots.push(pivot);
    wheelSpinMeshes.push(spinGroup);
  });

  let glowPlaneMat = null;
  if (isPlayer) {
    const glowPlaneGeo = new THREE.PlaneGeometry(2.45, 4.85);
    glowPlaneGeo.rotateX(-Math.PI / 2);
    glowPlaneMat = new THREE.MeshBasicMaterial({
      color: bodyColor,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide
    });
    const glowPlane = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
    glowPlane.position.y = 0.06;
    carGroup.add(glowPlane);
  }

  let nameSprite = null;
  if (labelName) {
    nameSprite = buildCarNameSprite(labelName, customHexColor || carConfig.defaultColor);
    carGroup.add(nameSprite);
  }

  carGroup.userData = {
    paintMat,
    glowPlaneMat,
    tailLightMat,
    flameMat,
    flameL,
    flameR,
    frontWheelPivots,
    wheelSpinMeshes,
    nameSprite
  };

  return carGroup;
}

function buildWildlifeMesh(animalType = 'deer') {
  const group = new THREE.Group();

  // Gummy Bear Wildlife for Reino Dulce Candy!
  if (animalType === 'gummy') {
    const gummyColors = [0xf43f5e, 0xa855f7, 0x10b981, 0xfbbf24, 0xec4899];
    const gColor = gummyColors[Math.floor(Math.random() * gummyColors.length)];
    const gMat = new THREE.MeshLambertMaterial({ color: gColor });
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), gMat);
    belly.position.set(0, 1.0, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), gMat);
    head.position.set(0, 1.85, 0.15);
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), gMat);
    earL.position.set(-0.42, 2.28, 0.15);
    const earR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), gMat);
    earR.position.set(0.42, 2.28, 0.15);
    group.add(belly, head, earL, earR);

    const legs = [];
    const legGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.65, 8);
    [[-0.35, 0.55, 0.25], [0.35, 0.55, 0.25], [-0.35, 0.55, -0.25], [0.35, 0.55, -0.25]].forEach((lc) => {
      const p = new THREE.Group();
      p.position.set(lc[0], lc[1], lc[2]);
      const m = new THREE.Mesh(legGeo, gMat);
      m.position.y = -0.25;
      p.add(m);
      group.add(p);
      legs.push(p);
    });
    group.userData = { legs };
    return group;
  }

  const isCyber = animalType === 'cyberdeer';
  const isJaguar = animalType === 'jaguar';
  const coatHex = isCyber ? 0x0f172a : (isJaguar ? 0xeab308 : (animalType === 'antelope' ? 0xd97706 : 0x92400e));
  const accentHex = isCyber ? 0x22d3ee : (isJaguar ? 0x1c1917 : 0xfef3c7);

  const bodyMat = new THREE.MeshLambertMaterial({ color: coatHex });
  const accentMat = new THREE.MeshBasicMaterial({ color: accentHex });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.68, 1.75), bodyMat);
  torso.position.set(0, 1.10, 0);
  group.add(torso);

  if (isJaguar) {
    for (let s = -1; s <= 1; s++) {
      const spot = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.22, 0.28), accentMat);
      spot.position.set(0, 1.18, s * 0.45);
      group.add(spot);
    }
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.95), bodyMat);
    tail.position.set(0, 1.05, -1.15);
    tail.rotation.x = -0.35;
    group.add(tail);
  }

  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.38), bodyMat);
  neck.position.set(0, 1.55, 0.68);
  neck.rotation.x = -0.28;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.58), bodyMat);
  head.position.set(0, 1.82, 0.92);
  group.add(head);

  if (!isJaguar) {
    const hornGeo = new THREE.BoxGeometry(0.08, 0.52, 0.08);
    const hornL = new THREE.Mesh(hornGeo, accentMat);
    hornL.position.set(-0.22, 2.18, 0.82);
    hornL.rotation.z = 0.28;
    const hornR = new THREE.Mesh(hornGeo, accentMat);
    hornR.position.set(0.22, 2.18, 0.82);
    hornR.rotation.z = -0.28;
    group.add(hornL, hornR);
  }

  const legs = [];
  const legGeo = new THREE.BoxGeometry(0.18, 0.82, 0.18);
  const legCoords = [
    [-0.25, 0.82,  0.55],
    [ 0.25, 0.82,  0.55],
    [-0.25, 0.82, -0.55],
    [ 0.25, 0.82, -0.55]
  ];
  legCoords.forEach((lc) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(lc[0], lc[1], lc[2]);
    const legMesh = new THREE.Mesh(legGeo, bodyMat);
    legMesh.position.y = -0.41;
    legPivot.add(legMesh);
    group.add(legPivot);
    legs.push(legPivot);
  });

  group.userData = { legs };
  return group;
}

function buildRoadObstacleMesh(sceneryType, index) {
  const group = new THREE.Group();
  const kind = index % 3;

  if (sceneryType === 'candy') {
    // Candy Obstacles: Frosted Donut, Narutomaki Roll (🍥), or Wafer Bar
    if (kind === 0) {
      const donut = new THREE.Mesh(
        new THREE.TorusGeometry(1.15, 0.45, 8, 16),
        new THREE.MeshLambertMaterial({ color: 0xf472b6 })
      );
      donut.position.y = 1.25;
      group.add(donut);
    } else if (kind === 1) {
      const rollGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.65, 16);
      rollGeo.rotateX(Math.PI / 2);
      const roll = new THREE.Mesh(rollGeo, new THREE.MeshBasicMaterial({ map: getNarutoSwirlTexture() }));
      roll.position.y = 1.1;
      group.add(roll);
    } else {
      const wafer = new THREE.Mesh(
        new THREE.BoxGeometry(3.3, 1.1, 0.85),
        new THREE.MeshLambertMaterial({ color: 0xfde047 })
      );
      wafer.position.y = 0.6;
      const pinkCream = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, 0.32, 0.88),
        new THREE.MeshBasicMaterial({ color: 0xf472b6 })
      );
      pinkCream.position.y = 0.65;
      group.add(wafer, pinkCream);
    }
    return group;
  }

  if (kind === 0) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 1.15, 0.75),
      new THREE.MeshLambertMaterial({ color: 0xef4444 })
    );
    bar.position.y = 0.65;
    group.add(bar);

    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(3.46, 0.32, 0.78),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    stripe.position.y = 0.72;
    group.add(stripe);
  } else if (kind === 1) {
    const logGeo = new THREE.CylinderGeometry(0.62, 0.68, 3.6, 8);
    logGeo.rotateZ(Math.PI / 2);
    const logColor = (sceneryType === 'city' || sceneryType === 'cybermeta') ? 0x00f5d4 : (sceneryType === 'jungle' ? 0x3f2305 : 0x5c2d0c);
    const logMesh = new THREE.Mesh(logGeo, new THREE.MeshLambertMaterial({ color: logColor }));
    logMesh.position.y = 0.65;
    group.add(logMesh);
  } else {
    const rockMat = new THREE.MeshLambertMaterial({
      color: sceneryType === 'jungle' ? 0x365314 : ((sceneryType === 'city' || sceneryType === 'cybermeta') ? 0x475569 : 0x78350f)
    });
    const rMain = new THREE.Mesh(GEO_CACHE.boulder, rockMat);
    rMain.position.y = 1.05;
    group.add(rMain);
  }

  return group;
}

// =========================================================================
// 5. ESCENA 3D OPTIMIZADA PARA MÓVILES
// =========================================================================
const container = document.getElementById('game-canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xfbcfe8, 0.0019);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 1050);
const cameraP2 = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 1050);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: 'high-performance',
  precision: 'mediump'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
renderer.shadowMap.enabled = false;
container.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xfff1f2, 0xf472b6, 1.02);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
dirLight.position.set(80, 160, -90);
scene.add(dirLight);

const garageGroup = new THREE.Group();
const raceWorldGroup = new THREE.Group();
scene.add(garageGroup);
scene.add(raceWorldGroup);

// Starts on Track 0 ('Reino Dulce Candy' 🍩🥞🍡🍥) & Car 1 ('SUGAR RUSH KART') or Car 0
let selectedCarIndex = 0;
let selectedTrackIndex = 0;
let selectedDifficultyIndex = 1;
let selectedPaintColor = CARS[0].defaultColor;
let highQualityLighting = false;
let isDrawerCollapsed = true;
let activeGarageTab = 'car';
let gameMode = 'garage';
let multiplayerMode = 'solo';

let garageCarMesh = null;
let garagePlatform = null;
let garageUserRotation = 0;
let isDraggingGarage = false;
let dragLastX = 0;

function setupGarageScene() {
  while (garageGroup.children.length > 0) {
    garageGroup.remove(garageGroup.children[0]);
  }

  const platGeo = new THREE.CylinderGeometry(4.5, 5.0, 0.35, 32);
  const platMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
  garagePlatform = new THREE.Mesh(platGeo, platMat);
  garagePlatform.position.y = -0.18;
  garageGroup.add(garagePlatform);

  const ringGeo = new THREE.RingGeometry(4.2, 4.45, 48);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, side: THREE.DoubleSide });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 0.01;
  garageGroup.add(ringMesh);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 6);
    const pillarMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xf472b6 : 0x06b6d4 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(Math.cos(angle) * 6.5, 2.8, Math.sin(angle) * 6.5);
    garageGroup.add(pillar);
  }

  rebuildGarageCar();
}

function rebuildGarageCar() {
  if (garageCarMesh && garagePlatform) {
    garagePlatform.remove(garageCarMesh);
  }
  const carCfg = CARS[selectedCarIndex];
  const label = (mpState && mpState.playerName) ? mpState.playerName : 'Tú';
  garageCarMesh = buildDetailedCarMesh(carCfg, selectedPaintColor, true, label);
  garageCarMesh.position.y = 0.18;
  garagePlatform.add(garageCarMesh);
}

function setGarageDrawerCollapsed(collapsed) {
  isDrawerCollapsed = collapsed;
  const drawer = document.getElementById('garage-drawer');
  const label = document.getElementById('drawer-toggle-label');
  const icon = document.getElementById('icon-drawer-toggle');

  if (drawer) drawer.classList.toggle('collapsed', isDrawerCollapsed);
  if (label) label.textContent = isDrawerCollapsed ? 'Opciones' : 'Ver 3D';
  if (icon) icon.style.transform = isDrawerCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
}

// =========================================================================
// 6. SALA MULTIJUGADOR HASTA 8 JUGADORES, BOTS CONFIGURABLES Y SYNC DE COLOR
// =========================================================================
const MAX_ROOM_PLAYERS = 8;

const mpState = {
  selfId: 'p_' + Math.random().toString(36).substring(2, 9),
  peer: null,
  connections: [], // Host stores up to 7 peer connections; Client stores [hostConn]
  roomCode: '',
  isHost: true,
  connected: false,
  localChannel: null,
  globalChatChannel: null,
  playerName: '', // Mandatory in multiplayer!
  botCount: 3,    // Host chooses 0..7 bots so room (Humans + Bots <= 8) is never empty or overcrowded
  remotePlayers: {} // keyed by peerId: { id, name, carIndex, paintColor, distance, lateralOffset, speed, driftAngle, mesh, builtCarIndex, builtColor, builtName }
};

function ensureMandatoryMultiplayerName() {
  const nameInput = document.getElementById('mp-player-name-input');
  const typed = (nameInput ? nameInput.value : mpState.playerName || '').trim();
  if (!typed) {
    // Open Multiplayer drawer tab and focus the mandatory name input
    const mpTabBtn = document.querySelector('.garage-tab-btn[data-tab="multiplayer"]');
    if (mpTabBtn && (isDrawerCollapsed || activeGarageTab !== 'multiplayer')) {
      mpTabBtn.click();
    }
    if (nameInput) {
      nameInput.classList.add('ring-2', 'ring-rose-500');
      nameInput.focus();
      setTimeout(() => nameInput.classList.remove('ring-2', 'ring-rose-500'), 2200);
    }
    setMpStatus('⚠️ ¡Nombre obligatorio! Escribe tu nombre de piloto arriba para ubicarte en la sala y sobre tu coche.', 'text-rose-400 font-bold');
    showFloatingEmoteToast('Sistema', '⚠️ Escribe tu Nombre de Piloto obligatorio');
    sound.playTone(220, 0.22, 'sawtooth', 0.20, 140);
    return false;
  }
  mpState.playerName = typed.slice(0, 14);
  if (garageCarMesh) {
    updateCarMeshColorAndLabel(garageCarMesh, selectedPaintColor, mpState.playerName);
  }
  return true;
}

function getLocalPlayerSummary() {
  return {
    id: mpState.selfId,
    name: mpState.playerName || 'Piloto 1',
    carIndex: selectedCarIndex,
    paintColor: selectedPaintColor,
    isHost: mpState.isHost
  };
}

function getMaxAllowedBots() {
  const humanCount = 1 + Object.keys(mpState.remotePlayers).length;
  return Math.max(0, MAX_ROOM_PLAYERS - humanCount);
}

function renderBotCountButtons() {
  const container = document.getElementById('mp-bot-count-buttons');
  if (!container) return;
  container.innerHTML = '';
  const maxBots = getMaxAllowedBots();
  if (mpState.botCount > maxBots) {
    mpState.botCount = maxBots;
  }

  for (let b = 0; b <= 7; b++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    const disabled = b > maxBots || (multiplayerMode === 'online' && mpState.connected && !mpState.isHost);
    const active = b === mpState.botCount;
    btn.className = `px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
      active
        ? 'bg-amber-500 text-slate-950 shadow font-black'
        : (disabled ? 'bg-slate-900/40 text-slate-600 cursor-not-allowed' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700')
    }`;
    btn.textContent = String(b);
    btn.disabled = disabled;
    btn.addEventListener('click', () => {
      if (disabled) return;
      sound.init();
      sound.playTone(580, 0.06, 'triangle', 0.12);
      mpState.botCount = b;
      renderBotCountButtons();
      renderRoomPlayersRoster();
      broadcastProfileAndRosterSync();
    });
    container.appendChild(btn);
  }
}

function renderRoomPlayersRoster() {
  const listEl = document.getElementById('mp-room-players-list');
  const countEl = document.getElementById('mp-roster-count');
  const botsSummaryEl = document.getElementById('mp-bots-summary');
  if (!listEl) return;

  const humans = [getLocalPlayerSummary()];
  Object.values(mpState.remotePlayers).forEach((rp) => {
    if (humans.length < MAX_ROOM_PLAYERS) {
      humans.push(rp);
    }
  });

  if (countEl) countEl.textContent = String(humans.length);
  const maxBots = Math.max(0, MAX_ROOM_PLAYERS - humans.length);
  const effectiveBots = Math.min(mpState.botCount, maxBots);
  if (botsSummaryEl) {
    botsSummaryEl.textContent = `+ ${effectiveBots} Bots IA (Total: ${humans.length + effectiveBots}/8)`;
  }

  listEl.innerHTML = '';
  humans.forEach((p, idx) => {
    const carObj = CARS[(p.carIndex || 0) % CARS.length];
    const pill = document.createElement('div');
    pill.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/15 text-[9px] text-white shadow';
    const dot = document.createElement('span');
    dot.className = 'w-2.5 h-2.5 rounded-full shrink-0 border border-white/40';
    dot.style.backgroundColor = p.paintColor || carObj.defaultColor;

    const txt = document.createElement('span');
    const roleTag = idx === 0 ? ' (Tú)' : '';
    txt.innerHTML = `<strong class="text-cyan-200">${p.name}</strong>${roleTag} <span class="text-slate-400">• ${carObj.name.split(' ')[0]}</span>`;
    pill.appendChild(dot);
    pill.appendChild(txt);
    listEl.appendChild(pill);
  });
}

function syncRemotePlayerCarMesh(rp) {
  if (!rp || gameMode === 'garage') return;
  const carIdx = (rp.carIndex ?? 0) % CARS.length;
  const colorHex = rp.paintColor || CARS[carIdx].defaultColor;
  const pName = rp.name || 'Piloto';

  if (!rp.mesh || rp.builtCarIndex !== carIdx) {
    if (rp.mesh) {
      raceWorldGroup.remove(rp.mesh);
    }
    rp.mesh = buildDetailedCarMesh(CARS[carIdx], colorHex, true, pName);
    rp.builtCarIndex = carIdx;
    rp.builtColor = colorHex;
    rp.builtName = pName;
    raceWorldGroup.add(rp.mesh);
  } else if (rp.builtColor !== colorHex || rp.builtName !== pName) {
    updateCarMeshColorAndLabel(rp.mesh, colorHex, pName);
    rp.builtColor = colorHex;
    rp.builtName = pName;
  }
}

let emoteToastTimer = null;
function showFloatingEmoteToast(sender, text) {
  const toast = document.getElementById('emote-floating-toast');
  if (!toast) return;
  toast.textContent = `${sender}: ${text}`;
  toast.style.opacity = '1';
  if (emoteToastTimer) clearTimeout(emoteToastTimer);
  emoteToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2400);
}

function appendGlobalChatMessage(sender, text, isSelf = false) {
  const list = document.getElementById('chat-messages-list');
  if (!list) return;
  const item = document.createElement('div');
  item.className = 'text-slate-200 leading-tight';
  const nameSpan = document.createElement('span');
  nameSpan.className = isSelf ? 'text-cyan-300 font-bold' : 'text-amber-300 font-bold';
  nameSpan.textContent = `[${sender}]: `;
  const msgSpan = document.createElement('span');
  msgSpan.textContent = text;
  item.appendChild(nameSpan);
  item.appendChild(msgSpan);
  list.appendChild(item);
  list.scrollTop = list.scrollHeight;
  showFloatingEmoteToast(sender, text);
}

function sendGlobalChatOrEmote(text) {
  const clean = (text || '').trim();
  if (!clean) return;
  sound.init();
  const sName = mpState.playerName || 'Piloto';
  sound.playTone(720, 0.07, 'triangle', 0.12, 960);
  appendGlobalChatMessage(sName, clean, true);

  const packet = {
    type: 'chat',
    senderId: mpState.selfId,
    sender: sName,
    text: clean
  };
  sendMultiplayerPacket(packet);
  if (mpState.globalChatChannel) {
    try { mpState.globalChatChannel.postMessage(packet); } catch (e) {}
  }

  if (!mpState.connected && Math.random() < 0.55) {
    const rivalNames = ['Dulce-Mia', 'Cyber-Kenji', 'Valkyrie-Leo', 'Apex-Sofia'];
    const rName = rivalNames[Math.floor(Math.random() * rivalNames.length)];
    const rMsg = QUICK_EMOTES[Math.floor(Math.random() * QUICK_EMOTES.length)];
    setTimeout(() => {
      appendGlobalChatMessage(rName, rMsg, false);
    }, 900);
  }
}

function initGlobalChatChannel() {
  try {
    mpState.globalChatChannel = new BroadcastChannel('apex_global_chat_channel');
    mpState.globalChatChannel.onmessage = (ev) => {
      if (ev.data && ev.data.type === 'chat' && ev.data.senderId !== mpState.selfId) {
        appendGlobalChatMessage(ev.data.sender || 'Piloto', ev.data.text || '', false);
      }
    };
  } catch (e) {}
}

function setMpStatus(msg, colorClass = 'text-emerald-300') {
  const el = document.getElementById('mp-status-text');
  if (el) {
    el.textContent = msg;
    el.className = `text-[9px] font-medium truncate w-full ${colorClass}`;
  }
}

function initBroadcastFallback(code) {
  try {
    if (mpState.localChannel) mpState.localChannel.close();
    mpState.localChannel = new BroadcastChannel('apex_room_' + code);
    mpState.localChannel.onmessage = (ev) => {
      handleMultiplayerPacket(ev.data);
    };
  } catch (e) {}
}

function sendMultiplayerPacket(payload) {
  if (!payload) return;
  payload.senderId = payload.senderId || mpState.selfId;
  mpState.connections.forEach((conn) => {
    if (conn && conn.open) {
      try { conn.send(payload); } catch (e) {}
    }
  });
  if (mpState.localChannel) {
    try { mpState.localChannel.postMessage(payload); } catch (e) {}
  }
}

function broadcastProfileAndRosterSync() {
  sendMultiplayerPacket({
    type: 'profile_update',
    senderId: mpState.selfId,
    playerName: mpState.playerName || 'Piloto',
    carIndex: selectedCarIndex,
    paintColor: selectedPaintColor,
    botCount: mpState.botCount,
    trackIndex: selectedTrackIndex,
    isHost: mpState.isHost
  });
}

function upsertRemotePlayer(data) {
  const pid = data.senderId || data.id;
  if (!pid || pid === mpState.selfId) return null;

  const existing = mpState.remotePlayers[pid];
  const currentCount = Object.keys(mpState.remotePlayers).length;
  if (!existing && currentCount >= MAX_ROOM_PLAYERS - 1) {
    return null; // Room full (8 max)
  }

  const rp = existing || {
    id: pid,
    name: data.playerName || data.name || 'Piloto',
    carIndex: typeof data.carIndex === 'number' ? data.carIndex : 1,
    paintColor: data.paintColor || '#f43f5e',
    distance: 0,
    lateralOffset: 2.5,
    speed: 0,
    driftAngle: 0,
    mesh: null,
    builtCarIndex: -1,
    builtColor: '',
    builtName: ''
  };

  if (data.playerName || data.name) rp.name = String(data.playerName || data.name).slice(0, 14);
  if (typeof data.carIndex === 'number') rp.carIndex = data.carIndex;
  if (data.paintColor) rp.paintColor = data.paintColor;
  if (typeof data.distance === 'number') rp.distance = data.distance;
  if (typeof data.lateralOffset === 'number') rp.lateralOffset = data.lateralOffset;
  if (typeof data.speed === 'number') rp.speed = data.speed;
  if (typeof data.driftAngle === 'number') rp.driftAngle = data.driftAngle;

  mpState.remotePlayers[pid] = rp;
  syncRemotePlayerCarMesh(rp);
  return rp;
}

function handleMultiplayerPacket(data) {
  if (!data || typeof data !== 'object') return;
  if (data.senderId === mpState.selfId) return;

  if (data.type === 'chat') {
    appendGlobalChatMessage(data.sender || 'Rival', data.text || '', false);
    return;
  }

  if (data.type === 'hello' || data.type === 'profile_update') {
    mpState.connected = true;
    const rp = upsertRemotePlayer(data);
    if (data.isHost) {
      if (typeof data.botCount === 'number') mpState.botCount = data.botCount;
      if (typeof data.trackIndex === 'number' && gameMode === 'garage') {
        selectTrack(data.trackIndex, true);
      }
    }
    renderBotCountButtons();
    renderRoomPlayersRoster();

    if (data.type === 'hello') {
      setMpStatus(`¡${rp ? rp.name : 'Piloto'} conectado en la sala! (${1 + Object.keys(mpState.remotePlayers).length}/8)`, 'text-cyan-300');
      appendGlobalChatMessage('Sala', `¡${rp ? rp.name : 'Un piloto'} se unió con su coche personalizado!`, false);
      sound.playTone(660, 0.14, 'triangle', 0.18, 880);

      // Reply with our profile & room settings so everyone sees everyone's exact color, car & name
      sendMultiplayerPacket({
        type: 'welcome',
        senderId: mpState.selfId,
        playerName: mpState.playerName || 'Anfitrión',
        carIndex: selectedCarIndex,
        paintColor: selectedPaintColor,
        trackIndex: selectedTrackIndex,
        botCount: mpState.botCount,
        isHost: mpState.isHost
      });
    }
  } else if (data.type === 'welcome') {
    mpState.connected = true;
    upsertRemotePlayer(data);
    if (data.isHost) {
      if (typeof data.trackIndex === 'number' && gameMode === 'garage') {
        selectTrack(data.trackIndex, true);
      }
      if (typeof data.botCount === 'number') {
        mpState.botCount = data.botCount;
      }
    }
    renderBotCountButtons();
    renderRoomPlayersRoster();
    setMpStatus(`¡Conectado a la sala con ${data.playerName || 'Anfitrión'}! (${1 + Object.keys(mpState.remotePlayers).length}/8)`, 'text-cyan-300');
  } else if (data.type === 'telemetry') {
    mpState.connected = true;
    upsertRemotePlayer(data);
  } else if (data.type === 'start_race' || data.type === 'rematch_race') {
    // FIXED REMATCH BUG: Works seamlessly from Garage, Replay, Paused, or Podium without unlinking!
    upsertRemotePlayer(data);
    if (typeof data.trackIndex === 'number') {
      selectTrack(data.trackIndex, true);
    }
    if (typeof data.botCount === 'number') {
      mpState.botCount = data.botCount;
    }
    // Reset all remote player distances to 0 so rematch starts cleanly from the starting grid
    Object.values(mpState.remotePlayers).forEach((rp) => {
      rp.distance = 0;
      rp.speed = 0;
    });
    startNewRace(true);
  }
}

function createOnlineRoom() {
  sound.init();
  if (!ensureMandatoryMultiplayerName()) return;

  const num = Math.floor(100 + Math.random() * 900);
  const code = `APX-${num}`;
  mpState.roomCode = code;
  mpState.isHost = true;
  mpState.remotePlayers = {};
  mpState.connections = [];

  document.getElementById('room-code-display').textContent = code;
  setMpStatus(`Sala ${code} creada por ${mpState.playerName} (Hasta 8 pilotos).`, 'text-cyan-300');
  initBroadcastFallback(code);
  renderBotCountButtons();
  renderRoomPlayersRoster();

  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      const peerId = 'apex-horizon-room-' + code.toLowerCase();
      mpState.peer = new Peer(peerId);
      mpState.peer.on('connection', (conn) => {
        if (mpState.connections.length >= MAX_ROOM_PLAYERS - 1) {
          conn.close();
          return;
        }
        mpState.connections.push(conn);
        conn.on('data', (pkt) => {
          handleMultiplayerPacket(pkt);
          // Relay packet to other connected peers in the 8-player room
          mpState.connections.forEach((otherConn) => {
            if (otherConn !== conn && otherConn.open) {
              try { otherConn.send(pkt); } catch (e) {}
            }
          });
        });
        conn.on('open', () => {
          mpState.connected = true;
          conn.send({
            type: 'welcome',
            senderId: mpState.selfId,
            playerName: mpState.playerName,
            carIndex: selectedCarIndex,
            paintColor: selectedPaintColor,
            trackIndex: selectedTrackIndex,
            botCount: mpState.botCount,
            isHost: true
          });
        });
      });
      mpState.peer.on('error', () => {
        setMpStatus(`Sala ${code} activa (Sincronización Local / P2P lista).`, 'text-amber-300');
      });
    } catch (err) {
      setMpStatus(`Sala ${code} activa en modo local.`, 'text-amber-300');
    }
  }
}

function joinOnlineRoom(rawCode) {
  sound.init();
  if (!ensureMandatoryMultiplayerName()) return;

  const clean = (rawCode || '').trim().toUpperCase();
  if (!clean) {
    setMpStatus('Escribe un código como APX-123 para unirte.', 'text-rose-300');
    return;
  }
  mpState.roomCode = clean;
  mpState.isHost = false;
  mpState.remotePlayers = {};
  mpState.connections = [];

  document.getElementById('room-code-display').textContent = clean;
  setMpStatus(`Conectando a la sala ${clean} como ${mpState.playerName}...`, 'text-amber-300');
  initBroadcastFallback(clean);

  sendMultiplayerPacket({
    type: 'hello',
    senderId: mpState.selfId,
    playerName: mpState.playerName,
    carIndex: selectedCarIndex,
    paintColor: selectedPaintColor,
    isHost: false
  });
  renderBotCountButtons();
  renderRoomPlayersRoster();

  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      mpState.peer = new Peer();
      mpState.peer.on('open', () => {
        const hostId = 'apex-horizon-room-' + clean.toLowerCase();
        const conn = mpState.peer.connect(hostId);
        mpState.connections = [conn];
        conn.on('open', () => {
          mpState.connected = true;
          setMpStatus(`¡Conectado a ${clean} como ${mpState.playerName}!`, 'text-emerald-300');
          conn.send({
            type: 'hello',
            senderId: mpState.selfId,
            playerName: mpState.playerName,
            carIndex: selectedCarIndex,
            paintColor: selectedPaintColor,
            isHost: false
          });
        });
        conn.on('data', handleMultiplayerPacket);
      });
    } catch (e) {}
  }
}


// =========================================================================
// 7. GENERADOR 3D: ESTÉTICA CANDY CRUSH (🍩🥞🍡🍥), TÚNELES 360° Y MULTICAMINOS
// =========================================================================
let currentCurve = null;
let trackLength = 1650;
const ROAD_HALF_WIDTH = 9.6;
let playerCar = null;
let player2Car = null;
let aiCars = [];
let particlePool = [];
let wildlifeHazards = [];
let roadObstacles = [];
let fallingRocks = [];
let waterfallParticles = [];

const _worldUp = new THREE.Vector3(0, 1, 0);
const _dummyObj = new THREE.Object3D();

function getTrackBasis(u) {
  const normU = ((u % 1) + 1) % 1;
  const point = currentCurve.getPointAt(normU);
  const tangent = currentCurve.getTangentAt(normU).normalize();
  const binormal = new THREE.Vector3().crossVectors(tangent, _worldUp).normalize();
  const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
  return { point, tangent, binormal, normal };
}

function getActiveTunnelZone(trackCfg, u) {
  const normU = ((u % 1) + 1) % 1;
  return (trackCfg.tunnelZones || []).find((tz) => normU >= tz.startU && normU <= tz.endU) || null;
}

function getMegaRampState(trackCfg, u) {
  const normU = ((u % 1) + 1) % 1;
  for (const rz of (trackCfg.megaRampZones || [])) {
    const jumpEndU = rz.jumpEndU || (rz.endU + 0.075);
    const rampH = rz.rampHeight || 13.5;
    const peakArc = rz.peakArc || 16.0;

    if (normU >= rz.startU && normU <= rz.endU) {
      const frac = (normU - rz.startU) / Math.max(0.0001, rz.endU - rz.startU);
      const height = Math.pow(frac, 1.45) * rampH;
      return { zone: rz, onRamp: true, inFlight: false, frac, flightFrac: 0, height, pitch: -0.22 * frac };
    }
    if (normU > rz.endU && normU <= jumpEndU) {
      const flightFrac = (normU - rz.endU) / Math.max(0.0001, jumpEndU - rz.endU);
      const height = rampH * (1 - flightFrac) + Math.sin(flightFrac * Math.PI) * peakArc;
      const pitch = -0.24 * Math.cos(flightFrac * Math.PI);
      return { zone: rz, onRamp: false, inFlight: true, frac: 1, flightFrac, height, pitch };
    }
  }
  return null;
}

function getActiveSplitZone(trackCfg, u) {
  const normU = ((u % 1) + 1) % 1;
  for (const sz of (trackCfg.splitZones || [])) {
    if (normU >= sz.startU && normU <= sz.endU) {
      const frac = (normU - sz.startU) / Math.max(0.0001, sz.endU - sz.startU);
      const envelope = Math.sin(frac * Math.PI);
      return { zone: sz, frac, envelope };
    }
  }
  return null;
}

function applySkyAndLighting(trackCfg) {
  scene.fog.color.setHex(trackCfg.fogColor);
  hemiLight.color.setHex(trackCfg.ambientSky);
  hemiLight.groundColor.setHex(trackCfg.ambientGround);
  hemiLight.intensity = trackCfg.ambientIntensity;

  dirLight.color.setHex(trackCfg.sunColor);
  dirLight.intensity = trackCfg.sunIntensity;
  dirLight.position.set(...trackCfg.sunPos);

  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 32;
  skyCanvas.height = 128;
  const sctx = skyCanvas.getContext('2d');
  const grad = sctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, trackCfg.skyTop);
  grad.addColorStop(0.62, trackCfg.skyBottom);
  grad.addColorStop(1, trackCfg.sceneryType === 'candy' ? '#fce7f3' : '#090d16');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 32, 128);
  scene.background = new THREE.CanvasTexture(skyCanvas);
}

// 3D Candy Crush Props: Pancake Stack (🥞), Dango Skewer (🍡), Frosted Donut Arch (🍩), Narutomaki Lollipop (🍥)
function buildPancakeStackMesh() {
  const group = new THREE.Group();
  const cakeMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
  const syrupMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
  const butterMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  for (let i = 0; i < 5; i++) {
    const r = 11.5 - i * 0.45;
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.3, 14), cakeMat);
    disc.position.y = i * 2.5 + 1.2;
    group.add(disc);

    const glaze = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.96, r * 0.98, 0.45, 14), syrupMat);
    glaze.position.y = i * 2.5 + 2.35;
    group.add(glaze);
  }
  const butter = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 5.2), butterMat);
  butter.position.y = 5 * 2.5 + 1.1;
  butter.rotation.y = 0.4;
  group.add(butter);
  return group;
}

function buildDangoSkewerMesh() {
  const group = new THREE.Group();
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 24, 8),
    new THREE.MeshLambertMaterial({ color: 0xfde68a })
  );
  stick.position.y = 12;
  group.add(stick);

  // Pink, White, Matcha Green Dango Balls (🍡)
  const dangoColors = [0xa7f3d0, 0xfff1f2, 0xf472b6];
  dangoColors.forEach((hex, idx) => {
    const ball = new THREE.Mesh(GEO_CACHE.dangoBall, new THREE.MeshLambertMaterial({ color: hex }));
    ball.position.y = 8.5 + idx * 5.2;
    group.add(ball);
  });
  return group;
}

function buildPyramidMesh() {
  const pyrGroup = new THREE.Group();
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0xd6d3d1 });
  const mossMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

  const tiers = 4;
  for (let t = 0; t < tiers; t++) {
    const w = 36 - t * 7.2;
    const h = 6.2;
    const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), t % 2 === 0 ? stoneMat : mossMat);
    tierMesh.position.y = t * h + h / 2;
    pyrGroup.add(tierMesh);
  }
  const temple = new THREE.Mesh(new THREE.BoxGeometry(10, 6.0, 10), stoneMat);
  temple.position.y = tiers * 6.2 + 3.0;
  pyrGroup.add(temple);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(2.0, 8, 8), goldMat);
  beacon.position.y = tiers * 6.2 + 7.5;
  pyrGroup.add(beacon);

  return pyrGroup;
}

function build360TunnelsAndMegaRamps(trackCfg) {
  (trackCfg.tunnelZones || []).forEach((tz) => {
    const radius = tz.radius || 10.8;
    const steps = 42;
    const radialSegs = 16;
    const tPositions = [];
    const tNormals = [];
    const tUvs = [];
    const tIndices = [];

    for (let i = 0; i <= steps; i++) {
      const u = tz.startU + (i / steps) * (tz.endU - tz.startU);
      const { point, binormal, normal } = getTrackBasis(u);
      const center = point.clone().addScaledVector(normal, radius);

      for (let j = 0; j <= radialSegs; j++) {
        const theta = (j / radialSegs) * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        const vPos = center.clone()
          .addScaledVector(binormal, sinT * radius)
          .addScaledVector(normal, -cosT * radius);

        tPositions.push(vPos.x, vPos.y, vPos.z);
        tNormals.push(-sinT * binormal.x + cosT * normal.x, -sinT * binormal.y + cosT * normal.y, -sinT * binormal.z + cosT * normal.z);
        tUvs.push(j / radialSegs, i / steps * 12);
      }

      if (i < steps) {
        const rowA = i * (radialSegs + 1);
        const rowB = (i + 1) * (radialSegs + 1);
        for (let j = 0; j < radialSegs; j++) {
          tIndices.push(rowA + j, rowB + j, rowA + j + 1);
          tIndices.push(rowB + j, rowB + j + 1, rowA + j + 1);
        }
      }
    }

    const tubeGeo = new THREE.BufferGeometry();
    tubeGeo.setAttribute('position', new THREE.Float32BufferAttribute(tPositions, 3));
    tubeGeo.setAttribute('normal', new THREE.Float32BufferAttribute(tNormals, 3));
    tubeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(tUvs, 2));
    tubeGeo.setIndex(tIndices);

    const tubeMat = new THREE.MeshLambertMaterial({
      color: 0x0f172a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.84
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    raceWorldGroup.add(tubeMesh);

    const ringCount = 14;
    const ringGeo = new THREE.TorusGeometry(radius - 0.15, 0.26, 6, 20);
    const ringMat = new THREE.MeshBasicMaterial({ color: tz.color || 0x06b6d4 });
    const instRings = new THREE.InstancedMesh(ringGeo, ringMat, ringCount);

    for (let r = 0; r < ringCount; r++) {
      const u = tz.startU + (r / (ringCount - 1)) * (tz.endU - tz.startU);
      const { point, tangent, normal } = getTrackBasis(u);
      const center = point.clone().addScaledVector(normal, radius);
      _dummyObj.position.copy(center);
      _dummyObj.lookAt(center.clone().add(tangent));
      _dummyObj.scale.set(1, 1, 1);
      _dummyObj.updateMatrix();
      instRings.setMatrixAt(r, _dummyObj.matrix);
    }
    instRings.instanceMatrix.needsUpdate = true;
    raceWorldGroup.add(instRings);
  });

  (trackCfg.megaRampZones || []).forEach((rz) => {
    const rampSteps = 18;
    const rPos = [];
    const rInd = [];
    const rampHalfW = ROAD_HALF_WIDTH * 0.90;
    const rampH = rz.rampHeight || 13.5;
    const peakArc = rz.peakArc || 16.0;
    const jumpEndU = rz.jumpEndU || (rz.endU + 0.075);

    for (let i = 0; i <= rampSteps; i++) {
      const frac = i / rampSteps;
      const u = rz.startU + frac * (rz.endU - rz.startU);
      const { point, binormal } = getTrackBasis(u);
      const rampElevation = Math.pow(frac, 1.45) * rampH;
      const centerPt = point.clone().add(new THREE.Vector3(0, rampElevation, 0));
      const leftPt = centerPt.clone().addScaledVector(binormal, -rampHalfW);
      const rightPt = centerPt.clone().addScaledVector(binormal, rampHalfW);
      rPos.push(leftPt.x, leftPt.y, leftPt.z, rightPt.x, rightPt.y, rightPt.z);

      if (i < rampSteps) {
        const a = i * 2;
        rInd.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }

    const rampGeo = new THREE.BufferGeometry();
    rampGeo.setAttribute('position', new THREE.Float32BufferAttribute(rPos, 3));
    rampGeo.setIndex(rInd);
    rampGeo.computeVertexNormals();

    const rampMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide
    });
    const rampMesh = new THREE.Mesh(rampGeo, rampMat);
    raceWorldGroup.add(rampMesh);

    const ringColors = [0x00f5d4, 0xf72585, 0xfde047];
    for (let k = 1; k <= 3; k++) {
      const flightFrac = k * 0.25;
      const airU = rz.endU + flightFrac * (jumpEndU - rz.endU);
      const { point, tangent } = getTrackBasis(airU);
      const exactRingHeight = rampH * (1 - flightFrac) + Math.sin(flightFrac * Math.PI) * peakArc;

      const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[k - 1] });
      const skyRing = new THREE.Mesh(GEO_CACHE.skyRing, ringMat);
      skyRing.position.copy(point).add(new THREE.Vector3(0, exactRingHeight + 1.1, 0));
      skyRing.lookAt(skyRing.position.clone().add(tangent));
      raceWorldGroup.add(skyRing);
    }
  });
}

function buildMultiPathSplitsAndCyberProps(trackCfg) {
  const muralTextures = getCyberMuralTextures();
  const dataTex = getCyberDataStreamTexture();
  const isCandy = trackCfg.sceneryType === 'candy';

  (trackCfg.splitZones || []).forEach((sz, sIdx) => {
    const steps = 36;
    const branchHalfW = ROAD_HALF_WIDTH * 0.68;

    [-1, 1].forEach((branchDir) => {
      const isLeft = branchDir === -1;
      const bPos = [];
      const bUvs = [];
      const bInd = [];

      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const env = Math.sin(frac * Math.PI);
        const u = sz.startU + frac * (sz.endU - sz.startU);
        const { point, binormal, tangent } = getTrackBasis(u);

        const latShift = branchDir * (sz.sepLat || 13.5) * env;
        const yShift = (isLeft ? (sz.leftHeight || 14.0) : (sz.rightHeight || -6.0)) * env;

        const centerPt = point.clone()
          .addScaledVector(binormal, latShift)
          .add(new THREE.Vector3(0, yShift + 0.15, 0));

        const lPt = centerPt.clone().addScaledVector(binormal, -branchHalfW);
        const rPt = centerPt.clone().addScaledVector(binormal, branchHalfW);

        bPos.push(lPt.x, lPt.y, lPt.z, rPt.x, rPt.y, rPt.z);
        bUvs.push(0, frac * 18, 1, frac * 18);

        if (i < steps) {
          const a = i * 2;
          bInd.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }

        if (isLeft && (i === 10 || i === 26)) {
          const pylonMat = new THREE.MeshBasicMaterial({ color: sz.leftColor || 0xf472b6 });
          const pylonL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 24, 1.1), pylonMat);
          pylonL.position.copy(lPt).add(new THREE.Vector3(0, 10, 0));
          const pylonR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 24, 1.1), pylonMat);
          pylonR.position.copy(rPt).add(new THREE.Vector3(0, 10, 0));
          const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(branchHalfW * 2 + 2.2, 1.4, 1.4), pylonMat);
          crossBeam.position.copy(centerPt).add(new THREE.Vector3(0, 20, 0));
          crossBeam.lookAt(crossBeam.position.clone().add(tangent));
          raceWorldGroup.add(pylonL, pylonR, crossBeam);
        }

        if (!isLeft && !isCandy && (i === 9 || i === 18 || i === 27)) {
          const muralGeo = new THREE.PlaneGeometry(24, 12);
          const muralMat = new THREE.MeshBasicMaterial({
            map: muralTextures[(sIdx + i) % muralTextures.length],
            side: THREE.DoubleSide
          });
          const muralMesh = new THREE.Mesh(muralGeo, muralMat);
          const wallPos = rPt.clone().addScaledVector(binormal, 3.5).add(new THREE.Vector3(0, 6.2, 0));
          muralMesh.position.copy(wallPos);
          muralMesh.lookAt(wallPos.clone().sub(binormal));
          raceWorldGroup.add(muralMesh);

          const dataArchMat = new THREE.MeshBasicMaterial({ map: dataTex, side: THREE.DoubleSide });
          const dataArch = new THREE.Mesh(new THREE.BoxGeometry(branchHalfW * 2 + 2, 8.5, 1.2), dataArchMat);
          dataArch.position.copy(centerPt).add(new THREE.Vector3(0, 8.5, 0));
          dataArch.lookAt(dataArch.position.clone().add(tangent));
          raceWorldGroup.add(dataArch);
        }
      }

      const branchGeo = new THREE.BufferGeometry();
      branchGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPos, 3));
      branchGeo.setAttribute('uv', new THREE.Float32BufferAttribute(bUvs, 2));
      branchGeo.setIndex(bInd);
      branchGeo.computeVertexNormals();

      const branchMat = new THREE.MeshLambertMaterial({
        color: isCandy ? (isLeft ? 0xf472b6 : 0xfde047) : (isLeft ? 0x0f172a : 0x181028),
        side: THREE.DoubleSide
      });
      const branchMesh = new THREE.Mesh(branchGeo, branchMat);
      raceWorldGroup.add(branchMesh);
    });
  });

  // Giant Frosted Donut Arches (🍩), Pancake Towers (🥞), Dango Skewers (🍡) & Narutomaki Swirls (🍥) on 'Reino Dulce Candy'
  if (isCandy) {
    const donutColors = [0xf472b6, 0xa855f7, 0x38bdf8, 0xfbbf24, 0x34d399];
    const narutoTex = getNarutoSwirlTexture();

    for (let c = 0; c < 14; c++) {
      const u = (c + 0.5) / 14;
      const { point, binormal, tangent } = getTrackBasis(u);
      const side = c % 2 === 0 ? -1 : 1;

      // Giant Frosted Donut Archway over the track every 2 segments (🍩)
      if (c % 2 === 0) {
        const dMat = new THREE.MeshLambertMaterial({ color: donutColors[(c / 2) % donutColors.length] });
        const donutArch = new THREE.Mesh(GEO_CACHE.donutArch, dMat);
        donutArch.position.copy(point).add(new THREE.Vector3(0, 3.2, 0));
        donutArch.lookAt(donutArch.position.clone().add(tangent));
        raceWorldGroup.add(donutArch);
      }

      // Towering Pancake Stack with Butter & Syrup (🥞) or Giant Dango Skewer (🍡) beside the road
      if (c % 2 === 0) {
        const pancakes = buildPancakeStackMesh();
        pancakes.position.copy(point).addScaledVector(binormal, side * (ROAD_HALF_WIDTH + 19)).add(new THREE.Vector3(0, -4, 0));
        raceWorldGroup.add(pancakes);
      } else {
        const dango = buildDangoSkewerMesh();
        dango.position.copy(point).addScaledVector(binormal, side * (ROAD_HALF_WIDTH + 15)).add(new THREE.Vector3(0, -2, 0));
        dango.rotation.z = side * -0.18;
        raceWorldGroup.add(dango);
      }

      // Giant Narutomaki Swirl Lollipop Sign (🍥) on the opposite side
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 14, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      const popPos = point.clone().addScaledVector(binormal, -side * (ROAD_HALF_WIDTH + 14));
      stick.position.copy(popPos).add(new THREE.Vector3(0, 5, 0));
      const swirlDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(4.2, 4.2, 1.1, 18),
        new THREE.MeshBasicMaterial({ map: narutoTex })
      );
      swirlDisc.rotation.x = Math.PI / 2;
      swirlDisc.position.copy(popPos).add(new THREE.Vector3(0, 13, 0));
      swirlDisc.lookAt(point.x, swirlDisc.position.y, point.z);
      raceWorldGroup.add(stick, swirlDisc);
    }
  }

  // Cyber Murals & Data Monoliths on 'Metrópolis Cyber 2099'
  if (trackCfg.sceneryType === 'cybermeta') {
    for (let m = 0; m < 14; m++) {
      const u = (m + 0.5) / 14;
      if (getActiveTunnelZone(trackCfg, u)) continue;
      const { point, binormal, tangent } = getTrackBasis(u);
      const side = m % 2 === 0 ? -1 : 1;

      const mGeo = new THREE.PlaneGeometry(26, 13);
      const mMat = new THREE.MeshBasicMaterial({
        map: muralTextures[m % muralTextures.length],
        side: THREE.DoubleSide
      });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      const mPos = point.clone().addScaledVector(binormal, side * (ROAD_HALF_WIDTH + 9)).add(new THREE.Vector3(0, 8.5, 0));
      mMesh.position.copy(mPos);
      mMesh.lookAt(point.x, mPos.y, point.z);
      raceWorldGroup.add(mMesh);

      const dPillar = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 34, 3.2),
        new THREE.MeshBasicMaterial({ map: dataTex })
      );
      dPillar.position.copy(point).addScaledVector(binormal, -side * (ROAD_HALF_WIDTH + 11)).add(new THREE.Vector3(0, 14, 0));
      raceWorldGroup.add(dPillar);

      if (m % 2 === 0) {
        const bridgeColor = m % 4 === 0 ? 0x00f5d4 : 0xf72585;
        const archMat = new THREE.MeshBasicMaterial({ color: bridgeColor });
        const overBeam = new THREE.Mesh(new THREE.BoxGeometry(ROAD_HALF_WIDTH * 2.5, 1.4, 2.4), archMat);
        overBeam.position.copy(point).add(new THREE.Vector3(0, 12.5, 0));
        overBeam.lookAt(overBeam.position.clone().add(tangent));
        raceWorldGroup.add(overBeam);
      }
    }
  }
}

function buildRaceTrackScene(trackCfg) {
  while (raceWorldGroup.children.length > 0) {
    raceWorldGroup.remove(raceWorldGroup.children[0]);
  }
  aiCars = [];
  particlePool = [];
  wildlifeHazards = [];
  roadObstacles = [];
  fallingRocks = [];
  waterfallParticles = [];

  applySkyAndLighting(trackCfg);

  const pts = trackCfg.waypoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  currentCurve = new THREE.CatmullRomCurve3(pts, true, 'centripetal', 0.5);
  trackLength = currentCurve.getLength();

  const segments = trackCfg.totalLaps === 1 ? 420 : 320;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const { point, binormal, normal } = getTrackBasis(u);
    const leftPt = point.clone().addScaledVector(binormal, -ROAD_HALF_WIDTH);
    const rightPt = point.clone().addScaledVector(binormal, ROAD_HALF_WIDTH);

    positions.push(leftPt.x, leftPt.y, leftPt.z);
    positions.push(rightPt.x, rightPt.y, rightPt.z);

    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);

    uvs.push(0, u);
    uvs.push(1, u);

    if (i < segments) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  roadGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  roadGeo.setIndex(indices);

  const roadMat = new THREE.MeshLambertMaterial({
    map: createRoadTexture(trackCfg),
    side: THREE.DoubleSide
  });
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  raceWorldGroup.add(roadMesh);

  build360TunnelsAndMegaRamps(trackCfg);
  buildMultiPathSplitsAndCyberProps(trackCfg);

  const postSteps = 76;
  const railMat = new THREE.MeshBasicMaterial({ color: trackCfg.roadLineColor });
  const instPosts = new THREE.InstancedMesh(GEO_CACHE.post, railMat, postSteps * 2);
  const instPillars = new THREE.InstancedMesh(GEO_CACHE.pillar, MAT_CACHE.pillar, 38);
  let postIdx = 0;
  let pillarIdx = 0;

  for (let i = 0; i < postSteps; i++) {
    const u = i / postSteps;
    const { point, binormal } = getTrackBasis(u);

    _dummyObj.scale.set(1, 1, 1);
    _dummyObj.rotation.set(0, 0, 0);
    _dummyObj.position.copy(point).addScaledVector(binormal, -(ROAD_HALF_WIDTH + 0.35)).add(new THREE.Vector3(0, 0.5, 0));
    _dummyObj.updateMatrix();
    instPosts.setMatrixAt(postIdx++, _dummyObj.matrix);

    _dummyObj.position.copy(point).addScaledVector(binormal, ROAD_HALF_WIDTH + 0.35).add(new THREE.Vector3(0, 0.5, 0));
    _dummyObj.updateMatrix();
    instPosts.setMatrixAt(postIdx++, _dummyObj.matrix);

    if (i % 2 === 0 && pillarIdx < 38) {
      const h = Math.max(4, point.y + 22);
      _dummyObj.position.set(point.x, point.y - h / 2 - 0.2, point.z);
      _dummyObj.scale.set(1, h, 1);
      _dummyObj.updateMatrix();
      instPillars.setMatrixAt(pillarIdx++, _dummyObj.matrix);
    }
  }
  instPosts.instanceMatrix.needsUpdate = true;
  instPillars.instanceMatrix.needsUpdate = true;
  raceWorldGroup.add(instPosts, instPillars);

  const groundColors = {
    candy: 0xfce7f3,
    jungle: 0x064e3b,
    city: 0x050814,
    cybermeta: 0x04020c,
    coast: 0x0369a1,
    mountain: 0x1e293b,
    desert: 0x451a03
  };
  const groundGeo = new THREE.PlaneGeometry(3800, 3800);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshLambertMaterial({
    color: groundColors[trackCfg.sceneryType] || 0x090d16
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.position.y = -20;
  raceWorldGroup.add(groundMesh);

  const startBasis = getTrackBasis(0);
  const startBannerGeo = new THREE.PlaneGeometry(ROAD_HALF_WIDTH * 2, 3.8);
  startBannerGeo.rotateX(-Math.PI / 2);
  const startBannerMat = new THREE.MeshBasicMaterial({ map: createCheckeredTexture() });
  const startLineMesh = new THREE.Mesh(startBannerGeo, startBannerMat);
  startLineMesh.position.copy(startBasis.point).add(new THREE.Vector3(0, 0.08, 0));
  const lookTarget = startBasis.point.clone().add(startBasis.tangent);
  startLineMesh.lookAt(lookTarget.x, startLineMesh.position.y, lookTarget.z);
  raceWorldGroup.add(startLineMesh);

  buildDetailedLandscapeProps(trackCfg);
  buildAllTrackObstacles(trackCfg);

  const playerCfg = CARS[selectedCarIndex];
  const myPilotLabel = mpState.playerName || 'Tú';
  playerCar = buildDetailedCarMesh(playerCfg, selectedPaintColor, true, myPilotLabel);
  raceWorldGroup.add(playerCar);

  player2Car = null;
  if (multiplayerMode === 'split') {
    const p2CarIdx = (selectedCarIndex + 1) % CARS.length;
    player2Car = buildDetailedCarMesh(CARS[p2CarIdx], '#f59e0b', true, 'Jugador 2');
    raceWorldGroup.add(player2Car);
  }

  // Build / attach all connected Online Remote Players (with their exact chosen Car, Paint Color & Nameplate!)
  Object.values(mpState.remotePlayers).forEach((rp) => {
    rp.mesh = null;
    syncRemotePlayerCarMesh(rp);
  });

  // Determine how many AI bots to spawn so total racers <= 8 and respects the Host's chosen Bot Count!
  const diffCfg = DIFFICULTY_LEVELS[selectedDifficultyIndex] || DIFFICULTY_LEVELS[1];
  const rivalColors = ['#f43f5e', '#eab308', '#10b981', '#a855f7', '#38bdf8', '#fb923c', '#f472b6'];
  const botPilotNames = ['Bot-Nova', 'Bot-Kira', 'Bot-Axel', 'Bot-Mochi', 'Bot-Zero', 'Bot-Rex', 'Bot-Luna'];

  const humanCount = 1 + (multiplayerMode === 'split' ? 1 : Object.keys(mpState.remotePlayers).length);
  const maxAllowedBots = Math.max(0, MAX_ROOM_PLAYERS - humanCount);
  const desiredBots = multiplayerMode === 'solo' ? 5 : Math.min(mpState.botCount, maxAllowedBots);

  for (let i = 0; i < desiredBots; i++) {
    const rivalCfg = CARS[(selectedCarIndex + i + 1) % CARS.length];
    const rColor = rivalColors[i % rivalColors.length];
    const bName = botPilotNames[i % botPilotNames.length];
    const rivalMesh = buildDetailedCarMesh(rivalCfg, rColor, false, bName);
    raceWorldGroup.add(rivalMesh);
    aiCars.push({
      name: bName,
      carName: rivalCfg.name,
      paintColor: rColor,
      mesh: rivalMesh,
      distance: 12 + i * 13,
      lateralOffset: (i % 2 === 0 ? -1 : 1) * 3.5,
      targetOffset: (i % 2 === 0 ? -1 : 1) * 3.5,
      speed: 0,
      baseMaxSpeed: playerCfg.maxUnitsPerSec * diffCfg.aiSpeedMult * (0.95 + i * 0.022),
      laneTimer: 1.2 + i * 0.55,
      nitroTimer: 0,
      clashCooldown: 0,
      clashHits: 0,
      spinTimer: 0,
      spinAngleY: 0,
      spinVelY: 0,
      rollAngleZ: 0,
      rollVelZ: 0,
      airBounceY: 0,
      airBounceVel: 0,
      tunnelAngle: 0,
      branchChoice: i % 2 === 0 ? -1 : 1
    });
  }

  for (let i = 0; i < 36; i++) {
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0
    });
    const pMesh = new THREE.Mesh(GEO_CACHE.particle, pMat);
    pMesh.visible = false;
    raceWorldGroup.add(pMesh);
    particlePool.push({
      mesh: pMesh,
      life: 0,
      maxLife: 0.48,
      vel: new THREE.Vector3()
    });
  }
}

function buildDetailedLandscapeProps(trackCfg) {
  (trackCfg.scenicZones || []).forEach((sz, idx) => {
    const midU = (sz.startU + sz.endU) * 0.5;
    const { point, binormal, tangent } = getTrackBasis(midU);
    const vistaDir = sz.lookSideOffset >= 0 ? 1 : -1;
    const landmarkPos = point.clone().addScaledVector(binormal, vistaDir * 50);

    if (trackCfg.sceneryType === 'candy') {
      const giantPancakes = buildPancakeStackMesh();
      giantPancakes.scale.set(1.6, 1.6, 1.6);
      giantPancakes.position.set(landmarkPos.x, point.y - 10, landmarkPos.z);
      raceWorldGroup.add(giantPancakes);
    } else if (trackCfg.sceneryType === 'jungle') {
      const pyramid = buildPyramidMesh();
      pyramid.position.set(landmarkPos.x, point.y - 10, landmarkPos.z);
      pyramid.lookAt(point.x, pyramid.position.y, point.z);
      raceWorldGroup.add(pyramid);

      const cenoteGeo = new THREE.CircleGeometry(18, 16);
      cenoteGeo.rotateX(-Math.PI / 2);
      const cenote = new THREE.Mesh(cenoteGeo, new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
      const cenotePos = point.clone().addScaledVector(binormal, -vistaDir * 34);
      cenote.position.set(cenotePos.x, point.y - 8, cenotePos.z);
      raceWorldGroup.add(cenote);
    } else if (trackCfg.sceneryType === 'mountain' || trackCfg.sceneryType === 'coast') {
      const cliff = new THREE.Mesh(
        new THREE.ConeGeometry(28, 95, 6),
        new THREE.MeshLambertMaterial({ color: trackCfg.sceneryType === 'mountain' ? 0x334155 : 0x475569 })
      );
      cliff.position.set(landmarkPos.x, point.y + 18, landmarkPos.z);
      raceWorldGroup.add(cliff);

      const snow = new THREE.Mesh(new THREE.ConeGeometry(12, 32, 6), MAT_CACHE.snow);
      snow.position.y = 33;
      cliff.add(snow);

      const waterfall = new THREE.Mesh(
        new THREE.BoxGeometry(6.5, 68, 1.5),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 })
      );
      waterfall.position.copy(point).addScaledVector(binormal, vistaDir * 36).add(new THREE.Vector3(0, 6, 0));
      waterfall.lookAt(point);
      raceWorldGroup.add(waterfall);

      for (let w = 0; w < 8; w++) {
        const dropMesh = new THREE.Mesh(
          GEO_CACHE.particle,
          new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
        );
        const basePos = waterfall.position.clone();
        dropMesh.position.copy(basePos).add(new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 5));
        raceWorldGroup.add(dropMesh);
        waterfallParticles.push({ mesh: dropMesh, baseY: basePos.y - 26, topY: basePos.y + 28, speed: 18 + Math.random() * 12 });
      }
    } else if (trackCfg.sceneryType === 'desert') {
      const archPillarMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
      const leftM = new THREE.Mesh(new THREE.ConeGeometry(18, 75, 5), archPillarMat);
      leftM.position.copy(point).addScaledVector(binormal, -32).add(new THREE.Vector3(0, 12, 0));
      const rightM = new THREE.Mesh(new THREE.ConeGeometry(18, 75, 5), archPillarMat);
      rightM.position.copy(point).addScaledVector(binormal, 32).add(new THREE.Vector3(0, 12, 0));
      const span = new THREE.Mesh(new THREE.BoxGeometry(72, 8, 12), archPillarMat);
      span.position.copy(point).add(new THREE.Vector3(0, 32, 0));
      span.lookAt(point.clone().add(tangent));
      raceWorldGroup.add(leftM, rightM, span);
    } else {
      const towerMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
      const neonMat = new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x00f5d4 : 0xf72585 });
      [-28, 28].forEach((offsetSide) => {
        const tMesh = new THREE.Mesh(new THREE.BoxGeometry(11, 105, 11), towerMat);
        tMesh.position.copy(point).addScaledVector(binormal, offsetSide).add(new THREE.Vector3(0, 20, 0));
        const ring = new THREE.Mesh(new THREE.BoxGeometry(12, 2.4, 12), neonMat);
        ring.position.y = 30;
        tMesh.add(ring);
        raceWorldGroup.add(tMesh);
      });
    }
  });

  const propCount = 68;
  const isUrban = trackCfg.sceneryType === 'city' || trackCfg.sceneryType === 'cybermeta';
  const isCandy = trackCfg.sceneryType === 'candy';
  const propGeo = isUrban
    ? new THREE.BoxGeometry(9, 42, 9)
    : (isCandy ? new THREE.SphereGeometry(5.5, 10, 10) : new THREE.ConeGeometry(4.2, 14, 6));
  const propColor = isCandy
    ? 0xf472b6
    : (trackCfg.sceneryType === 'jungle'
      ? 0x15803d
      : (isUrban ? 0x0f172a : (trackCfg.sceneryType === 'mountain' ? 0x065f46 : (trackCfg.sceneryType === 'coast' ? 0x10b981 : 0x9a3412))));
  const propMat = new THREE.MeshLambertMaterial({ color: propColor });
  const instProps = new THREE.InstancedMesh(propGeo, propMat, propCount);

  for (let i = 0; i < propCount; i++) {
    const u = i / propCount;
    const { point, binormal } = getTrackBasis(u);
    const side = i % 2 === 0 ? -1 : 1;
    const dist = ROAD_HALF_WIDTH + 16 + (i * 11 % 32);
    const propPos = point.clone().addScaledVector(binormal, side * dist);

    _dummyObj.position.set(propPos.x, propPos.y + 6, propPos.z);
    _dummyObj.rotation.set(0, (i * 0.7) % Math.PI, 0);
    const sc = 0.8 + (i % 4) * 0.28;
    _dummyObj.scale.set(sc, sc, sc);
    _dummyObj.updateMatrix();
    instProps.setMatrixAt(i, _dummyObj.matrix);
  }
  instProps.instanceMatrix.needsUpdate = true;
  raceWorldGroup.add(instProps);
}

function buildAllTrackObstacles(trackCfg) {
  const zones = trackCfg.wildlifeZones || [
    { u: 0.15 }, { u: 0.30 }, { u: 0.54 }, { u: 0.78 }, { u: 0.90 }
  ];
  zones.forEach((wz, idx) => {
    const animalMesh = buildWildlifeMesh(trackCfg.animalType);
    raceWorldGroup.add(animalMesh);

    wildlifeHazards.push({
      u: wz.u,
      distance: wz.u * trackLength,
      mesh: animalMesh,
      lateralOffset: (idx % 2 === 0 ? -1 : 1) * (ROAD_HALF_WIDTH - 1.6),
      dir: idx % 2 === 0 ? 1 : -1,
      walkSpeed: 5.2 + (idx % 3) * 0.8,
      animPhase: idx * 1.4,
      dodgedThisLap: false,
      hitCooldown: 0
    });
  });

  const obstacleCount = 8;
  for (let i = 0; i < obstacleCount; i++) {
    const u = 0.08 + (i / obstacleCount) * 0.84;
    if (getMegaRampState(trackCfg, u) || getActiveSplitZone(trackCfg, u)) continue;
    const { point, tangent, binormal } = getTrackBasis(u);
    const obsMesh = buildRoadObstacleMesh(trackCfg.sceneryType, i);

    const lanePattern = [-4.6, 0.0, 4.6, -2.8, 3.2];
    const latOffset = lanePattern[i % lanePattern.length];
    const worldPos = point.clone().addScaledVector(binormal, latOffset);
    obsMesh.position.copy(worldPos);
    obsMesh.lookAt(worldPos.clone().add(tangent));
    raceWorldGroup.add(obsMesh);

    roadObstacles.push({
      u,
      distance: u * trackLength,
      mesh: obsMesh,
      lateralOffset: latOffset,
      dodgedThisLap: false,
      hitCooldown: 0
    });
  }
}

function spawnRockslideBoulder(aheadDistance) {
  const normDist = ((aheadDistance % trackLength) + trackLength) % trackLength;
  const u = normDist / trackLength;
  const { point, binormal } = getTrackBasis(u);
  const diffCfg = DIFFICULTY_LEVELS[selectedDifficultyIndex] || DIFFICULTY_LEVELS[1];
  const isCandy = TRACKS[selectedTrackIndex].sceneryType === 'candy';

  const targetOffset = (Math.random() - 0.5) * (ROAD_HALF_WIDTH * 1.5);
  const impactPos = point.clone().addScaledVector(binormal, targetOffset);

  const boulderMat = new THREE.MeshLambertMaterial({ color: isCandy ? 0xf472b6 : 0x78350f });
  const boulderMesh = new THREE.Mesh(GEO_CACHE.boulder, boulderMat);
  const spawnSide = Math.random() > 0.5 ? 1 : -1;
  boulderMesh.position.copy(impactPos).addScaledVector(binormal, spawnSide * 9).add(new THREE.Vector3(0, 22, 0));
  raceWorldGroup.add(boulderMesh);

  const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
  const ringMesh = new THREE.Mesh(GEO_CACHE.ringWarn, ringMat);
  ringMesh.position.copy(impactPos).add(new THREE.Vector3(0, 0.12, 0));
  raceWorldGroup.add(ringMesh);

  sound.playRockRumble();

  fallingRocks.push({
    mesh: boulderMesh,
    ringMesh,
    distance: normDist,
    lateralOffset: targetOffset + spawnSide * 9,
    targetLateral: targetOffset,
    heightAboveRoad: 22,
    verticalVel: -17 * diffCfg.rockSpeedMult,
    lateralRollSpeed: -spawnSide * 6.2 * diffCfg.rockSpeedMult,
    roadY: impactPos.y,
    life: 5.5,
    dodged: false,
    hit: false
  });
}

function spawnParticle(pos, colorHex, scale = 1.0) {
  const slot = particlePool.find((p) => p.life <= 0);
  if (!slot) return;
  slot.life = slot.maxLife;
  slot.mesh.visible = true;
  slot.mesh.position.copy(pos);
  slot.mesh.scale.setScalar(scale);
  slot.mesh.material.color.setHex(colorHex);
  slot.mesh.material.opacity = 0.78;
  slot.vel.set((Math.random() - 0.5) * 4.2, 1.8 + Math.random() * 3.0, (Math.random() - 0.5) * 4.2);
}

// =========================================================================
// 8. FÍSICAS, REVANCHA SIN DESCONEXIÓN Y RANKING EN VIVO DE LA SALA
// =========================================================================
const MAX_TURBO_RESERVE = 45;

const inputState = {
  left: false,
  right: false,
  gas: true,
  drift: false,
  nitro: false
};

const inputStateP2 = {
  left: false,
  right: false,
  gas: true,
  drift: false,
  nitro: false
};

const raceState = {
  distance: 0,
  lateralOffset: 0,
  lateralVelocity: 0,
  steerInputSmooth: 0,
  speed: 0,
  nitroAmount: 0,
  lap: 1,
  totalLaps: 3,
  elapsedTime: 0,
  topSpeedRecorded: 0,
  carClashes: 0,
  clashCombo: 0,
  clashComboTimer: 0,
  playerSpinTimer: 0,
  playerSpinAngle: 0,
  playerSpinVel: 0,
  tunnelAngle: 0,
  inTunnel: false,
  airHeight: 0,
  inMegaJump: false,
  lastRingPassed: 0,
  activeBranch: 0,
  branchOffsetLat: 0,
  branchOffsetY: 0,
  cameraMode: 0,
  bodyRoll: 0,
  bodyPitch: 0,
  driftAngle: 0,
  shakeTimer: 0,
  rockSpawnCooldown: 2.5,
  skipCurrentVista: false,
  activeVistaTitle: '',
  countdownTimer: 3.0,
  replaySampleAccum: 0,
  rankingUiAccum: 0,
  camPos: new THREE.Vector3(),
  camLook: new THREE.Vector3(),
  p2Distance: 0,
  p2LateralOffset: 2.8,
  p2LateralVel: 0,
  p2SteerSmooth: 0,
  p2Speed: 0,
  p2Nitro: 20,
  p2CamPos: new THREE.Vector3(),
  p2CamLook: new THREE.Vector3()
};

let replayFrames = [];
let raceHighlights = [];
const replayState = {
  playing: true,
  timeIndex: 0,
  elapsedReplaySec: 0,
  speedMult: 1.0,
  camMode: 0,
  autoCamTimer: 0,
  activeAutoCam: 1,
  finalRank: 1
};

const CAMERA_MODES = [
  { name: 'Dinámica', dist: 8.8, height: 3.3, lookAhead: 12 },
  { name: 'Panorámica', dist: 12.5, height: 5.0, lookAhead: 15 },
  { name: 'Capó Pro', dist: -0.6, height: 1.45, lookAhead: 24 },
  { name: 'Cinematográfica', dist: 14.5, height: 6.8, lookAhead: 18 }
];

function computeRaceStandings() {
  const entries = [
    {
      name: mpState.playerName || 'Tú',
      color: selectedPaintColor,
      distance: raceState.distance,
      isSelf: true,
      isHuman: true
    }
  ];

  if (multiplayerMode === 'split' && player2Car) {
    entries.push({
      name: 'Jugador 2',
      color: '#f59e0b',
      distance: raceState.p2Distance,
      isSelf: false,
      isHuman: true
    });
  } else {
    Object.values(mpState.remotePlayers).forEach((rp) => {
      entries.push({
        name: rp.name || 'Piloto',
        color: rp.paintColor || '#38bdf8',
        distance: rp.distance || 0,
        isSelf: false,
        isHuman: true
      });
    });
  }

  aiCars.forEach((ai) => {
    entries.push({
      name: ai.name,
      color: ai.paintColor || '#94a3b8',
      distance: ai.distance || 0,
      isSelf: false,
      isHuman: false
    });
  });

  entries.sort((a, b) => b.distance - a.distance);
  return entries;
}

function updateLiveRankingHUD() {
  const listEl = document.getElementById('hud-live-ranking-list');
  const posEl = document.getElementById('hud-position');
  const totalEl = document.getElementById('hud-position-total');
  const roomTagEl = document.getElementById('hud-ranking-room-tag');
  if (!listEl) return;

  const standings = computeRaceStandings();
  const selfIdx = standings.findIndex((e) => e.isSelf);
  const myRank = selfIdx >= 0 ? selfIdx + 1 : 1;

  if (posEl) posEl.textContent = String(myRank);
  if (totalEl) totalEl.textContent = `/${standings.length}`;
  if (roomTagEl) {
    roomTagEl.textContent = mpState.roomCode ? mpState.roomCode : `${standings.length}P`;
  }

  listEl.innerHTML = '';
  standings.slice(0, 8).forEach((r, idx) => {
    const row = document.createElement('div');
    row.className = `flex items-center justify-between gap-1 px-1 py-0.5 rounded ${
      r.isSelf ? 'bg-cyan-500/25 text-white font-bold' : 'text-slate-200'
    }`;
    const left = document.createElement('div');
    left.className = 'flex items-center gap-1 min-w-0';

    const rankSpan = document.createElement('span');
    rankSpan.className = idx === 0 ? 'font-display font-black text-amber-300 w-3.5' : 'font-display font-bold text-slate-400 w-3.5';
    rankSpan.textContent = `${idx + 1}º`;

    const dot = document.createElement('span');
    dot.className = 'w-2 h-2 rounded-full shrink-0 border border-white/40';
    dot.style.backgroundColor = r.color;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'truncate max-w-[92px] sm:max-w-[115px]';
    nameSpan.textContent = r.isSelf ? `${r.name} (Tú)` : r.name;

    left.appendChild(rankSpan);
    left.appendChild(dot);
    left.appendChild(nameSpan);
    row.appendChild(left);
    listEl.appendChild(row);
  });

  return { myRank, totalRacers: standings.length, standings };
}

function triggerFunCarClash(ai, pushDir) {
  raceState.carClashes++;
  ai.clashHits = (ai.clashHits || 0) + 1;

  if (raceState.clashComboTimer > 0) {
    raceState.clashCombo++;
  } else {
    raceState.clashCombo = 1;
  }
  raceState.clashComboTimer = 4.5;

  const turboGain = Math.min(18, 9 + raceState.clashCombo * 2);
  raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + turboGain);
  const carCfg = CARS[selectedCarIndex];
  raceState.speed = Math.min(carCfg.maxUnitsPerSec * 1.38, raceState.speed + 14);

  const isSuperTornado = ai.clashHits >= 2 || raceState.clashCombo >= 2 || inputState.nitro;

  if (isSuperTornado) {
    ai.spinTimer = 1.65;
    ai.spinVelY = pushDir * (Math.PI * 6 / 1.65);
    ai.rollVelZ = pushDir * (Math.PI * 2 / 1.65);
    ai.airBounceVel = 17.5;
    sound.playTornadoSpinSound();

    if (raceState.playerSpinTimer <= 0) {
      raceState.playerSpinTimer = 0.56;
      raceState.playerSpinAngle = 0;
      raceState.playerSpinVel = -pushDir * (Math.PI * 2 / 0.56);
    }
    logRaceHighlight(`¡Tornado Spin 1080° contra ${ai.name} (Combo x${raceState.clashCombo})!`);
  } else {
    ai.spinTimer = 1.05;
    ai.spinVelY = pushDir * (Math.PI * 2 / 1.05);
    ai.rollVelZ = pushDir * 3.5;
    ai.airBounceVel = 9.0;
    sound.playClashTurboSound(raceState.clashCombo);
    logRaceHighlight(`Impacto Turbo contra ${ai.name}`);
  }

  const comboEl = document.getElementById('hud-combo-pill');
  if (comboEl) {
    comboEl.classList.remove('hidden');
    comboEl.textContent = isSuperTornado
      ? `🌀 x${raceState.clashCombo} TORNADO!`
      : `💥 x${raceState.clashCombo} +TURBO`;
  }

  for (let k = 0; k < 8; k++) {
    spawnParticle(ai.mesh.position.clone().add(new THREE.Vector3(0, 0.8, 0)), isSuperTornado ? 0xe879f9 : 0xf59e0b, 1.45);
  }
}

function awardSmallDodgeTurbo() {
  raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + 4);
  sound.playDodgeBoostSound();
  for (let k = 0; k < 3; k++) {
    spawnParticle(playerCar.position.clone().add(new THREE.Vector3(0, 0.45, 0)), 0x22d3ee, 1.0);
  }
}

function logRaceHighlight(text) {
  const stamp = formatTime(raceState.elapsedTime);
  raceHighlights.push(`[${stamp}] ${text}`);
}

function positionCarOnSpline(
  carMesh,
  distanceAlongTrack,
  lateralOffset,
  yawSlipAngle,
  bodyRollAngle,
  bodyPitchAngle,
  dt,
  speedUnits,
  tunnelAngle = 0,
  airHeight = 0,
  extraSpinY = 0,
  extraRollZ = 0,
  branchLat = 0,
  branchY = 0
) {
  if (!carMesh || !currentCurve) return;
  const trackCfg = TRACKS[selectedTrackIndex];
  const u = ((distanceAlongTrack / trackLength) % 1 + 1) % 1;
  const { point, tangent, binormal, normal } = getTrackBasis(u);
  const activeTunnel = getActiveTunnelZone(trackCfg, u);

  let worldPos;
  let effectiveRoll = bodyRollAngle + extraRollZ;

  if (activeTunnel || Math.abs(tunnelAngle) > 0.02) {
    const R = activeTunnel ? (activeTunnel.radius - 0.55) : 10.0;
    const center = point.clone().addScaledVector(normal, R);
    worldPos = center
      .addScaledVector(binormal, Math.sin(tunnelAngle) * R)
      .addScaledVector(normal, -Math.cos(tunnelAngle) * R);
    effectiveRoll -= tunnelAngle;
  } else {
    worldPos = point.clone()
      .addScaledVector(binormal, lateralOffset + branchLat)
      .add(new THREE.Vector3(0, airHeight + branchY, 0));
  }

  carMesh.position.copy(worldPos);

  const lookTarget = worldPos.clone().add(tangent);
  carMesh.lookAt(lookTarget);

  carMesh.rotateY(Math.PI + yawSlipAngle + extraSpinY);
  carMesh.rotateZ(-effectiveRoll);
  carMesh.rotateX(-bodyPitchAngle);

  const ud = carMesh.userData;
  if (ud) {
    const wheelSpinDelta = speedUnits * dt * 0.85;
    ud.wheelSpinMeshes.forEach((w) => {
      w.rotation.x += wheelSpinDelta;
    });
    ud.frontWheelPivots.forEach((p) => {
      p.rotation.y = yawSlipAngle * 0.65 - bodyRollAngle * 2.2;
    });
  }
}


let lastFrameTime = performance.now();
let lastCountdownInt = 3;

function startNewRace(fromRemote = false, isRematch = false) {
  sound.init();

  // Require mandatory pilot name when racing in Multiplayer!
  if ((multiplayerMode === 'online' || multiplayerMode === 'split') && !fromRemote) {
    if (!ensureMandatoryMultiplayerName()) return;
  } else if (!mpState.playerName) {
    const inp = document.getElementById('mp-player-name-input');
    mpState.playerName = (inp && inp.value.trim()) ? inp.value.trim().slice(0, 14) : 'Piloto 1';
  }

  const trackCfg = TRACKS[selectedTrackIndex];
  sound.setMusicStyle(trackCfg.musicStyleIndex ?? selectedTrackIndex);

  // Reset all remote player distances cleanly so Rematch starts synchronized from 0m!
  Object.values(mpState.remotePlayers).forEach((rp) => {
    rp.distance = 0;
    rp.speed = 0;
    rp.mesh = null;
  });

  buildRaceTrackScene(trackCfg);

  if (multiplayerMode === 'online' && !fromRemote) {
    sendMultiplayerPacket({
      type: isRematch ? 'rematch_race' : 'start_race',
      senderId: mpState.selfId,
      playerName: mpState.playerName,
      carIndex: selectedCarIndex,
      paintColor: selectedPaintColor,
      trackIndex: selectedTrackIndex,
      botCount: mpState.botCount,
      isHost: mpState.isHost
    });
  }

  garageGroup.visible = false;
  raceWorldGroup.visible = true;
  document.body.classList.remove('cinematic-active');

  document.getElementById('garage-screen').classList.add('hidden');
  document.getElementById('replay-screen').classList.add('hidden');
  document.getElementById('replay-screen').classList.remove('flex');

  const raceHud = document.getElementById('race-hud');
  raceHud.classList.remove('hidden');
  raceHud.classList.add('flex');

  document.getElementById('btn-camera').classList.remove('hidden');
  document.getElementById('btn-pause').classList.remove('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('flex');

  const comboEl = document.getElementById('hud-combo-pill');
  if (comboEl) comboEl.classList.add('hidden');

  const p2Controls = document.getElementById('p2-touch-controls');
  const divider = document.getElementById('split-screen-divider');
  if (multiplayerMode === 'split') {
    p2Controls.classList.remove('hidden');
    p2Controls.classList.add('flex');
    divider.classList.remove('hidden');
    updateSplitScreenDivider();
  } else {
    p2Controls.classList.add('hidden');
    p2Controls.classList.remove('flex');
    divider.classList.add('hidden');
  }

  // Reset input states & countdown integer so Rematch never sticks or desyncs
  inputState.left = false;
  inputState.right = false;
  inputState.drift = false;
  inputState.nitro = false;
  lastCountdownInt = 3;

  raceState.distance = 0;
  raceState.lateralOffset = -2.8;
  raceState.lateralVelocity = 0;
  raceState.steerInputSmooth = 0;
  raceState.speed = 0;
  raceState.nitroAmount = 0;
  raceState.lap = 1;
  raceState.totalLaps = trackCfg.totalLaps || 3;
  raceState.elapsedTime = 0;
  raceState.topSpeedRecorded = 0;
  raceState.carClashes = 0;
  raceState.clashCombo = 0;
  raceState.clashComboTimer = 0;
  raceState.playerSpinTimer = 0;
  raceState.playerSpinAngle = 0;
  raceState.playerSpinVel = 0;
  raceState.tunnelAngle = 0;
  raceState.inTunnel = false;
  raceState.airHeight = 0;
  raceState.inMegaJump = false;
  raceState.lastRingPassed = 0;
  raceState.activeBranch = 0;
  raceState.branchOffsetLat = 0;
  raceState.branchOffsetY = 0;
  raceState.bodyRoll = 0;
  raceState.bodyPitch = 0;
  raceState.driftAngle = 0;
  raceState.shakeTimer = 0;
  raceState.rockSpawnCooldown = 2.2;
  raceState.skipCurrentVista = false;
  raceState.activeVistaTitle = '';
  raceState.countdownTimer = 3.0;
  raceState.replaySampleAccum = 0;
  raceState.rankingUiAccum = 0;

  raceState.p2Distance = 0;
  raceState.p2LateralOffset = 2.8;
  raceState.p2LateralVel = 0;
  raceState.p2SteerSmooth = 0;
  raceState.p2Speed = 0;
  raceState.p2Nitro = 20;

  replayFrames = [];
  raceHighlights = [
    `${isRematch ? '¡Revancha' : 'Salida'} en ${trackCfg.name} con ${CARS[selectedCarIndex].name}!`
  ];

  document.getElementById('hud-lap').textContent = '1';
  const lapTotalEl = document.getElementById('hud-lap-total');
  if (lapTotalEl) lapTotalEl.textContent = `/${raceState.totalLaps}`;
  document.getElementById('hud-nitro-pct').textContent = '0%';
  document.getElementById('hud-nitro-bar').style.width = '0%';

  positionCarOnSpline(playerCar, 0, raceState.lateralOffset, 0, 0, 0, 0.016, 0);
  if (player2Car) {
    positionCarOnSpline(player2Car, 0, raceState.p2LateralOffset, 0, 0, 0, 0.016, 0);
  }
  Object.values(mpState.remotePlayers).forEach((rp, rIdx) => {
    syncRemotePlayerCarMesh(rp);
    if (rp.mesh) {
      positionCarOnSpline(rp.mesh, 0, (rIdx % 2 === 0 ? 1 : -1) * 2.8, 0, 0, 0, 0.016, 0);
    }
  });
  aiCars.forEach((ai) => {
    positionCarOnSpline(ai.mesh, ai.distance, ai.lateralOffset, 0, 0, 0, 0.016, 0);
  });

  updateLiveRankingHUD();

  const basis = getTrackBasis(0);
  raceState.camPos.copy(playerCar.position).addScaledVector(basis.tangent, -10).add(new THREE.Vector3(0, 4, 0));
  raceState.camLook.copy(playerCar.position).addScaledVector(basis.tangent, 12);
  if (player2Car) {
    raceState.p2CamPos.copy(player2Car.position).addScaledVector(basis.tangent, -10).add(new THREE.Vector3(0, 4, 0));
    raceState.p2CamLook.copy(player2Car.position).addScaledVector(basis.tangent, 12);
  }

  const cdOverlay = document.getElementById('countdown-overlay');
  cdOverlay.classList.remove('hidden');
  document.getElementById('countdown-text').textContent = '3';
  document.getElementById('countdown-sub').textContent = isRematch
    ? '🔄 ¡REVANCHA EN VIVO! Todos los pilotos listos en la salida'
    : (trackCfg.sceneryType === 'candy'
      ? '🍩 ¡Reino Dulce Candy! Pasa por donas, hotcakes 🥞 y dango 🍡'
      : 'Impacta autos para hacerlos girar y ganar Turbo');

  gameMode = 'countdown';
  sound.playTone(440, 0.18, 'triangle', 0.18);
}

function returnToGarage() {
  gameMode = 'garage';
  garageGroup.visible = true;
  raceWorldGroup.visible = false;
  document.body.classList.remove('cinematic-active');

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  applySkyAndLighting(TRACKS[selectedTrackIndex]);
  rebuildGarageCar();
  setGarageDrawerCollapsed(true);

  document.getElementById('garage-screen').classList.remove('hidden');
  const raceHud = document.getElementById('race-hud');
  raceHud.classList.add('hidden');
  raceHud.classList.remove('flex');

  const replayScr = document.getElementById('replay-screen');
  replayScr.classList.add('hidden');
  replayScr.classList.remove('flex');

  document.getElementById('split-screen-divider').classList.add('hidden');
  document.getElementById('btn-camera').classList.add('hidden');
  document.getElementById('btn-pause').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('flex');
  document.getElementById('speed-lines').style.opacity = '0';
}

function finishRace(finalRank) {
  replayState.finalRank = finalRank;
  replayState.playing = true;
  replayState.timeIndex = 0;
  replayState.elapsedReplaySec = 0;
  replayState.speedMult = 1.0;
  replayState.camMode = 0;
  replayState.autoCamTimer = 0;
  replayState.activeAutoCam = 1;

  sound.playTone(523.25, 0.18, 'triangle', 0.22);
  setTimeout(() => sound.playTone(659.25, 0.18, 'triangle', 0.22), 160);
  setTimeout(() => sound.playTone(783.99, 0.38, 'triangle', 0.25), 320);

  logRaceHighlight(`Meta en ${finalRank}º Lugar • Vel. Máx: ${Math.round(raceState.topSpeedRecorded)} km/h • ${raceState.carClashes} choques Tornado`);

  document.getElementById('modal-badge').textContent = finalRank === 1 ? '¡VICTORIA EN EL PODIO!' : 'CARRERA COMPLETADA';
  document.getElementById('modal-title').textContent = finalRank === 1 ? '¡1º Lugar Campeón!' : `Terminaste en ${finalRank}º Lugar`;
  document.getElementById('modal-subtitle').textContent = `Circuito ${TRACKS[selectedTrackIndex].name} completado con ${CARS[selectedCarIndex].name}.`;
  document.getElementById('modal-stats').classList.remove('hidden');
  document.getElementById('result-pos').textContent = `${finalRank}º`;
  document.getElementById('result-time').textContent = formatTime(raceState.elapsedTime);
  document.getElementById('result-topspeed').textContent = `${Math.round(raceState.topSpeedRecorded)} km/h`;
  document.getElementById('result-dodges').textContent = `${raceState.carClashes} choques`;
  document.getElementById('btn-modal-resume').classList.add('hidden');
  document.getElementById('btn-modal-watch-replay').classList.remove('hidden');

  // Populate full final standings table in the Podium Modal
  const standingsEl = document.getElementById('modal-standings-list');
  if (standingsEl) {
    const standings = computeRaceStandings();
    standingsEl.innerHTML = '';
    standings.forEach((s, idx) => {
      const item = document.createElement('div');
      item.className = `flex items-center justify-between px-2 py-1 rounded ${
        s.isSelf ? 'bg-cyan-500/25 border border-cyan-400/40 text-white font-bold' : 'bg-slate-950/60 text-slate-300'
      }`;
      item.innerHTML = `
        <div class="flex items-center gap-1.5">
          <span class="font-display font-black ${idx === 0 ? 'text-amber-300' : 'text-slate-400'}">${idx + 1}º</span>
          <span class="w-2.5 h-2.5 rounded-full border border-white/40 inline-block" style="background:${s.color}"></span>
          <span>${s.name}${s.isSelf ? ' (Tú)' : ''}</span>
        </div>
        <span class="text-[9px] text-cyan-300">${s.isHuman ? 'Piloto' : 'Bot IA'}</span>
      `;
      standingsEl.appendChild(item);
    });
  }

  startTvBroadcastReplay();
}

function startTvBroadcastReplay() {
  gameMode = 'replay';
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  document.getElementById('split-screen-divider').classList.add('hidden');

  const raceHud = document.getElementById('race-hud');
  raceHud.classList.add('hidden');
  raceHud.classList.remove('flex');

  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('flex');

  const replayScr = document.getElementById('replay-screen');
  replayScr.classList.remove('hidden');
  replayScr.classList.add('flex');
  document.body.classList.add('cinematic-active');

  const trk = TRACKS[selectedTrackIndex];
  const car = CARS[selectedCarIndex];
  const rank = replayState.finalRank;

  document.getElementById('replay-headline').textContent =
    rank === 1
      ? `¡VICTORIA DE ${mpState.playerName || car.name} EN ${trk.name.toUpperCase()}!`
      : `RESUMEN DE CARRERA: ${trk.name.toUpperCase()} (${rank}º LUGAR)`;

  const standingsText = computeRaceStandings()
    .map((s, idx) => `${idx + 1}º ${s.name}`)
    .join(' | ');

  const tickerText = `🎙️ RANKING DE LA SALA: [ ${standingsText} ]   •   ${raceHighlights.join('   •   ')}   •   Tiempo final: ${formatTime(raceState.elapsedTime)}`;
  document.getElementById('replay-ticker').textContent = tickerText;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const tenths = Math.floor((sec % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
}

// =========================================================================
// 9. BUCLE DE FÍSICAS Y RANKING EN VIVO
// =========================================================================
function updateRacePhysics(dt) {
  const carCfg = CARS[selectedCarIndex];
  const trackCfg = TRACKS[selectedTrackIndex];
  const steerAssist = document.getElementById('toggle-assist').checked;
  const hazardsEnabled = document.getElementById('toggle-hazards').checked;
  const cinematicVistasEnabled = document.getElementById('toggle-cinematic-vistas').checked;
  const diffCfg = DIFFICULTY_LEVELS[selectedDifficultyIndex] || DIFFICULTY_LEVELS[1];

  waterfallParticles.forEach((wp) => {
    wp.mesh.position.y -= wp.speed * dt;
    if (wp.mesh.position.y < wp.baseY) {
      wp.mesh.position.y = wp.topY;
    }
  });

  if (gameMode === 'countdown') {
    raceState.countdownTimer -= dt;
    const cdInt = Math.ceil(raceState.countdownTimer);
    if (cdInt !== lastCountdownInt && cdInt >= 1) {
      lastCountdownInt = cdInt;
      document.getElementById('countdown-text').textContent = String(cdInt);
      sound.playTone(440, 0.16, 'triangle', 0.18);
    }
    if (raceState.countdownTimer <= 0) {
      gameMode = 'racing';
      document.getElementById('countdown-text').textContent = '¡YA!';
      sound.playTone(880, 0.35, 'sawtooth', 0.22);
      setTimeout(() => {
        document.getElementById('countdown-overlay').classList.add('hidden');
      }, 450);
    }
    return;
  }

  if (gameMode !== 'racing') return;

  raceState.elapsedTime += dt;

  if (raceState.clashComboTimer > 0) {
    raceState.clashComboTimer -= dt;
    if (raceState.clashComboTimer <= 0) {
      raceState.clashCombo = 0;
      const comboEl = document.getElementById('hud-combo-pill');
      if (comboEl) comboEl.classList.add('hidden');
    }
  }

  if (raceState.playerSpinTimer > 0) {
    raceState.playerSpinTimer -= dt;
    raceState.playerSpinAngle += raceState.playerSpinVel * dt;
    if (raceState.playerSpinTimer <= 0) {
      raceState.playerSpinTimer = 0;
      raceState.playerSpinAngle = 0;
    }
  }

  const currentU = ((raceState.distance / trackLength) % 1 + 1) % 1;
  const currentBasis = getTrackBasis(currentU);
  const slopeY = currentBasis.tangent.y;
  const altitudeMeters = Math.round(currentBasis.point.y + raceState.airHeight + raceState.branchOffsetY);
  const slopePct = Math.round(slopeY * 100);

  const activeTunnel = getActiveTunnelZone(trackCfg, currentU);
  const megaRampState = getMegaRampState(trackCfg, currentU);
  const activeSplit = getActiveSplitZone(trackCfg, currentU);

  if (activeSplit) {
    if (raceState.activeBranch === 0 || activeSplit.frac < 0.18) {
      raceState.activeBranch = raceState.lateralOffset <= 0 ? -1 : 1;
    }
    const sz = activeSplit.zone;
    const env = activeSplit.envelope;
    const targetBranchLat = raceState.activeBranch * (sz.sepLat || 13.5) * env;
    const targetBranchY = (raceState.activeBranch === -1 ? (sz.leftHeight || 14.0) : (sz.rightHeight || -6.0)) * env;
    raceState.branchOffsetLat += (targetBranchLat - raceState.branchOffsetLat) * Math.min(1, dt * 10);
    raceState.branchOffsetY += (targetBranchY - raceState.branchOffsetY) * Math.min(1, dt * 10);

    raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + dt * 3.6);
  } else {
    raceState.activeBranch = 0;
    raceState.branchOffsetLat *= Math.max(0, 1 - dt * 9);
    raceState.branchOffsetY *= Math.max(0, 1 - dt * 9);
  }

  const elevEl = document.getElementById('hud-elevation');
  if (elevEl) {
    if (activeTunnel) {
      const deg = Math.round((Math.abs(raceState.tunnelAngle) / Math.PI) * 180) % 360;
      elevEl.textContent = deg > 125 ? `TÚNEL 360° • TECHO` : (deg > 45 ? `TÚNEL 360° • PARED` : `TÚNEL 360°`);
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-fuchsia-300 leading-none';
    } else if (megaRampState && megaRampState.inFlight) {
      elevEl.textContent = `🎯 AROS +${Math.round(raceState.airHeight)}m`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-cyan-300 leading-none';
    } else if (activeSplit) {
      elevEl.textContent = raceState.activeBranch === -1
        ? `🍩 ${activeSplit.zone.leftLabel}`
        : `🥞 ${activeSplit.zone.rightLabel}`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-pink-300 leading-none';
    } else if (trackCfg.totalLaps === 1) {
      const pctMeta = Math.min(99, Math.floor(currentU * 100));
      elevEl.textContent = `META ${pctMeta}% • ${altitudeMeters}m`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-emerald-300 leading-none';
    } else if (slopePct > 4) {
      elevEl.textContent = `${altitudeMeters}m ▲+${slopePct}%`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-amber-300 leading-none';
    } else if (slopePct < -4) {
      elevEl.textContent = `${altitudeMeters}m ▼${slopePct}%`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-cyan-300 leading-none';
    } else {
      elevEl.textContent = `${altitudeMeters}m • ${trackCfg.sceneryType === 'candy' ? 'Dulce 🍡' : 'Llano'}`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-emerald-300 leading-none';
    }
  }

  const isBraking = inputState.drift;
  const isNitroActive = inputState.nitro && raceState.nitroAmount > 1.0;

  if (raceState.shakeTimer > 0) {
    raceState.shakeTimer = Math.max(0, raceState.shakeTimer - dt);
  }

  const slopeTopSpeedMod = 1 - slopeY * 0.20;
  let targetMaxSpeed = carCfg.maxUnitsPerSec * slopeTopSpeedMod;
  if (activeTunnel || (megaRampState && megaRampState.inFlight) || (activeSplit && raceState.activeBranch === -1)) {
    targetMaxSpeed *= 1.12;
  }
  if (isNitroActive) {
    targetMaxSpeed *= carCfg.nitroBoost;
    raceState.nitroAmount = Math.max(0, raceState.nitroAmount - dt * 26);
  }

  if (!isBraking) {
    const accelMult = isNitroActive ? 1.72 : 1.0;
    raceState.speed += (carCfg.accelRate * accelMult - slopeY * 22) * dt;
  } else {
    raceState.speed -= (carCfg.accelRate * 0.38 + slopeY * 16) * dt;
  }

  if (!activeTunnel && Math.abs(raceState.lateralOffset) > ROAD_HALF_WIDTH - 1.1) {
    raceState.speed *= (1 - 0.85 * dt);
  }

  raceState.speed = Math.max(0, Math.min(targetMaxSpeed, raceState.speed));
  const speedRatio = raceState.speed / carCfg.maxUnitsPerSec;

  const rawSteer = (inputState.left ? -1 : 0) + (inputState.right ? 1 : 0);
  const steerLerpRate = steerAssist ? 10.5 : 14.0;
  raceState.steerInputSmooth += (rawSteer - raceState.steerInputSmooth) * Math.min(1, dt * steerLerpRate);

  const isDrifting = isBraking && Math.abs(raceState.steerInputSmooth) > 0.2 && speedRatio > 0.35;
  const turnAgility = carCfg.handlingRate * (isDrifting ? 1.35 : 1.0);

  if (activeTunnel) {
    if (!raceState.inTunnel) {
      raceState.inTunnel = true;
      raceState.tunnelAngle = (raceState.lateralOffset / ROAD_HALF_WIDTH) * 0.65;
    }
    const autoSpiral = Math.abs(rawSteer) < 0.05 ? 1.15 : 0;
    raceState.tunnelAngle += (raceState.steerInputSmooth * 3.1 + autoSpiral) * dt;
    raceState.lateralOffset = Math.sin(raceState.tunnelAngle) * (ROAD_HALF_WIDTH * 0.75);
  } else {
    if (raceState.inTunnel) {
      raceState.inTunnel = false;
    }
    if (Math.abs(raceState.tunnelAngle) > 0.01) {
      raceState.tunnelAngle = ((raceState.tunnelAngle + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      raceState.tunnelAngle *= Math.max(0, 1 - dt * 7.5);
      if (Math.abs(raceState.tunnelAngle) < 0.02) raceState.tunnelAngle = 0;
    }

    const targetLateralVel = raceState.steerInputSmooth * turnAgility * Math.min(1, speedRatio + 0.2) * 5.2;
    raceState.lateralVelocity += (targetLateralVel - raceState.lateralVelocity) * Math.min(1, dt * 8.5);
    raceState.lateralOffset += raceState.lateralVelocity * dt;

    const maxOffset = activeSplit ? (ROAD_HALF_WIDTH * 0.60) : (ROAD_HALF_WIDTH - 1.25);
    if (raceState.lateralOffset > maxOffset) {
      raceState.lateralOffset = maxOffset;
      raceState.lateralVelocity *= -0.25;
    } else if (raceState.lateralOffset < -maxOffset) {
      raceState.lateralOffset = -maxOffset;
      raceState.lateralVelocity *= -0.25;
    }
  }

  let rampPitch = 0;
  if (megaRampState) {
    raceState.airHeight = megaRampState.height;
    rampPitch = megaRampState.pitch;

    raceState.lateralOffset *= Math.max(0, 1 - dt * 5.5);
    raceState.lateralVelocity *= Math.max(0, 1 - dt * 8.0);

    if (megaRampState.inFlight) {
      if (!raceState.inMegaJump) {
        raceState.inMegaJump = true;
        raceState.lastRingPassed = 0;
        sound.playMegaJumpSound();
        logRaceHighlight('¡Vuelo calibrado a través de los 3 aros aéreos!');
      }
      const ringThresholds = [0.25, 0.50, 0.75];
      ringThresholds.forEach((th, rIdx) => {
        const ringNum = rIdx + 1;
        if (megaRampState.flightFrac >= th && raceState.lastRingPassed < ringNum) {
          raceState.lastRingPassed = ringNum;
          raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + 5);
          sound.playRingPassSound(ringNum);
          for (let k = 0; k < 5; k++) {
            spawnParticle(playerCar.position, ringNum === 2 ? 0xf72585 : 0x00f5d4, 1.35);
          }
        }
      });
    }
  } else {
    if (raceState.inMegaJump) {
      raceState.inMegaJump = false;
      raceState.lastRingPassed = 0;
      raceState.shakeTimer = 0.16;
      sound.playClashTurboSound(2);
    }
    raceState.airHeight *= Math.max(0, 1 - dt * 14);
    if (raceState.airHeight < 0.05) raceState.airHeight = 0;
  }

  if (isDrifting) {
    raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + dt * 2.5);
  }

  raceState.distance += raceState.speed * dt;

  const targetRoll = -raceState.steerInputSmooth * 0.11 * Math.min(1, speedRatio);
  const targetPitch = rampPitch + (isNitroActive ? -0.045 : (isBraking ? 0.04 : -0.015 * speedRatio));
  const targetYaw = isDrifting
    ? -raceState.steerInputSmooth * 0.34
    : -raceState.steerInputSmooth * 0.12 * Math.min(1, speedRatio);

  raceState.bodyRoll += (targetRoll - raceState.bodyRoll) * Math.min(1, dt * 10);
  raceState.bodyPitch += (targetPitch - raceState.bodyPitch) * Math.min(1, dt * 10);
  raceState.driftAngle += (targetYaw - raceState.driftAngle) * Math.min(1, dt * 8);

  positionCarOnSpline(
    playerCar,
    raceState.distance,
    raceState.lateralOffset,
    raceState.driftAngle,
    raceState.bodyRoll,
    raceState.bodyPitch,
    dt,
    raceState.speed,
    raceState.tunnelAngle,
    raceState.airHeight,
    raceState.playerSpinAngle,
    0,
    raceState.branchOffsetLat,
    raceState.branchOffsetY
  );

  const pud = playerCar.userData;
  if (pud) {
    pud.tailLightMat.color.setHex(isBraking ? 0xffaa00 : 0xf43f5e);
    const showFlame = isNitroActive || raceState.playerSpinTimer > 0 || raceState.airHeight > 3;
    pud.flameMat.opacity = showFlame ? (0.68 + Math.random() * 0.32) : 0.0;
    const fScale = showFlame ? (1.05 + Math.random() * 0.65) : 0.01;
    pud.flameL.scale.set(1, 1, fScale);
    pud.flameR.scale.set(1, 1, fScale);
  }

  if (isDrifting || isNitroActive) {
    const pColor = isNitroActive ? 0x38bdf8 : (trackCfg.sceneryType === 'candy' ? 0xf472b6 : 0xcbd5e1);
    spawnParticle(playerCar.position.clone().add(new THREE.Vector3(0, 0.25, 0)), pColor, isNitroActive ? 0.9 : 1.15);
  }

  // Split-Screen Player 2
  if (multiplayerMode === 'split' && player2Car) {
    const maxOffset = ROAD_HALF_WIDTH - 1.25;
    const p2Cfg = CARS[(selectedCarIndex + 1) % CARS.length];
    const p2SteerRaw = (inputStateP2.left ? -1 : 0) + (inputStateP2.right ? 1 : 0);
    raceState.p2SteerSmooth += (p2SteerRaw - raceState.p2SteerSmooth) * Math.min(1, dt * 11);
    const p2NitroActive = inputStateP2.nitro && raceState.p2Nitro > 1;
    if (p2NitroActive) {
      raceState.p2Nitro = Math.max(0, raceState.p2Nitro - dt * 22);
    }
    const p2Max = p2Cfg.maxUnitsPerSec * (p2NitroActive ? p2Cfg.nitroBoost : 1.0);
    raceState.p2Speed += (inputStateP2.drift ? -p2Cfg.accelRate * 0.38 : p2Cfg.accelRate) * dt;
    raceState.p2Speed = Math.max(0, Math.min(p2Max, raceState.p2Speed));
    raceState.p2LateralOffset += raceState.p2SteerSmooth * p2Cfg.handlingRate * 4.5 * dt;
    raceState.p2LateralOffset = Math.max(-maxOffset, Math.min(maxOffset, raceState.p2LateralOffset));
    raceState.p2Distance += raceState.p2Speed * dt;

    positionCarOnSpline(
      player2Car,
      raceState.p2Distance,
      raceState.p2LateralOffset,
      -raceState.p2SteerSmooth * 0.16,
      -raceState.p2SteerSmooth * 0.08,
      0,
      dt,
      raceState.p2Speed
    );
    const p2Kmh = Math.round((raceState.p2Speed / p2Cfg.maxUnitsPerSec) * p2Cfg.topSpeedKmh);
    const p2SpdEl = document.getElementById('hud-p2-speed');
    if (p2SpdEl) p2SpdEl.textContent = `${p2Kmh} km/h`;
  }

  // Online P2P Multiplayer Telemetry & Remote Cars (With exact Paint Color & Car Model!)
  if (multiplayerMode === 'online') {
    sendMultiplayerPacket({
      type: 'telemetry',
      senderId: mpState.selfId,
      playerName: mpState.playerName || 'Piloto',
      carIndex: selectedCarIndex,
      paintColor: selectedPaintColor,
      distance: raceState.distance,
      lateralOffset: raceState.lateralOffset,
      speed: raceState.speed,
      driftAngle: raceState.driftAngle
    });

    Object.values(mpState.remotePlayers).forEach((rp) => {
      syncRemotePlayerCarMesh(rp);
      if (rp.mesh) {
        positionCarOnSpline(
          rp.mesh,
          rp.distance || 0,
          rp.lateralOffset || 0,
          rp.driftAngle || 0,
          0,
          0,
          dt,
          rp.speed || 95
        );
      }
    });
  }

  // Obstacles
  if (hazardsEnabled && raceState.airHeight < 3.0 && !activeTunnel && !activeSplit) {
    const playerLapDist = ((raceState.distance % trackLength) + trackLength) % trackLength;

    wildlifeHazards.forEach((wh) => {
      wh.mesh.visible = true;
      if (wh.hitCooldown > 0) wh.hitCooldown -= dt;

      wh.lateralOffset += wh.dir * wh.walkSpeed * diffCfg.hazardFrequency * dt;
      if (wh.lateralOffset > ROAD_HALF_WIDTH - 1.2) {
        wh.lateralOffset = ROAD_HALF_WIDTH - 1.2;
        wh.dir = -1;
      } else if (wh.lateralOffset < -(ROAD_HALF_WIDTH - 1.2)) {
        wh.lateralOffset = -(ROAD_HALF_WIDTH - 1.2);
        wh.dir = 1;
      }

      const basis = getTrackBasis(wh.u);
      const wPos = basis.point.clone().addScaledVector(basis.binormal, wh.lateralOffset);
      wh.mesh.position.copy(wPos);
      const lookDir = basis.point.clone().addScaledVector(basis.binormal, wh.lateralOffset + wh.dir * 5);
      wh.mesh.lookAt(lookDir.x, wPos.y, lookDir.z);

      wh.animPhase += dt * 11;
      const ud = wh.mesh.userData;
      if (ud && ud.legs) {
        ud.legs[0].rotation.x = Math.sin(wh.animPhase) * 0.55;
        ud.legs[1].rotation.x = -Math.sin(wh.animPhase) * 0.55;
        ud.legs[2].rotation.x = -Math.sin(wh.animPhase) * 0.55;
        ud.legs[3].rotation.x = Math.sin(wh.animPhase) * 0.55;
      }

      const distAhead = wh.distance - playerLapDist;
      if (distAhead < -35) wh.dodgedThisLap = false;

      const absLong = Math.abs(playerLapDist - wh.distance);
      const absLat = Math.abs(raceState.lateralOffset - wh.lateralOffset);
      if (absLong < 3.2 && absLat < 1.95 && wh.hitCooldown <= 0) {
        wh.hitCooldown = 1.8;
        raceState.speed *= 0.62;
        raceState.shakeTimer = 0.30;
        const pushDir = raceState.lateralOffset >= wh.lateralOffset ? 1 : -1;
        raceState.lateralVelocity += pushDir * 12;
        sound.playTone(110, 0.20, 'sawtooth', 0.20, 55);
      } else if (absLong < 4.2 && absLat >= 1.95 && absLat < 5.5 && !wh.dodgedThisLap && wh.hitCooldown <= 0) {
        wh.dodgedThisLap = true;
        awardSmallDodgeTurbo();
      }
    });

    roadObstacles.forEach((ro) => {
      ro.mesh.visible = true;
      if (ro.hitCooldown > 0) ro.hitCooldown -= dt;

      const distAhead = ro.distance - playerLapDist;
      if (distAhead < -35) ro.dodgedThisLap = false;

      const absLong = Math.abs(playerLapDist - ro.distance);
      const absLat = Math.abs(raceState.lateralOffset - ro.lateralOffset);
      if (absLong < 3.1 && absLat < 2.05 && ro.hitCooldown <= 0) {
        ro.hitCooldown = 1.8;
        raceState.speed *= 0.62;
        raceState.shakeTimer = 0.30;
        const pushDir = raceState.lateralOffset >= ro.lateralOffset ? 1 : -1;
        raceState.lateralVelocity += pushDir * 12;
        sound.playRockRumble();
      } else if (absLong < 4.2 && absLat >= 2.05 && absLat < 5.4 && !ro.dodgedThisLap && ro.hitCooldown <= 0) {
        ro.dodgedThisLap = true;
        awardSmallDodgeTurbo();
      }
    });

    raceState.rockSpawnCooldown -= dt * diffCfg.hazardFrequency;
    const inRockZone = (trackCfg.rockslideZones || []).some((rz) => currentU >= rz.startU && currentU <= rz.endU);
    if ((inRockZone || Math.abs(slopeY) > 0.065) && raceState.rockSpawnCooldown <= 0 && fallingRocks.length < 3) {
      raceState.rockSpawnCooldown = 2.8 + Math.random() * 2.0;
      spawnRockslideBoulder(raceState.distance + 65 + Math.random() * 35);
    }

    for (let i = fallingRocks.length - 1; i >= 0; i--) {
      const rk = fallingRocks[i];
      rk.life -= dt;
      rk.verticalVel -= 28 * dt;
      rk.heightAboveRoad += rk.verticalVel * dt;

      if (rk.heightAboveRoad <= 1.35) {
        rk.heightAboveRoad = 1.35;
        rk.verticalVel = Math.abs(rk.verticalVel) > 4 ? -rk.verticalVel * 0.42 : 0;
      }

      rk.lateralOffset += rk.lateralRollSpeed * dt;
      const rBasis = getTrackBasis(rk.distance / trackLength);
      const rWorld = rBasis.point.clone()
        .addScaledVector(rBasis.binormal, rk.lateralOffset)
        .add(new THREE.Vector3(0, rk.heightAboveRoad, 0));
      rk.mesh.position.copy(rWorld);
      rk.mesh.rotation.x += dt * 4.5;
      rk.mesh.rotation.z += dt * 3.8;

      const longDiff = Math.abs(playerLapDist - rk.distance);
      const latDiff = Math.abs(raceState.lateralOffset - rk.lateralOffset);
      if (!rk.hit && rk.heightAboveRoad < 3.0 && longDiff < 3.3 && latDiff < 2.1) {
        rk.hit = true;
        raceState.speed *= 0.60;
        raceState.shakeTimer = 0.35;
        sound.playRockRumble();
      } else if (!rk.hit && !rk.dodged && longDiff < 4.2 && latDiff >= 2.1 && latDiff < 5.8) {
        rk.dodged = true;
        awardSmallDodgeTurbo();
      }

      if (rk.life <= 0) {
        raceWorldGroup.remove(rk.mesh);
        raceWorldGroup.remove(rk.ringMesh);
        fallingRocks.splice(i, 1);
      }
    }
  } else if (!hazardsEnabled) {
    wildlifeHazards.forEach((wh) => { wh.mesh.visible = false; });
    roadObstacles.forEach((ro) => { ro.mesh.visible = false; });
  }

  // AI Rivals + TORNADO SPIN-OUT
  aiCars.forEach((ai, idx) => {
    if (ai.clashCooldown > 0) ai.clashCooldown -= dt;

    if (ai.spinTimer > 0) {
      ai.spinTimer -= dt;
      ai.spinAngleY += ai.spinVelY * dt;
      ai.rollAngleZ += ai.rollVelZ * dt;
      if (ai.spinTimer <= 0) {
        ai.spinTimer = 0;
        ai.spinAngleY = 0;
        ai.rollAngleZ = 0;
      }
    }
    if (ai.airBounceY > 0 || ai.airBounceVel > 0) {
      ai.airBounceY += ai.airBounceVel * dt;
      ai.airBounceVel -= 32 * dt;
      if (ai.airBounceY <= 0) {
        ai.airBounceY = 0;
        ai.airBounceVel = 0;
      }
    }

    const distGap = raceState.distance - ai.distance;
    const rubberBand = Math.max(-12, Math.min(20 * diffCfg.aiAggression, distGap * 0.10 * diffCfg.aiAggression));
    ai.nitroTimer -= dt;
    if (distGap > 15 && ai.nitroTimer <= 0 && Math.random() < 0.05 * diffCfg.aiAggression) {
      ai.nitroTimer = 1.5;
    }
    const aiBoost = ai.nitroTimer > 0 ? 1.16 : 1.0;
    const spinSlowdown = ai.spinTimer > 0 ? 0.76 : 1.0;
    const targetAiSpeed = (ai.baseMaxSpeed + rubberBand) * aiBoost * spinSlowdown;
    ai.speed += (targetAiSpeed - ai.speed) * Math.min(1, dt * 2.8);
    ai.distance += ai.speed * dt;

    ai.laneTimer -= dt;
    if (ai.laneTimer <= 0) {
      ai.laneTimer = 1.5 + Math.random() * 2.0;
      ai.targetOffset = (Math.random() - 0.5) * (ROAD_HALF_WIDTH * 1.15);
    }
    ai.lateralOffset += (ai.targetOffset - ai.lateralOffset) * Math.min(1, dt * 2.5);

    const aiU = ((ai.distance / trackLength) % 1 + 1) % 1;
    const aiInTunnel = getActiveTunnelZone(trackCfg, aiU);
    if (aiInTunnel) {
      ai.tunnelAngle += (idx % 2 === 0 ? 1.5 : -1.5) * dt;
    } else {
      ai.tunnelAngle *= Math.max(0, 1 - dt * 6);
    }

    const aiRamp = getMegaRampState(trackCfg, aiU);
    const aiJumpY = aiRamp ? aiRamp.height : 0;
    if (aiRamp) ai.lateralOffset *= Math.max(0, 1 - dt * 5);

    const aiSplit = getActiveSplitZone(trackCfg, aiU);
    let aiBranchLat = 0;
    let aiBranchY = 0;
    if (aiSplit) {
      const sz = aiSplit.zone;
      const env = aiSplit.envelope;
      aiBranchLat = ai.branchChoice * (sz.sepLat || 13.5) * env;
      aiBranchY = (ai.branchChoice === -1 ? (sz.leftHeight || 14.0) : (sz.rightHeight || -6.0)) * env;
    }

    const aiYaw = (ai.lateralOffset - ai.targetOffset) * 0.045;
    positionCarOnSpline(
      ai.mesh,
      ai.distance,
      ai.lateralOffset,
      aiYaw,
      0,
      0,
      dt,
      ai.speed,
      ai.tunnelAngle,
      ai.airBounceY + aiJumpY,
      ai.spinAngleY,
      ai.rollAngleZ,
      aiBranchLat,
      aiBranchY
    );

    const sameBranch = !activeSplit || (ai.branchChoice === raceState.activeBranch);
    const longDiff = Math.abs(raceState.distance - ai.distance);
    const latDiff = Math.abs(raceState.lateralOffset - ai.lateralOffset);
    if (sameBranch && longDiff < 4.3 && latDiff < 2.35 && raceState.airHeight < 5.0) {
      const pushDir = raceState.lateralOffset >= ai.lateralOffset ? 1 : -1;
      raceState.lateralVelocity += pushDir * 7.5;
      ai.lateralOffset -= pushDir * 2.4;
      ai.targetOffset = Math.max(-(ROAD_HALF_WIDTH - 1.4), Math.min(ROAD_HALF_WIDTH - 1.4, ai.lateralOffset - pushDir * 3.5));

      if (ai.clashCooldown <= 0) {
        ai.clashCooldown = 0.55;
        triggerFunCarClash(ai, -pushDir);
      }
    }
  });

  particlePool.forEach((p) => {
    if (p.life > 0) {
      p.life -= dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.material.opacity = Math.max(0, (p.life / p.maxLife) * 0.72);
      p.mesh.scale.multiplyScalar(1 + dt * 1.8);
      if (p.life <= 0) p.mesh.visible = false;
    }
  });

  const activeVista = cinematicVistasEnabled
    ? (trackCfg.scenicZones || []).find((sz) => currentU >= sz.startU && currentU <= sz.endU)
    : null;

  if (activeVista && !raceState.skipCurrentVista) {
    if (raceState.activeVistaTitle !== activeVista.title) {
      raceState.activeVistaTitle = activeVista.title;
      document.body.classList.add('cinematic-active');
    }
  } else {
    if (!activeVista) raceState.skipCurrentVista = false;
    if (raceState.activeVistaTitle !== '') {
      raceState.activeVistaTitle = '';
      document.body.classList.remove('cinematic-active');
    }
  }

  let desiredCamPos;
  let desiredLookAt;

  if (activeTunnel) {
    const R = activeTunnel.radius || 10.8;
    const tunnelCenter = currentBasis.point.clone().addScaledVector(currentBasis.normal, R * 0.68);
    desiredCamPos = playerCar.position.clone()
      .lerp(tunnelCenter, 0.38)
      .addScaledVector(currentBasis.tangent, -8.2);
    desiredLookAt = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, 14);
  } else if (megaRampState && megaRampState.inFlight) {
    desiredCamPos = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, -10.2)
      .add(new THREE.Vector3(0, 3.6, 0));
    desiredLookAt = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, 18)
      .add(new THREE.Vector3(0, 0.5, 0));
  } else if (activeVista && !raceState.skipCurrentVista) {
    desiredCamPos = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, -11.0)
      .addScaledVector(currentBasis.binormal, activeVista.sideOffset * 0.45)
      .add(new THREE.Vector3(0, activeVista.heightOffset, 0));

    desiredLookAt = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, 15)
      .addScaledVector(currentBasis.binormal, activeVista.lookSideOffset * 0.25)
      .add(new THREE.Vector3(0, activeVista.lookHeightOffset, 0));
  } else if (raceState.cameraMode === 3) {
    const sweepSide = Math.sin(raceState.elapsedTime * 0.65) * 6.0;
    desiredCamPos = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, -13.0)
      .addScaledVector(currentBasis.binormal, sweepSide)
      .add(new THREE.Vector3(0, 6.0, 0));
    desiredLookAt = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, 16)
      .add(new THREE.Vector3(0, 1.2, 0));
  } else {
    const camCfg = CAMERA_MODES[raceState.cameraMode] || CAMERA_MODES[0];
    desiredCamPos = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, -camCfg.dist)
      .add(new THREE.Vector3(0, camCfg.height, 0))
      .addScaledVector(currentBasis.binormal, raceState.steerInputSmooth * 0.85);

    desiredLookAt = playerCar.position.clone()
      .addScaledVector(currentBasis.tangent, camCfg.lookAhead)
      .add(new THREE.Vector3(0, 0.8 + slopeY * 4.5, 0));
  }

  if (raceState.shakeTimer > 0) {
    desiredCamPos.x += (Math.random() - 0.5) * 0.75;
    desiredCamPos.y += (Math.random() - 0.5) * 0.55;
  }

  const camFollowTightness = raceState.cameraMode === 2 ? 24 : (activeVista ? 5.5 : 13.5);
  raceState.camPos.lerp(desiredCamPos, Math.min(1, dt * camFollowTightness));
  raceState.camLook.lerp(desiredLookAt, Math.min(1, dt * (camFollowTightness + 3)));

  camera.position.copy(raceState.camPos);
  camera.lookAt(raceState.camLook);

  if (multiplayerMode === 'split' && player2Car) {
    const uP2 = ((raceState.p2Distance / trackLength) % 1 + 1) % 1;
    const basisP2 = getTrackBasis(uP2);
    const desP2Pos = player2Car.position.clone()
      .addScaledVector(basisP2.tangent, -9.2)
      .add(new THREE.Vector3(0, 3.5, 0));
    const desP2Look = player2Car.position.clone()
      .addScaledVector(basisP2.tangent, 12)
      .add(new THREE.Vector3(0, 0.8, 0));
    raceState.p2CamPos.lerp(desP2Pos, Math.min(1, dt * 11));
    raceState.p2CamLook.lerp(desP2Look, Math.min(1, dt * 14));
    cameraP2.position.copy(raceState.p2CamPos);
    cameraP2.lookAt(raceState.p2CamLook);
  }

  const targetFov = 60 + speedRatio * 14 + (isNitroActive ? 9 : 0) + (raceState.airHeight > 3 ? 5 : 0);
  camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 6);
  camera.updateProjectionMatrix();

  document.getElementById('speed-lines').style.opacity = (isNitroActive || raceState.airHeight > 4) ? '0.92' : (speedRatio > 0.85 ? '0.38' : '0');

  const displayKmh = Math.round((raceState.speed / carCfg.maxUnitsPerSec) * carCfg.topSpeedKmh);
  if (displayKmh > raceState.topSpeedRecorded) {
    raceState.topSpeedRecorded = displayKmh;
  }
  document.getElementById('hud-speed').textContent = String(displayKmh);

  const gearNum = Math.min(6, Math.max(1, Math.ceil(speedRatio * 6)));
  document.getElementById('hud-gear').textContent = `${gearNum}ª`;

  const turboPct = Math.round((raceState.nitroAmount / MAX_TURBO_RESERVE) * 100);
  document.getElementById('hud-nitro-pct').textContent = `${turboPct}%`;
  document.getElementById('hud-nitro-bar').style.width = `${turboPct}%`;
  const timeEl = document.getElementById('hud-time');
  if (timeEl) timeEl.textContent = formatTime(raceState.elapsedTime);

  // Refresh Live Ranking Leaderboard at ~8 Hz
  raceState.rankingUiAccum += dt;
  let rank = Number(document.getElementById('hud-position').textContent) || 1;
  if (raceState.rankingUiAccum >= 0.12) {
    raceState.rankingUiAccum = 0;
    const rankInfo = updateLiveRankingHUD();
    if (rankInfo) rank = rankInfo.myRank;
  }

  raceState.replaySampleAccum += dt;
  if (raceState.replaySampleAccum >= 0.033) {
    raceState.replaySampleAccum = 0;
    replayFrames.push({
      t: raceState.elapsedTime,
      d: raceState.distance,
      lat: raceState.lateralOffset,
      spd: raceState.speed,
      kmh: displayKmh,
      alt: altitudeMeters,
      rank,
      yaw: raceState.driftAngle,
      roll: raceState.bodyRoll,
      pitch: raceState.bodyPitch,
      tun: raceState.tunnelAngle,
      air: raceState.airHeight,
      spin: raceState.playerSpinAngle,
      bLat: raceState.branchOffsetLat,
      bY: raceState.branchOffsetY,
      nitro: isNitroActive,
      p2D: raceState.p2Distance,
      p2Lat: raceState.p2LateralOffset,
      ai: aiCars.map((a) => ({
        d: a.distance,
        lat: a.lateralOffset,
        spd: a.speed,
        tun: a.tunnelAngle,
        air: a.airBounceY,
        spin: a.spinAngleY,
        rollZ: a.rollAngleZ
      }))
    });
  }

  const computedLap = Math.floor(raceState.distance / trackLength) + 1;
  if (computedLap > raceState.lap) {
    if (computedLap > raceState.totalLaps) {
      const finalInfo = updateLiveRankingHUD();
      finishRace(finalInfo ? finalInfo.myRank : rank);
      return;
    } else {
      raceState.lap = computedLap;
      document.getElementById('hud-lap').textContent = String(raceState.lap);
      sound.playTone(659.25, 0.2, 'triangle', 0.2, 880);
      logRaceHighlight(`Vuelta ${raceState.lap} en ${rank}º lugar`);
    }
  }
}

// =========================================================================
// 10. REPETICIÓN TV ULTRA FLUIDA CON INTERPOLACIÓN
// =========================================================================
function lerpVal(a, b, t) {
  return a + (b - a) * t;
}

function updateTvBroadcastReplay(dt) {
  if (replayFrames.length === 0) return;

  replayState.elapsedReplaySec += dt;

  waterfallParticles.forEach((wp) => {
    wp.mesh.position.y -= wp.speed * dt;
    if (wp.mesh.position.y < wp.baseY) wp.mesh.position.y = wp.topY;
  });

  if (replayState.playing) {
    replayState.timeIndex += dt * 30;
    if (replayState.timeIndex >= replayFrames.length - 1) {
      replayState.timeIndex = 0;
    }
    const scrubber = document.getElementById('replay-scrubber');
    if (scrubber) {
      scrubber.value = String(Math.round((replayState.timeIndex / Math.max(1, replayFrames.length - 1)) * 100));
    }
  }

  const maxIdx = replayFrames.length - 1;
  const idx0 = Math.min(maxIdx, Math.max(0, Math.floor(replayState.timeIndex)));
  const idx1 = Math.min(maxIdx, idx0 + 1);
  const alpha = Math.max(0, Math.min(1, replayState.timeIndex - idx0));

  const f0 = replayFrames[idx0];
  const f1 = replayFrames[idx1] || f0;

  const interpD = lerpVal(f0.d, f1.d, alpha);
  const interpLat = lerpVal(f0.lat, f1.lat, alpha);
  const interpYaw = lerpVal(f0.yaw, f1.yaw, alpha);
  const interpRoll = lerpVal(f0.roll, f1.roll, alpha);
  const interpPitch = lerpVal(f0.pitch, f1.pitch, alpha);
  const interpSpd = lerpVal(f0.spd, f1.spd, alpha);
  const interpTun = lerpVal(f0.tun || 0, f1.tun || 0, alpha);
  const interpAir = lerpVal(f0.air || 0, f1.air || 0, alpha);
  const interpSpin = lerpVal(f0.spin || 0, f1.spin || 0, alpha);
  const interpBLat = lerpVal(f0.bLat || 0, f1.bLat || 0, alpha);
  const interpBY = lerpVal(f0.bY || 0, f1.bY || 0, alpha);

  positionCarOnSpline(
    playerCar,
    interpD,
    interpLat,
    interpYaw,
    interpRoll,
    interpPitch,
    dt,
    interpSpd,
    interpTun,
    interpAir,
    interpSpin,
    0,
    interpBLat,
    interpBY
  );
  const pud = playerCar.userData;
  if (pud) {
    pud.flameMat.opacity = f0.nitro ? 0.85 : 0.0;
    const fScale = f0.nitro ? 1.25 : 0.01;
    pud.flameL.scale.set(1, 1, fScale);
    pud.flameR.scale.set(1, 1, fScale);
  }

  if (player2Car && typeof f0.p2D === 'number') {
    const p2D = lerpVal(f0.p2D, f1.p2D ?? f0.p2D, alpha);
    const p2Lat = lerpVal(f0.p2Lat || 2.5, f1.p2Lat ?? (f0.p2Lat || 2.5), alpha);
    positionCarOnSpline(player2Car, p2D, p2Lat, 0, 0, 0, dt, interpSpd);
  }

  if (f0.ai) {
    f0.ai.forEach((a0, i) => {
      if (aiCars[i]) {
        const a1 = (f1.ai && f1.ai[i]) ? f1.ai[i] : a0;
        const aiD = lerpVal(a0.d, a1.d, alpha);
        const aiLat = lerpVal(a0.lat, a1.lat, alpha);
        const aiSpd = lerpVal(a0.spd, a1.spd, alpha);
        const aiTun = lerpVal(a0.tun || 0, a1.tun || 0, alpha);
        const aiAir = lerpVal(a0.air || 0, a1.air || 0, alpha);
        const aiSpin = lerpVal(a0.spin || 0, a1.spin || 0, alpha);
        const aiRollZ = lerpVal(a0.rollZ || 0, a1.rollZ || 0, alpha);
        positionCarOnSpline(aiCars[i].mesh, aiD, aiLat, 0, 0, 0, dt, aiSpd, aiTun, aiAir, aiSpin, aiRollZ);
      }
    });
  }

  replayState.autoCamTimer += dt;
  if (replayState.autoCamTimer > 4.2) {
    replayState.autoCamTimer = 0;
    replayState.activeAutoCam = (replayState.activeAutoCam % 4) + 1;
  }

  const effectiveCam = replayState.camMode === 0 ? replayState.activeAutoCam : replayState.camMode;
  const uCar = ((interpD / trackLength) % 1 + 1) % 1;
  const basis = getTrackBasis(uCar);

  if (effectiveCam === 1) {
    const anchorDist = Math.floor(interpD / 110) * 110 + 55;
    const anchorU = ((anchorDist / trackLength) % 1 + 1) % 1;
    const anchorBasis = getTrackBasis(anchorU);
    const camWorld = anchorBasis.point.clone()
      .addScaledVector(anchorBasis.binormal, ROAD_HALF_WIDTH + 6.0)
      .add(new THREE.Vector3(0, 4.5, 0));
    camera.position.copy(camWorld);
    camera.lookAt(playerCar.position.clone().add(new THREE.Vector3(0, 0.9, 0)));
    camera.fov = 50;
  } else if (effectiveCam === 2) {
    const orbitAngle = replayState.elapsedReplaySec * 0.45;
    const heliPos = playerCar.position.clone()
      .addScaledVector(basis.tangent, -Math.cos(orbitAngle) * 16)
      .addScaledVector(basis.binormal, Math.sin(orbitAngle) * 16)
      .add(new THREE.Vector3(0, 12.5, 0));
    camera.position.copy(heliPos);
    camera.lookAt(playerCar.position.clone().addScaledVector(basis.tangent, 5).add(new THREE.Vector3(0, 0.8, 0)));
    camera.fov = 58;
  } else if (effectiveCam === 3) {
    const sideWave = Math.sin(replayState.elapsedReplaySec * 1.2) * 1.2;
    const dronePos = playerCar.position.clone()
      .addScaledVector(basis.tangent, -4.2 + sideWave)
      .addScaledVector(basis.binormal, -4.5)
      .add(new THREE.Vector3(0, 1.55, 0));
    camera.position.copy(dronePos);
    camera.lookAt(playerCar.position.clone().addScaledVector(basis.tangent, 4).add(new THREE.Vector3(0, 0.75, 0)));
    camera.fov = 64;
  } else {
    const hoodPos = playerCar.position.clone()
      .addScaledVector(basis.tangent, 0.4)
      .add(new THREE.Vector3(0, 1.5, 0));
    camera.position.copy(hoodPos);
    camera.lookAt(playerCar.position.clone().addScaledVector(basis.tangent, 24).add(new THREE.Vector3(0, 1.0 + basis.tangent.y * 5, 0)));
    camera.fov = 68;
  }
  camera.updateProjectionMatrix();
}

// =========================================================================
// 11. BUCLE PRINCIPAL DE RENDERIZADO
// =========================================================================
function updateSplitScreenDivider() {
  const divider = document.getElementById('split-screen-divider');
  if (!divider || multiplayerMode !== 'split' || gameMode === 'garage' || gameMode === 'replay') return;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPortrait) {
    divider.style.left = '0';
    divider.style.right = '0';
    divider.style.top = '50%';
    divider.style.bottom = 'auto';
    divider.style.width = '100%';
    divider.style.height = '3px';
  } else {
    divider.style.top = '0';
    divider.style.bottom = '0';
    divider.style.left = '50%';
    divider.style.right = 'auto';
    divider.style.width = '3px';
    divider.style.height = '100%';
  }
}

let eqFrameCounter = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  if (gameMode === 'garage') {
    if (garagePlatform && !isDraggingGarage) {
      garageUserRotation += dt * 0.55;
    }
    if (garagePlatform) {
      garagePlatform.rotation.y = garageUserRotation;
    }

    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const isSmallPortrait = aspect < 0.85;
    const isShortLandscape = window.innerHeight < 480 && aspect > 1.2;

    const camZ = isSmallPortrait ? 8.0 : (isShortLandscape ? 6.0 : 6.4);
    const camY = isSmallPortrait ? 2.4 : (isShortLandscape ? 1.95 : 2.25);
    const lookY = isDrawerCollapsed ? 0.45 : 0.15;

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, lookY, 0);
    camera.fov = isSmallPortrait ? 60 : 55;
    camera.updateProjectionMatrix();

    sound.update(0.25, false, false, false);
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  } else if (gameMode === 'replay') {
    updateTvBroadcastReplay(dt);
    sound.update(0.7, false, false, true);
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  } else {
    updateRacePhysics(dt);
    const carCfg = CARS[selectedCarIndex];
    const sRatio = raceState.speed / carCfg.maxUnitsPerSec;
    const isDrifting = inputState.drift && Math.abs(raceState.steerInputSmooth) > 0.2;
    const isNitro = inputState.nitro && raceState.nitroAmount > 1.0;
    sound.update(sRatio, isDrifting, isNitro, gameMode === 'racing');

    if (multiplayerMode === 'split' && player2Car) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPortrait = h > w;
      renderer.setScissorTest(true);

      if (isPortrait) {
        const halfH = Math.floor(h / 2);
        camera.aspect = w / halfH;
        camera.updateProjectionMatrix();
        renderer.setViewport(0, 0, w, halfH);
        renderer.setScissor(0, 0, w, halfH);
        renderer.render(scene, camera);

        cameraP2.aspect = w / (h - halfH);
        cameraP2.updateProjectionMatrix();
        renderer.setViewport(0, halfH, w, h - halfH);
        renderer.setScissor(0, halfH, w, h - halfH);
        renderer.render(scene, cameraP2);
      } else {
        const halfW = Math.floor(w / 2);
        camera.aspect = halfW / h;
        camera.updateProjectionMatrix();
        renderer.setViewport(0, 0, halfW, h);
        renderer.setScissor(0, 0, halfW, h);
        renderer.render(scene, camera);

        cameraP2.aspect = (w - halfW) / h;
        cameraP2.updateProjectionMatrix();
        renderer.setViewport(halfW, 0, w - halfW, h);
        renderer.setScissor(halfW, 0, w - halfW, h);
        renderer.render(scene, cameraP2);
      }
    } else {
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }
  }

  eqFrameCounter++;
  if (!sound.muted && sound.isInitialized && eqFrameCounter % 4 === 0) {
    document.getElementById('eq-1').style.height = `${4 + Math.floor(Math.random() * 8)}px`;
    document.getElementById('eq-2').style.height = `${5 + Math.floor(Math.random() * 7)}px`;
    document.getElementById('eq-3').style.height = `${3 + Math.floor(Math.random() * 9)}px`;
  }
}

// =========================================================================
// 12. INTERFAZ TRANSPARENTE, 12 COLORES, 8 COCHES Y EVENTOS
// =========================================================================
function renderPaintSwatches() {
  const swatchContainer = document.getElementById('paint-swatches');
  if (!swatchContainer) return;
  swatchContainer.innerHTML = '';
  PAINT_SWATCHES.forEach((sw) => {
    const active = sw.hex.toLowerCase() === (selectedPaintColor || '').toLowerCase();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.color = sw.hex;
    btn.title = sw.name;
    btn.className = `paint-btn w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full shrink-0 transition border border-white/40 ${
      active ? 'ring-2 ring-white scale-115 opacity-100' : 'opacity-80 hover:opacity-100'
    }`;
    btn.style.backgroundColor = sw.hex;
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(660, 0.07, 'triangle', 0.12);
      selectedPaintColor = sw.hex;
      renderPaintSwatches();
      rebuildGarageCar();
      renderRoomPlayersRoster();
      broadcastProfileAndRosterSync();
    });
    swatchContainer.appendChild(btn);
  });
}

function renderGarageSelectors() {
  const carContainer = document.getElementById('car-list-buttons');
  carContainer.innerHTML = '';
  CARS.forEach((c, idx) => {
    const active = idx === selectedCarIndex;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `px-2 py-1 rounded-lg text-left border transition flex flex-col justify-between ${
      active
        ? 'bg-cyan-500/35 border-cyan-300 text-white shadow'
        : 'bg-slate-950/45 border-white/10 text-slate-200 hover:bg-slate-900/60'
    }`;
    btn.innerHTML = `
      <span class="font-display font-bold text-[9px] sm:text-[10px] truncate">${c.name}</span>
      <span class="text-[8px] text-cyan-300">${c.topSpeedKmh} km/h</span>
    `;
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(520, 0.08, 'sine', 0.12);
      selectCar(idx);
    });
    carContainer.appendChild(btn);
  });

  const trackContainer = document.getElementById('track-list-buttons');
  trackContainer.innerHTML = '';
  TRACKS.forEach((t, idx) => {
    const active = idx === selectedTrackIndex;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `p-1.5 rounded-lg text-left border transition flex flex-col justify-between ${
      active
        ? 'bg-pink-500/35 border-pink-300 text-white shadow'
        : 'bg-slate-950/45 border-white/10 text-slate-200 hover:bg-slate-900/60'
    }`;
    btn.innerHTML = `
      <span class="text-[8px] font-bold uppercase text-pink-300 truncate">${t.tag}</span>
      <span class="font-display font-bold text-[9px] sm:text-[10px] truncate">${t.name}</span>
    `;
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(620, 0.09, 'triangle', 0.14);
      selectTrack(idx, false);
    });
    trackContainer.appendChild(btn);
  });
}

function renderEmoteButtons() {
  const chatGrid = document.getElementById('quick-emotes-grid');
  const replayBar = document.getElementById('replay-emote-bar');
  if (chatGrid) chatGrid.innerHTML = '';
  if (replayBar) replayBar.innerHTML = '';

  QUICK_EMOTES.forEach((phrase) => {
    if (chatGrid) {
      const b1 = document.createElement('button');
      b1.type = 'button';
      b1.className = 'px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-500/30 border border-white/10 text-[9px] text-left text-slate-100 truncate transition';
      b1.textContent = phrase;
      b1.addEventListener('click', () => sendGlobalChatOrEmote(phrase));
      chatGrid.appendChild(b1);
    }
    if (replayBar) {
      const b2 = document.createElement('button');
      b2.type = 'button';
      b2.className = 'px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-amber-500/30 border border-amber-400/30 text-[10px] text-amber-200 font-semibold shrink-0 transition';
      b2.textContent = phrase;
      b2.addEventListener('click', () => sendGlobalChatOrEmote(phrase));
      replayBar.appendChild(b2);
    }
  });
}

function selectCar(index) {
  selectedCarIndex = (index + CARS.length) % CARS.length;
  const car = CARS[selectedCarIndex];
  selectedPaintColor = car.defaultColor;

  document.getElementById('car-badge-class').textContent = car.badge.split('•')[0].trim();
  document.getElementById('car-title').textContent = car.name;
  document.getElementById('car-desc').textContent = car.desc;

  document.getElementById('stat-speed-val').textContent = `${car.topSpeedKmh} km/h`;
  const shortSpd = document.getElementById('stat-speed-short');
  if (shortSpd) shortSpd.textContent = `${car.topSpeedKmh}`;
  document.getElementById('stat-speed-bar').style.width = `${car.statsUI.speed}%`;
  document.getElementById('stat-accel-val').textContent = car.statsUI.accelText;
  document.getElementById('stat-accel-bar').style.width = `${car.statsUI.accel}%`;
  document.getElementById('stat-handling-val').textContent = car.statsUI.handlingText;
  document.getElementById('stat-handling-bar').style.width = `${car.statsUI.handling}%`;
  document.getElementById('stat-nitro-val').textContent = car.statsUI.nitroText;
  document.getElementById('stat-nitro-bar').style.width = `${car.statsUI.nitro}%`;

  renderPaintSwatches();
  rebuildGarageCar();
  renderGarageSelectors();
  renderRoomPlayersRoster();
  broadcastProfileAndRosterSync();
}

function selectTrack(index, fromRemote = false) {
  selectedTrackIndex = (index + TRACKS.length) % TRACKS.length;
  const trk = TRACKS[selectedTrackIndex];
  document.getElementById('selected-track-banner').textContent = `• ${trk.name}`;
  document.getElementById('selected-track-meta').textContent = trk.subtitle;
  sound.setMusicStyle(trk.musicStyleIndex ?? selectedTrackIndex);
  applySkyAndLighting(trk);
  renderGarageSelectors();
  if (!fromRemote && mpState.isHost) {
    broadcastProfileAndRosterSync();
  }
}

function setMultiplayerMode(mode) {
  multiplayerMode = mode;
  const pill = document.getElementById('mp-active-pill');
  const labels = {
    solo: '1P Solo',
    split: '2P Local',
    online: 'Sala 8P Online'
  };
  if (pill) pill.textContent = labels[mode] || '1P Solo';

  const modeBtns = {
    solo: document.getElementById('btn-mode-solo'),
    split: document.getElementById('btn-mode-split'),
    online: document.getElementById('btn-mode-online')
  };
  Object.keys(modeBtns).forEach((k) => {
    const btn = modeBtns[k];
    if (!btn) return;
    if (k === mode) {
      btn.className = 'mp-mode-btn p-1.5 rounded-lg border text-left transition bg-cyan-500/35 border-cyan-300 text-white shadow';
    } else {
      btn.className = 'mp-mode-btn p-1.5 rounded-lg border text-left transition bg-slate-900/40 border-white/10 text-slate-200';
    }
  });

  renderBotCountButtons();
  renderRoomPlayersRoster();

  if (mode === 'split') {
    setMpStatus('Modo 2P Pantalla Dividida activo: escribe tu nombre obligatorio arriba.', 'text-amber-300');
  } else if (mode === 'online') {
    setMpStatus('Escribe tu nombre obligatorio, elige Bots IA y crea o únete a una sala (hasta 8P).', 'text-pink-300');
  } else {
    setMpStatus('Modo 1P Carrera Solo activo • Puedes cambiar a Sala Online 8P cuando quieras.', 'text-emerald-300');
  }
}

function bindHoldButton(btnId, targetStateObj, stateKey) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  const activate = (e) => {
    if (e.cancelable) e.preventDefault();
    sound.init();
    targetStateObj[stateKey] = true;
    btn.classList.add('active');
  };
  const deactivate = (e) => {
    if (e && e.cancelable) e.preventDefault();
    targetStateObj[stateKey] = false;
    btn.classList.remove('active');
  };

  btn.addEventListener('touchstart', activate, { passive: false });
  btn.addEventListener('touchend', deactivate, { passive: false });
  btn.addEventListener('touchcancel', deactivate, { passive: false });
  btn.addEventListener('mousedown', activate);
  btn.addEventListener('mouseup', deactivate);
  btn.addEventListener('mouseleave', deactivate);
}

function setupEventListeners() {
  bindHoldButton('btn-steer-left', inputState, 'left');
  bindHoldButton('btn-steer-right', inputState, 'right');
  bindHoldButton('btn-gas', inputState, 'gas');
  bindHoldButton('btn-drift', inputState, 'drift');
  bindHoldButton('btn-nitro', inputState, 'nitro');

  bindHoldButton('btn-p2-left', inputStateP2, 'left');
  bindHoldButton('btn-p2-right', inputStateP2, 'right');
  bindHoldButton('btn-p2-drift', inputStateP2, 'drift');
  bindHoldButton('btn-p2-nitro', inputStateP2, 'nitro');

  const nameInput = document.getElementById('mp-player-name-input');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      mpState.playerName = nameInput.value.trim().slice(0, 14);
      if (garageCarMesh) {
        updateCarMeshColorAndLabel(garageCarMesh, selectedPaintColor, mpState.playerName || 'Tú');
      }
      renderRoomPlayersRoster();
      broadcastProfileAndRosterSync();
    });
  }

  container.addEventListener('pointerdown', (e) => {
    if (gameMode !== 'garage') return;
    isDraggingGarage = true;
    dragLastX = e.clientX;
    if (!isDrawerCollapsed) {
      setGarageDrawerCollapsed(true);
    }
  });
  window.addEventListener('pointermove', (e) => {
    if (!isDraggingGarage || gameMode !== 'garage') return;
    const dx = e.clientX - dragLastX;
    dragLastX = e.clientX;
    garageUserRotation += dx * 0.012;
  });
  window.addEventListener('pointerup', () => {
    isDraggingGarage = false;
  });

  window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
        document.getElementById('btn-chat-send').click();
      }
      return;
    }
    sound.init();
    const k = e.key.toLowerCase();
    if (multiplayerMode === 'split') {
      if (k === 'a') inputState.left = true;
      if (k === 'd') inputState.right = true;
      if (k === 's' || k === ' ') inputState.drift = true;
      if (k === 'shift') inputState.nitro = true;

      if (k === 'arrowleft') inputStateP2.left = true;
      if (k === 'arrowright') inputStateP2.right = true;
      if (k === 'arrowdown') inputStateP2.drift = true;
      if (k === 'enter' || k === 'n') inputStateP2.nitro = true;
    } else {
      if (k === 'arrowleft' || k === 'a') {
        inputState.left = true;
        document.getElementById('btn-steer-left').classList.add('active');
      }
      if (k === 'arrowright' || k === 'd') {
        inputState.right = true;
        document.getElementById('btn-steer-right').classList.add('active');
      }
      if (k === 'arrowdown' || k === 's' || k === ' ') {
        inputState.drift = true;
        document.getElementById('btn-drift').classList.add('active');
      }
      if (k === 'shift' || k === 'n') {
        inputState.nitro = true;
        document.getElementById('btn-nitro').classList.add('active');
      }
    }
    if (k === 'c' && gameMode === 'racing') {
      document.getElementById('btn-camera').click();
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (multiplayerMode === 'split') {
      if (k === 'a') inputState.left = false;
      if (k === 'd') inputState.right = false;
      if (k === 's' || k === ' ') inputState.drift = false;
      if (k === 'shift') inputState.nitro = false;

      if (k === 'arrowleft') inputStateP2.left = false;
      if (k === 'arrowright') inputStateP2.right = false;
      if (k === 'arrowdown') inputStateP2.drift = false;
      if (k === 'enter' || k === 'n') inputStateP2.nitro = false;
    } else {
      if (k === 'arrowleft' || k === 'a') {
        inputState.left = false;
        document.getElementById('btn-steer-left').classList.remove('active');
      }
      if (k === 'arrowright' || k === 'd') {
        inputState.right = false;
        document.getElementById('btn-steer-right').classList.remove('active');
      }
      if (k === 'arrowdown' || k === 's' || k === ' ') {
        inputState.drift = false;
        document.getElementById('btn-drift').classList.remove('active');
      }
      if (k === 'shift' || k === 'n') {
        inputState.nitro = false;
        document.getElementById('btn-nitro').classList.remove('active');
      }
    }
  });

  const chatPanel = document.getElementById('global-chat-panel');
  document.getElementById('btn-toggle-chat').addEventListener('click', () => {
    sound.init();
    const isHidden = chatPanel.classList.contains('hidden');
    chatPanel.classList.toggle('hidden', !isHidden);
    chatPanel.classList.toggle('flex', isHidden);
  });
  document.getElementById('btn-close-chat').addEventListener('click', () => {
    chatPanel.classList.add('hidden');
    chatPanel.classList.remove('flex');
  });
  document.getElementById('btn-chat-send').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    sendGlobalChatOrEmote(input.value);
    input.value = '';
  });

  document.getElementById('btn-replay-emotes').addEventListener('click', () => {
    const bar = document.getElementById('replay-emote-bar');
    bar.classList.toggle('hidden');
  });

  const tabBtns = document.querySelectorAll('.garage-tab-btn');
  const tabPanels = {
    car: document.getElementById('tab-panel-car'),
    track: document.getElementById('tab-panel-track'),
    multiplayer: document.getElementById('tab-panel-multiplayer'),
    settings: document.getElementById('tab-panel-settings')
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(540, 0.06, 'sine', 0.1);
      const target = btn.dataset.tab;

      if (!isDrawerCollapsed && activeGarageTab === target) {
        setGarageDrawerCollapsed(true);
        return;
      }

      activeGarageTab = target;
      setGarageDrawerCollapsed(false);

      tabBtns.forEach((b) => {
        if (b.dataset.tab === target) {
          b.className = 'garage-tab-btn px-2 py-1 rounded-lg font-display font-bold text-[9px] sm:text-[10px] uppercase tracking-wider bg-cyan-500/30 text-cyan-100 border border-cyan-400/50 shrink-0';
        } else {
          b.className = 'garage-tab-btn px-2 py-1 rounded-lg font-display font-bold text-[9px] sm:text-[10px] uppercase tracking-wider bg-slate-900/40 text-slate-200 border border-white/10 shrink-0';
        }
      });

      Object.keys(tabPanels).forEach((k) => {
        if (tabPanels[k]) {
          tabPanels[k].classList.toggle('hidden', k !== target);
        }
      });
    });
  });

  document.getElementById('btn-toggle-drawer').addEventListener('click', () => {
    sound.init();
    setGarageDrawerCollapsed(!isDrawerCollapsed);
  });

  document.getElementById('btn-prev-car').addEventListener('click', () => {
    sound.init();
    sound.playTone(480, 0.08, 'sine', 0.12);
    selectCar(selectedCarIndex - 1);
  });
  document.getElementById('btn-next-car').addEventListener('click', () => {
    sound.init();
    sound.playTone(560, 0.08, 'sine', 0.12);
    selectCar(selectedCarIndex + 1);
  });

  document.getElementById('btn-mode-solo').addEventListener('click', () => setMultiplayerMode('solo'));
  document.getElementById('btn-mode-split').addEventListener('click', () => setMultiplayerMode('split'));
  document.getElementById('btn-mode-online').addEventListener('click', () => setMultiplayerMode('online'));

  document.getElementById('btn-create-room').addEventListener('click', () => {
    setMultiplayerMode('online');
    createOnlineRoom();
  });

  document.getElementById('btn-copy-room').addEventListener('click', () => {
    const code = mpState.roomCode || document.getElementById('room-code-display').textContent;
    if (code && code !== 'SIN SALA') {
      try {
        navigator.clipboard.writeText(code);
      } catch (e) {}
      setMpStatus(`Código ${code} copiado al portapapeles.`, 'text-cyan-300');
    }
  });

  document.getElementById('btn-join-room').addEventListener('click', () => {
    setMultiplayerMode('online');
    const val = document.getElementById('input-join-room').value;
    joinOnlineRoom(val);
  });

  document.querySelectorAll('.diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedDifficultyIndex = Number(btn.dataset.diff || 1);
      document.querySelectorAll('.diff-btn').forEach((b) => {
        const active = Number(b.dataset.diff) === selectedDifficultyIndex;
        b.className = active
          ? 'diff-btn px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400'
          : 'diff-btn px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800/80 text-slate-300';
      });
    });
  });

  document.getElementById('btn-lighting-quality').addEventListener('click', () => {
    highQualityLighting = !highQualityLighting;
    renderer.setPixelRatio(highQualityLighting ? Math.min(window.devicePixelRatio || 1, 1.75) : Math.min(window.devicePixelRatio || 1, 1.25));
    const lbl = document.getElementById('lighting-quality-label');
    if (lbl) lbl.textContent = highQualityLighting ? 'Ultra HD' : 'Fluido 60fps';
  });

  const toggleAutogas = document.getElementById('toggle-autogas');
  const btnHudAutogas = document.getElementById('btn-hud-autogas');
  btnHudAutogas.addEventListener('click', () => {
    toggleAutogas.checked = !toggleAutogas.checked;
  });

  document.getElementById('btn-skip-vista').addEventListener('click', () => {
    raceState.skipCurrentVista = true;
    document.body.classList.remove('cinematic-active');
  });

  document.getElementById('btn-music-track').addEventListener('click', () => {
    sound.cycleMusicStyle();
  });

  document.getElementById('btn-mute').addEventListener('click', () => {
    const isMuted = sound.toggleMute();
    document.getElementById('icon-sound-on').classList.toggle('hidden', isMuted);
    document.getElementById('icon-sound-off').classList.toggle('hidden', !isMuted);
  });

  document.getElementById('btn-camera').addEventListener('click', () => {
    raceState.cameraMode = (raceState.cameraMode + 1) % CAMERA_MODES.length;
    document.getElementById('camera-mode-text').textContent = CAMERA_MODES[raceState.cameraMode].name;
  });

  document.getElementById('btn-start-race').addEventListener('click', () => {
    startNewRace(false, false);
  });

  document.getElementById('btn-replay-play').addEventListener('click', (e) => {
    replayState.playing = !replayState.playing;
    e.currentTarget.textContent = replayState.playing ? '⏸ Pausa' : '▶ Reproducir';
  });

  const tvCamLabels = ['Auto', 'Grúa Zoom', 'Helicóptero', 'Dron Acción', 'Onboard'];
  document.getElementById('btn-replay-cam').addEventListener('click', (e) => {
    replayState.camMode = (replayState.camMode + 1) % tvCamLabels.length;
    e.currentTarget.textContent = `🎥 Ángulo TV: ${tvCamLabels[replayState.camMode]}`;
  });

  document.getElementById('btn-replay-speed').addEventListener('click', () => {
    document.getElementById('replay-emote-bar').classList.toggle('hidden');
  });

  document.getElementById('replay-scrubber').addEventListener('input', (e) => {
    const pct = Number(e.target.value) / 100;
    replayState.timeIndex = pct * Math.max(0, replayFrames.length - 1);
  });

  document.getElementById('btn-replay-podium').addEventListener('click', () => {
    const modal = document.getElementById('modal-overlay');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  // FIXED REMATCH BUTTONS: Trigger synchronized Rematch without breaking room connection!
  document.getElementById('btn-replay-restart').addEventListener('click', () => {
    startNewRace(false, true);
  });

  document.getElementById('btn-replay-garage').addEventListener('click', () => {
    returnToGarage();
  });

  document.getElementById('btn-pause').addEventListener('click', () => {
    if (gameMode === 'racing' || gameMode === 'countdown') {
      gameMode = 'paused';
      const modal = document.getElementById('modal-overlay');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('modal-badge').textContent = 'CARRERA EN PAUSA';
      document.getElementById('modal-title').textContent = 'Juego en Pausa';
      document.getElementById('modal-subtitle').textContent = 'Ajusta tu emisora musical o vuelve a la pista.';
      document.getElementById('modal-stats').classList.add('hidden');
      document.getElementById('btn-modal-resume').classList.remove('hidden');
      document.getElementById('btn-modal-watch-replay').classList.add('hidden');
    }
  });

  document.getElementById('btn-modal-resume').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-overlay').classList.remove('flex');
    gameMode = raceState.countdownTimer > 0 ? 'countdown' : 'racing';
  });

  document.getElementById('btn-modal-watch-replay').addEventListener('click', () => {
    startTvBroadcastReplay();
  });

  document.getElementById('btn-modal-restart').addEventListener('click', () => {
    startNewRace(false, true);
  });

  document.getElementById('btn-modal-garage').addEventListener('click', () => {
    returnToGarage();
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateSplitScreenDivider();
  });
}

window.addEventListener('load', () => {
  initGlobalChatChannel();
  renderEmoteButtons();
  setupGarageScene();
  selectCar(1); // Starts on SUGAR RUSH KART 🍩 in Pastel Pink!
  selectTrack(0); // Starts on the new 'Reino Dulce Candy' 🥞🍡🍩🍥 map!
  renderBotCountButtons();
  renderRoomPlayersRoster();
  setGarageDrawerCollapsed(true);
  setupEventListeners();
  requestAnimationFrame(animate);
});
