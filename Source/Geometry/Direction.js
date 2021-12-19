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
                this.E = GameFramework.Coords.fromXY(1, 0);
                this.N = GameFramework.Coords.fromXY(0, -1);
                this.NE = GameFramework.Coords.fromXY(1, -1);
                this.NW = GameFramework.Coords.fromXY(-1, -1);
                this.S = GameFramework.Coords.fromXY(0, 1);
                this.SE = GameFramework.Coords.fromXY(1, 1);
                this.SW = GameFramework.Coords.fromXY(-1, 1);
                this.W = GameFramework.Coords.fromXY(-1, 0);
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
