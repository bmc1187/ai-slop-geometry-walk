import { Actor, Circle, Color, Vector } from 'excalibur';
import { COLORS } from '../config';
import type { AsteroidState } from '../logic/asteroid';

const FLASH_COLOR = '#ffffff';

/**
 * A circular asteroid. Uses a centre anchor: the Circle graphic pads itself
 * symmetrically, so its anchor lands on the true centre, and `pos` therefore
 * matches the circular hitbox exactly. Flashes white briefly when a bullet
 * lands a non-fatal hit, so damage reads clearly now that rocks can be shot
 * apart.
 */
export class AsteroidActor extends Actor {
  private readonly normal: Circle;
  private readonly flash: Circle;
  private flashing = false;

  constructor(radius: number) {
    super({
      name: 'asteroid',
      pos: new Vector(0, 0),
      anchor: new Vector(0.5, 0.5),
      z: 7,
    });

    this.normal = new Circle({
      radius,
      color: Color.fromHex(COLORS.asteroidFill),
      strokeColor: Color.fromHex(COLORS.asteroid),
      lineWidth: 3,
    });
    this.flash = new Circle({
      radius,
      color: Color.fromHex(FLASH_COLOR),
      strokeColor: Color.fromHex(FLASH_COLOR),
      lineWidth: 3,
    });

    this.graphics.use(this.normal);
  }

  sync(state: AsteroidState): void {
    this.pos.x = state.x;
    this.pos.y = state.y;

    const flashing = state.hitFlash > 0;
    if (flashing !== this.flashing) {
      this.flashing = flashing;
      this.graphics.use(flashing ? this.flash : this.normal);
    }
  }
}
