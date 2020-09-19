"use strict";
class Direction {
    static Instances() {
        if (Direction._instances == null) {
            Direction._instances = new Direction_Instances();
        }
        return Direction._instances;
    }
}
class Direction_Instances {
    constructor() {
        this.E = new Coords(1, 0, 0);
        this.N = new Coords(0, -1, 0);
        this.NE = new Coords(1, -1, 0);
        this.NW = new Coords(-1, -1, 0);
        this.S = new Coords(0, 1, 0);
        this.SE = new Coords(1, 1, 0);
        this.SW = new Coords(-1, 1, 0);
        this.W = new Coords(-1, 0, 0);
        this._ByHeading =
            [
                this.E,
                this.SE,
                this.S,
                this.SW,
                this.W,
                this.NW,
                this.N,
                this.NE,
            ];
    }
}
