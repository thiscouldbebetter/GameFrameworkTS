"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CraftingRecipe {
            constructor(name, ticksToComplete, itemsIn, itemsOut) {
                this.name = name;
                this.ticksToComplete = ticksToComplete;
                this.itemsIn = itemsIn;
                this.itemsOut = itemsOut;
            }
            static fromItemsInAndItemOut(itemsIn, itemOut) {
                return new CraftingRecipe(itemOut.defnName, 0, // ticksToComplete
                itemsIn, [itemOut]);
            }
            isFulfilledByItemHolder(itemHolderStaged) {
                var itemsStaged = itemHolderStaged.items;
                var areAllRequirementsFulfilledSoFar = true;
                for (var i = 0; i < this.itemsIn.length; i++) {
                    var itemRequired = this.itemsIn[i];
                    var itemStaged = itemsStaged.filter(x => x.defnName == itemRequired.defnName)[0];
                    var isRequirementFulfilled = (itemStaged != null
                        && itemStaged.quantity >= itemRequired.quantity);
                    if (isRequirementFulfilled == false) {
                        areAllRequirementsFulfilledSoFar = false;
                        break;
                    }
                }
                return areAllRequirementsFulfilledSoFar;
            }
            nameAndSecondsToCompleteAsString(universe) {
                return this.name + " (" + this.secondsToComplete(universe) + "s)";
            }
            secondsToComplete(universe) {
                return (this.ticksToComplete / universe.timerHelper.ticksPerSecond);
            }
            // Cloneable.
            clone() {
                return new CraftingRecipe(this.name, this.ticksToComplete, GameFramework.ArrayHelper.clone(this.itemsIn), GameFramework.ArrayHelper.clone(this.itemsOut));
            }
            overwriteWith(other) {
                this.name = other.name;
                this.ticksToComplete = other.ticksToComplete;
                GameFramework.ArrayHelper.overwriteWith(this.itemsIn, other.itemsIn);
                GameFramework.ArrayHelper.overwriteWith(this.itemsOut, other.itemsOut);
                return this;
            }
        }
        GameFramework.CraftingRecipe = CraftingRecipe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
