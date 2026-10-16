// =========================================================================
// 3. GENERADORES DE TEXTURAS PROCEDURALES PARA ASFALTO Y ESCENARIO
// =========================================================================
function createRoadTexture(trackCfg) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = trackCfg.roadPrimary;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.07;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const stripeCount = 8;
  const stripeH = 512 / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? trackCfg.kerbColorA : trackCfg.kerbColorB;
    ctx.fillRect(0, i * stripeH, 28, stripeH);
    ctx.fillRect(512 - 28, i * stripeH, 28, stripeH);
  }

  ctx.fillStyle = trackCfg.roadLineColor;
  ctx.fillRect(36, 0, 8, 512);
  ctx.fillRect(512 - 44, 0, 8, 512);

  ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(172, i * 128 + 20, 6, 68);
    ctx.fillRect(334, i * 128 + 20, 6, 68);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 95);
  texture.anisotropy = 4;
  return texture;
}

function createCheckeredTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const sq = 16;
  for (let y = 0; y < 64 / sq; y++) {
    for (let x = 0; x < 256 / sq; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#0f172a';
      ctx.fillRect(x * sq, y * sq, sq, sq);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// =========================================================================
// 4. CONSTRUCTORES 3D: COCHES DETALLADOS, JAGUAR / FAUNA Y OBSTÁCULOS
// =========================================================================
function buildDetailedCarMesh(carConfig, customHexColor, isPlayer = false) {
  const carGroup = new THREE.Group();
  const bodyColor = new THREE.Color(customHexColor || carConfig.defaultColor);
  const accentColor = new THREE.Color(carConfig.accentColor || '#38bdf8');

  const paintMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    metalness: 0.68,
    roughness: 0.22
  });
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.45,
    roughness: 0.5
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    metalness: 0.9,
    roughness: 0.1
  });
  const accentMat = new THREE.MeshBasicMaterial({
    color: accentColor
  });

  // 1. Carbon Lower Splitter & Diffuser Floor
  const floorGeo = new THREE.BoxGeometry(2.26, 0.16, 4.75);
  const floorMesh = new THREE.Mesh(floorGeo, carbonMat);
  floorMesh.position.y = 0.26;
  floorMesh.castShadow = true;
  carGroup.add(floorMesh);

  // 2. Main Sculpted Lower Body
  const bodyGeo = new THREE.BoxGeometry(2.16, 0.52, 4.55);
  const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
  bodyMesh.position.y = 0.56;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  carGroup.add(bodyMesh);

  // 3. Front Aerodynamic Hood Slope (-Z is Front of the Car)
  const noseGeo = new THREE.BoxGeometry(2.04, 0.34, 1.35);
  const noseMesh = new THREE.Mesh(noseGeo, paintMat);
  noseMesh.position.set(0, 0.52, -1.75);
  noseMesh.rotation.x = 0.14;
  noseMesh.castShadow = true;
  carGroup.add(noseMesh);

  // 4. Sculpted Side Fenders / Air Intakes
  const fenderGeo = new THREE.BoxGeometry(2.30, 0.42, 1.5);
  const frontFender = new THREE.Mesh(fenderGeo, paintMat);
  frontFender.position.set(0, 0.55, -1.35);
  carGroup.add(frontFender);

  const rearFender = new THREE.Mesh(fenderGeo, paintMat);
  rearFender.position.set(0, 0.60, 1.35);
  carGroup.add(rearFender);

  const sideStripGeo = new THREE.BoxGeometry(2.33, 0.05, 2.8);
  const sideStrip = new THREE.Mesh(sideStripGeo, accentMat);
  sideStrip.position.set(0, 0.32, 0);
  carGroup.add(sideStrip);

  // 5. Aerodynamic Cabin / Cockpit Greenhouse
  const cabinWidth = carConfig.bodyStyle === 'prototype' ? 1.45 : 1.68;
  const cabinLength = carConfig.bodyStyle === 'wedge' ? 2.25 : 1.95;
  const cabinGeo = new THREE.BoxGeometry(cabinWidth, 0.46, cabinLength);
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
  cabinMesh.position.set(0, 0.96, -0.1);
  cabinMesh.castShadow = true;
  carGroup.add(cabinMesh);

  const roofGeo = new THREE.BoxGeometry(cabinWidth * 0.86, 0.08, cabinLength * 0.72);
  const roofMesh = new THREE.Mesh(roofGeo, paintMat);
  roofMesh.position.set(0, 1.20, -0.05);
  carGroup.add(roofMesh);

  // 6. Custom Spoiler / Wing per Car Model (+Z is Rear of the Car)
  if (carConfig.spoilerStyle === 'gt_wing' || carConfig.spoilerStyle === 'lmp_wing') {
    const strutGeo = new THREE.BoxGeometry(0.08, 0.42, 0.32);
    const strutL = new THREE.Mesh(strutGeo, carbonMat);
    strutL.position.set(-0.68, 0.98, 2.02);
    const strutR = new THREE.Mesh(strutGeo, carbonMat);
    strutR.position.set(0.68, 0.98, 2.02);
    const wingBladeGeo = new THREE.BoxGeometry(2.24, 0.08, 0.48);
    const wingBlade = new THREE.Mesh(wingBladeGeo, carbonMat);
    wingBlade.position.set(0, 1.18, 2.08);
    wingBlade.rotation.x = -0.12;
    carGroup.add(strutL, strutR, wingBlade);

    if (carConfig.spoilerStyle === 'lmp_wing') {
      const sharkFinGeo = new THREE.BoxGeometry(0.06, 0.38, 1.25);
      const sharkFin = new THREE.Mesh(sharkFinGeo, paintMat);
      sharkFin.position.set(0, 1.06, 1.28);
      carGroup.add(sharkFin);
    }
  } else if (carConfig.spoilerStyle === 'twin_fin') {
    const finGeo = new THREE.BoxGeometry(0.1, 0.45, 0.85);
    const finL = new THREE.Mesh(finGeo, paintMat);
    finL.position.set(-0.88, 0.96, 1.85);
    const finR = new THREE.Mesh(finGeo, paintMat);
    finR.position.set(0.88, 0.96, 1.85);
    const lightBridgeGeo = new THREE.BoxGeometry(1.86, 0.06, 0.25);
    const lightBridge = new THREE.Mesh(lightBridgeGeo, accentMat);
    lightBridge.position.set(0, 1.12, 2.02);
    carGroup.add(finL, finR, lightBridge);
  } else {
    const duckGeo = new THREE.BoxGeometry(2.06, 0.22, 0.42);
    const duckMesh = new THREE.Mesh(duckGeo, paintMat);
    duckMesh.position.set(0, 0.86, 2.12);
    duckMesh.rotation.x = 0.28;
    carGroup.add(duckMesh);
  }

  // 7. Front LED Headlights (-Z)
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
  const hlGeo = new THREE.BoxGeometry(0.46, 0.12, 0.1);
  const hlLeft = new THREE.Mesh(hlGeo, headlightMat);
  hlLeft.position.set(-0.74, 0.56, -2.36);
  const hlRight = new THREE.Mesh(hlGeo, headlightMat);
  hlRight.position.set(0.74, 0.56, -2.36);
  carGroup.add(hlLeft, hlRight);

  // 8. Rear LED Brake Light Bar (+Z)
  const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  const tailGeo = new THREE.BoxGeometry(1.98, 0.14, 0.1);
  const tailBar = new THREE.Mesh(tailGeo, tailLightMat);
  tailBar.position.set(0, 0.64, 2.29);
  carGroup.add(tailBar);

  // 9. Twin Exhaust Pipes + Nitro Flame Cones (+Z)
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const pipeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.3, 12);
  pipeGeo.rotateX(Math.PI / 2);
  const pipeL = new THREE.Mesh(pipeGeo, exhaustMat);
  pipeL.position.set(-0.48, 0.32, 2.34);
  const pipeR = new THREE.Mesh(pipeGeo, exhaustMat);
  pipeR.position.set(0.48, 0.32, 2.34);
  carGroup.add(pipeL, pipeR);

  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.0
  });
  const flameGeo = new THREE.ConeGeometry(0.16, 0.95, 10);
  flameGeo.rotateX(Math.PI / 2);
  const flameL = new THREE.Mesh(flameGeo, flameMat);
  flameL.position.set(-0.48, 0.32, 2.85);
  const flameR = new THREE.Mesh(flameGeo, flameMat);
  flameR.position.set(0.48, 0.32, 2.85);
  carGroup.add(flameL, flameR);

  // 10. Four Detailed 3D Wheels
  const wheelPositions = [
    { x: -1.12, y: 0.40, z: -1.42, isFront: true },
    { x:  1.12, y: 0.40, z: -1.42, isFront: true },
    { x: -1.12, y: 0.42, z:  1.42, isFront: false },
    { x:  1.12, y: 0.42, z:  1.42, isFront: false }
  ];

  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.1 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 });

  const frontWheelPivots = [];
  const wheelSpinMeshes = [];

  wheelPositions.forEach((wp) => {
    const pivot = new THREE.Group();
    pivot.position.set(wp.x, wp.y, wp.z);

    const spinGroup = new THREE.Group();
    const tireGeo = new THREE.CylinderGeometry(0.40, 0.40, 0.36, 18);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, tireMat);
    tireMesh.castShadow = true;
    spinGroup.add(tireMesh);

    const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.38, 12);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    spinGroup.add(rimMesh);

    const spokeGeo = new THREE.BoxGeometry(0.40, 0.07, 0.44);
    const spokeMesh = new THREE.Mesh(spokeGeo, accentMat);
    spinGroup.add(spokeMesh);

    pivot.add(spinGroup);
    carGroup.add(pivot);

    if (wp.isFront) frontWheelPivots.push(pivot);
    wheelSpinMeshes.push(spinGroup);
  });

  let underglowLight = null;
  let headlightPoint = null;
  if (isPlayer) {
    underglowLight = new THREE.PointLight(bodyColor, 1.5, 8);
    underglowLight.position.set(0, 0.25, 0);
    carGroup.add(underglowLight);

    headlightPoint = new THREE.PointLight(0xe0f2fe, 2.0, 42);
    headlightPoint.position.set(0, 1.1, -3.5);
    carGroup.add(headlightPoint);
  }

  carGroup.userData = {
    paintMat,
    tailLightMat,
    flameMat,
    flameL,
    flameR,
    frontWheelPivots,
    wheelSpinMeshes,
    underglowLight,
    headlightPoint
  };

  return carGroup;
}

