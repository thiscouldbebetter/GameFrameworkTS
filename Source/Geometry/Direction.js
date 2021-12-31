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
                this.East = GameFramework.Coords.fromXY(1, 0);
                this.North = GameFramework.Coords.fromXY(0, -1);
                this.Northeast = GameFramework.Coords.fromXY(1, -1);
                this.Northwest = GameFramework.Coords.fromXY(-1, -1);
                this.South = GameFramework.Coords.fromXY(0, 1);
                this.Southeast = GameFramework.Coords.fromXY(1, 1);
                this.Southwest = GameFramework.Coords.fromXY(-1, 1);
                this.West = GameFramework.Coords.fromXY(-1, 0);
                this._ByHeading =
                    [
                        this.East,
                        this.Southeast,
                        this.South,
                        this.Southwest,
                        this.West,
                        this.Northwest,
                        this.North,
                        this.Northeast
                    ];
            }
        }
        GameFramework.Direction_Instances = Direction_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
