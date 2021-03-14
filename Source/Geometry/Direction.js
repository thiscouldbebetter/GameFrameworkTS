"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Direction {
            static Instances() {
                if (Direction._instances == null) {
                    Direction._instances = new Direction_Instances();
                }
                return Direction._instances;
            }
        }
        GameFramework.Direction = Direction;
        class Direction_Instances {
            constructor() {
                this.E = new GameFramework.Coords(1, 0, 0);
                this.N = new GameFramework.Coords(0, -1, 0);
                this.NE = new GameFramework.Coords(1, -1, 0);
                this.NW = new GameFramework.Coords(-1, -1, 0);
                this.S = new GameFramework.Coords(0, 1, 0);
                this.SE = new GameFramework.Coords(1, 1, 0);
                this.SW = new GameFramework.Coords(-1, 1, 0);
                this.W = new GameFramework.Coords(-1, 0, 0);
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
        GameFramework.Direction_Instances = Direction_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
