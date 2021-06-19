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
                var returnValue = null;
                var defn = this.defn(uwpe.world);
                if (defn.use != null) {
                    returnValue = defn.use(uwpe);
                }
                return returnValue;
            }
            // cloneable
            clone() {
                return new Item(this.defnName, this.quantity);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Item = Item;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
