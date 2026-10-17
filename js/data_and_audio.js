// =========================================================================
// 1. CATÁLOGO DE 8 COCHES ÚNICOS, 12 COLORES, EMOTES Y 8 CIRCUITOS (INCL. REINO DULCE CANDY)
// =========================================================================
const PAINT_SWATCHES = [
  { hex: '#06b6d4', name: 'Cian Neón' },
  { hex: '#f472b6', name: 'Rosa Pastel 🍡' },
  { hex: '#fb7185', name: 'Glaseado Fresa 🍩' },
  { hex: '#c084fc', name: 'Lavanda Dulce 🍥' },
  { hex: '#67e8f9', name: 'Menta Helada' },
  { hex: '#fde047', name: 'Crema Vainilla 🥞' },
  { hex: '#f43f5e', name: 'Rojo Carmesí' },
  { hex: '#eab308', name: 'Oro Solar' },
  { hex: '#a855f7', name: 'Violeta Cyber' },
  { hex: '#10b981', name: 'Verde Esmeralda' },
  { hex: '#fb923c', name: 'Mandarina Mango' },
  { hex: '#f8fafc', name: 'Blanco Perla' }
];

const CARS = [
  {
    id: 'valkyrie',
    name: 'VALKYRIE GT-R',
    badge: 'CLASE S • HYPER GT',
    desc: 'Chasis aerodinámico con alerón GT de carbono, doble faro láser y gran fuerza de impacto Tornado.',
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
    id: 'sugarrush',
    name: 'SUGAR RUSH KART',
    badge: 'CLASE S • CANDY TURBO 🍩',
    desc: 'Bólido pastel de repostería con turbo-dona glaseada trasera, barquillos laterales y giro ultra rápido.',
    defaultColor: '#f472b6',
    accentColor: '#fde047',
    topSpeedKmh: 352,
    maxUnitsPerSec: 121,
    accelRate: 66,
    handlingRate: 5.5,
    nitroBoost: 1.35,
    spoilerStyle: 'donut_wing',
    bodyStyle: 'candy_kart',
    statsUI: { speed: 92, accel: 96, handling: 99, nitro: 94, accelText: '9.6', handlingText: '9.9', nitroText: '9.4' }
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
    desc: 'Superdeportivo de motor central con dirección ágil para dominar puentes, túneles y chocar rivales.',
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
    desc: 'Prototipo de competición con cabina en burbuja, aleta dorsal y máxima estabilidad en mega-rampas.',
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
  },
  {
    id: 'nebula',
    name: 'NEBULA HOVER-GT',
    badge: 'CLASE X • PLASMA HALO',
    desc: 'Coupé magnético futurista con anillo de plasma trasero, turbinas laterales y aceleración instantánea.',
    defaultColor: '#67e8f9',
    accentColor: '#c084fc',
    topSpeedKmh: 364,
    maxUnitsPerSec: 125,
    accelRate: 65,
    handlingRate: 5.1,
    nitroBoost: 1.37,
    spoilerStyle: 'halo_ring',
    bodyStyle: 'hover_gt',
    statsUI: { speed: 96, accel: 95, handling: 93, nitro: 97, accelText: '9.5', handlingText: '9.3', nitroText: '9.7' }
  },
  {
    id: 'goliath',
    name: 'GOLIATH 6x6 BAJA',
    badge: 'CLASE S+ • 6 RUEDAS',
    desc: 'Bestia todoterreno de 6 ruedas con barra LED en el techo, blindaje pesado y demolición Tornado.',
    defaultColor: '#fb923c',
    accentColor: '#fde047',
    topSpeedKmh: 342,
    maxUnitsPerSec: 117,
    accelRate: 64,
    handlingRate: 4.7,
    nitroBoost: 1.35,
    spoilerStyle: 'roof_rack',
    bodyStyle: 'monster_6x6',
    statsUI: { speed: 88, accel: 94, handling: 89, nitro: 95, accelText: '9.4', handlingText: '8.9', nitroText: '9.5' }
  },
  {
    id: 'phantomf1',
    name: 'PHANTOM F1 ZERO',
    badge: 'CLASE X • MONOPLAZA F1',
    desc: 'Monoplaza de rueda descubierta con alerón delantero triple, halo de titanio y paso por curva extremo.',
    defaultColor: '#c084fc',
    accentColor: '#00f5d4',
    topSpeedKmh: 372,
    maxUnitsPerSec: 128,
    accelRate: 68,
    handlingRate: 5.6,
    nitroBoost: 1.34,
    spoilerStyle: 'f1_aero',
    bodyStyle: 'formula_x',
    statsUI: { speed: 99, accel: 98, handling: 99, nitro: 93, accelText: '9.8', handlingText: '9.9', nitroText: '9.3' }
  }
];

