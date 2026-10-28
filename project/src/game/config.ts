/**
 * Central tuning + layout constants for Geometry Walk.
 * Kept free of engine imports so it can be shared with unit tests.
 */

export const VIEW = {
  width: 960,
  height: 540,
} as const;

/** Playfield inset from the view edges, in pixels. */
export const FIELD = {
  left: 16,
  right: VIEW.width - 16,
  top: 16,
  bottom: VIEW.height - 16,
} as const;

/** Stable simulation step, matching the engine's fixed update rate. */
export const FIXED_UPDATE_FPS = 60;

export const PLAYER = {
  size: 26,
  startX: 150,
  muzzleOffset: 30,
  invulnSeconds: 1.5,
  lives: 3,
} as const;

export const BULLET = {
  width: 16,
  height: 6,
  life: 1.6,
  /** Total angular spread of a multi-shot volley, in radians. */
  spreadRadians: 0.28,
} as const;

export type EnemyKind = 'grunt' | 'erratic' | 'hunter';

export interface EnemyKindSpec {
  size: number;
  minSpeed: number;
  maxSpeed: number;
  minWobble: number;
  maxWobble: number;
  minAmplitude: number;
  maxAmplitude: number;
  /** Horizontal jitter in px/s layered on top of the base velocity. */
  jitter: number;
  /** Radians/second the triangle spins (magnitude; sign is chosen per spawn). */
  spinMin?: number;
  spinMax?: number;
  /**
   * When set (> 0) the enemy ignores the wobble path and instead steers
   * vertically toward the player at up to this many px/s.
   */
  homing?: number;
  /**
   * Vertical distance from the player's centre that a homing enemy aims for.
   * A non-zero value makes hunters converge on the player's flank (their side)
   * rather than dead-centre.
   */
  sideOffset?: number;
  /** Points awarded for destroying this enemy. */
  score: number;
  /** Relative chance of being picked when an enemy spawns. */
  weight: number;
  color: string;
  fill: string;
}

/**
 * Enemy archetypes. `grunt` is the predictable red cube; `erratic` is a faster,
 * yellow cube that lurches around with a compound wobble and horizontal jitter,
 * and is worth considerably more.
 */
export const ENEMY_KINDS: Record<EnemyKind, EnemyKindSpec> = {
  grunt: {
    size: 26,
    minSpeed: 130,
    maxSpeed: 240,
    minWobble: 0.6,
    maxWobble: 2.4,
    minAmplitude: 6,
    maxAmplitude: 26,
    jitter: 0,
    spinMin: 0.6,
    spinMax: 1.6,
    score: 100,
    weight: 3,
    color: '#ff6b6b',
    fill: '#3a1418',
  },
  erratic: {
    size: 22,
    minSpeed: 200,
    maxSpeed: 320,
    minWobble: 2.6,
    maxWobble: 5.5,
    minAmplitude: 40,
    maxAmplitude: 90,
    jitter: 150,
    spinMin: 3,
    spinMax: 6,
    score: 250,
    weight: 1,
    color: '#ffd43b',
    fill: '#3a3310',
  },
  hunter: {
    size: 30,
    minSpeed: 60,
    maxSpeed: 100,
    minWobble: 0,
    maxWobble: 0,
    minAmplitude: 0,
    maxAmplitude: 0,
    jitter: 0,
    spinMin: 0.8,
    spinMax: 1.4,
    homing: 115,
    sideOffset: 18,
    score: 150,
    weight: 1,
    color: '#ff9f45',
    fill: '#3a2410',
  },
};

export const ENEMY_SPAWN = {
  minInterval: 0.42,
  maxInterval: 0.9,
  minIntervalFloor: 0.2,
  /** How much the spawn interval shrinks per minute of play. */
  rampPerMinute: 0.5,
} as const;

/** Circular obstacles that drift across the field and can be shot apart. */
export const ASTEROID = {
  minRadius: 18,
  maxRadius: 44,
  minSpeed: 70,
  maxSpeed: 120,
  maxDrift: 55,
  /** HP per pixel of radius: small rocks take ~3 hits, the largest ~7. */
  hpPerRadius: 0.16,
  /** Points awarded per point of max HP (tougher rocks score more). */
  scorePerHp: 25,
} as const;

export const ASTEROID_SPAWN = {
  minInterval: 1.0,
  maxInterval: 2.2,
  minIntervalFloor: 0.5,
  rampPerMinute: 0.35,
} as const;

/** A boss appears every this many points. */
export const BOSS_EVERY = 5000;

export const BOSS = {
  size: 120,
  hoverMargin: 60,
  approachSpeed: 240,
  minAmplitude: 100,
  maxAmplitude: 170,
  minWobble: 0.5,
  maxWobble: 1.0,
  spin: 1.2,
  baseHp: 80,
  hpPerBoss: 45,
  score: 1500,
  color: '#c77dff',

  // Attack parameters, all escalating with the boss number.
  baseFireInterval: 1.8,
  fireIntervalPerBoss: 0.18,
  minFireInterval: 0.7,
  baseVolley: 1,
  volleyPerBoss: 1,
  maxVolley: 7,
  baseProjectileSpeed: 220,
  projectileSpeedPerBoss: 25,
  maxProjectileSpeed: 420,
  baseSpread: 0.25,
  spreadPerBoss: 0.12,
  maxSpread: 1.6,
  projectileSize: 12,
  projectileLife: 4,
  projectileColor: '#ff5d8f',
} as const;

/** Caps that keep boss upgrades from running away. */
export const UPGRADE = {
  fireIntervalFactor: 0.82,
  minFireInterval: 0.055,
  speedStep: 60,
  maxSpeed: 540,
  spreadStep: 2,
  maxBulletCount: 5,
  damageStep: 1,
  maxDamage: 5,
} as const;

export const COLORS = {
  background: '#070b12',
  player: '#4dd0ff',
  playerFill: '#10303f',
  bullet: '#ffe066',
  star: '#9fb6d4',
  asteroid: '#8ea3c0',
  asteroidFill: '#2b3240',
} as const;
