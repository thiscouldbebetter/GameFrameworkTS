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
            toEntity(u, w, p, e) {
                if (this._entity == null) {
                    var defn = this.defn(w);
                    this._entity = defn.toEntity(u, w, p, e, this);
                }
                return this._entity;
            }
            toString(world) {
                return this.defn(world).appearance + " (" + this.quantity + ")";
            }
            tradeValue(world) {
                return this.quantity * this.defn(world).tradeValue;
            }
            use(universe, world, place, userEntity, itemEntity) {
                var returnValue = null;
                var defn = this.defn(world);
                if (defn.use != null) {
                    returnValue = defn.use(universe, world, place, userEntity, itemEntity);
                }
                return returnValue;
            }
            // cloneable
            clone() {
                return new Item(this.defnName, this.quantity);
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
        }
        GameFramework.Item = Item;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
