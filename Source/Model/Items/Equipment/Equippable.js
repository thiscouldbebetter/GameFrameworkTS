"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Equippable {
            constructor(equip, unequip) {
                this._equip = equip;
                this._unequip = unequip;
                this.isEquipped = false;
            }
            static default() {
                return new Equippable(null, null);
            }
            equip(u, w, p, eEquipmentUser, eEquippable) {
                if (this._equip != null) {
                    this._equip(u, w, p, eEquipmentUser, eEquippable);
                }
                this.isEquipped = true;
            }
            unequip(u, w, p, eEquipmentUser, eEquippable) {
                if (this._unequip != null) {
                    this._unequip(u, w, p, eEquipmentUser, eEquippable);
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
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
        }
        GameFramework.Equippable = Equippable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