// Build articulated 3D wildlife mesh (Mexican Jaguar / Deer / Antelope / Cyber-Deer)
function buildWildlifeMesh(animalType = 'deer') {
  const group = new THREE.Group();
  const isCyber = animalType === 'cyberdeer';
  const isJaguar = animalType === 'jaguar';
  const coatHex = isCyber ? 0x0f172a : (isJaguar ? 0xeab308 : (animalType === 'antelope' ? 0xd97706 : 0x92400e));
  const accentHex = isCyber ? 0x22d3ee : (isJaguar ? 0x1c1917 : 0xfef3c7);

  const bodyMat = new THREE.MeshStandardMaterial({ color: coatHex, roughness: isCyber ? 0.25 : 0.65, metalness: isCyber ? 0.8 : 0.1 });
  const accentMat = new THREE.MeshBasicMaterial({ color: accentHex });

  // Torso (oriented along +Z so lookAt points head forward)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.68, 1.75), bodyMat);
  torso.position.set(0, 1.10, 0);
  torso.castShadow = true;
  group.add(torso);

  // Jaguar dark spots or cyber stripes
  if (isJaguar) {
    for (let s = -1; s <= 1; s++) {
      const spot = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.22, 0.28), accentMat);
      spot.position.set(0, 1.18, s * 0.45);
      group.add(spot);
    }
    // Sleek Jaguar Tail at -Z
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.95), bodyMat);
    tail.position.set(0, 1.05, -1.15);
    tail.rotation.x = -0.35;
    group.add(tail);
  }

  // Neck & Head at +Z
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.38), bodyMat);
  neck.position.set(0, 1.55, 0.68);
  neck.rotation.x = -0.28;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.58), bodyMat);
  head.position.set(0, 1.82, 0.92);
  group.add(head);

  if (!isJaguar) {
    const hornL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.08), accentMat);
    hornL.position.set(-0.22, 2.18, 0.82);
    hornL.rotation.z = 0.28;
    const hornR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.08), accentMat);
    hornR.position.set(0.22, 2.18, 0.82);
    hornR.rotation.z = -0.28;
    group.add(hornL, hornR);
  }

  const legs = [];
  const legCoords = [
    [-0.25, 0.82,  0.55],
    [ 0.25, 0.82,  0.55],
    [-0.25, 0.82, -0.55],
    [ 0.25, 0.82, -0.55]
  ];
  legCoords.forEach((lc) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(lc[0], lc[1], lc[2]);
    const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.82, 0.18), bodyMat);
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

  if (kind === 0) {
    const barGeo = new THREE.BoxGeometry(3.4, 1.15, 0.75);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.3 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.y = 0.65;
    bar.castShadow = true;
    group.add(bar);

    const stripeGeo = new THREE.BoxGeometry(3.46, 0.32, 0.78);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 0.72;
    group.add(stripe);
  } else if (kind === 1) {
    const logGeo = new THREE.CylinderGeometry(0.62, 0.68, 3.6, 10);
    logGeo.rotateZ(Math.PI / 2);
    const logColor = sceneryType === 'city' ? 0x38bdf8 : (sceneryType === 'jungle' ? 0x3f2305 : 0x5c2d0c);
    const logMat = new THREE.MeshStandardMaterial({ color: logColor, roughness: 0.75 });
    const logMesh = new THREE.Mesh(logGeo, logMat);
    logMesh.position.y = 0.65;
    logMesh.castShadow = true;
    group.add(logMesh);
  } else {
    const rockMat = new THREE.MeshStandardMaterial({
      color: sceneryType === 'jungle' ? 0x365314 : (sceneryType === 'city' ? 0x475569 : 0x78350f),
      roughness: 0.85
    });
    const rMain = new THREE.Mesh(new THREE.DodecahedronGeometry(1.45, 0), rockMat);
    rMain.position.y = 1.05;
    rMain.castShadow = true;
    group.add(rMain);
  }

  return group;
}

// =========================================================================
// 5. ESCENA 3D, GARAJE TRANSPARENTE Y CONSTRUCTOR DE MUNDOS (THREE.JS)
// =========================================================================
const container = document.getElementById('game-canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b1026, 0.0026);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1200);
const cameraP2 = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1200);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
container.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.88);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(80, 160, -90);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 10;
dirLight.shadow.camera.far = 550;
const d = 160;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;
scene.add(dirLight);

const garageGroup = new THREE.Group();
const raceWorldGroup = new THREE.Group();
scene.add(garageGroup);
scene.add(raceWorldGroup);

// Global Game State
let selectedCarIndex = 0;
let selectedTrackIndex = 0; // Starts on 'Selva Maya Mexicana'!
let selectedDifficultyIndex = 1;
let selectedPaintColor = CARS[0].defaultColor;
let highQualityLighting = true;
let isDrawerCollapsed = true;
let activeGarageTab = 'car';
let gameMode = 'garage'; // 'garage' | 'countdown' | 'racing' | 'paused' | 'replay' | 'finished'
let multiplayerMode = 'solo'; // 'solo' | 'split' | 'online'

// Garage Showroom & Touch Orbit
let garageCarMesh = null;
let garagePlatform = null;
let garageUserRotation = 0;
let isDraggingGarage = false;
let dragLastX = 0;

