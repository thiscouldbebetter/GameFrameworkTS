"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapLocated {
            constructor(map, loc) {
                this.map = map;
                this.loc = loc;
                this.box = new GameFramework.Box(this.loc.pos, this.map.size);
                // Helper variables.
                this._boxTransformed = GameFramework.Box.create();
            }
            static fromMap(map) {
                return new MapLocated(map, GameFramework.Disposition.default());
            }
            cellsInBox(box, cellsInBox) {
                var boxTransformed = this._boxTransformed.overwriteWith(box);
                boxTransformed.center.subtract(this.loc.pos).add(this.map.sizeHalf);
                var returnCells = this.map.cellsInBox(boxTransformed, cellsInBox);
                return returnCells;
            }
            // cloneable
            clone() {
                return new MapLocated(this.map, this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // translatable
            coordsGroupToTranslate() {
                return [this.loc.pos];
            }
            // ShapeBase.
            collider() { return null; }
            locate(loc) {
                return GameFramework.ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
            }
            normalAtPos(posToCheck, normalOut) {
                return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
            }
            pointRandom(randomizer) {
                return null; // todo
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBox(boxOut) { throw new Error("Not implemented!"); }
            // Transformable.
            transform(transformToApply) {
                throw new Error("Not implemented!");
            }
        }
        GameFramework.MapLocated = MapLocated;
        class MapLocated2 extends MapLocated {
            // hack - To allow different collision calculations.
            constructor(map, loc) {
                super(map, loc);
            }
            static fromMap(map) {
                return new MapLocated2(map, GameFramework.Disposition.default());
            }
            // Cloneable.
            clone() {
                return new MapLocated2(this.map, this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
        }
        GameFramework.MapLocated2 = MapLocated2;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
