# Geometry Walk

A forward-scrolling shoot 'em up where you pilot a lone cube through an endless
hostile corridor. Built with the same stack as
[`NatTuck/drunk-panda`](https://github.com/NatTuck/drunk-panda): Vite + TypeScript
+ Vitest, rendered with [Excalibur](https://excaliburjs.com).

## Controls

| Action | Keys |
| --- | --- |
| Move the cube | <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> |
| Restart after game over | <kbd>Enter</kbd> |

The cube fires automatically, so movement is the only thing to master. WASD
works as an alias for the arrow keys.

## Rules

- Enemy **triangles** stream in from the right, apex-first, **spinning** as they
  fly. Three kinds show up:
  - **Red grunt triangles** (100 pts) drift left with a gentle, predictable wobble.
  - **Yellow erratic triangles** (250 pts) are smaller, faster, and lurch around
    with a compound wobble plus horizontal jitter — much harder to lead.
  - **Orange hunter triangles** (150 pts) are slow but *home in on you*. Each one
    picks a side and slides toward that flank of the cube, tracking your
    vertical position. They're easy to outrun — keep moving.
- **Grey circle asteroids** drift across the field too. They are indestructible
  obstacles: they **soak up your bullets** and cost you a life on contact, so
  weave around them or wait for a gap. They bounce off the top and bottom edges.
- **Every 5000 points a boss arrives** — a huge spinning purple triangle with a
  health bar. Ordinary enemies and asteroids stop spawning while it's on screen.
  It **fires aimed bursts** of pink projectiles at you (dodge them or take a hit).
- **Each boss is harder than the last:** more HP, and it attacks faster, with
  more projectiles per burst, faster projectiles and a wider spread.
  Chip it down with your bullets and weave through its fire.
- **Defeating a boss grants an upgrade**, cycling through: *Rapid Fire*,
  *Spread Shot* (+2 bullets), *Engine Boost* (faster movement), *Reinforce*
  (+1 life) and *Power Shot* (+1 bullet damage). Each is capped so a run can't
  run away with itself.
- Collision uses each enemy's **actual triangle** (via a separating-axis test),
  not its bounding box, so the empty corners beside the apex are safe to graze.
  The triangle hitbox **rotates with the spin**, so it stays perfectly aligned
  with what you see. Asteroids use an exact circle hitbox (circle-vs-box test).
- Fly into any cube and you lose a life (you get a short window of
  invulnerability afterwards).
- You start with **3 lives**; the spawn rate ramps up the longer you survive.

## Development

```bash
pnpm install     # install dependencies
pnpm dev         # start the Vite dev server
pnpm test        # run the unit tests (Vitest)
pnpm test:watch  # tests in watch mode
pnpm typecheck   # tsc --noEmit
pnpm build       # typecheck + self-contained bundle into dist/
pnpm preview     # serve the production build
```

`pnpm build` emits a **single self-contained `dist/index.html`** (CSS and JS
inlined, no external asset requests), so you can open that one file directly —
double-click it, email it, or open it over `file://` — with no server. The
inlining step lives in `scripts/inline-dist.mjs`; it places the script at the
end of `<body>` so the canvas exists before the engine starts.

## Project layout

```
src/
  main.ts                 engine bootstrap + scene registration
  game/
    config.ts             tuning, layout, palette, enemy archetypes
    logic/                pure, engine-free simulation (unit tested)
      mathx.ts            clamp / AABB overlap / ranged random
      shapes.ts           triangle + circle geometry, SAT / circle-box collision
      player.ts           player state, movement, damage
      enemy.ts            enemy kinds, weighted selection, erratic motion
      asteroid.ts         circular obstacle spawn, drift and edge-bounce
      boss.ts             boss spawn, motion, HP and escalating attack
      projectile.ts       aimed projectile volleys + travel
      upgrades.ts         boss reward pool + effect application
      bullet.ts           volley spawning (spread/damage) + travel
      spawner.ts          time-based, difficulty-ramped spawner
    entities/             Excalibur actors that render logic state
    fx/Starfield.ts       parallax scrolling backdrop
    scenes/GameScene.ts   input, spawning, collisions, scoring
    ui/Hud.ts             DOM overlay (score / lives / game over)
scripts/
  inline-dist.mjs         inlines the build output into one dist/index.html
tests/                    Vitest suites for the pure logic
```

The gameplay simulation lives in `src/game/logic` and has no Excalibur imports,
so it can be tested directly; the actors in `src/game/entities` simply mirror
that state onto the screen each frame.
