import { range } from './mathx';
import type { PlayerBounds } from './player';

export interface AsteroidState {
  /** Centre of the circle. */
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  /** Remaining hit points; player bullets chip this away. */
  hp: number;
  /** Hit points at spawn (scaled to the radius, so bigger rocks are tougher). */
  maxHp: number;
  /** Points awarded when the asteroid is destroyed. */
  score: number;
  /** Seconds of hit-flash remaining (visual cue only). */
  hitFlash: number;
}

export interface AsteroidSpec {
  minRadius: number;
  maxRadius: number;
  minSpeed: number;
  maxSpeed: number;
  /** Maximum vertical drift speed, in px/s. */
  maxDrift: number;
  /** Hit points granted per pixel of radius (bigger asteroids = more HP). */
  hpPerRadius: number;
  /** Points awarded per point of max HP. */
  scorePerHp: number;
}

/** How long an asteroid flashes white after taking a non-fatal hit. */
const HIT_FLASH_SECONDS = 0.08;

/**
 * Spawn a circular asteroid just off the right edge. It drifts slowly leftward
 * with a random vertical component so it carves an unpredictable path.
 */
export function spawnAsteroid(
  rand: () => number,
  spec: AsteroidSpec,
  bounds: PlayerBounds,
): AsteroidState {
  const r = range(rand, spec.minRadius, spec.maxRadius);
  const maxHp = Math.max(1, Math.round(r * spec.hpPerRadius));
  return {
    x: bounds.right + r,
    y: range(rand, bounds.top + r, bounds.bottom - r),
    r,
    vx: -range(rand, spec.minSpeed, spec.maxSpeed),
    vy: range(rand, -spec.maxDrift, spec.maxDrift),
    hp: maxHp,
    maxHp,
    score: maxHp * spec.scorePerHp,
    hitFlash: 0,
  };
}

/**
 * Advance an asteroid, bouncing it off the top and bottom of the playfield so
 * it stays a threat for the whole trip across the screen.
 */
export function stepAsteroid(
  asteroid: AsteroidState,
  dt: number,
  bounds: PlayerBounds,
): void {
  asteroid.x += asteroid.vx * dt;
  asteroid.y += asteroid.vy * dt;

  if (asteroid.hitFlash > 0) {
    asteroid.hitFlash = Math.max(0, asteroid.hitFlash - dt);
  }

  if (asteroid.y - asteroid.r < bounds.top) {
    asteroid.y = bounds.top + asteroid.r;
    asteroid.vy = Math.abs(asteroid.vy);
  } else if (asteroid.y + asteroid.r > bounds.bottom) {
    asteroid.y = bounds.bottom - asteroid.r;
    asteroid.vy = -Math.abs(asteroid.vy);
  }
}

/** True once the asteroid has fully left the field on the left. */
export function isAsteroidGone(asteroid: AsteroidState, fieldLeft: number): boolean {
  return asteroid.x + asteroid.r < fieldLeft;
}

/**
 * Apply damage from a bullet. Non-fatal hits trigger the visual flash; the HP
 * floor stays at 0 so `isAsteroidDead` is a simple threshold check.
 */
export function damageAsteroid(asteroid: AsteroidState, amount: number): void {
  asteroid.hp = Math.max(0, asteroid.hp - amount);
  if (asteroid.hp > 0) {
    asteroid.hitFlash = HIT_FLASH_SECONDS;
  }
}

/** True once the asteroid's HP is depleted and it should break apart. */
export function isAsteroidDead(asteroid: AsteroidState): boolean {
  return asteroid.hp <= 0;
}
