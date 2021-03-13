"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
                return new CraftingRecipe(this.name, this.ticksToComplete, GameFramework.ArrayHelper.clone(this.itemsIn), GameFramework.ArrayHelper.clone(this.itemEntitiesOut));
            }
        }
        GameFramework.CraftingRecipe = CraftingRecipe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
