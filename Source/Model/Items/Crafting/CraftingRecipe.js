"use strict";
class CraftingRecipe {
    constructor(name, ticksToComplete, itemsIn, itemEntitiesOut) {
        this.name = name;
        this.ticksToComplete = ticksToComplete;
        this.itemsIn = itemsIn;
        this.itemEntitiesOut = itemEntitiesOut;
    }
    isFulfilledByItemHolder(itemHolderStaged) {
        var itemEntitiesStaged = itemHolderStaged.itemEntities;
        var areAllRequirementsFulfilledSoFar = true;
        for (var i = 0; i < this.itemsIn.length; i++) {
            var itemRequired = this.itemsIn[i];
            var itemEntityStaged = itemEntitiesStaged.filter(x => x.item().defnName == itemRequired.defnName)[0];
            var isRequirementFulfilled = (itemEntityStaged != null && itemEntityStaged.item().quantity >= itemRequired.quantity);
            if (isRequirementFulfilled == false) {
                areAllRequirementsFulfilledSoFar = false;
                break;
            }
        }
        return areAllRequirementsFulfilledSoFar;
    }
    itemsInHeldOverRequiredForItemHolder(itemHolder) {
        return this.itemsIn.map(x => x.defnName + " (" + itemHolder.itemQuantityByDefnName(x.defnName) + "/" + x.quantity + ")");
    }
    ;
    nameAndSecondsToCompleteAsString(universe) {
        return this.name + " (" + this.secondsToComplete(universe) + "s)";
    }
    secondsToComplete(universe) {
        return (this.ticksToComplete / universe.timerHelper.ticksPerSecond);
    }
    // Cloneable.
    clone() {
        return new CraftingRecipe(this.name, this.ticksToComplete, ArrayHelper.clone(this.itemsIn), ArrayHelper.clone(this.itemEntitiesOut));
    }
}
