"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemCrafter extends GameFramework.EntityProperty {
            constructor(recipesAvailable) {
                super();
                this.recipesAvailable = recipesAvailable || [];
                this.itemHolderStaged = new GameFramework.ItemHolder([], null, null);
                this.recipeAvailableSelected = null;
                this.recipeInProgressTicksSoFar = 0;
                this.recipeQueuedSelected = null;
                this.recipesQueued = [];
                this.statusMessage = "-";
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
                var itemEntitiesOut = recipe.itemEntitiesOut;
                for (var i = 0; i < itemEntitiesOut.length; i++) {
                    var itemEntityOut = itemEntitiesOut[i];
                    entityCrafter.itemHolder().itemEntityAdd(itemEntityOut);
                }
                this.itemHolderStaged.itemEntities.length = 0;
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
            // venue
            updateForTimerTick(universe, world, place, entityCrafter) {
                if (this.recipesQueued.length > 0) {
                    var recipeInProgress = this.recipesQueued[0];
                    if (this.isRecipeInProgressFulfilled()) {
                        if (this.recipeInProgressTicksSoFar >= recipeInProgress.ticksToComplete) {
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
                this.statusMessage = "Select a recipe and click Craft.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * 0.6;
                var fontHeightLarge = fontHeight * 1.5;
                var itemHolder = entityItemHolder.itemHolder();
                var crafter = this;
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var addToQueue = () => {
                    if (crafter.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder())) {
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
                    new GameFramework.ControlLabel("labelRecipes", new GameFramework.Coords(10, 5, 0), // pos
                    new GameFramework.Coords(70, 25, 0), // size
                    false, // isTextCentered
                    "Recipes:", fontHeightSmall),
                    new GameFramework.ControlList("listRecipes", new GameFramework.Coords(10, 15, 0), // pos
                    new GameFramework.Coords(85, 100, 0), // size
                    new GameFramework.DataBinding(this, (c) => c.recipesAvailable, null), // items
                    new GameFramework.DataBinding(null, (c) => c.name, null), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.recipeAvailableSelected, (c, v) => { c.recipeAvailableSelected = v; }), // bindingForItemSelected
                    new GameFramework.DataBinding(null, (c) => c, null), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    addToQueue, // confirm
                    null),
                    new GameFramework.ControlLabel("labelRecipeSelected", new GameFramework.Coords(105, 5, 0), // pos
                    new GameFramework.Coords(70, 25, 0), // size
                    false, // isTextCentered
                    "Recipe Selected:", fontHeightSmall),
                    new GameFramework.ControlButton("buttonCraft", new GameFramework.Coords(170, 5, 0), // pos
                    new GameFramework.Coords(20, 10, 0), // size
                    "Craft", fontHeightSmall, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => c.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder()), null), // isEnabled
                    addToQueue, // click
                    null, null),
                    new GameFramework.ControlLabel("infoRecipeSelected", new GameFramework.Coords(105, 10, 0), // pos
                    new GameFramework.Coords(75, 25, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => ((c.recipeAvailableSelected == null)
                        ? "-"
                        : c.recipeAvailableSelected.nameAndSecondsToCompleteAsString(universe)), null), fontHeightSmall),
                    new GameFramework.ControlList("listItemsInRecipe", new GameFramework.Coords(105, 20, 0), // pos
                    new GameFramework.Coords(85, 25, 0), // size
                    new GameFramework.DataBinding(this, (c) => (c.recipeAvailableSelected == null
                        ? []
                        : c.recipeAvailableSelected.itemsInHeldOverRequiredForItemHolder(itemHolder)), null), // items
                    new GameFramework.DataBinding(null, (c) => c, null), // bindingForItemText
                    fontHeightSmall, null, // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    null, null, null),
                    new GameFramework.ControlLabel("labelCrafting", new GameFramework.Coords(105, 50, 0), // pos
                    new GameFramework.Coords(75, 25, 0), // size
                    false, // isTextCentered
                    GameFramework.DataBinding.fromContext("Crafting:"), fontHeightSmall),
                    new GameFramework.ControlButton("buttonCancel", new GameFramework.Coords(170, 50, 0), // pos
                    new GameFramework.Coords(20, 10, 0), // size
                    "Cancel", fontHeightSmall, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => (c.recipesQueued.length > 0), null), // isEnabled
                    crafter.recipeInProgressCancel, // click
                    null, null),
                    new GameFramework.ControlLabel("infoCrafting", new GameFramework.Coords(105, 55, 0), // pos
                    new GameFramework.Coords(75, 25, 0), // size
                    false, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => (c.recipeProgressAsString(universe)), null), fontHeightSmall),
                    new GameFramework.ControlList("listCraftingsQueued", new GameFramework.Coords(105, 65, 0), // pos
                    new GameFramework.Coords(85, 35, 0), // size
                    new GameFramework.DataBinding(this, (c) => c.recipesQueued, null), // items
                    new GameFramework.DataBinding(null, (c) => c.name, null), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.recipeQueuedSelected, (c, v) => { c.recipeQueuedSelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    null, null, null),
                    new GameFramework.ControlLabel("infoStatus", new GameFramework.Coords(100, 125, 0), // pos
                    new GameFramework.Coords(200, 15, 0), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => c.statusMessage, null), // text
                    fontHeightSmall)
                ], // end children
                [
                    new GameFramework.Action("Back", back),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                ]);
                if (includeTitleAndDoneButton) {
                    returnValue.children.splice(0, 0, new GameFramework.ControlLabel("labelCrafting", new GameFramework.Coords(100, -5, 0), // pos
                    new GameFramework.Coords(100, 25, 0), // size
                    true, // isTextCentered
                    "Craft", fontHeightLarge));
                    returnValue.children.push(new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(170, 115, 0), // pos
                    new GameFramework.Coords(20, 10, 0), // size
                    "Done", fontHeightSmall, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null));
                    var titleHeight = new GameFramework.Coords(0, 15, 0);
                    sizeBase.add(titleHeight);
                    returnValue.size.add(titleHeight);
                    returnValue.shiftChildPositions(titleHeight);
                }
                var scaleMultiplier = size.clone().divide(sizeBase);
                returnValue.scalePosAndSize(scaleMultiplier);
                return returnValue;
            }
            // cloneable
            clone() {
                return new ItemCrafter(GameFramework.ArrayHelper.clone(this.recipesAvailable));
            }
        }
        GameFramework.ItemCrafter = ItemCrafter;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
