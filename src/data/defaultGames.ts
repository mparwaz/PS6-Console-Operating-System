import { GameApp } from '../types';

export const INITIAL_DEFAULT_APPS: GameApp[] = [
  {
    id: 'store',
    type: 'system',
    title: 'PlayStation Store',
    bg: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1920',
    cardStyle: 'bg-white text-black',
    innerHTML: `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-shopping-bag text-5xl text-[var(--ps-blue)]"></i></div>`,
    pub: 'SONY',
    category: 'Media App',
    description: 'Explore the next generation of games, add-ons, and PS6 exclusives in 8K HDR.'
  },
  {
    id: 'explore',
    type: 'explore',
    title: 'Explore',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920',
    cardStyle: 'bg-black text-[var(--ps-gold)]',
    innerHTML: `<div class="w-full h-full flex flex-col items-center justify-center gap-2"><div class="grid grid-cols-2 gap-2 text-3xl"><i class="fas fa-times"></i><i class="far fa-circle"></i><i class="far fa-square"></i><i class="fas fa-caret-up"></i></div></div>`,
    pub: 'DISCOVER',
    category: 'Game',
    description: 'Latest PlayStation community highlights, live broadcasts, and developer streams.'
  },
  {
    id: 'scratch-geo',
    type: 'custom_wasm',
    title: 'GEOMETRY DASH<br>SCRATCH EDITION',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
    pub: 'GRIFFPATCH • SCRATCH EDU',
    category: 'Scratch / Educational',
    description: 'The iconic rhythm platformer recreated in Scratch visual programming, running via embed.',
    embedUrl: 'https://scratch.mit.edu/projects/105500895/embed',
    iframeCode: '<iframe src="https://scratch.mit.edu/projects/105500895/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    embedType: 'iframe',
    isCustom: true,
    sizeGb: 2.4,
    releaseYear: '2026'
  },
  {
    id: 'tlou3',
    type: 'game',
    title: 'THE LAST OF US<br>PART III',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400',
    pub: 'SONY',
    category: 'Game',
    description: 'Naughty Dog returns with the groundbreaking next chapter in the emotional saga.',
    sizeGb: 114.2,
    releaseYear: '2027'
  },
  {
    id: 'spidey3',
    type: 'game',
    title: 'SPIDER-MAN 3<br>THE FINAL CHAPTER',
    bg: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400',
    pub: 'MARVEL',
    category: 'Game',
    description: 'Peter Parker and Miles Morales confront their greatest threats across a photorealistic NYC.',
    sizeGb: 98.4,
    releaseYear: '2026'
  },
  {
    id: 'pt-wasm',
    type: 'custom_wasm',
    title: 'P.T. SILENT HILLS<br>WASM DEMAKE',
    bg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400',
    pub: '7780S STUDIO',
    category: 'WASM Emulation',
    description: 'The legendary psychological horror playable teaser recreated in interactive WebGL / WebAssembly.',
    embedUrl: 'https://pt-hallway-demo.glitch.me/',
    sizeGb: 12.5,
    releaseYear: '2026'
  },
  {
    id: 'gta5-wasm',
    type: 'custom_wasm',
    title: 'GRAND THEFT AUTO V<br>LOS SANTOS WASM',
    bg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400',
    pub: 'ROCKSTAR',
    category: 'WASM Emulation',
    description: 'Los Santos open-world sandbox compiled to WebAssembly with high-speed ray-traced rendering.',
    embedUrl: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fgta.jsdos',
    sizeGb: 88.0,
    releaseYear: '2026'
  },
  {
    id: 'cyberpunk-wasm',
    type: 'custom_wasm',
    title: 'CYBERPUNK 2077<br>NIGHT CITY WASM',
    bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400',
    pub: 'CD PROJEKT RED',
    category: 'WASM Emulation',
    description: 'Neon-drenched Night City 3D engine compiled with WebGPU / WebAssembly physics.',
    embedUrl: 'https://threejs.org/examples/webgl_materials_cubemap_dynamic.html',
    sizeGb: 64.2,
    releaseYear: '2026'
  },
  {
    id: 'cod-wasm',
    type: 'custom_wasm',
    title: 'CALL OF DUTY<br>ARENA WASM',
    bg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=400',
    pub: 'ACTIVISION',
    category: 'WASM Emulation',
    description: 'High-octane tactical FPS arena running at 120 FPS on WebAssembly architecture.',
    embedUrl: 'https://playcanv.as/p/2OuwCzgy/',
    sizeGb: 45.1,
    releaseYear: '2026'
  },
  {
    id: 'tlou1',
    type: 'game',
    title: 'THE LAST OF US',
    bg: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400',
    pub: 'SONY',
    category: 'Game',
    description: 'The masterfully remastered journey of Joel and Ellie with full DualSense haptics.',
    sizeGb: 78.5,
    releaseYear: '2024'
  },
  {
    id: 'gta6',
    type: 'game',
    title: 'GRAND THEFT AUTO VI',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400',
    pub: 'ROCKSTAR',
    category: 'Game',
    description: 'Leonida welcomes you. The biggest open-world experience ever created.',
    sizeGb: 145.0,
    releaseYear: '2026'
  },
  {
    id: 'fc26',
    type: 'game',
    title: 'EA FC 26',
    bg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400',
    pub: 'EA SPORTS',
    category: 'Game',
    description: 'HyperMotion 6.0 delivers uncanny player realism on PS6.',
    sizeGb: 58.0,
    releaseYear: '2025'
  },
  {
    id: 'rdr3',
    type: 'game',
    title: 'RED DEAD REDEMPTION III',
    bg: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=400',
    pub: 'ROCKSTAR',
    category: 'Game',
    description: 'The untamed frontier reborn in astonishing realism and immersive haptics.',
    sizeGb: 132.8,
    releaseYear: '2027'
  }
];

