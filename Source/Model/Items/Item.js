"use strict";
class Item extends EntityProperty //<Item>
 {
    constructor(defnName, quantity) {
        super();
        this.defnName = defnName;
        this.quantity = quantity;
    }
    defn(world) {
        return world.defn.itemDefnsByName().get(this.defnName);
    }
    isUsable(world) {
        return (this.defn(world).use != null);
    }
    mass(world) {
        return this.quantity * this.defn(world).mass;
    }
    toEntity() {
        // todo
        return new Entity(this.defnName, [this]);
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
            returnValue = defn.use(universe, world, place, userEntity, itemEntity, this);
        }
        return returnValue;
    }
    // cloneable
    clone() {
        return new Item(this.defnName, this.quantity);
    }
}
