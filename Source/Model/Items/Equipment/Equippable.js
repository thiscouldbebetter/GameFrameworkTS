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
            overwriteWith(other) {
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Equippable = Equippable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
