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
            }
            // cloneable
            clone() {
                return new MapLocated(this.map, this.loc.clone());
            }
            overwriteWith(other) {
                this.loc.overwriteWith(other.loc);
                return this;
            }
            // translatable
            coordsGroupToTranslate() {
                return [this.loc.pos];
            }
            // Shape.
            locate(loc) {
                return GameFramework.ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
            }
            normalAtPos(posToCheck, normalOut) {
                return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
            toBox(boxOut) { throw ("Not implemented!"); }
        }
        GameFramework.MapLocated = MapLocated;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
