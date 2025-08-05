"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemCrafter extends GameFramework.EntityPropertyBase {
            constructor(recipesAvailable) {
                super();
                this.recipesAvailable = recipesAvailable || [];
                this.itemHolderStaged = GameFramework.ItemHolder.create();
                this.recipeAvailableSelected = null;
                this.recipeInProgressTicksSoFar = 0;
                this.recipeQueuedSelected = null;
                this.recipesQueued = [];
                this.statusMessage = "-";
            }
            static fromRecipesAvailable(recipesAvailable) {
                return new ItemCrafter(recipesAvailable);
            }
            static of(entity) {
                return entity.propertyByName(ItemCrafter.name);
            }
            isRecipeAvailableSelectedFulfilled(itemHolder) {
                var returnValue = (this.recipeAvailableSelected == null
                    ? false
                    : this.recipeAvailableSelected.isFulfilledByItemHolder(itemHolder));
                return returnValue;
            }
            isRecipeInProgressFulfilled() {
                var recipeInProgress = this.recipesQueued[0];
                var returnValue = (recipeInProgress == null
                    ? false
                    : recipeInProgress.isFulfilledByItemHolder(this.itemHolderStaged));
                return returnValue;
            }
            recipeInProgressCancel() {
                // todo
            }
            recipeInProgressSecondsSoFar(universe) {
                return this.recipeInProgressTicksSoFar / universe.timerHelper.ticksPerSecond;
            }
            recipeInProgressFinish(entityCrafter) {
                var recipe = this.recipesQueued[0];
                var itemsOut = recipe.itemsOut;
                for (var i = 0; i < itemsOut.length; i++) {
                    var itemOut = itemsOut[i];
                    GameFramework.ItemHolder.of(entityCrafter).itemAdd(itemOut);
                }
                this.itemHolderStaged.items.length = 0;
                this.recipeInProgressTicksSoFar = 0;
                this.recipesQueued.splice(0, 1);
            }
            recipeProgressAsString(universe) {
                var returnValue = null;
                var recipeInProgress = this.recipesQueued[0];
                if (recipeInProgress == null) {
                    returnValue = "-";
                }
                else {
                    returnValue =
                        recipeInProgress.name
                            + " ("
                            + this.recipeInProgressSecondsSoFar(universe)
                            + "/"
                            + recipeInProgress.secondsToComplete(universe)
                            + "s)";
                }
                return returnValue;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ItemCrafter.name; }
            updateForTimerTick(uwpe) {
                if (this.recipesQueued.length > 0) {
                    var recipeInProgress = this.recipesQueued[0];
                    if (this.isRecipeInProgressFulfilled()) {
                        if (this.recipeInProgressTicksSoFar >= recipeInProgress.ticksToComplete) {
                            var entityCrafter = uwpe.entity;
                            this.recipeInProgressFinish(entityCrafter);
                        }
                        else {
                            this.recipeInProgressTicksSoFar++;
                        }
                    }
                    else {
                        this.recipeInProgressTicksSoFar = 0;
                        this.recipesQueued.splice(0, 1);
                    }
                }
            }
            // controls
            toControl(universe, size, entityCrafter, entityItemHolder, venuePrev, includeTitleAndDoneButton) {
                var itemCrafter = this;
                this.statusMessage = "Select a recipe and click Craft.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * 0.6;
                var fontSmall = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
                var fontHeightLarge = fontHeight * 1.5;
                var fontLarge = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightLarge);
                var itemHolder = GameFramework.ItemHolder.of(entityItemHolder);
                var crafter = this;
                var back = () => universe.venueTransitionTo(venuePrev);
                var addToQueue = () => {
                    if (crafter.isRecipeAvailableSelectedFulfilled(GameFramework.ItemHolder.of(entityCrafter))) {
                        var recipe = crafter.recipeAvailableSelected;
                        var itemsIn = recipe.itemsIn;
                        for (var i = 0; i < itemsIn.length; i++) {
                            var itemIn = itemsIn[i];
                            itemHolder.itemTransferTo(itemIn, this.itemHolderStaged);
                        }
                        crafter.recipesQueued.push(crafter.recipeAvailableSelected);
                    }
                };
                var returnValue = new GameFramework.ControlContainer("Craft", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    GameFramework.DataBinding.fromContext("Recipes:"), fontSmall),
                    new GameFramework.ControlList("listRecipes", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(85, 100), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.recipesAvailable), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontSmall, new GameFramework.DataBinding(this, (c) => c.recipeAvailableSelected, (c, v) => c.recipeAvailableSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    addToQueue, // confirm
                    null),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    GameFramework.DataBinding.fromContext("Recipe Selected:"), fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 5), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Craft", fontSmall, addToQueue).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => c.isRecipeAvailableSelectedFulfilled(GameFramework.ItemHolder.of(entityCrafter))) // isEnabled
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 10), // pos
                    GameFramework.Coords.fromXY(75, 25), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => ((c.recipeAvailableSelected == null)
                        ? "-"
                        : c.recipeAvailableSelected.nameAndSecondsToCompleteAsString(universe))), fontSmall),
                    GameFramework.ControlList.fromNamePosSizeItemsTextFontSelectedValue("listItemsInRecipe", GameFramework.Coords.fromXY(105, 20), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.recipeAvailableSelected == null
                        ? []
                        : c.recipeAvailableSelected.itemsIn)), // items
                    GameFramework.DataBinding.fromGet((c) => {
                        var recipe = itemCrafter.recipeAvailableSelected;
                        var itemInAsString = "(" + c.quantity + "/"
                            + recipe.itemsIn.find(x => x.defnName == c.defnName).quantity
                            + ")";
                        return itemInAsString;
                    }), // bindingForItemText
                    fontSmall, null, // bindingForItemSelected
                    null // bindingForItemValue
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 50), // pos
                    GameFramework.Coords.fromXY(75, 25), // size
                    GameFramework.DataBinding.fromContext("Crafting:"), fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 50), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Cancel", fontSmall, crafter.recipeInProgressCancel // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.recipesQueued.length > 0)) // isEnabled
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(105, 55), // pos
                    GameFramework.Coords.fromXY(75, 25), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.recipeProgressAsString(universe)), fontSmall),
                    GameFramework.ControlList.fromNamePosSizeItemsTextFontSelectedValue("listCraftingsQueued", GameFramework.Coords.fromXY(105, 65), // pos
                    GameFramework.Coords.fromXY(85, 35), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.recipesQueued), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontSmall, new GameFramework.DataBinding(this, (c) => c.recipeQueuedSelected, (c, v) => c.recipeQueuedSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c) // bindingForItemValue
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, 125), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontSmall)
                ], // end children
                [
                    new GameFramework.Action("Back", back),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true),
                ]);
                if (includeTitleAndDoneButton) {
                    returnValue.children.splice(0, 0, GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContext("Craft"), fontLarge));
                    returnValue.children.push(GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 115), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Done", fontSmall, back // click
                    ));
                    var titleHeight = GameFramework.Coords.fromXY(0, 15);
                    sizeBase.add(titleHeight);
                    returnValue.size.add(titleHeight);
                    returnValue.shiftChildPositions(titleHeight);
                }
                var scaleMultiplier = size.clone().divide(sizeBase);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            // Clonable.
            clone() {
                return new ItemCrafter(GameFramework.ArrayHelper.clone(this.recipesAvailable));
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.ItemCrafter = ItemCrafter;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
