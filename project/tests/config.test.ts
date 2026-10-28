import { describe, expect, it } from 'vitest';
import {
  ASTEROID,
  ASTEROID_SPAWN,
  BOSS,
  BOSS_EVERY,
  ENEMY_KINDS,
  ENEMY_SPAWN,
  UPGRADE,
  VIEW,
} from '../src/game/config';

const { grunt, erratic, hunter } = ENEMY_KINDS;

describe('enemy archetypes', () => {
  it('gives every kind a positive spawn weight and a point value', () => {
    for (const spec of Object.values(ENEMY_KINDS)) {
      expect(spec.weight).toBeGreaterThan(0);
      expect(spec.score).toBeGreaterThan(0);
      expect(spec.size).toBeGreaterThan(0);
    }
  });

  it('makes every kind spin', () => {
    for (const spec of Object.values(ENEMY_KINDS)) {
      expect(spec.spinMax ?? 0).toBeGreaterThan(0);
      expect(spec.spinMin ?? 0).toBeGreaterThan(0);
      expect(spec.spinMin ?? 0).toBeLessThanOrEqual(spec.spinMax ?? 0);
    }
  });

  it('makes the erratic cube faster and worth more than the grunt', () => {
    expect(erratic.minSpeed).toBeGreaterThan(grunt.minSpeed);
    expect(erratic.score).toBeGreaterThan(grunt.score);
  });

  it('makes the hunter slower than everything else but homing', () => {
    expect(hunter.maxSpeed).toBeLessThan(grunt.minSpeed);
    expect(hunter.maxSpeed).toBeLessThan(erratic.minSpeed);
    expect(hunter.homing).toBeGreaterThan(0);
    expect(hunter.sideOffset).toBeGreaterThan(0);
  });

  it('makes the erratic cube worth the most', () => {
    expect(erratic.score).toBeGreaterThan(hunter.score);
    expect(erratic.score).toBeGreaterThan(grunt.score);
  });
});

describe('asteroids', () => {
  it('has a sensible radius range', () => {
    expect(ASTEROID.minRadius).toBeGreaterThan(0);
    expect(ASTEROID.minRadius).toBeLessThan(ASTEROID.maxRadius);
  });

  it('drifts slower than the slowest enemy so it is dodgeable', () => {
    expect(ASTEROID.maxSpeed).toBeGreaterThan(0);
    expect(ASTEROID.maxSpeed).toBeLessThan(grunt.minSpeed);
  });

  it('spawns less often than enemies', () => {
    expect(ASTEROID_SPAWN.minInterval).toBeGreaterThan(ENEMY_SPAWN.minInterval);
  });

  it('is destructible: has health and a point value', () => {
    expect(ASTEROID.hpPerRadius).toBeGreaterThan(0);
    expect(ASTEROID.scorePerHp).toBeGreaterThan(0);
  });
});

describe('boss', () => {
  it('appears every 5000 points', () => {
    expect(BOSS_EVERY).toBe(5000);
  });

  it('has positive, scaling HP', () => {
    expect(BOSS.baseHp).toBeGreaterThan(0);
    expect(BOSS.hpPerBoss).toBeGreaterThan(0);
    expect(BOSS.score).toBeGreaterThan(0);
  });

  it('fits at its hover position with margin to spare', () => {
    expect(BOSS.hoverMargin + BOSS.size).toBeLessThan(VIEW.width);
  });

  it('escalates its attack each time', () => {
    expect(BOSS.minFireInterval).toBeGreaterThan(0);
    expect(BOSS.minFireInterval).toBeLessThan(BOSS.baseFireInterval);
    expect(BOSS.volleyPerBoss).toBeGreaterThan(0);
    expect(BOSS.maxVolley).toBeGreaterThan(BOSS.baseVolley);
    expect(BOSS.projectileSpeedPerBoss).toBeGreaterThan(0);
    expect(BOSS.maxProjectileSpeed).toBeGreaterThan(BOSS.baseProjectileSpeed);
    expect(BOSS.projectileSize).toBeGreaterThan(0);
    expect(BOSS.projectileLife).toBeGreaterThan(0);
  });
});

describe('upgrade caps', () => {
  it('speeds up fire without hitting zero', () => {
    expect(UPGRADE.fireIntervalFactor).toBeLessThan(1);
    expect(UPGRADE.fireIntervalFactor).toBeGreaterThan(0);
    expect(UPGRADE.minFireInterval).toBeGreaterThan(0);
  });

  it('is internally consistent', () => {
    expect(UPGRADE.spreadStep).toBeGreaterThan(0);
    expect(UPGRADE.maxBulletCount).toBeGreaterThanOrEqual(1);
    expect(UPGRADE.damageStep).toBeGreaterThan(0);
    expect(UPGRADE.maxDamage).toBeGreaterThanOrEqual(1);
  });
});