export const WASM_GAME_PRESETS: {
  title: string;
  pub: string;
  category: 'Game' | 'WASM Emulation' | 'Scratch / Educational' | 'Cloud Stream' | 'Media App';
  embedUrl: string;
  iframeCode?: string;
  cardImg: string;
  bg: string;
  description: string;
}[] = [
  {
    title: 'Scratch: Geometry Dash',
    pub: 'GRIFFPATCH • SCRATCH EDU',
    category: 'Scratch / Educational',
    embedUrl: 'https://scratch.mit.edu/projects/105500895/embed',
    iframeCode: '<iframe src="https://scratch.mit.edu/projects/105500895/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    cardImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920',
    description: 'World-famous Geometry Dash port built entirely inside MIT Scratch engine.'
  },
  {
    title: 'Scratch: Paper Minecraft',
    pub: 'GRIFFPATCH • SCRATCH EDU',
    category: 'Scratch / Educational',
    embedUrl: 'https://scratch.mit.edu/projects/10128407/embed',
    iframeCode: '<iframe src="https://scratch.mit.edu/projects/10128407/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    cardImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920',
    description: '2D sandbox survival and crafting game built on Scratch EDU platform.'
  },
  {
    title: 'GTA V: Los Santos WASM',
    pub: 'ROCKSTAR',
    category: 'WASM Emulation',
    embedUrl: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fgta.jsdos',
    cardImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920',
    description: 'Grand Theft Auto sandbox engine compiled to WebAssembly for browser runtime.'
  },
  {
    title: 'Cyberpunk 2077 Night City 3D',
    pub: 'CD PROJEKT RED',
    category: 'WASM Emulation',
    embedUrl: 'https://threejs.org/examples/webgl_materials_cubemap_dynamic.html',
    cardImg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920',
    description: 'High-speed 3D WebGL / WebAssembly cybernetic city runtime with dynamic reflections.'
  },
  {
    title: 'P.T. (Silent Hills) Hallway Loop',
    pub: '7780S STUDIO',
    category: 'WASM Emulation',
    embedUrl: 'https://pt-hallway-demo.glitch.me/',
    cardImg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1920',
    description: 'The infamous never-ending haunted hallway recreation running in WebGL / WASM.'
  },
  {
    title: 'Call of Duty: Arena FPS WASM',
    pub: 'ACTIVISION',
    category: 'WASM Emulation',
    embedUrl: 'https://playcanv.as/p/2OuwCzgy/',
    cardImg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1920',
    description: 'Competitive tactical FPS with 120 FPS high tick rate WASM networking.'
  },
  {
    title: 'DOOM: Classic 3D WASM',
    pub: 'ID SOFTWARE',
    category: 'WASM Emulation',
    embedUrl: 'https://silentspacemarine.com/',
    cardImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920',
    description: 'Original id Tech 1 engine running natively in WebAssembly in the browser.'
  },
  {
    title: 'Quake III Arena WASM',
    pub: 'ID SOFTWARE',
    category: 'WASM Emulation',
    embedUrl: 'https://quakejs.com/',
    cardImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400',
    bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920',
    description: 'Legendary arena multiplayer shooter ported to WebAssembly with dedicated servers.'
  }
];