function setupGarageScene() {
  while (garageGroup.children.length > 0) {
    garageGroup.remove(garageGroup.children[0]);
  }

  const platGeo = new THREE.CylinderGeometry(4.5, 5.0, 0.35, 48);
  const platMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.2
  });
  garagePlatform = new THREE.Mesh(platGeo, platMat);
  garagePlatform.position.y = -0.18;
  garagePlatform.receiveShadow = true;
  garageGroup.add(garagePlatform);

  const ringGeo = new THREE.RingGeometry(4.2, 4.45, 64);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 0.01;
  garageGroup.add(ringMesh);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 8);
    const pillarMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x10b981 : 0xfbbf24 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(Math.cos(angle) * 6.5, 2.8, Math.sin(angle) * 6.5);
    garageGroup.add(pillar);
  }

  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 34, Math.PI / 3, 0.5);
  spotLight.position.set(0, 9.5, 4);
  garageGroup.add(spotLight);

  rebuildGarageCar();
}

function rebuildGarageCar() {
  if (garageCarMesh && garagePlatform) {
    garagePlatform.remove(garageCarMesh);
  }
  const carCfg = CARS[selectedCarIndex];
  garageCarMesh = buildDetailedCarMesh(carCfg, selectedPaintColor, true);
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
// 6. P2P ONLINE MULTIPLAYER & CHAT GLOBAL EN VIVO (WEBRTC + BROADCAST)
// =========================================================================
const mpState = {
  peer: null,
  conn: null,
  roomCode: '',
  isHost: false,
  connected: false,
  localChannel: null,
  globalChatChannel: null,
  playerName: 'Piloto-' + Math.floor(10 + Math.random() * 89),
  remoteCarData: {
    carIndex: 1,
    paintColor: '#f43f5e',
    distance: 0,
    lateralOffset: 2.8,
    speed: 0,
    driftAngle: 0
  }
};

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
  sound.playTone(720, 0.07, 'triangle', 0.12, 960);
  appendGlobalChatMessage(mpState.playerName, clean, true);

  const packet = {
    type: 'chat',
    sender: mpState.playerName,
    text: clean
  };
  sendMultiplayerPacket(packet);
  if (mpState.globalChatChannel) {
    try { mpState.globalChatChannel.postMessage(packet); } catch (e) {}
  }

  // If playing solo and no remote player is connected, let a rival driver reply occasionally!
  if (!mpState.connected && Math.random() < 0.55) {
    const rivalNames = ['Valkyrie-Pro', 'Maya-Racer', 'Cyber-Kenji', 'Apex-Sofia'];
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
      if (ev.data && ev.data.type === 'chat') {
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
  if (mpState.conn && mpState.conn.open) {
    try { mpState.conn.send(payload); } catch (e) {}
  }
  if (mpState.localChannel) {
    try { mpState.localChannel.postMessage(payload); } catch (e) {}
  }
}

function handleMultiplayerPacket(data) {
  if (!data || typeof data !== 'object') return;
  if (data.type === 'chat') {
    appendGlobalChatMessage(data.sender || 'Rival', data.text || '', false);
  } else if (data.type === 'hello') {
    mpState.connected = true;
    setMpStatus('¡Rival conectado en vivo! Listos para correr.', 'text-cyan-300');
    appendGlobalChatMessage('Sistema', '¡Un nuevo piloto se unió a la sala!', false);
    sound.playTone(660, 0.14, 'triangle', 0.18, 880);
    if (mpState.isHost) {
      sendMultiplayerPacket({
        type: 'welcome',
        trackIndex: selectedTrackIndex,
        carIndex: selectedCarIndex,
        paintColor: selectedPaintColor
      });
    }
  } else if (data.type === 'welcome') {
    mpState.connected = true;
    selectTrack(data.trackIndex || 0);
    mpState.remoteCarData.carIndex = data.carIndex || 0;
    mpState.remoteCarData.paintColor = data.paintColor || '#38bdf8';
    setMpStatus('¡Conectado a la sala del anfitrión!', 'text-cyan-300');
  } else if (data.type === 'telemetry') {
    mpState.connected = true;
    mpState.remoteCarData.distance = data.distance || 0;
    mpState.remoteCarData.lateralOffset = data.lateralOffset || 0;
    mpState.remoteCarData.speed = data.speed || 0;
    mpState.remoteCarData.driftAngle = data.driftAngle || 0;
    mpState.remoteCarData.carIndex = data.carIndex ?? mpState.remoteCarData.carIndex;
    mpState.remoteCarData.paintColor = data.paintColor || mpState.remoteCarData.paintColor;
  } else if (data.type === 'start_race') {
    if (typeof data.trackIndex === 'number') selectTrack(data.trackIndex);
    if (gameMode === 'garage') startNewRace(true);
  }
}

function createOnlineRoom() {
  sound.init();
  const num = Math.floor(100 + Math.random() * 900);
  const code = `APX-${num}`;
  mpState.roomCode = code;
  mpState.isHost = true;
  document.getElementById('room-code-display').textContent = code;
  setMpStatus(`Sala ${code} activa. Comparte el código con tu amigo.`, 'text-cyan-300');
  initBroadcastFallback(code);

  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      const peerId = 'apex-horizon-room-' + code.toLowerCase();
      mpState.peer = new Peer(peerId);
      mpState.peer.on('connection', (conn) => {
        mpState.conn = conn;
        conn.on('data', handleMultiplayerPacket);
        conn.on('open', () => {
          mpState.connected = true;
          setMpStatus('¡Jugador 2 conectado vía P2P Online!', 'text-emerald-300');
        });
      });
      mpState.peer.on('error', () => {
        setMpStatus(`Sala ${code} lista (Modo Red Local / P2P activo).`, 'text-amber-300');
      });
    } catch (err) {
      setMpStatus(`Sala ${code} lista en modo local.`, 'text-amber-300');
    }
  }
}

function joinOnlineRoom(rawCode) {
  sound.init();
  const clean = (rawCode || '').trim().toUpperCase();
  if (!clean) {
    setMpStatus('Escribe un código como APX-123 para unirte.', 'text-rose-300');
    return;
  }
  mpState.roomCode = clean;
  mpState.isHost = false;
  document.getElementById('room-code-display').textContent = clean;
  setMpStatus(`Conectando a la sala ${clean}...`, 'text-amber-300');
  initBroadcastFallback(clean);
  sendMultiplayerPacket({
    type: 'hello',
    carIndex: selectedCarIndex,
    paintColor: selectedPaintColor
  });

  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      mpState.peer = new Peer();
      mpState.peer.on('open', () => {
        const hostId = 'apex-horizon-room-' + clean.toLowerCase();
        const conn = mpState.peer.connect(hostId);
        mpState.conn = conn;
        conn.on('open', () => {
          mpState.connected = true;
          setMpStatus(`¡Conectado a ${clean}! Listo para correr.`, 'text-emerald-300');
          conn.send({
            type: 'hello',
            carIndex: selectedCarIndex,
            paintColor: selectedPaintColor
          });
        });
        conn.on('data', handleMultiplayerPacket);
      });
    } catch (e) {}
  }
}

// =========================================================================
// 7. GENERADOR DE PISTA 3D (INCLUYE SELVA MAYA MEXICANA CON PIRÁMIDES/CENOTES)
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

function getTrackBasis(u) {
  const normU = ((u % 1) + 1) % 1;
  const point = currentCurve.getPointAt(normU);
  const tangent = currentCurve.getTangentAt(normU).normalize();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const binormal = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
  const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
  return { point, tangent, binormal, normal };
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
  skyCanvas.width = 64;
  skyCanvas.height = 256;
  const sctx = skyCanvas.getContext('2d');
  const grad = sctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, trackCfg.skyTop);
  grad.addColorStop(0.62, trackCfg.skyBottom);
  grad.addColorStop(1, '#090d16');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 256);
  scene.background = new THREE.CanvasTexture(skyCanvas);
}