const QUICK_EMOTES = [
  '🔥 ¡Qué carrerón!',
  '🍩 ¡Dulce victoria!',
  '🌀 ¡Toma ese Tornado Spin!',
  '⚡ ¡Coman polvo!',
  '🌉 ¡Nos vemos en la meta!',
  '🤝 ¡Revancha ya!'
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
    desc: 'Impacta rivales para hacerlos girar y ganar Turbo',
    aiSpeedMult: 1.03,
    aiAggression: 1.15,
    hazardFrequency: 1.30,
    rockSpeedMult: 1.12
  },
  {
    id: 'extreme',
    name: 'Extremo',
    desc: 'Rivales implacables, choques intensos y saltos extremos',
    aiSpeedMult: 1.08,
    aiAggression: 1.40,
    hazardFrequency: 1.65,
    rockSpeedMult: 1.30
  }
];

// =========================================================================
// 8 CIRCUITOS (INCLUYE EL NUEVO MAPA 'REINO DULCE CANDY' 🥞🍡🍩🍥)
// =========================================================================
const TRACKS = [
  {
    id: 'candy',
    name: 'Reino Dulce Candy',
    subtitle: 'Mundo Pastel 🥞🍡🍩🍥 • Arcos de Donas Glaseadas, Torres de Hotcakes, Brochetas Dango y Gomitas',
    tag: 'CANDY PASTEL 🍩🍡',
    totalLaps: 3,
    musicStyleIndex: 7,
    elevationBadge: '+85m Dulce Pastel',
    hazardLabel: 'Ositos de Gomita, Bombones y Donas',
    animalName: 'Osito de Gomita',
    animalType: 'gummy',
    skyTop: '#f472b6',
    skyBottom: '#fdf2f8',
    fogColor: 0xfce7f3,
    ambientSky: 0xfdf2f8,
    ambientGround: 0xbe185d,
    ambientIntensity: 1.08,
    sunColor: 0xfffbeb,
    sunIntensity: 1.38,
    sunPos: [140, 230, -140],
    roadPrimary: '#831843',
    roadLineColor: '#fde047',
    kerbColorA: '#f472b6',
    kerbColorB: '#ffffff',
    sceneryType: 'candy',
    waypoints: [
      [0, 0, 0],
      [0, 20, -210],
      [115, 48, -390],
      [255, 82, -520],
      [125, 38, -690],
      [-105, 54, -640],
      [-265, 22, -460],
      [-330, -8, -230],
      [-225, 32, -40],
      [-140, 18, 145],
      [-45, 6, 170]
    ],
    tunnelZones: [],
    megaRampZones: [
      { startU: 0.28, endU: 0.32, jumpEndU: 0.39, rampHeight: 13.0, peakArc: 15.5 }
    ],
    splitZones: [
      {
        startU: 0.52,
        endU: 0.68,
        leftLabel: 'PUENTE DE GLASEADO ROSA 🍩',
        rightLabel: 'PASEO DE HOTCAKES Y DANGO 🥞🍡',
        sepLat: 13.0,
        leftHeight: 13.0,
        rightHeight: -5.0,
        leftColor: 0xf472b6,
        rightColor: 0xfde047
      }
    ],
    scenicZones: [
      {
        startU: 0.16,
        endU: 0.25,
        title: 'VALLE DE DONAS Y TORRES DE HOTCAKES 🥞🍩',
        subtitle: 'Reino Dulce Pastel',
        sideOffset: -15,
        heightOffset: 8.0,
        lookSideOffset: 22,
        lookHeightOffset: 3
      },
      {
        startU: 0.74,
        endU: 0.84,
        title: 'JARDÍN DE DANGO Y PIRULETAS 🍡🍥',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.2,
        lookSideOffset: -20,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.10, endU: 0.22 },
      { startU: 0.75, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.14 },
      { u: 0.44 },
      { u: 0.72 },
      { u: 0.89 }
    ]
  },
  {
    id: 'cybermeta',
    name: 'Metrópolis Cyber 2099',
    subtitle: 'Gran Mapa de 1 Vuelta (~4.2 km) • Puentes Láser, Murales Neón, Datos, Túnel 360° y 3 Bifurcaciones a la Meta',
    tag: '1 VUELTA • MULTICAMINO',
    totalLaps: 1,
    musicStyleIndex: 6,
    elevationBadge: '1 Vuelta • 3 Rutas',
    hazardLabel: 'Puentes, Murales, Datos y Túnel 360°',
    animalName: 'Mecha-Pantera',
    animalType: 'cyberdeer',
    skyTop: '#03020d',
    skyBottom: '#701a75',
    fogColor: 0x07041a,
    ambientSky: 0x22d3ee,
    ambientGround: 0x4a044e,
    ambientIntensity: 0.98,
    sunColor: 0xe879f9,
    sunIntensity: 1.5,
    sunPos: [180, 290, -240],
    roadPrimary: '#090d1c',
    roadLineColor: '#00f5d4',
    kerbColorA: '#f72585',
    kerbColorB: '#4cc9f0',
    sceneryType: 'cybermeta',
    waypoints: [
      [0, 0, 0],
      [0, 18, -260],
      [90, 42, -520],
      [260, 74, -760],
      [480, 96, -960],
      [720, 62, -1120],
      [920, 28, -940],
      [1040, 54, -660],
      [960, 108, -360],
      [740, 44, -120],
      [520, 16, 140],
      [340, 64, 420],
      [120, 92, 640],
      [-160, 38, 720],
      [-440, 14, 580],
      [-680, 56, 360],
      [-820, 98, 80],
      [-740, 26, -220],
      [-520, 48, -380],
      [-280, 24, -220],
      [-110, 8, 90]
    ],
    tunnelZones: [
      { startU: 0.56, endU: 0.67, radius: 11.0, color: 0x00f5d4 }
    ],
    megaRampZones: [
      { startU: 0.36, endU: 0.395, jumpEndU: 0.455, rampHeight: 14.0, peakArc: 16.5 }
    ],
    splitZones: [
      {
        startU: 0.11,
        endU: 0.25,
        leftLabel: 'PUENTE LÁSER ALTO (+TURBO)',
        rightLabel: 'AVENIDA DE MURALES NEÓN',
        sepLat: 13.5,
        leftHeight: 14.0,
        rightHeight: -6.0,
        leftColor: 0x00f5d4,
        rightColor: 0xf72585
      },
      {
        startU: 0.47,
        endU: 0.55,
        leftLabel: 'ARCO DE DATOS MATRIX',
        rightLabel: 'VIADUCTO HOLOGRÁFICO',
        sepLat: 13.0,
        leftHeight: 11.0,
        rightHeight: -5.0,
        leftColor: 0x38bdf8,
        rightColor: 0xfbbf24
      },
      {
        startU: 0.74,
        endU: 0.88,
        leftLabel: 'PUENTE COLGANTE META',
        rightLabel: 'BULEVAR CYBER MURALES',
        sepLat: 14.0,
        leftHeight: 15.0,
        rightHeight: -7.0,
        leftColor: 0xa855f7,
        rightColor: 0x00f5d4
      }
    ],
    scenicZones: [
      {
        startU: 0.26,
        endU: 0.33,
        title: 'DISTRITO DE MURALES Y PUENTE NEÓN',
        subtitle: 'Metrópolis Cyber 2099',
        sideOffset: -15,
        heightOffset: 8.5,
        lookSideOffset: 22,
        lookHeightOffset: 3
      },
      {
        startU: 0.89,
        endU: 0.95,
        title: 'RECTA FINAL: PORTAL DE DATOS',
        subtitle: 'Llegando a la Meta',
        sideOffset: 14,
        heightOffset: 7.5,
        lookSideOffset: -18,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.30, endU: 0.35 },
      { startU: 0.68, endU: 0.73 }
    ],
    wildlifeZones: [
      { u: 0.08 },
      { u: 0.32 },
      { u: 0.70 },
      { u: 0.92 }
    ]
  },
  {
    id: 'selva',
    name: 'Selva',
    subtitle: 'Selva Tropical • Pirámides Escalonadas, Cenotes Sagrados, Cascadas y Jaguares',
    tag: 'SELVA',
    totalLaps: 3,
    musicStyleIndex: 0,
    elevationBadge: '+80m Selva',
    hazardLabel: 'Jaguares, Troncos y Rocas',
    animalName: 'Jaguar',
    animalType: 'jaguar',
    skyTop: '#064e3b',
    skyBottom: '#fbbf24',
    fogColor: 0x064e3b,
    ambientSky: 0xa7f3d0,
    ambientGround: 0x14532d,
    ambientIntensity: 0.95,
    sunColor: 0xfde68a,
    sunIntensity: 1.4,
    sunPos: [140, 210, -140],
    roadPrimary: '#1c2421',
    roadLineColor: '#10b981',
    kerbColorA: '#f59e0b',
    kerbColorB: '#059669',
    sceneryType: 'jungle',
    waypoints: [
      [0, 0, 0],
      [0, 22, -205],
      [115, 52, -370],
      [235, 78, -500],
      [105, 48, -670],
      [-110, 26, -630],
      [-265, 64, -450],
      [-320, -10, -230],
      [-220, 24, -45],
      [-145, 32, 140],
      [-45, 8, 170]
    ],
    tunnelZones: [],
    megaRampZones: [],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.22,
        endU: 0.34,
        title: 'GRAN PIRÁMIDE Y CENOTE SAGRADO',
        subtitle: 'Vista Panorámica',
        sideOffset: -16,
        heightOffset: 8.5,
        lookSideOffset: 24,
        lookHeightOffset: 3
      },
      {
        startU: 0.74,
        endU: 0.85,
        title: 'CASCADA DE LA SELVA',
        subtitle: 'Vista Panorámica',
        sideOffset: 15,
        heightOffset: 7.0,
        lookSideOffset: -20,
        lookHeightOffset: 2
      }
    ],
    rockslideZones: [
      { startU: 0.10, endU: 0.30 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.30 },
      { u: 0.54 },
      { u: 0.78 },
      { u: 0.90 }
    ]
  },
  {
    id: 'abismo',
    name: 'Túnel Abismo X',
    subtitle: 'Doble Túnel 360° (Paredes y Techo) + Mega-Rampas con Aros Aéreos Calibrados',
    tag: 'TÚNEL 360° Y RAMPAS',
    totalLaps: 3,
    musicStyleIndex: 1,
    elevationBadge: '+115m Salto Aros',
    hazardLabel: 'Túneles 360° y Mega-Rampas',
    animalName: 'Cyber-Pantera',
    animalType: 'cyberdeer',
    skyTop: '#090524',
    skyBottom: '#06b6d4',
    fogColor: 0x090d24,
    ambientSky: 0x67e8f9,
    ambientGround: 0x3b0764,
    ambientIntensity: 0.98,
    sunColor: 0xf472b6,
    sunIntensity: 1.45,
    sunPos: [120, 260, -120],
    roadPrimary: '#0f172a',
    roadLineColor: '#f43f5e',
    kerbColorA: '#06b6d4',
    kerbColorB: '#d946ef',
    sceneryType: 'city',
    waypoints: [
      [0, 0, 0],
      [0, 34, -220],
      [130, 68, -410],
      [275, 112, -550],
      [115, 22, -720],
      [-130, 48, -660],
      [-295, 96, -470],
      [-355, 8, -235],
      [-235, 58, -40],
      [-145, 24, 155],
      [-45, 6, 175]
    ],
    tunnelZones: [
      { startU: 0.14, endU: 0.30, radius: 10.8, color: 0x06b6d4 },
      { startU: 0.54, endU: 0.69, radius: 10.8, color: 0xe879f9 }
    ],
    megaRampZones: [
      { startU: 0.34, endU: 0.38, jumpEndU: 0.46, rampHeight: 13.5, peakArc: 16.0 },
      { startU: 0.72, endU: 0.76, jumpEndU: 0.84, rampHeight: 13.5, peakArc: 16.0 }
    ],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.46,
        endU: 0.52,
        title: 'SALTO ABISMO SKY +115M',
        subtitle: 'Caída Libre Extrema',
        sideOffset: -14,
        heightOffset: 9.0,
        lookSideOffset: 18,
        lookHeightOffset: -4
      }
    ],
    rockslideZones: [
      { startU: 0.08, endU: 0.13 },
      { startU: 0.86, endU: 0.93 }
    ],
    wildlifeZones: [
      { u: 0.11 },
      { u: 0.50 },
      { u: 0.89 }
    ]
  },
  {
    id: 'alps',
    name: 'Cumbre Alpina',
    subtitle: 'Montaña de Gran Altitud (+88m) • Ciervos Alpinos y Derrumbes de Roca',
    tag: 'ALTA MONTAÑA',
    totalLaps: 3,
    musicStyleIndex: 2,
    elevationBadge: '+88m Desnivel',
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
    sunIntensity: 1.4,
    sunPos: [160, 240, 110],
    roadPrimary: '#1f2937',
    roadLineColor: '#38bdf8',
    kerbColorA: '#dc2626',
    kerbColorB: '#ffffff',
    sceneryType: 'mountain',
    waypoints: [
      [0, 0, 0],
      [0, 22, -195],
      [110, 52, -360],
      [220, 86, -510],
      [80, 32, -680],
      [-125, 28, -640],
      [-280, 58, -460],
      [-340, -14, -245],
      [-235, 22, -50],
      [-165, 32, 135],
      [-50, 10, 175]
    ],
    tunnelZones: [],
    megaRampZones: [],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.22,
        endU: 0.30,
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
      { startU: 0.10, endU: 0.26 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.16 },
      { u: 0.39 },
      { u: 0.64 },
      { u: 0.82 }
    ]
  },
  {
    id: 'costa',
    name: 'Costa del Sol',
    subtitle: 'Acantilados Costeros (+76m) • Faro Dorado y Cornisa del Océano',
    tag: 'ACANTILADO COSTERO',
    totalLaps: 3,
    musicStyleIndex: 3,
    elevationBadge: '+76m Acantilado',
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
    sunIntensity: 1.38,
    sunPos: [-190, 110, -230],
    roadPrimary: '#1e293b',
    roadLineColor: '#fbbf24',
    kerbColorA: '#ef4444',
    kerbColorB: '#f8fafc',
    sceneryType: 'coast',
    waypoints: [
      [0, 0, 0],
      [0, 20, -210],
      [-105, 48, -395],
      [-275, 76, -485],
      [-445, 22, -340],
      [-475, 6, -120],
      [-340, -10, 65],
      [-210, 24, 225],
      [-65, 8, 210]
    ],
    tunnelZones: [],
    megaRampZones: [],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.22,
        endU: 0.31,
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
      { startU: 0.12, endU: 0.28 },
      { startU: 0.74, endU: 0.89 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.42 },
      { u: 0.68 },
      { u: 0.88 }
    ]
  },
  {
    id: 'mirage',
    name: 'Desierto Espejismo',
    subtitle: 'Cañón Rojo (+84m) • Arco Natural de Roca y Cresta de Monolitos',
    tag: 'GRAN CAÑÓN',
    totalLaps: 3,
    musicStyleIndex: 4,
    elevationBadge: '+84m Cañón',
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
      [0, 24, -245],
      [135, 56, -460],
      [340, 84, -520],
      [495, 22, -315],
      [480, -8, -70],
      [355, -14, 135],
      [180, 26, 240],
      [35, 8, 180]
    ],
    tunnelZones: [],
    megaRampZones: [],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.20,
        endU: 0.30,
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
      { startU: 0.09, endU: 0.25 },
      { startU: 0.70, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.14 },
      { u: 0.41 },
      { u: 0.66 },
      { u: 0.86 }
    ]
  },
  {
    id: 'tokyo',
    name: 'Distrito Neón Tokio',
    subtitle: 'Autopista Nocturna (+90m) • Puente Colgante y Rascacielos Holográficos',
    tag: 'NOCHE CYBERPUNK',
    totalLaps: 3,
    musicStyleIndex: 5,
    elevationBadge: '+90m Autopista',
    hazardLabel: 'Cyber-Fauna, Rocas y Vallas',
    animalName: 'Cyber-Ciervo Neón',
    animalType: 'cyberdeer',
    skyTop: '#040716',
    skyBottom: '#1e1b4b',
    fogColor: 0x0b1026,
    ambientSky: 0x38bdf8,
    ambientGround: 0x1e1b4b,
    ambientIntensity: 0.85,
    sunColor: 0xc084fc,
    sunIntensity: 1.1,
    sunPos: [80, 150, -90],
    roadPrimary: '#111827',
    roadLineColor: '#22d3ee',
    kerbColorA: '#ec4899',
    kerbColorB: '#06b6d4',
    sceneryType: 'city',
    waypoints: [
      [0, 0, 0],
      [0, 24, -200],
      [85, 54, -380],
      [240, 88, -470],
      [395, 24, -345],
      [455, 6, -135],
      [365, -10, 65],
      [225, 24, 210],
      [80, 12, 240],
      [-50, 4, 150]
    ],
    tunnelZones: [],
    megaRampZones: [],
    splitZones: [],
    scenicZones: [
      {
        startU: 0.20,
        endU: 0.28,
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
      { startU: 0.10, endU: 0.24 },
      { startU: 0.72, endU: 0.88 }
    ],
    wildlifeZones: [
      { u: 0.15 },
      { u: 0.39 },
      { u: 0.65 },
      { u: 0.88 }
    ]
  }
];

