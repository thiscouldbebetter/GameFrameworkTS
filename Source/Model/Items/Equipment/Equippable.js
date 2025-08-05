"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Equippable extends GameFramework.EntityPropertyBase {
            constructor(equip, unequip) {
                super();
                this._equip = equip;
                this._unequip = unequip;
                this.isEquipped = false;
            }
            static default() {
                return new Equippable(null, null);
            }
            static of(entity) {
                return entity.propertyByName(Equippable.name);
            }
            equip(uwpe) {
                if (this._equip != null) {
                    this._equip(uwpe);
                }
                this.isEquipped = true;
            }
            unequip(uwpe) {
                if (this._unequip != null) {
                    this._unequip(uwpe);
                }
                this.isEquipped = false;
            }
            // Clonable.
            clone() {
                return this;
            }
        }
        GameFramework.Equippable = Equippable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