// Helper to build a 3D Stepped Mayan Pyramid for Selva Mexicana
function buildMayanPyramidMesh() {
  const pyrGroup = new THREE.Group();
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85, metalness: 0.1 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

  const tiers = 5;
  for (let t = 0; t < tiers; t++) {
    const w = 38 - t * 6.2;
    const h = 5.5;
    const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), t % 2 === 0 ? stoneMat : mossMat);
    tierMesh.position.y = t * h + h / 2;
    pyrGroup.add(tierMesh);
  }
  // Upper Mayan Temple Sanctuary
  const temple = new THREE.Mesh(new THREE.BoxGeometry(10, 6.5, 10), stoneMat);
  temple.position.y = tiers * 5.5 + 3.25;
  pyrGroup.add(temple);

  // Central Staircase & Torch Brazier
  const stairs = new THREE.Mesh(new THREE.BoxGeometry(7, 30, 39), stoneMat);
  stairs.position.y = 14;
  pyrGroup.add(stairs);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 10), goldMat);
  beacon.position.y = tiers * 5.5 + 8.0;
  pyrGroup.add(beacon);

  return pyrGroup;
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

  const segments = 540;
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

  const roadMat = new THREE.MeshStandardMaterial({
    map: createRoadTexture(trackCfg),
    roughness: 0.42,
    metalness: 0.25,
    side: THREE.DoubleSide
  });
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  roadMesh.receiveShadow = true;
  raceWorldGroup.add(roadMesh);

  // Viaduct Pillars & Guardrail Posts
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.3 });
  const railMat = new THREE.MeshBasicMaterial({ color: trackCfg.roadLineColor });
  for (let i = 0; i < 90; i++) {
    const u = i / 90;
    const { point, binormal } = getTrackBasis(u);

    const postGeo = new THREE.BoxGeometry(0.32, 1.05, 0.32);
    const postL = new THREE.Mesh(postGeo, railMat);
    postL.position.copy(point).addScaledVector(binormal, -(ROAD_HALF_WIDTH + 0.35)).add(new THREE.Vector3(0, 0.5, 0));
    const postR = new THREE.Mesh(postGeo, railMat);
    postR.position.copy(point).addScaledVector(binormal, ROAD_HALF_WIDTH + 0.35).add(new THREE.Vector3(0, 0.5, 0));
    raceWorldGroup.add(postL, postR);

    if (point.y > 5 && i % 2 === 0) {
      const h = point.y + 20;
      const pGeo = new THREE.CylinderGeometry(1.3, 1.8, h, 10);
      const pillar = new THREE.Mesh(pGeo, pillarMat);
      pillar.position.set(point.x, point.y - h / 2 - 0.2, point.z);
      raceWorldGroup.add(pillar);
    }
  }

  const groundColors = {
    jungle: 0x064e3b,
    city: 0x050814,
    coast: 0x0369a1,
    mountain: 0x1e293b,
    desert: 0x451a03
  };
  const groundGeo = new THREE.PlaneGeometry(3600, 3600);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: groundColors[trackCfg.sceneryType] || 0x090d16,
    roughness: trackCfg.sceneryType === 'coast' ? 0.25 : 0.85,
    metalness: trackCfg.sceneryType === 'coast' ? 0.65 : 0.1
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.position.y = -18;
  groundMesh.receiveShadow = true;
  raceWorldGroup.add(groundMesh);

  const startBasis = getTrackBasis(0);
  const startBannerGeo = new THREE.PlaneGeometry(ROAD_HALF_WIDTH * 2, 3.4);
  startBannerGeo.rotateX(-Math.PI / 2);
  const startBannerMat = new THREE.MeshBasicMaterial({ map: createCheckeredTexture() });
  const startLineMesh = new THREE.Mesh(startBannerGeo, startBannerMat);
  startLineMesh.position.copy(startBasis.point).add(new THREE.Vector3(0, 0.08, 0));
  const lookTarget = startBasis.point.clone().add(startBasis.tangent);
  startLineMesh.lookAt(lookTarget.x, startLineMesh.position.y, lookTarget.z);
  raceWorldGroup.add(startLineMesh);

  const archCount = 16;
  const archPillarGeo = new THREE.BoxGeometry(0.65, 8.8, 0.65);
  const archTopGeo = new THREE.BoxGeometry(ROAD_HALF_WIDTH * 2 + 1.6, 0.75, 0.75);
  const archMat = new THREE.MeshBasicMaterial({ color: trackCfg.roadLineColor });

  for (let i = 0; i < archCount; i++) {
    const u = i / archCount;
    const { point, tangent } = getTrackBasis(u);
    const archGroup = new THREE.Group();
    archGroup.position.copy(point);
    archGroup.lookAt(point.clone().add(tangent));

    const leftPillar = new THREE.Mesh(archPillarGeo, archMat);
    leftPillar.position.set(-(ROAD_HALF_WIDTH + 0.4), 4.3, 0);
    const rightPillar = new THREE.Mesh(archPillarGeo, archMat);
    rightPillar.position.set(ROAD_HALF_WIDTH + 0.4, 4.3, 0);
    const topBeam = new THREE.Mesh(archTopGeo, archMat);
    topBeam.position.set(0, 8.6, 0);

    archGroup.add(leftPillar, rightPillar, topBeam);
    raceWorldGroup.add(archGroup);
  }

  buildDetailedLandscapeProps(trackCfg);
  buildAllTrackObstacles(trackCfg);

  const playerCfg = CARS[selectedCarIndex];
  playerCar = buildDetailedCarMesh(playerCfg, selectedPaintColor, true);
  raceWorldGroup.add(playerCar);

  player2Car = null;
  if (multiplayerMode === 'split' || multiplayerMode === 'online') {
    const p2CarIdx = (selectedCarIndex + 1) % CARS.length;
    const p2Color = multiplayerMode === 'online' ? mpState.remoteCarData.paintColor : '#f59e0b';
    player2Car = buildDetailedCarMesh(CARS[p2CarIdx], p2Color, true);
    raceWorldGroup.add(player2Car);
  }

  const diffCfg = DIFFICULTY_LEVELS[selectedDifficultyIndex] || DIFFICULTY_LEVELS[1];
  const rivalColors = ['#f43f5e', '#eab308', '#10b981', '#a855f7', '#38bdf8'];
  const aiCount = multiplayerMode === 'solo' ? 5 : 4;
  for (let i = 0; i < aiCount; i++) {
    const rivalCfg = CARS[(selectedCarIndex + i + 1) % CARS.length];
    const rivalMesh = buildDetailedCarMesh(rivalCfg, rivalColors[i], false);
    raceWorldGroup.add(rivalMesh);
    aiCars.push({
      name: rivalCfg.name,
      mesh: rivalMesh,
      distance: 14 + i * 14,
      lateralOffset: (i % 2 === 0 ? -1 : 1) * 3.5,
      targetOffset: (i % 2 === 0 ? -1 : 1) * 3.5,
      speed: 0,
      baseMaxSpeed: playerCfg.maxUnitsPerSec * diffCfg.aiSpeedMult * (0.95 + i * 0.024),
      laneTimer: 1.2 + i * 0.55,
      nitroTimer: 0,
      clashCooldown: 0
    });
  }

  const pGeo = new THREE.SphereGeometry(0.28, 6, 6);
  for (let i = 0; i < 65; i++) {
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.visible = false;
    raceWorldGroup.add(pMesh);
    particlePool.push({
      mesh: pMesh,
      life: 0,
      maxLife: 0.5,
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

    if (trackCfg.sceneryType === 'jungle') {
      // Stepped Mayan Pyramid + Glowing Sacred Cenote + Jungle Waterfall
      const pyramid = buildMayanPyramidMesh();
      pyramid.position.set(landmarkPos.x, point.y - 10, landmarkPos.z);
      pyramid.lookAt(point.x, pyramid.position.y, point.z);
      raceWorldGroup.add(pyramid);

      // Glowing Turquoise Cenote Pool
      const cenoteGeo = new THREE.CircleGeometry(18, 24);
      cenoteGeo.rotateX(-Math.PI / 2);
      const cenoteMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const cenote = new THREE.Mesh(cenoteGeo, cenoteMat);
      const cenotePos = point.clone().addScaledVector(binormal, -vistaDir * 34);
      cenote.position.set(cenotePos.x, point.y - 8, cenotePos.z);
      raceWorldGroup.add(cenote);
    } else if (trackCfg.sceneryType === 'mountain' || trackCfg.sceneryType === 'coast') {
      const cliffGeo = new THREE.ConeGeometry(28, 95, 7);
      const cliffMat = new THREE.MeshStandardMaterial({
        color: trackCfg.sceneryType === 'mountain' ? 0x334155 : 0x475569,
        roughness: 0.85
      });
      const cliff = new THREE.Mesh(cliffGeo, cliffMat);
      cliff.position.set(landmarkPos.x, point.y + 18, landmarkPos.z);
      raceWorldGroup.add(cliff);

      const snow = new THREE.Mesh(new THREE.ConeGeometry(12, 32, 7), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
      snow.position.y = 33;
      cliff.add(snow);

      const wfGeo = new THREE.BoxGeometry(6.5, 68, 1.5);
      const wfMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 });
      const waterfall = new THREE.Mesh(wfGeo, wfMat);
      waterfall.position.copy(point).addScaledVector(binormal, vistaDir * 36).add(new THREE.Vector3(0, 6, 0));
      waterfall.lookAt(point);
      raceWorldGroup.add(waterfall);

      for (let w = 0; w < 14; w++) {
        const dropMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 })
        );
        const basePos = waterfall.position.clone();
        dropMesh.position.copy(basePos).add(new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 5));
        raceWorldGroup.add(dropMesh);
        waterfallParticles.push({ mesh: dropMesh, baseY: basePos.y - 26, topY: basePos.y + 28, speed: 18 + Math.random() * 12 });
      }
    } else if (trackCfg.sceneryType === 'desert') {
      const archPillarMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
      const leftM = new THREE.Mesh(new THREE.ConeGeometry(18, 75, 6), archPillarMat);
      leftM.position.copy(point).addScaledVector(binormal, -32).add(new THREE.Vector3(0, 12, 0));
      const rightM = new THREE.Mesh(new THREE.ConeGeometry(18, 75, 6), archPillarMat);
      rightM.position.copy(point).addScaledVector(binormal, 32).add(new THREE.Vector3(0, 12, 0));
      const span = new THREE.Mesh(new THREE.BoxGeometry(72, 8, 12), archPillarMat);
      span.position.copy(point).add(new THREE.Vector3(0, 32, 0));
      span.lookAt(point.clone().add(tangent));
      raceWorldGroup.add(leftM, rightM, span);
    } else {
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
      const neonMat = new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x22d3ee : 0xe879f9 });
      [-26, 26].forEach((offsetSide) => {
        const tMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 95, 10), towerMat);
        tMesh.position.copy(point).addScaledVector(binormal, offsetSide).add(new THREE.Vector3(0, 18, 0));
        const ring = new THREE.Mesh(new THREE.BoxGeometry(11, 2.2, 11), neonMat);
        ring.position.y = 28;
        tMesh.add(ring);
        raceWorldGroup.add(tMesh);
      });
    }
  });

  const propCount = 120;
  for (let i = 0; i < propCount; i++) {
    const u = i / propCount;
    const { point, binormal } = getTrackBasis(u);
    const side = i % 2 === 0 ? -1 : 1;
    const dist = ROAD_HALF_WIDTH + 8 + (i * 11 % 34);
    const propPos = point.clone().addScaledVector(binormal, side * dist);

    if (trackCfg.sceneryType === 'jungle') {
      // Giant Ceiba Jungle Trees + Mayan Stone Pillars
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.1, 9, 7), new THREE.MeshStandardMaterial({ color: 0x3f2305 }));
      trunk.position.set(propPos.x, propPos.y + 3.5, propPos.z);
      const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(4.8), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
      canopy.position.y = 5.5;
      canopy.scale.y = 0.55;
      trunk.add(canopy);
      raceWorldGroup.add(trunk);

      if (i % 12 === 0) {
        const miniPyr = buildMayanPyramidMesh();
        miniPyr.scale.setScalar(0.55);
        const farPos = point.clone().addScaledVector(binormal, side * (dist + 44));
        miniPyr.position.set(farPos.x, farPos.y - 8, farPos.z);
        raceWorldGroup.add(miniPyr);
      }
    } else if (trackCfg.sceneryType === 'city') {
      const h = 22 + (i * 17 % 56);
      const bGeo = new THREE.BoxGeometry(8, h, 8);
      const bMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(propPos.x, propPos.y + h / 2 - 14, propPos.z);
      const trimMesh = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.55, 8.3), new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x22d3ee : 0xe879f9 }));
      trimMesh.position.y = h / 2;
      bMesh.add(trimMesh);
      raceWorldGroup.add(bMesh);
    } else if (trackCfg.sceneryType === 'mountain') {
      const tree = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.65, 3.5, 6), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
      tree.position.set(propPos.x, propPos.y + 1.2, propPos.z);
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(3.1, 10, 7), new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.7 }));
      foliage.position.y = 5.4;
      tree.add(foliage);
      raceWorldGroup.add(tree);

      if (i % 5 === 0) {
        const mH = 48 + (i * 19 % 55);
        const mtn = new THREE.Mesh(new THREE.ConeGeometry(22, mH, 6), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 }));
        const farPos = point.clone().addScaledVector(binormal, side * (dist + 48));
        mtn.position.set(farPos.x, farPos.y + mH / 2 - 18, farPos.z);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(9.5, mH * 0.36, 6), new THREE.MeshBasicMaterial({ color: 0xf1f5f9 }));
        cap.position.y = mH * 0.32;
        mtn.add(cap);
        raceWorldGroup.add(mtn);
      }
    } else if (trackCfg.sceneryType === 'coast') {
      const palm = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 8.0, 7), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      palm.position.set(propPos.x, propPos.y + 3.4, propPos.z);
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6), new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 }));
      crown.position.y = 4.2;
      crown.scale.y = 0.45;
      palm.add(crown);
      raceWorldGroup.add(palm);
    } else {
      const h = 12 + (i * 13 % 36);
      const rock = new THREE.Mesh(new THREE.ConeGeometry(6.5, h, 6), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 }));
      rock.position.set(propPos.x, propPos.y + h / 2 - 4, propPos.z);
      raceWorldGroup.add(rock);
    }
  }
}

