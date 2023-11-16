import { Engine } from "./engine";
import { Entity } from "./entity";


export interface Action{
    perform: (engine: Engine, entity: Entity) => void;
}

export class MovementAction implements Action{
    //character movement 
    dx: number;
    dy: number;

    constructor(dx: number, dy: number){
        this.dx = dx;
        this.dy = dy;
    }

    perform(engine: Engine, entity: Entity){
        const destX = entity.x + this.dx;
        const destY = entity.y + this.dy;

        if (!engine.gameMap.isInBounds(destX, destY)) return;
        if (!engine.gameMap.tiles[destY][destX].walkable) return;
        entity.move(this.dx, this.dy);
    }
}

interface MovementMap{
    [key: string]: Action;
}


const MOVE_KEYS: MovementMap = {
    "w": new MovementAction(0, -1),
    "s": new MovementAction(0, 1),
    "a": new MovementAction(-1, 0),
    "d": new MovementAction(1, 0),
};

export function handleInput(event: KeyboardEvent): Action{
    return MOVE_KEYS[event.key];
}