import { Engine } from "./engine";
import { Entity } from "./entity";


export interface Action{
    perform: (engine: Engine, entity: Entity) => void;
}

export abstract class ActionWithDirection implements Action{
    constructor(public dx:number, public dy:number){}
    perform(_engine: Engine, _entity: Entity){}
}
 
export class MovementAction extends ActionWithDirection{


    perform(engine: Engine, entity: Entity){
        const destX = entity.x + this.dx;
        const destY = entity.y + this.dy;

        if (!engine.gameMap.isInBounds(destX, destY)) return;
        if (!engine.gameMap.tiles[destY][destX].walkable) return;
        if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) return;
        entity.move(this.dx, this.dy);
    }
}

export class MeleeAction extends ActionWithDirection {
    perform(engine: Engine, entity: Entity){
        const destX = entity.x + this.dx;
        const destY = entity.y + this.dy;

        const target = engine.gameMap.getBlockingEntityAtLocation(destX, destY);

        if (!target) return;
        console.log(`you kick the ${target.name}`);
    }
}

export class BumpAction extends ActionWithDirection {
    perform(engine: Engine, entity: Entity) {
      const destX = entity.x + this.dx;
      const destY = entity.y + this.dy;
  
      if (engine.gameMap.getBlockingEntityAtLocation(destX, destY)) {
        return new MeleeAction(this.dx, this.dy).perform(engine, entity);
      } else {
        return new MovementAction(this.dx, this.dy).perform(engine, entity);
      }
    }
  }

interface MovementMap{
    [key: string]: Action;
}

const MOVE_KEYS: MovementMap = {
    "w": new BumpAction(0, -1),
    "s": new BumpAction(0, 1),
    "a": new BumpAction(-1, 0),
    "d": new BumpAction(1, 0),
};

export function handleInput(event: KeyboardEvent): Action{
    return MOVE_KEYS[event.key];
}