function buildAllTrackObstacles(trackCfg) {
  const zones = trackCfg.wildlifeZones || [
    { u: 0.15 }, { u: 0.30 }, { u: 0.47 }, { u: 0.63 }, { u: 0.78 }, { u: 0.91 }
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

  const obstacleCount = 10;
  for (let i = 0; i < obstacleCount; i++) {
    const u = 0.08 + (i / obstacleCount) * 0.86;
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

  const targetOffset = (Math.random() - 0.5) * (ROAD_HALF_WIDTH * 1.5);
  const impactPos = point.clone().addScaledVector(binormal, targetOffset);

  const boulderGeo = new THREE.DodecahedronGeometry(1.5, 1);
  const boulderMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.9,
    metalness: 0.1
  });
  const boulderMesh = new THREE.Mesh(boulderGeo, boulderMat);
  const spawnSide = Math.random() > 0.5 ? 1 : -1;
  boulderMesh.position.copy(impactPos).addScaledVector(binormal, spawnSide * 9).add(new THREE.Vector3(0, 22, 0));
  boulderMesh.castShadow = true;
  raceWorldGroup.add(boulderMesh);

  const ringGeo = new THREE.RingGeometry(1.2, 2.2, 24);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
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
    life: 6.5,
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
  slot.vel.set((Math.random() - 0.5) * 3.5, 1.5 + Math.random() * 2.5, (Math.random() - 0.5) * 3.5);
}

// =========================================================================
// 8. FÍSICAS: AVANCE HACIA ADELANTE CORREGIDO Y TURBO POR CHOQUE CON AUTOS
// =========================================================================
const MAX_TURBO_RESERVE = 45; // Compact reserve as requested!

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
  cameraMode: 0,
  bodyRoll: 0,
  bodyPitch: 0,
  driftAngle: 0,
  shakeTimer: 0,
  rockSpawnCooldown: 2.2,
  skipCurrentVista: false,
  activeVistaTitle: '',
  countdownTimer: 3.0,
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

