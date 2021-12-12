"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemCrafter {
            constructor(recipesAvailable) {
                this.recipesAvailable = recipesAvailable || [];
                this.itemHolderStaged = GameFramework.ItemHolder.create();
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
                var itemsOut = recipe.itemsOut;
                for (var i = 0; i < itemsOut.length; i++) {
                    var itemOut = itemsOut[i];
                    entityCrafter.itemHolder().itemAdd(itemOut);
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
                var back = () => universe.venueTransitionTo(venuePrev);
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
                    new GameFramework.ControlLabel("labelRecipes", GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    false, // isTextCentered
                    GameFramework.DataBinding.fromContext("Recipes:"), fontHeightSmall),
                    new GameFramework.ControlList("listRecipes", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(85, 100), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.recipesAvailable), // items
                    GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.recipeAvailableSelected, (c, v) => c.recipeAvailableSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    addToQueue, // confirm
                    null),
                    /*
                    new ControlLabel
                    (
                        "labelRecipeSelected",
                        Coords.fromXY(105, 5), // pos
                        Coords.fromXY(70, 25), // size
                        false, // isTextCentered
                        DataBinding.fromContext("Recipe Selected:"),
                        fontHeightSmall
                    ),
    
                    new ControlButton
                    (
                        "buttonCraft",
                        Coords.fromXY(170, 5), // pos
                        Coords.fromXY(20, 10), // size
                        "Craft",
                        fontHeightSmall,
                        true, // hasBorder
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) =>
                                c.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder())
                        ), // isEnabled
                        addToQueue, // click
                        null, null
                    ),
    
                    new ControlLabel
                    (
                        "infoRecipeSelected",
                        Coords.fromXY(105, 10), // pos
                        Coords.fromXY(75, 25), // size
                        false, // isTextCentered
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) =>
                                (
                                    (c.recipeAvailableSelected == null)
                                    ? "-"
                                    : c.recipeAvailableSelected.nameAndSecondsToCompleteAsString(universe)
                                )
                        ),
                        fontHeightSmall
                    ),
    
                    ControlList.from8
                    (
                        "listItemsInRecipe",
                        Coords.fromXY(105, 20), // pos
                        Coords.fromXY(85, 25), // size
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) =>
                                (
                                    c.recipeAvailableSelected == null
                                    ? []
                                    : c.recipeAvailableSelected.itemsInHeldOverRequiredForItemHolder(itemHolder)
                                )
                        ), // items
                        DataBinding.fromGet
                        (
                            (c: string) => c
                        ), // bindingForItemText
                        fontHeightSmall,
                        null, // bindingForItemSelected
                        DataBinding.fromGet( (c: Entity) => c ) // bindingForItemValue
                    ),
    
                    new ControlLabel
                    (
                        "labelCrafting",
                        Coords.fromXY(105, 50), // pos
                        Coords.fromXY(75, 25), // size
                        false, // isTextCentered
                        DataBinding.fromContext("Crafting:"),
                        fontHeightSmall
                    ),
    
                    ControlButton.from8
                    (
                        "buttonCancel",
                        Coords.fromXY(170, 50), // pos
                        Coords.fromXY(20, 10), // size
                        "Cancel",
                        fontHeightSmall,
                        true, // hasBorder
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) => (c.recipesQueued.length > 0)
                        ), // isEnabled
                        crafter.recipeInProgressCancel // click
                    ),
    
                    new ControlLabel
                    (
                        "infoCrafting",
                        Coords.fromXY(105, 55), // pos
                        Coords.fromXY(75, 25), // size
                        false, // isTextCentered
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) => c.recipeProgressAsString(universe)
                        ),
                        fontHeightSmall
                    ),
    
                    ControlList.from8
                    (
                        "listCraftingsQueued",
                        Coords.fromXY(105, 65), // pos
                        Coords.fromXY(85, 35), // size
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) => c.recipesQueued
                        ), // items
                        DataBinding.fromGet
                        (
                            (c: CraftingRecipe) => c.name
                        ), // bindingForItemText
                        fontHeightSmall,
                        new DataBinding
                        (
                            this,
                            (c: ItemCrafter) => c.recipeQueuedSelected,
                            (c: ItemCrafter, v: CraftingRecipe) =>
                                c.recipeQueuedSelected = v
                        ), // bindingForItemSelected
                        DataBinding.fromGet( (c: Entity) => c ) // bindingForItemValue
                    ),
    
                    new ControlLabel
                    (
                        "infoStatus",
                        Coords.fromXY(100, 125), // pos
                        Coords.fromXY(200, 15), // size
                        true, // isTextCentered
                        DataBinding.fromContextAndGet
                        (
                            this,
                            (c: ItemCrafter) => c.statusMessage
                        ), // text
                        fontHeightSmall
                    )
                    */
                ], // end children
                [
                    new GameFramework.Action("Back", back),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                ]);
                if (includeTitleAndDoneButton) {
                    returnValue.children.splice(0, 0, new GameFramework.ControlLabel("labelCrafting", GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContext("Craft"), fontHeightLarge));
                    returnValue.children.push(GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(170, 115), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Done", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    back // click
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
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.ItemCrafter = ItemCrafter;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
