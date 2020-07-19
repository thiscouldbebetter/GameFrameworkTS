"use strict";
class EquipmentSocket {
    constructor(defnName, itemEntityEquipped) {
        this.defnName = defnName;
        this.itemEntityEquipped = itemEntityEquipped;
    }
    defn(defnGroup) {
        return defnGroup.socketDefnsByName.get(this.defnName);
    }
    ;
    toString(world) {
        var itemEntityEquippedAsString = (this.itemEntityEquipped == null
            ? " [empty] "
            : this.itemEntityEquipped.item().toString(world));
        var returnValue = this.defnName + ": " + itemEntityEquippedAsString;
        return returnValue;
    }
    ;
}
