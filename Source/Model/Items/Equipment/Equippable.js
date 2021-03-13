"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Equippable extends GameFramework.EntityProperty {
            constructor(equip, unequip) {
                super();
                this._equip = equip;
                this._unequip = unequip;
                this.isEquipped = false;
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
        }
        GameFramework.Equippable = Equippable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