// Award small Turbo points when ramming/clashing with rival cars (Zero intrusive popups!)
function awardCarClashTurbo() {
  raceState.carClashes++;
  raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + 9);
  sound.playClashTurboSound();
  for (let k = 0; k < 7; k++) {
    spawnParticle(playerCar.position.clone().add(new THREE.Vector3(0, 0.55, 0)), 0xf59e0b, 1.3);
  }
}

// Reduced Turbo gain for obstacle dodges (Zero screen notifications!)
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

// FIXED: Car mesh nose is at -Z and spoiler/exhaust is at +Z.
// Three.js Object3D.lookAt aligns +Z with target, so we rotate Y by Math.PI (180°)
// so the nose (-Z) points forward along the road and the exhaust (+Z) faces backward!
function positionCarOnSpline(carMesh, distanceAlongTrack, lateralOffset, yawSlipAngle, bodyRollAngle, bodyPitchAngle, dt, speedUnits) {
  if (!carMesh || !currentCurve) return;
  const u = ((distanceAlongTrack / trackLength) % 1 + 1) % 1;
  const { point, tangent, binormal } = getTrackBasis(u);

  const worldPos = point.clone().addScaledVector(binormal, lateralOffset);
  carMesh.position.copy(worldPos);

  const lookTarget = worldPos.clone().add(tangent);
  carMesh.lookAt(lookTarget);

  // Rotate 180 degrees (Math.PI) so the front nose (-Z) points forward along +tangent!
  carMesh.rotateY(Math.PI + yawSlipAngle);
  carMesh.rotateZ(-bodyRollAngle);
  carMesh.rotateX(-bodyPitchAngle);

  const ud = carMesh.userData;
  if (ud) {
    // Forward wheel spin matching the corrected forward orientation
    const wheelSpinDelta = speedUnits * dt * 0.85;
    ud.wheelSpinMeshes.forEach((w) => {
      w.rotation.x += wheelSpinDelta;
    });
    ud.frontWheelPivots.forEach((p) => {
      p.rotation.y = yawSlipAngle * 0.65 - bodyRollAngle * 2.2;
    });
  }
}

