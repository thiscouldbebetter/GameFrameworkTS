"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Item {
            constructor(defnName, quantity) {
                this.defnName = defnName;
                this.quantity = (quantity == null) ? 1 : quantity;
            }
            static fromDefnName(defnName) {
                return new Item(defnName, 1);
            }
            static fromEntity(entity) {
                return entity.propertyByName(Item.name);
            }
            belongsToCategory(category, world) {
                return this.defn(world).belongsToCategory(category);
            }
            belongsToCategoryWithName(categoryName, world) {
                return this.defn(world).belongsToCategoryWithName(categoryName);
            }
            defn(world) {
                return world.defn.itemDefnByName(this.defnName);
            }
            encumbrance(world) {
                return this.quantity * this.defn(world).encumbrance;
            }
            isUsable(world) {
                return (this.defn(world).use != null);
            }
            quantityAdd(increment) {
                return this.quantitySet(this.quantity + increment);
            }
            quantityClear() {
                return this.quantitySet(0);
            }
            quantitySet(value) {
                this.quantity = value;
                return this;
            }
            quantitySubtract(decrement) {
                if (this.quantity < decrement) {
                    throw new Error("Cannot subtract more than total quantity of item '" + this.defnName + "'.");
                }
                return this.quantitySet(this.quantity - decrement);
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
                var itemAsEntity = this.toEntity(uwpe);
                uwpe.entity2Set(itemAsEntity);
                var defn = this.defn(uwpe.world);
                defn.use(uwpe);
            }
            // Clonable.
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
            propertyName() { return Item.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Item = Item;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
