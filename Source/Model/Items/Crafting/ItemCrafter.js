"use strict";
class ItemCrafter {
    constructor(recipes) {
        this.recipes = recipes || [];
        this.recipeSelected = null;
        this.itemEntitiesStaged = [];
        this.statusMessage = "-";
    }
    isRecipeSelectedFulfilled() {
        var returnValue = (this.recipeSelected == null
            ? false
            : this.recipeSelected.isFulfilledByItemEntities(this.itemEntitiesStaged));
        return returnValue;
    }
    ;
    // controls
    toControl(universe, size, entityItemHolder, venuePrev, includeTitleAndDoneButton) {
        this.statusMessage = "1. Select recipe.\n2. Stage materials.\n3.Click Combine.";
        if (size == null) {
            size = universe.display.sizeDefault().clone();
        }
        var sizeBase = new Coords(200, 150, 1);
        var fontHeight = 10;
        var fontHeightSmall = fontHeight * .6;
        var fontHeightLarge = fontHeight * 1.5;
        var itemHolder = entityItemHolder.itemHolder();
        var itemEntities = itemHolder.itemEntities;
        var crafter = this;
        var world = universe.world;
        var back = () => {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var stage = () => {
            var itemEntityToStage = crafter.itemEntitySelected;
            if (itemEntityToStage != null) {
                var itemEntitiesStaged = crafter.itemEntitiesStaged;
                if (itemEntitiesStaged.indexOf(itemEntityToStage) == -1) {
                    itemEntitiesStaged.push(itemEntityToStage);
                }
            }
        };
        var unstage = () => {
            var itemEntityToUnstage = crafter.itemEntityStagedSelected;
            if (itemEntityToUnstage != null) {
                var itemEntitiesStaged = crafter.itemEntitiesStaged;
                if (itemEntitiesStaged.some(x => x == itemEntityToUnstage)) {
                    ArrayHelper.remove(itemEntitiesStaged, itemEntityToUnstage);
                }
            }
        };
        var combine = () => {
            var recipe = crafter.recipeSelected;
            var itemsIn = recipe.itemsIn;
            for (var i = 0; i < itemsIn.length; i++) {
                var itemIn = itemsIn[i];
                itemHolder.itemSubtract(itemIn);
            }
            var itemEntitiesOut = recipe.itemEntitiesOut;
            for (var i = 0; i < itemEntitiesOut.length; i++) {
                var itemEntityOut = itemEntitiesOut[i];
                itemHolder.itemEntityAdd(itemEntityOut);
            }
            crafter.itemEntitiesStaged.length = 0;
        };
        var returnValue = new ControlContainer("Craft", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        // children
        [
            new ControlLabel("labelMaterials", new Coords(10, 5, 0), // pos
            new Coords(70, 25, 0), // size
            false, // isTextCentered
            "Materials Held:", fontHeightSmall),
            new ControlList("listItemsHeld", new Coords(10, 15, 0), // pos
            new Coords(80, 110, 0), // size
            new DataBinding(itemEntities, null, null), // items
            new DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
            fontHeightSmall, new DataBinding(this, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromContext(true), // isEnabled
            (universe) => {
                stage();
            }, null),
            new ControlButton("buttonStage", new Coords(95, 65, 0), // pos
            new Coords(10, 10, 0), // size
            ">", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var returnValue = (c.itemEntitySelected != null
                    && c.itemEntitiesStaged.indexOf(c.itemEntitySelected) == -1);
                return returnValue;
            }, null), // isEnabled
            stage, // click
            null, null),
            new ControlButton("buttonUnstage", new Coords(95, 80, 0), // pos
            new Coords(10, 10, 0), // size
            "<", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                return (c.itemEntityStagedSelected != null);
            }, null), // isEnabled
            unstage, // click
            null, null),
            new ControlLabel("labelRecipe", new Coords(110, 5, 0), // pos
            new Coords(70, 25, 0), // size
            false, // isTextCentered
            "Recipe:", fontHeightSmall),
            new ControlSelect("selectRecipe", new Coords(110, 15, 0), // pos
            new Coords(80, 10, 0), // size
            new DataBinding(this, (c) => c.recipeSelected, (c, v) => { c.recipeSelected = v; }), // valueSelected
            this.recipes, // options
            new DataBinding(null, (c) => c, null), // bindingForOptionValues
            new DataBinding(null, (c) => c.name, null), // bindingForOptionText
            fontHeightSmall),
            new ControlList("listItemsInRecipe", new Coords(110, 25, 0), // pos
            new Coords(80, 25, 0), // size
            new DataBinding(this, (c) => {
                return (c.recipeSelected == null ? [] : c.recipeSelected.itemsIn);
            }, null), // items
            new DataBinding(null, (c) => c.toString(world), null), // bindingForItemText
            fontHeightSmall, null, // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            null, null, null),
            new ControlButton("buttonCombine", new Coords(110, 55, 0), // pos
            new Coords(30, 10, 0), // size
            "Combine:", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => c.isRecipeSelectedFulfilled(), null), // isEnabled
            combine, // click
            null, null),
            new ControlList("listItemsStaged", new Coords(110, 65, 0), // pos
            new Coords(80, 25, 0), // size
            new DataBinding(this, (c) => c.itemEntitiesStaged, null), // items
            new DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
            fontHeightSmall, new DataBinding(this, (c) => c.itemEntityStagedSelected, (c, v) => { c.itemEntityStagedSelected = v; }), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            null, null, null),
            new ControlLabel("infoStatus", new Coords(150, 95, 0), // pos
            new Coords(200, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => c.statusMessage, null), // text
            fontHeightSmall)
        ], // end children
        [
            new Action("Back", back),
        ], [
            new ActionToInputsMapping("Back", [Input.Names().Escape], true),
        ]);
        if (includeTitleAndDoneButton) {
            returnValue.children.splice(0, 0, new ControlLabel("labelCrafting", new Coords(100, -5, 0), // pos
            new Coords(100, 25, 0), // size
            true, // isTextCentered
            "Crafting", fontHeightLarge));
            returnValue.children.push(new ControlButton("buttonDone", new Coords(170, 115, 0), // pos
            new Coords(20, 10, 0), // size
            "Done", fontHeightSmall, true, // hasBorder
            true, // isEnabled
            back, // click
            null, null));
            var titleHeight = new Coords(0, 15, 0);
            sizeBase.add(titleHeight);
            returnValue.size.add(titleHeight);
            returnValue.shiftChildPositions(titleHeight);
        }
        var scaleMultiplier = size.clone().divide(sizeBase);
        returnValue.scalePosAndSize(scaleMultiplier);
        return returnValue;
    }
    ;
    // cloneable
    clone() {
        return new ItemCrafter(ArrayHelper.clone(this.recipes));
    }
    ;
}
