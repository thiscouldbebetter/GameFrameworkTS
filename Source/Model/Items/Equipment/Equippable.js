"use strict";
class Equippable extends EntityProperty {
    constructor(equip, unequip) {
        super();
        this._equip = equip;
        this._unequip = unequip;
        this.isEquipped = false;
    }
    equip(u, w, p, e) {
        if (this._equip != null) {
            this._equip(u, w, p, e);
        }
        this.isEquipped = true;
    }
    unequip(u, w, p, e) {
        if (this._unequip != null) {
            this._unequip(u, w, p, e);
        }
        this.isEquipped = false;
    }
    // Clonable.
    clone() {
        return this;
    }
    overwriteWith(other) {
        return this;
    }
}
