// =========================================================================
// 1. CATÁLOGO DE COCHES, EMOTES MULTIJUGADOR Y CIRCUITOS (INCLUYE SELVA MEXICANA)
// =========================================================================
const CARS = [
  {
    id: 'valkyrie',
    name: 'VALKYRIE GT-R',
    badge: 'CLASE S • HYPER GT',
    desc: 'Chasis aerodinámico con alerón GT de carbono, doble faro láser y gran resistencia en choques.',
    defaultColor: '#06b6d4',
    accentColor: '#38bdf8',
    topSpeedKmh: 345,
    maxUnitsPerSec: 118,
    accelRate: 60,
    handlingRate: 4.8,
    nitroBoost: 1.32,
    spoilerStyle: 'gt_wing',
    bodyStyle: 'coupe',
    statsUI: { speed: 89, accel: 90, handling: 94, nitro: 88, accelText: '9.0', handlingText: '9.4', nitroText: '8.8' }
  },
  {
    id: 'cyberx',
    name: 'AETHER CYBER-X',
    badge: 'CLASE S+ • PROTOTIPO NEÓN',
    desc: 'Diseño futurista tipo cuña con doble aleta trasera, tira LED continua y velocidad punta extrema.',
    defaultColor: '#a855f7',
    accentColor: '#f472b6',
    topSpeedKmh: 368,
    maxUnitsPerSec: 126,
    accelRate: 56,
    handlingRate: 4.4,
    nitroBoost: 1.36,
    spoilerStyle: 'twin_fin',
    bodyStyle: 'wedge',
    statsUI: { speed: 97, accel: 86, handling: 88, nitro: 96, accelText: '8.6', handlingText: '8.8', nitroText: '9.6' }
  },
  {
    id: 'solstice',
    name: 'SOLSTICE STRADALE',
    badge: 'CLASE S • SUPERCAR DRIFT',
    desc: 'Superdeportivo italiano de motor central con dirección ágil para esquivar obstáculos e impactar rivales.',
    defaultColor: '#f43f5e',
    accentColor: '#fb923c',
    topSpeedKmh: 338,
    maxUnitsPerSec: 115,
    accelRate: 63,
    handlingRate: 5.3,
    nitroBoost: 1.30,
    spoilerStyle: 'ducktail',
    bodyStyle: 'exotic',
    statsUI: { speed: 86, accel: 94, handling: 98, nitro: 87, accelText: '9.4', handlingText: '9.8', nitroText: '8.7' }
  },
  {
    id: 'titan',
    name: 'TITAN APEX LMP',
    badge: 'CLASE X • LE MANS PRO',
    desc: 'Prototipo de competición con cabina en burbuja, aleta dorsal de tiburón y máxima tracción en pendientes.',
    defaultColor: '#10b981',
    accentColor: '#34d399',
    topSpeedKmh: 358,
    maxUnitsPerSec: 122,
    accelRate: 67,
    handlingRate: 5.0,
    nitroBoost: 1.34,
    spoilerStyle: 'lmp_wing',
    bodyStyle: 'prototype',
    statsUI: { speed: 94, accel: 98, handling: 95, nitro: 92, accelText: '9.8', handlingText: '9.5', nitroText: '9.2' }
  }
];

const QUICK_EMOTES = [
  '🔥 ¡Qué carrerón!',
  '💥 ¡Toma ese choque +Turbo!',
  '⚡ ¡Coman polvo!',
  '👑 ¡Rey de la pista!',
  '🐆 ¡Cuidado en la selva!',
  '🤝 ¡Buena carrera!'
];

const DIFFICULTY_LEVELS = [
  {
    id: 'normal',
    name: 'Normal',
    desc: 'Rivales competitivos y densidad media de obstáculos',
    aiSpeedMult: 0.98,
    aiAggression: 0.85,
    hazardFrequency: 1.0,
    rockSpeedMult: 0.95
  },
  {
    id: 'challenging',
    name: 'Retador',
    desc: 'Impacta rivales y esquiva obstáculos para ganar Turbo',
    aiSpeedMult: 1.03,
    aiAggression: 1.15,
    hazardFrequency: 1.35,
    rockSpeedMult: 1.15
  },
  {
    id: 'extreme',
    name: 'Extremo',
    desc: 'Rivales implacables, lluvia de rocas y cruces constantes',
    aiSpeedMult: 1.09,
    aiAggression: 1.45,
    hazardFrequency: 1.75,
    rockSpeedMult: 1.35
  }
];

