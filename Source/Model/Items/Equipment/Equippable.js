"use strict";
class Equippable {
    constructor(equip) {
        this._equip = equip;
    }
    equip(u, w, p, e) {
        this._equip(u, w, p, e);
    }
    // Clonable.
    clone() {
        return this;
    }
    overwriteWith(other) {
        return this;
    }
}