function startNewRace(fromRemote = false) {
  sound.init();
  const trackCfg = TRACKS[selectedTrackIndex];
  buildRaceTrackScene(trackCfg);

  if (multiplayerMode === 'online' && !fromRemote) {
    sendMultiplayerPacket({
      type: 'start_race',
      trackIndex: selectedTrackIndex
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

  raceState.distance = 0;
  raceState.lateralOffset = -2.8;
  raceState.lateralVelocity = 0;
  raceState.steerInputSmooth = 0;
  raceState.speed = 0;
  raceState.nitroAmount = 0;
  raceState.lap = 1;
  raceState.elapsedTime = 0;
  raceState.topSpeedRecorded = 0;
  raceState.carClashes = 0;
  raceState.bodyRoll = 0;
  raceState.bodyPitch = 0;
  raceState.driftAngle = 0;
  raceState.shakeTimer = 0;
  raceState.rockSpawnCooldown = 2.0;
  raceState.skipCurrentVista = false;
  raceState.activeVistaTitle = '';
  raceState.countdownTimer = 3.0;

  raceState.p2Distance = 0;
  raceState.p2LateralOffset = 2.8;
  raceState.p2LateralVel = 0;
  raceState.p2SteerSmooth = 0;
  raceState.p2Speed = 0;
  raceState.p2Nitro = 20;

  replayFrames = [];
  raceHighlights = [
    `Salida en ${trackCfg.name} con ${CARS[selectedCarIndex].name}`
  ];

  document.getElementById('hud-lap').textContent = '1';
  document.getElementById('hud-position').textContent = '1';
  document.getElementById('hud-nitro-pct').textContent = '0%';
  document.getElementById('hud-nitro-bar').style.width = '0%';

  positionCarOnSpline(playerCar, 0, raceState.lateralOffset, 0, 0, 0, 0.016, 0);
  if (player2Car) {
    positionCarOnSpline(player2Car, 0, raceState.p2LateralOffset, 0, 0, 0, 0.016, 0);
  }
  aiCars.forEach((ai) => {
    positionCarOnSpline(ai.mesh, ai.distance, ai.lateralOffset, 0, 0, 0, 0.016, 0);
  });

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
  document.getElementById('countdown-sub').textContent = 'Impacta autos para ganar Turbo';

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

  logRaceHighlight(`Meta en ${finalRank}º Lugar • Vel. Máx: ${Math.round(raceState.topSpeedRecorded)} km/h • ${raceState.carClashes} impactos de Turbo`);

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
      ? `¡VICTORIA DE ${car.name} EN ${trk.name.toUpperCase()}!`
      : `RESUMEN DE CARRERA: ${trk.name.toUpperCase()} (${rank}º LUGAR)`;

  const tickerText = `🎙️ REPORTAJE EN VIVO: ${raceHighlights.join('   •   ')}   •   Tiempo final: ${formatTime(raceState.elapsedTime)}   •   Choques de Turbo: ${raceState.carClashes}`;
  document.getElementById('replay-ticker').textContent = tickerText;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const tenths = Math.floor((sec % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
}

// =========================================================================
// 9. BUCLE DE FÍSICAS, CHOQUES CON AUTOS PARA TURBO Y GRABACIÓN 60 FPS
// =========================================================================
let lastFrameTime = performance.now();
let lastCountdownInt = 3;

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

  const currentU = ((raceState.distance / trackLength) % 1 + 1) % 1;
  const currentBasis = getTrackBasis(currentU);
  const slopeY = currentBasis.tangent.y;
  const altitudeMeters = Math.round(currentBasis.point.y);
  const slopePct = Math.round(slopeY * 100);

  const elevEl = document.getElementById('hud-elevation');
  if (elevEl) {
    if (slopePct > 4) {
      elevEl.textContent = `${altitudeMeters}m ▲+${slopePct}%`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-amber-300 leading-none';
    } else if (slopePct < -4) {
      elevEl.textContent = `${altitudeMeters}m ▼${slopePct}%`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-cyan-300 leading-none';
    } else {
      elevEl.textContent = `${altitudeMeters}m • Llano`;
      elevEl.className = 'font-display font-bold text-[9px] sm:text-[11px] text-emerald-300 leading-none';
    }
  }

  // Automatic forward propulsion (Gas button removed; player uses Steering, Drift, and Turbo!)
  const isBraking = inputState.drift;
  const isNitroActive = inputState.nitro && raceState.nitroAmount > 1.0;

  if (raceState.shakeTimer > 0) {
    raceState.shakeTimer = Math.max(0, raceState.shakeTimer - dt);
  }

  const slopeTopSpeedMod = 1 - slopeY * 0.22;
  let targetMaxSpeed = carCfg.maxUnitsPerSec * slopeTopSpeedMod;
  if (isNitroActive) {
    targetMaxSpeed *= carCfg.nitroBoost;
    // Compact reserve drains quickly for short, tactical bursts
    raceState.nitroAmount = Math.max(0, raceState.nitroAmount - dt * 26);
  }

  if (!isBraking) {
    const accelMult = isNitroActive ? 1.72 : 1.0;
    raceState.speed += (carCfg.accelRate * accelMult - slopeY * 26) * dt;
  } else {
    raceState.speed -= (carCfg.accelRate * 0.38 + slopeY * 18) * dt;
  }

  if (Math.abs(raceState.lateralOffset) > ROAD_HALF_WIDTH - 1.1) {
    raceState.speed *= (1 - 0.85 * dt);
  }

  raceState.speed = Math.max(0, Math.min(targetMaxSpeed, raceState.speed));
  const speedRatio = raceState.speed / carCfg.maxUnitsPerSec;

  // Steering & Drift
  const rawSteer = (inputState.left ? -1 : 0) + (inputState.right ? 1 : 0);
  const steerLerpRate = steerAssist ? 10.5 : 14.0;
  raceState.steerInputSmooth += (rawSteer - raceState.steerInputSmooth) * Math.min(1, dt * steerLerpRate);

  const isDrifting = isBraking && Math.abs(raceState.steerInputSmooth) > 0.2 && speedRatio > 0.35;
  const turnAgility = carCfg.handlingRate * (isDrifting ? 1.35 : 1.0);
  const targetLateralVel = raceState.steerInputSmooth * turnAgility * Math.min(1, speedRatio + 0.2) * 5.2;

  raceState.lateralVelocity += (targetLateralVel - raceState.lateralVelocity) * Math.min(1, dt * 8.5);
  raceState.lateralOffset += raceState.lateralVelocity * dt;

  const maxOffset = ROAD_HALF_WIDTH - 1.25;
  if (raceState.lateralOffset > maxOffset) {
    raceState.lateralOffset = maxOffset;
    raceState.lateralVelocity *= -0.25;
  } else if (raceState.lateralOffset < -maxOffset) {
    raceState.lateralOffset = -maxOffset;
    raceState.lateralVelocity *= -0.25;
  }

  if (isDrifting) {
    raceState.nitroAmount = Math.min(MAX_TURBO_RESERVE, raceState.nitroAmount + dt * 2.5);
  }

  raceState.distance += raceState.speed * dt;

  const targetRoll = -raceState.steerInputSmooth * 0.11 * Math.min(1, speedRatio);
  const targetPitch = isNitroActive ? -0.045 : (isBraking ? 0.04 : -0.015 * speedRatio);
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
    raceState.speed
  );

  const pud = playerCar.userData;
  if (pud) {
    pud.tailLightMat.color.setHex(isBraking ? 0xffaa00 : 0xf43f5e);
    pud.flameMat.opacity = isNitroActive ? (0.65 + Math.random() * 0.35) : 0.0;
    const fScale = isNitroActive ? (0.95 + Math.random() * 0.65) : 0.01;
    pud.flameL.scale.set(1, 1, fScale);
    pud.flameR.scale.set(1, 1, fScale);
  }

  if (isDrifting || isNitroActive) {
    const pColor = isNitroActive ? 0x38bdf8 : 0xcbd5e1;
    spawnParticle(playerCar.position.clone().add(new THREE.Vector3(0, 0.25, 0)), pColor, isNitroActive ? 0.9 : 1.2);
  }

  // Player 2 Update (Split-Screen or Online P2P) + Clash Check with Player 2
  if (player2Car) {
    if (multiplayerMode === 'split') {
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
    } else if (multiplayerMode === 'online') {
      sendMultiplayerPacket({
        type: 'telemetry',
        distance: raceState.distance,
        lateralOffset: raceState.lateralOffset,
        speed: raceState.speed,
        driftAngle: raceState.driftAngle,
        carIndex: selectedCarIndex,
        paintColor: selectedPaintColor
      });
      if (!mpState.connected) {
        mpState.remoteCarData.distance += carCfg.maxUnitsPerSec * 0.98 * dt;
      }
      positionCarOnSpline(
        player2Car,
        mpState.remoteCarData.distance,
        mpState.remoteCarData.lateralOffset,
        mpState.remoteCarData.driftAngle || 0,
        0,
        0,
        dt,
        mpState.remoteCarData.speed || 95
      );
    }
  }

  // Obstacles (Silent — Zero screen notifications!)
  if (hazardsEnabled) {
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
        raceState.speed *= 0.58;
        raceState.shakeTimer = 0.35;
        const pushDir = raceState.lateralOffset >= wh.lateralOffset ? 1 : -1;
        raceState.lateralVelocity += pushDir * 13;
        sound.playTone(110, 0.22, 'sawtooth', 0.22, 55);
        for (let k = 0; k < 6; k++) spawnParticle(playerCar.position, 0xfbbf24, 1.3);
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
        raceState.speed *= 0.58;
        raceState.shakeTimer = 0.35;
        const pushDir = raceState.lateralOffset >= ro.lateralOffset ? 1 : -1;
        raceState.lateralVelocity += pushDir * 13;
        sound.playRockRumble();
        for (let k = 0; k < 6; k++) spawnParticle(playerCar.position, 0xef4444, 1.3);
      } else if (absLong < 4.2 && absLat >= 2.05 && absLat < 5.4 && !ro.dodgedThisLap && ro.hitCooldown <= 0) {
        ro.dodgedThisLap = true;
        awardSmallDodgeTurbo();
      }
    });

    raceState.rockSpawnCooldown -= dt * diffCfg.hazardFrequency;
    const inRockZone = (trackCfg.rockslideZones || []).some((rz) => currentU >= rz.startU && currentU <= rz.endU);
    if ((inRockZone || Math.abs(slopeY) > 0.055) && raceState.rockSpawnCooldown <= 0 && fallingRocks.length < 5) {
      raceState.rockSpawnCooldown = 2.4 + Math.random() * 1.8;
      spawnRockslideBoulder(raceState.distance + 65 + Math.random() * 35);
    }

    for (let i = fallingRocks.length - 1; i >= 0; i--) {
      const rk = fallingRocks[i];
      rk.life -= dt;
      rk.verticalVel -= 28 * dt;
      rk.heightAboveRoad += rk.verticalVel * dt;

      if (rk.heightAboveRoad <= 1.35) {
        rk.heightAboveRoad = 1.35;
        if (Math.abs(rk.verticalVel) > 4) {
          rk.verticalVel = -rk.verticalVel * 0.42;
          for (let s = 0; s < 4; s++) spawnParticle(rk.mesh.position, 0xd97706, 1.3);
        } else {
          rk.verticalVel = 0;
        }
      }

      rk.lateralOffset += rk.lateralRollSpeed * dt;
      const rBasis = getTrackBasis(rk.distance / trackLength);
      const rWorld = rBasis.point.clone()
        .addScaledVector(rBasis.binormal, rk.lateralOffset)
        .add(new THREE.Vector3(0, rk.heightAboveRoad, 0));
      rk.mesh.position.copy(rWorld);
      rk.mesh.rotation.x += dt * 4.5;
      rk.mesh.rotation.z += dt * 3.8;

      rk.ringMesh.material.opacity = rk.heightAboveRoad > 2.0 ? (0.4 + Math.sin(raceState.elapsedTime * 16) * 0.35) : 0.12;

      const longDiff = Math.abs(playerLapDist - rk.distance);
      const latDiff = Math.abs(raceState.lateralOffset - rk.lateralOffset);
      if (!rk.hit && rk.heightAboveRoad < 3.0 && longDiff < 3.3 && latDiff < 2.1) {
        rk.hit = true;
        raceState.speed *= 0.56;
        raceState.shakeTimer = 0.45;
        sound.playRockRumble();
        for (let k = 0; k < 8; k++) spawnParticle(rk.mesh.position, 0xf97316, 1.4);
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
  } else {
    wildlifeHazards.forEach((wh) => { wh.mesh.visible = false; });
    roadObstacles.forEach((ro) => { ro.mesh.visible = false; });
  }

  // AI Rivals + NEW MECHANIC: Clashing/Colliding with Cars Generates Turbo Points!
  aiCars.forEach((ai) => {
    if (ai.clashCooldown > 0) ai.clashCooldown -= dt;

    const distGap = raceState.distance - ai.distance;
    const rubberBand = Math.max(-12, Math.min(20 * diffCfg.aiAggression, distGap * 0.10 * diffCfg.aiAggression));
    ai.nitroTimer -= dt;
    if (distGap > 15 && ai.nitroTimer <= 0 && Math.random() < 0.05 * diffCfg.aiAggression) {
      ai.nitroTimer = 1.5;
    }
    const aiBoost = ai.nitroTimer > 0 ? 1.16 : 1.0;
    const targetAiSpeed = (ai.baseMaxSpeed + rubberBand) * aiBoost;
    ai.speed += (targetAiSpeed - ai.speed) * Math.min(1, dt * 2.8);
    ai.distance += ai.speed * dt;

    ai.laneTimer -= dt;
    if (ai.laneTimer <= 0) {
      ai.laneTimer = 1.5 + Math.random() * 2.0;
      ai.targetOffset = (Math.random() - 0.5) * (ROAD_HALF_WIDTH * 1.48);
    }
    ai.lateralOffset += (ai.targetOffset - ai.lateralOffset) * Math.min(1, dt * 2.5);

    const aiYaw = (ai.lateralOffset - ai.targetOffset) * 0.045;
    positionCarOnSpline(ai.mesh, ai.distance, ai.lateralOffset, aiYaw, 0, 0, dt, ai.speed);

    // Car-to-Car Clash Detection -> Awards Turbo Points!
    const longDiff = Math.abs(raceState.distance - ai.distance);
    const latDiff = Math.abs(raceState.lateralOffset - ai.lateralOffset);
    if (longDiff < 4.0 && latDiff < 2.15) {
      const pushDir = raceState.lateralOffset >= ai.lateralOffset ? 1 : -1;
      raceState.lateralVelocity += pushDir * 9.5;
      ai.lateralOffset -= pushDir * 1.1;
      ai.targetOffset = ai.lateralOffset;

      if (ai.clashCooldown <= 0) {
        ai.clashCooldown = 0.75;
        awardCarClashTurbo();
        logRaceHighlight(`Impacto de Turbo contra ${ai.name}`);
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

  // Scenic Vista Camera & Chase Camera
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

  if (activeVista && !raceState.skipCurrentVista) {
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
    desiredCamPos.x += (Math.random() - 0.5) * 0.85;
    desiredCamPos.y += (Math.random() - 0.5) * 0.65;
  }

  const camFollowTightness = raceState.cameraMode === 2 ? 24 : (activeVista ? 5.5 : 11.5);
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

  const targetFov = 60 + speedRatio * 14 + (isNitroActive ? 9 : 0);
  camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 6);
  camera.updateProjectionMatrix();

  document.getElementById('speed-lines').style.opacity = isNitroActive ? '0.95' : (speedRatio > 0.85 ? '0.4' : '0');

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

  let rank = 1;
  aiCars.forEach((ai) => {
    if (ai.distance > raceState.distance) rank++;
  });
  if (player2Car) {
    const rivalDist = multiplayerMode === 'split' ? raceState.p2Distance : mpState.remoteCarData.distance;
    if (rivalDist > raceState.distance) rank++;
  }
  document.getElementById('hud-position').textContent = String(rank);

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
    nitro: isNitroActive,
    p2D: multiplayerMode === 'split' ? raceState.p2Distance : mpState.remoteCarData.distance,
    p2Lat: multiplayerMode === 'split' ? raceState.p2LateralOffset : mpState.remoteCarData.lateralOffset,
    ai: aiCars.map((a) => ({ d: a.distance, lat: a.lateralOffset, spd: a.speed }))
  });

  const computedLap = Math.floor(raceState.distance / trackLength) + 1;
  if (computedLap > raceState.lap) {
    if (computedLap > raceState.totalLaps) {
      finishRace(rank);
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
// 10. REPETICIÓN TV 60 FPS ULTRA FLUIDA
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
    replayState.timeIndex += dt * 60;
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

  positionCarOnSpline(playerCar, interpD, interpLat, interpYaw, interpRoll, interpPitch, dt, interpSpd);
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
        positionCarOnSpline(aiCars[i].mesh, aiD, aiLat, 0, 0, 0, dt, aiSpd);
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

  if (!sound.muted && sound.isInitialized) {
    document.getElementById('eq-1').style.height = `${4 + Math.floor(Math.random() * 8)}px`;
    document.getElementById('eq-2').style.height = `${5 + Math.floor(Math.random() * 7)}px`;
    document.getElementById('eq-3').style.height = `${3 + Math.floor(Math.random() * 9)}px`;
  }
}

// =========================================================================
// 12. INTERFAZ TRANSPARENTE, EMOTES, CHAT GLOBAL Y EVENTOS
// =========================================================================
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
        ? 'bg-emerald-500/35 border-emerald-300 text-white shadow'
        : 'bg-slate-950/45 border-white/10 text-slate-200 hover:bg-slate-900/60'
    }`;
    btn.innerHTML = `
      <span class="text-[8px] font-bold uppercase text-emerald-300 truncate">${t.tag}</span>
      <span class="font-display font-bold text-[9px] sm:text-[10px] truncate">${t.name}</span>
    `;
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(620, 0.09, 'triangle', 0.14);
      selectTrack(idx);
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

  document.querySelectorAll('.paint-btn').forEach((b) => {
    if (b.dataset.color === selectedPaintColor) {
      b.classList.add('ring-2', 'ring-white', 'scale-110');
      b.classList.remove('opacity-80');
    } else {
      b.classList.remove('ring-2', 'ring-white', 'scale-110');
      b.classList.add('opacity-80');
    }
  });

  rebuildGarageCar();
  renderGarageSelectors();
}

function selectTrack(index) {
  selectedTrackIndex = (index + TRACKS.length) % TRACKS.length;
  const trk = TRACKS[selectedTrackIndex];
  document.getElementById('selected-track-banner').textContent = `• ${trk.name}`;
  document.getElementById('selected-track-meta').textContent = trk.subtitle;
  applySkyAndLighting(trk);
  renderGarageSelectors();
}

function setMultiplayerMode(mode) {
  multiplayerMode = mode;
  const pill = document.getElementById('mp-active-pill');
  const labels = {
    solo: '1P Solo',
    split: '2P Local',
    online: 'Online P2P'
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

  if (mode === 'split') {
    setMpStatus('Modo 2P Pantalla Dividida activo: J1 y J2 corren juntos.', 'text-amber-300');
  } else if (mode === 'online') {
    setMpStatus('Crea una sala para obtener código o ingresa el de tu amigo.', 'text-fuchsia-300');
  } else {
    setMpStatus('Choca autos para ganar Turbo • Chat Global activo.', 'text-emerald-300');
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

  // Global Chat & Emotes Panel Listeners
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

  // Replay Emote Bar Toggle
  document.getElementById('btn-replay-emotes').addEventListener('click', () => {
    const bar = document.getElementById('replay-emote-bar');
    bar.classList.toggle('hidden');
  });

  // Garage Drawer Tabs
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

  document.querySelectorAll('.paint-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.init();
      sound.playTone(660, 0.07, 'triangle', 0.12);
      selectedPaintColor = btn.dataset.color;
      document.querySelectorAll('.paint-btn').forEach((b) => {
        b.classList.remove('ring-2', 'ring-white', 'scale-110');
        b.classList.add('opacity-80');
      });
      btn.classList.add('ring-2', 'ring-white', 'scale-110');
      btn.classList.remove('opacity-80');
      rebuildGarageCar();
    });
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

  document.getElementById('btn-lighting-quality').addEventListener('click', (e) => {
    highQualityLighting = !highQualityLighting;
    renderer.shadowMap.enabled = highQualityLighting;
    renderer.setPixelRatio(highQualityLighting ? Math.min(window.devicePixelRatio || 1, 2) : 1);
    e.currentTarget.textContent = highQualityLighting ? 'Ultra HD' : 'Fluido 60fps';
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
    const newName = sound.cycleMusicStyle();
    document.getElementById('music-track-label').textContent = newName;
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
    startNewRace(false);
  });

  // TV Broadcast Replay Controls
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

  document.getElementById('btn-replay-restart').addEventListener('click', () => {
    startNewRace(false);
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
    startNewRace(false);
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
  selectCar(0);
  selectTrack(0);
  setGarageDrawerCollapsed(true);
  setupEventListeners();
  document.getElementById("music-track-label").textContent = MUSIC_STYLES[0].name;
  requestAnimationFrame(animate);
});
