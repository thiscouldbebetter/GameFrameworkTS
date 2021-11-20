"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Item {
            constructor(defnName, quantity) {
                this.defnName = defnName;
                this.quantity = quantity;
            }
            defn(world) {
                return world.defn.itemDefnByName(this.defnName);
            }
            isUsable(world) {
                return (this.defn(world).use != null);
            }
            mass(world) {
                return this.quantity * this.defn(world).mass;
            }
            toEntity(uwpe) {
                if (this._entity == null) {
                    var defn = this.defn(uwpe.world);
                    this._entity = defn.toEntity(uwpe, this);
                }
                return this._entity;
            }
            toString(world) {
                return this.defn(world).appearance + " (" + this.quantity + ")";
            }
            tradeValue(world) {
                return this.quantity * this.defn(world).tradeValue;
            }
            use(uwpe) {
                uwpe.entity2 = this.toEntity(uwpe);
                var defn = this.defn(uwpe.world);
                defn.use(uwpe);
            }
            // cloneable
            clone() {
                return new Item(this.defnName, this.quantity);
            }
            overwriteWith(other) {
                this.defnName = other.defnName;
                this.quantity = other.quantity;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Item = Item;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