// Circuitos con desniveles pronunciados (Incluye el nuevo mapa de la Selva Mexicana)
const TRACKS = [
  {
    id: 'selva',
    name: 'Selva Maya Mexicana',
    subtitle: 'Selva Tropical • Desnivel +54m • Pirámides, Cenotes y Jaguares',
    tag: 'SELVA MEXICANA',
    elevationBadge: '+54m Selva',
    hazardLabel: 'Jaguares, Troncos y Rocas',
    animalName: 'Jaguar Maya',
    animalType: 'jaguar',
    skyTop: '#064e3b',
    skyBottom: '#fbbf24',
    fogColor: 0x064e3b,
    ambientSky: 0xa7f3d0,
    ambientGround: 0x14532d,
    ambientIntensity: 0.95,
    sunColor: 0xfde68a,
    sunIntensity: 1.45,
    sunPos: [140, 210, -140],
    roadPrimary: '#1c2421',
    roadLineColor: '#10b981',
    kerbColorA: '#f59e0b',
    kerbColorB: '#059669',
    sceneryType: 'jungle',
    waypoints: [
      [0, 0, 0],
      [0, 16, -205],
      [115, 38, -370],
      [235, 54, -500],
      [105, 44, -670],
      [-110, 24, -630],
      [-265, 6, -450],
      [-320, -12, -230],
      [-220, 20, -45],
      [-145, 30, 140],
      [-45, 8, 170]
    ],
    scenicZones: [
      {
        startU: 0.22,
        endU: 0.35,
        title: 'GRAN PIRÁMIDE MAYA Y CENOTE SAGRADO',
        subtitle: 'Vista Panorámica',
        sideOffset: -16,
        heightOffset: 8.5,
        lookSideOffset: 24,
        lookHeightOffset: 3
      },
      {
        startU: 0.74,
        endU: 0.85,
        title: 'CASCADA LACANDONA',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.0,
        lookSideOffset: -20,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.10, endU: 0.30 },
      { startU: 0.40, endU: 0.62 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.30 },
      { u: 0.47 },
      { u: 0.63 },
      { u: 0.78 },
      { u: 0.90 }
    ]
  },
  {
    id: 'alps',
    name: 'Cumbre Alpina',
    subtitle: 'Montaña • Desnivel +58m • Ciervos, Troncos y Derrumbes',
    tag: 'ALTA MONTAÑA',
    elevationBadge: '+58m Desnivel',
    hazardLabel: 'Ciervos, Rocas y Troncos',
    animalName: 'Ciervo Alpino',
    animalType: 'deer',
    skyTop: '#0369a1',
    skyBottom: '#bae6fd',
    fogColor: 0x7dd3fc,
    ambientSky: 0xe0f2fe,
    ambientGround: 0x334155,
    ambientIntensity: 0.95,
    sunColor: 0xffffff,
    sunIntensity: 1.45,
    sunPos: [160, 240, 110],
    roadPrimary: '#1f2937',
    roadLineColor: '#38bdf8',
    kerbColorA: '#dc2626',
    kerbColorB: '#ffffff',
    sceneryType: 'mountain',
    waypoints: [
      [0, 0, 0],
      [0, 18, -195],
      [110, 42, -360],
      [220, 58, -510],
      [80, 50, -680],
      [-125, 28, -640],
      [-280, 8, -460],
      [-340, -14, -245],
      [-235, 22, -50],
      [-165, 32, 135],
      [-50, 10, 175]
    ],
    scenicZones: [
      {
        startU: 0.24,
        endU: 0.36,
        title: 'MIRADOR GLACIAR Y CASCADA',
        subtitle: 'Vista Panorámica',
        sideOffset: -16,
        heightOffset: 8.5,
        lookSideOffset: 24,
        lookHeightOffset: 3
      },
      {
        startU: 0.76,
        endU: 0.86,
        title: 'VIADUCTO DEL VALLE',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.0,
        lookSideOffset: -20,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.10, endU: 0.30 },
      { startU: 0.40, endU: 0.62 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.16 },
      { u: 0.31 },
      { u: 0.48 },
      { u: 0.64 },
      { u: 0.79 },
      { u: 0.91 }
    ]
  },
  {
    id: 'costa',
    name: 'Costa del Sol',
    subtitle: 'Acantilados • Desnivel +46m • Rocas Costeras y Barreras',
    tag: 'ACANTILADO COSTERO',
    elevationBadge: '+46m Acantilado',
    hazardLabel: 'Fauna, Rocas y Vallas',
    animalName: 'Ciervo Costero',
    animalType: 'deer',
    skyTop: '#1e1b4b',
    skyBottom: '#f97316',
    fogColor: 0x431407,
    ambientSky: 0xfdba74,
    ambientGround: 0x31102f,
    ambientIntensity: 0.92,
    sunColor: 0xffedd5,
    sunIntensity: 1.4,
    sunPos: [-190, 110, -230],
    roadPrimary: '#1e293b',
    roadLineColor: '#fbbf24',
    kerbColorA: '#ef4444',
    kerbColorB: '#f8fafc',
    sceneryType: 'coast',
    waypoints: [
      [0, 0, 0],
      [0, 16, -210],
      [-105, 36, -395],
      [-275, 46, -485],
      [-445, 28, -340],
      [-475, 6, -120],
      [-340, -10, 65],
      [-210, 18, 225],
      [-65, 8, 210]
    ],
    scenicZones: [
      {
        startU: 0.25,
        endU: 0.38,
        title: 'ACANTILADO DEL FARO DORADO',
        subtitle: 'Vista Panorámica',
        sideOffset: 16,
        heightOffset: 8.0,
        lookSideOffset: -26,
        lookHeightOffset: -1
      },
      {
        startU: 0.73,
        endU: 0.84,
        title: 'CORNISA DEL OCÉANO',
        subtitle: 'Vista Panorámica',
        sideOffset: -15,
        heightOffset: 6.8,
        lookSideOffset: 20,
        lookHeightOffset: 1
      }
    ],
    rockslideZones: [
      { startU: 0.12, endU: 0.32 },
      { startU: 0.44, endU: 0.64 },
      { startU: 0.74, endU: 0.89 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.29 },
      { u: 0.46 },
      { u: 0.61 },
      { u: 0.77 },
      { u: 0.90 }
    ]
  },
  {
    id: 'mirage',
    name: 'Desierto Espejismo',
    subtitle: 'Cañón Rojo • Desnivel +52m • Peñascos y Berrendos',
    tag: 'GRAN CAÑÓN',
    elevationBadge: '+52m Cañón',
    hazardLabel: 'Peñascos, Fauna y Bloques',
    animalName: 'Berrendo del Cañón',
    animalType: 'antelope',
    skyTop: '#3b0764',
    skyBottom: '#f59e0b',
    fogColor: 0x451a03,
    ambientSky: 0xfde68a,
    ambientGround: 0x451a03,
    ambientIntensity: 0.9,
    sunColor: 0xfbbf24,
    sunIntensity: 1.35,
    sunPos: [210, 125, -190],
    roadPrimary: '#27272a',
    roadLineColor: '#f59e0b',
    kerbColorA: '#f97316',
    kerbColorB: '#fef3c7',
    sceneryType: 'desert',
    waypoints: [
      [0, 0, 0],
      [0, 20, -245],
      [135, 44, -460],
      [340, 52, -520],
      [495, 28, -315],
      [480, -8, -70],
      [355, -14, 135],
      [180, 22, 240],
      [35, 8, 180]
    ],
    scenicZones: [
      {
        startU: 0.23,
        endU: 0.35,
        title: 'ARCO NATURAL DEL GRAN CAÑÓN',
        subtitle: 'Vista Panorámica',
        sideOffset: -16,
        heightOffset: 8.2,
        lookSideOffset: 24,
        lookHeightOffset: 2
      },
      {
        startU: 0.74,
        endU: 0.85,
        title: 'CRESTA DE LOS MONOLITOS',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.5,
        lookSideOffset: -20,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.09, endU: 0.31 },
      { startU: 0.38, endU: 0.62 },
      { startU: 0.70, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.14 },
      { u: 0.28 },
      { u: 0.44 },
      { u: 0.59 },
      { u: 0.75 },
      { u: 0.89 }
    ]
  },
  {
    id: 'tokyo',
    name: 'Distrito Neón Tokio',
    subtitle: 'Autopista Elevada • Desnivel +50m • Drones, Vallas y Escombros',
    tag: 'NOCHE CYBERPUNK',
    elevationBadge: '+50m Autopista',
    hazardLabel: 'Cyber-Fauna, Rocas y Vallas',
    animalName: 'Cyber-Ciervo Neón',
    animalType: 'cyberdeer',
    skyTop: '#040716',
    skyBottom: '#1e1b4b',
    fogColor: 0x0b1026,
    ambientSky: 0x38bdf8,
    ambientGround: 0x1e1b4b,
    ambientIntensity: 0.8,
    sunColor: 0xc084fc,
    sunIntensity: 1.05,
    sunPos: [80, 150, -90],
    roadPrimary: '#111827',
    roadLineColor: '#22d3ee',
    kerbColorA: '#ec4899',
    kerbColorB: '#06b6d4',
    sceneryType: 'city',
    waypoints: [
      [0, 0, 0],
      [0, 18, -200],
      [85, 40, -380],
      [240, 50, -470],
      [395, 32, -345],
      [455, 6, -135],
      [365, -10, 65],
      [225, 20, 210],
      [80, 12, 240],
      [-50, 4, 150]
    ],
    scenicZones: [
      {
        startU: 0.24,
        endU: 0.36,
        title: 'PUENTE COLGANTE SHIBUYA SKY',
        subtitle: 'Vista Panorámica',
        sideOffset: -16,
        heightOffset: 8.0,
        lookSideOffset: 24,
        lookHeightOffset: 4
      },
      {
        startU: 0.72,
        endU: 0.84,
        title: 'TORRE HOLOGRÁFICA AKIHABARA',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.5,
        lookSideOffset: -22,
        lookHeightOffset: 3
      }
    ],
    rockslideZones: [
      { startU: 0.12, endU: 0.30 },
      { startU: 0.42, endU: 0.60 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.30 },
      { u: 0.47 },
      { u: 0.63 },
      { u: 0.78 },
      { u: 0.91 }
    ]
  }
];