// =========================================================================
// 2. SINTETIZADOR MUSICAL AUTOMÁTICO POR PISTA (8 EMISORAS INCL. CANDY POP PASTEL)
// =========================================================================
const MUSIC_STYLES = [
  {
    name: 'FM: Selva Tribal',
    bpm: 148,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    breakbeat: true,
    bassNotes: [
      49.00, 49.00, 98.00, 49.00,  58.27, 58.27, 116.54, 58.27,
      65.41, 65.41, 130.81, 65.41, 55.00, 55.00, 110.00, 73.42
    ],
    leadNotes: [
      587.33, 698.46, 783.99, 0,   880.00, 783.99, 698.46, 587.33,
      523.25, 587.33, 698.46, 0,   659.25, 587.33, 493.88, 392.00
    ],
    arpNotes: [
      293.66, 349.23, 440.00, 587.33,  349.23, 440.00, 523.25, 698.46,
      261.63, 329.63, 392.00, 523.25,  293.66, 392.00, 493.88, 587.33
    ]
  },
  {
    name: 'FM: Cyber Tunnel 360',
    bpm: 166,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    cowbell: true,
    bassNotes: [
      36.71, 73.42, 36.71, 73.42,  43.65, 87.31, 43.65, 87.31,
      41.20, 82.41, 41.20, 82.41,  49.00, 98.00, 55.00, 110.00
    ],
    leadNotes: [
      783.99, 0, 932.33, 783.99,   698.46, 0, 783.99, 659.25,
      587.33, 659.25, 783.99, 0,   880.00, 783.99, 698.46, 587.33
    ],
    arpNotes: [
      392.00, 466.16, 587.33, 783.99,  349.23, 440.00, 523.25, 698.46,
      329.63, 392.00, 493.88, 659.25,  293.66, 369.99, 440.00, 587.33
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
    name: 'FM: Drum & Bass 174',
    bpm: 174,
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
    name: 'FM: Cyber Metrópolis 2099',
    bpm: 170,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    breakbeat: true,
    cowbell: true,
    bassNotes: [
      32.70, 65.41, 32.70, 65.41,  38.89, 77.78, 38.89, 77.78,
      43.65, 87.31, 43.65, 87.31,  49.00, 98.00, 58.27, 116.54
    ],
    leadNotes: [
      783.99, 932.33, 1046.50, 0,  932.33, 783.99, 698.46, 587.33,
      659.25, 783.99, 1046.50, 0,  1174.66, 1046.50, 932.33, 783.99
    ],
    arpNotes: [
      261.63, 311.13, 392.00, 523.25,  311.13, 392.00, 466.16, 622.25,
      349.23, 440.00, 523.25, 698.46,  392.00, 493.88, 587.33, 783.99
    ]
  },
  {
    // Pista 7 (Nuevo Mapa Candy): Reino Dulce Candy 🥞🍡🍩🍥
    name: 'FM: Candy Pop Pastel 🍩',
    bpm: 156,
    leadWave: 'square',
    bassWave: 'triangle',
    breakbeat: false,
    cowbell: false,
    bassNotes: [
      65.41, 130.81, 98.00, 130.81,  73.42, 146.83, 110.00, 146.83,
      82.41, 164.81, 123.47, 164.81, 87.31, 174.61, 130.81, 196.00
    ],
    leadNotes: [
      1046.50, 1174.66, 1318.51, 1567.98,  1318.51, 1174.66, 1046.50, 880.00,
      987.77,  1046.50, 1174.66, 1318.51,  1567.98, 1318.51, 1174.66, 1046.50
    ],
    arpNotes: [
      523.25, 659.25, 783.99, 1046.50,  587.33, 739.99, 880.00, 1174.66,
      659.25, 783.99, 987.77, 1318.51,  698.46, 880.00, 1046.50, 1396.91
    ]
  }
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.styleIndex = 7;
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
    this.masterGain.gain.value = 0.56;
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

    const bufferSize = Math.floor(this.ctx.sampleRate * 1.0);
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
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.56, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  setMusicStyle(index) {
    this.styleIndex = ((index % MUSIC_STYLES.length) + MUSIC_STYLES.length) % MUSIC_STYLES.length;
    const label = document.getElementById('music-track-label');
    if (label) label.textContent = MUSIC_STYLES[this.styleIndex].name;
    return MUSIC_STYLES[this.styleIndex].name;
  }

  cycleMusicStyle() {
    this.init();
    return this.setMusicStyle(this.styleIndex + 1);
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
    this.playTone(587.33, 0.08, 'triangle', 0.14, 880);
  }

  playRingPassSound(ringIdx = 1) {
    const base = 523.25 + ringIdx * 140;
    this.playTone(base, 0.14, 'triangle', 0.18, base * 1.45);
  }

  playClashTurboSound(combo = 1) {
    const base = 180 + Math.min(5, combo) * 45;
    this.playTone(base, 0.11, 'sawtooth', 0.18, 90);
    setTimeout(() => this.playTone(523.25 + combo * 80, 0.15, 'triangle', 0.19, 1046.5), 45);
  }

  playTornadoSpinSound() {
    this.playTone(320, 0.18, 'sawtooth', 0.20, 880);
    setTimeout(() => this.playTone(660, 0.22, 'triangle', 0.20, 1320), 90);
  }

  playMegaJumpSound() {
    this.playTone(260, 0.32, 'triangle', 0.20, 920);
  }

  playRockRumble() {
    this.playTone(90, 0.22, 'sawtooth', 0.16, 38);
  }

  playKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, time);
    osc.frequency.exponentialRampToValueAtTime(34, time + 0.13);
    gain.gain.setValueAtTime(0.34, time);
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
    const dur = isSnare ? 0.11 : 0.04;
    gain.gain.setValueAtTime(isSnare ? 0.16 : 0.06, time);
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
    bassFilter.frequency.setValueAtTime(isRacing ? 380 + speedRatio * 580 : 300, time);
    bassGain.gain.setValueAtTime(0.15, time);
    bassGain.gain.exponentialRampToValueAtTime(0.008, time + 0.17);
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start(time);
    bassOsc.stop(time + 0.18);

    const leadFreq = style.leadNotes ? style.leadNotes[step16 % style.leadNotes.length] : 0;
    if (leadFreq > 0) {
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = style.cowbell ? 'square' : (style.leadWave || 'sawtooth');
      leadOsc.frequency.setValueAtTime(leadFreq, time);
      leadGain.gain.setValueAtTime(isRacing ? 0.095 : 0.055, time);
      leadGain.gain.exponentialRampToValueAtTime(0.003, time + 0.15);
      leadOsc.connect(leadGain);
      leadGain.connect(this.masterGain);
      leadOsc.start(time);
      leadOsc.stop(time + 0.16);
    }

    const arpFreq = style.arpNotes[step16 % style.arpNotes.length];
    const arpOsc = this.ctx.createOscillator();
    const arpGain = this.ctx.createGain();
    arpOsc.type = 'triangle';
    arpOsc.frequency.setValueAtTime(arpFreq, time);
    arpGain.gain.setValueAtTime(isRacing ? 0.065 : 0.04, time);
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
      this.engineGain.gain.setTargetAtTime(0.09 + speedRatio * 0.07, now, 0.06);
      this.driftNoiseGain.gain.setTargetAtTime(isDrifting && speedRatio > 0.25 ? 0.08 : 0.0, now, 0.05);
    } else {
      this.engineGain.gain.setTargetAtTime(0.0, now, 0.08);
      this.driftNoiseGain.gain.setTargetAtTime(0.0, now, 0.05);
    }
  }
}

const sound = new SoundEngine();
