"use strict";
class MapLocated {
    constructor(map, loc) {
        this.map = map;
        this.loc = loc;
        this.box = new Box(this.loc.pos, this.map.size);
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
    normalAtPos(posToCheck, normalOut) {
        return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
    }
}