// =========================================================================
// 2. SINTETIZADOR MUSICAL ADICTIVO DE 5 EMISORAS (PHONK, EUROBEAT, D&B...)
// =========================================================================
const MUSIC_STYLES = [
  {
    name: 'FM: Phonk Drift',
    bpm: 152,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    cowbell: true,
    bassNotes: [
      36.71, 36.71, 73.42, 36.71,  41.20, 41.20, 82.41, 41.20,
      43.65, 43.65, 87.31, 43.65,  38.89, 38.89, 73.42, 55.00
    ],
    leadNotes: [
      587.33, 0, 587.33, 698.46,  659.25, 0, 587.33, 523.25,
      466.16, 0, 523.25, 587.33,  440.00, 523.25, 466.16, 440.00
    ],
    arpNotes: [
      293.66, 349.23, 440.00, 587.33, 349.23, 440.00, 523.25, 659.25,
      293.66, 349.23, 440.00, 587.33, 261.63, 329.63, 440.00, 523.25
    ]
  },
  {
    name: 'FM: Eurobeat Nitro',
    bpm: 160,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    cowbell: false,
    bassNotes: [
      55.00, 110.00, 55.00, 110.00,  43.65, 87.31, 43.65, 87.31,
      49.00, 98.00,  49.00, 98.00,   41.20, 82.41, 49.00, 98.00
    ],
    leadNotes: [
      440.00, 523.25, 659.25, 880.00,  783.99, 659.25, 523.25, 659.25,
      587.33, 659.25, 783.99, 659.25,  523.25, 493.88, 440.00, 659.25
    ],
    arpNotes: [
      220.00, 261.63, 329.63, 440.00,  174.61, 220.00, 261.63, 349.23,
      196.00, 246.94, 293.66, 392.00,  164.81, 207.65, 246.94, 329.63
    ]
  },
  {
    name: 'FM: Drum & Bass 172',
    bpm: 172,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    breakbeat: true,
    bassNotes: [
      41.20, 41.20, 41.20, 82.41,  49.00, 49.00, 49.00, 98.00,
      55.00, 55.00, 55.00, 110.0,  36.71, 36.71, 49.00, 73.42
    ],
    leadNotes: [
      659.25, 0, 783.99, 659.25,  587.33, 0, 493.88, 587.33,
      659.25, 783.99, 880.00, 0,  783.99, 659.25, 587.33, 493.88
    ],
    arpNotes: [
      329.63, 392.00, 493.88, 659.25,  293.66, 369.99, 440.00, 587.33,
      329.63, 392.00, 493.88, 659.25,  246.94, 329.63, 392.00, 493.88
    ]
  },
  {
    name: 'FM: Outrun Turbo',
    bpm: 138,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    bassNotes: [
      65.41, 65.41, 130.81, 65.41,  55.00, 55.00, 110.00, 55.00,
      43.65, 43.65, 87.31,  43.65,  49.00, 49.00, 98.00,  49.00
    ],
    leadNotes: [
      523.25, 659.25, 783.99, 1046.5, 880.00, 783.99, 659.25, 523.25,
      698.46, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 880.00
    ],
    arpNotes: [
      261.63, 329.63, 392.00, 523.25, 220.00, 261.63, 329.63, 440.00,
      174.61, 220.00, 261.63, 349.23, 196.00, 246.94, 293.66, 392.00
    ]
  },
  {
    name: 'FM: Hyper Rave',
    bpm: 148,
    leadWave: 'square',
    bassWave: 'sawtooth',
    bassNotes: [
      46.25, 92.50, 46.25, 92.50,  46.25, 92.50, 55.00, 110.00,
      41.20, 82.41, 41.20, 82.41,  49.00, 98.00, 55.00, 110.00
    ],
    leadNotes: [
      739.99, 739.99, 0, 880.00,  739.99, 659.25, 587.33, 659.25,
      554.37, 554.37, 0, 659.25,  587.33, 554.37, 493.88, 659.25
    ],
    arpNotes: [
      369.99, 440.00, 554.37, 739.99, 369.99, 440.00, 554.37, 739.99,
      329.63, 392.00, 493.88, 659.25, 293.66, 369.99, 440.00, 587.33
    ]
  }
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.styleIndex = 0;
    this.step = 0;
    this.nextNoteTime = 0;
    this.engineOsc = null;
    this.engineSubOsc = null;
    this.engineGain = null;
    this.driftNoiseGain = null;
    this.noiseBuffer = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.58;
    this.masterGain.connect(this.ctx.destination);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.0;

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 340;

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 65;

    this.engineSubOsc = this.ctx.createOscillator();
    this.engineSubOsc.type = 'triangle';
    this.engineSubOsc.frequency.value = 32.5;

    this.engineOsc.connect(engineFilter);
    this.engineSubOsc.connect(engineFilter);
    engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc.start();
    this.engineSubOsc.start();

    const bufferSize = this.ctx.sampleRate * 1.5;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = this.noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1150;
    bandpass.Q.value = 3.5;

    this.driftNoiseGain = this.ctx.createGain();
    this.driftNoiseGain.gain.value = 0.0;

    whiteNoise.connect(bandpass);
    bandpass.connect(this.driftNoiseGain);
    this.driftNoiseGain.connect(this.masterGain);
    whiteNoise.start();

    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.isInitialized = true;
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.58, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  cycleMusicStyle() {
    this.init();
    this.styleIndex = (this.styleIndex + 1) % MUSIC_STYLES.length;
    return MUSIC_STYLES[this.styleIndex].name;
  }

  playTone(freq, duration, type = 'sine', vol = 0.14, slideFreq = null) {
    if (!this.isInitialized || this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), now + duration);
    }
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }

  playDodgeBoostSound() {
    this.playTone(587.33, 0.08, 'triangle', 0.16, 880);
  }

  playClashTurboSound() {
    this.playTone(165, 0.10, 'sawtooth', 0.18, 95);
    setTimeout(() => this.playTone(659.25, 0.12, 'triangle', 0.18, 987.77), 55);
  }

  playRockRumble() {
    this.playTone(90, 0.25, 'sawtooth', 0.18, 38);
  }

  playKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(148, time);
    osc.frequency.exponentialRampToValueAtTime(34, time + 0.13);
    gain.gain.setValueAtTime(0.36, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  playSnareOrHat(time, isSnare) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = isSnare ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(isSnare ? 1850 : 6800, time);
    const gain = this.ctx.createGain();
    const dur = isSnare ? 0.12 : 0.045;
    gain.gain.setValueAtTime(isSnare ? 0.18 : 0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(time);
    src.stop(time + dur + 0.01);
  }

  playSynthStep(time, speedRatio, isRacing) {
    const style = MUSIC_STYLES[this.styleIndex];
    const step16 = this.step % 16;

    if (style.breakbeat) {
      if (step16 === 0 || step16 === 10) this.playKick(time);
      if (step16 === 4 || step16 === 12) this.playSnareOrHat(time, true);
      if (step16 % 2 === 1) this.playSnareOrHat(time, false);
    } else {
      if (step16 % 4 === 0) this.playKick(time);
      if (step16 % 4 === 2) this.playSnareOrHat(time, true);
      if (step16 % 2 === 1) this.playSnareOrHat(time, false);
    }

    const bassFreq = style.bassNotes[step16 % style.bassNotes.length];
    const bassOsc = this.ctx.createOscillator();
    const bassFilter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();
    bassOsc.type = style.bassWave || 'sawtooth';
    bassOsc.frequency.setValueAtTime(bassFreq, time);
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(isRacing ? 380 + speedRatio * 620 : 300, time);
    bassGain.gain.setValueAtTime(0.16, time);
    bassGain.gain.exponentialRampToValueAtTime(0.008, time + 0.17);
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start(time);
    bassOsc.stop(time + 0.18);

    const leadFreq = style.leadNotes ? style.leadNotes[step16 % style.leadNotes.length] : 0;
    if (leadFreq > 0) {
      const leadOsc = this.ctx.createOscillator();
      const leadFilter = this.ctx.createBiquadFilter();
      const leadGain = this.ctx.createGain();
      leadOsc.type = style.cowbell ? 'square' : (style.leadWave || 'sawtooth');
      leadOsc.frequency.setValueAtTime(leadFreq, time);
      leadFilter.type = style.cowbell ? 'bandpass' : 'lowpass';
      leadFilter.frequency.setValueAtTime(style.cowbell ? 1450 : 2400, time);
      leadGain.gain.setValueAtTime(isRacing ? 0.11 : 0.065, time);
      leadGain.gain.exponentialRampToValueAtTime(0.003, time + 0.15);
      leadOsc.connect(leadFilter);
      leadFilter.connect(leadGain);
      leadGain.connect(this.masterGain);
      leadOsc.start(time);
      leadOsc.stop(time + 0.16);
    }

    const arpFreq = style.arpNotes[step16 % style.arpNotes.length];
    const arpOsc = this.ctx.createOscillator();
    const arpGain = this.ctx.createGain();
    arpOsc.type = 'triangle';
    arpOsc.frequency.setValueAtTime(arpFreq, time);
    arpGain.gain.setValueAtTime(isRacing ? 0.075 : 0.045, time);
    arpGain.gain.exponentialRampToValueAtTime(0.003, time + 0.13);
    arpOsc.connect(arpGain);
    arpGain.connect(this.masterGain);
    arpOsc.start(time);
    arpOsc.stop(time + 0.14);

    this.step++;
  }

  update(speedRatio, isDrifting, isNitro, isEngineActive) {
    if (!this.isInitialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const style = MUSIC_STYLES[this.styleIndex];
    const dynamicBpm = style.bpm + (isEngineActive ? speedRatio * 12 : 0) + (isNitro ? 8 : 0);
    const secondsPerSixteenth = 60 / dynamicBpm / 2.2;

    while (this.nextNoteTime < now + 0.12) {
      this.playSynthStep(this.nextNoteTime, speedRatio, isEngineActive);
      this.nextNoteTime += secondsPerSixteenth;
    }

    if (isEngineActive) {
      const gearMod = (speedRatio * 5.2) % 1;
      const baseFreq = 52 + speedRatio * 135 + gearMod * 42 + (isNitro ? 38 : 0);
      this.engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.04);
      this.engineSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.04);
      this.engineGain.gain.setTargetAtTime(0.10 + speedRatio * 0.08, now, 0.06);
      this.driftNoiseGain.gain.setTargetAtTime(isDrifting && speedRatio > 0.25 ? 0.09 : 0.0, now, 0.05);
    } else {
      this.engineGain.gain.setTargetAtTime(0.0, now, 0.08);
      this.driftNoiseGain.gain.setTargetAtTime(0.0, now, 0.05);
    }
  }
}

const sound = new SoundEngine();
