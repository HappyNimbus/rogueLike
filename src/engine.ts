import * as ROT from 'rot-js';
import { GameMap } from './game-map';
import { handleInput} from './input-handler';
import { Entity } from './entity';
import { generateDungeon } from './procgen';

export class Engine {
  public static readonly WIDTH = 80;
  public static readonly HEIGHT = 50;

  public static readonly MAP_WIDTH = 80;
  public static readonly MAP_HEIGHT = 45;  
  public static readonly MIN_ROOM_SIZE = 6;
  public static readonly MAX_ROOM_SIZE = 10;
  public static readonly MAX_ROOMS = 30;

  display: ROT.Display;

  gameMap: GameMap;

  player: Entity;
  entities: Entity[];

  constructor(entities: Entity[], player: Entity) {
    this.entities = entities;
    this.player = player;

    this.display = new ROT.Display({
      width: Engine.WIDTH,
      height: Engine.HEIGHT,
      forceSquareRatio: true,
    });

    this.gameMap = generateDungeon(
        Engine.MAP_WIDTH,
        Engine.MAP_HEIGHT,
        Engine.MAX_ROOMS,
        Engine.MIN_ROOM_SIZE,
        Engine.MAX_ROOM_SIZE,
        player,
        this.display,
    )
    const container = this.display.getContainer()!;
    document.body.appendChild(container);

    window.addEventListener('keydown', (event) => {
      this.update(event);
    });

    this.render();
  }

  update(event: KeyboardEvent) {
    this.display.clear();
    const action = handleInput(event);

    if (action){
        action.perform(this, this.player);
    }

    this.render();
  }

  render() {
    this.gameMap.render();
    this.entities.forEach((e) => {
      this.display.draw(e.x, e.y, e.char, e.fg, e.bg);
    });
  }
}