"use strict";
class ItemHolder {
    constructor(itemEntities) {
        this.itemEntities = [];
        itemEntities = itemEntities || [];
        for (var i = 0; i < itemEntities.length; i++) {
            var itemEntity = itemEntities[i];
            this.itemEntityAdd(itemEntity);
        }
    }
    // Static methods.
    static fromItems(items) {
        var itemEntities = items.map(x => x.toEntity());
        return new ItemHolder(itemEntities);
    }
    ;
    // Instance methods.
    hasItem(itemToCheck) {
        return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
    }
    ;
    hasItemWithDefnNameAndQuantity(defnName, quantityToCheck) {
        var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
        var returnValue = (itemExistingQuantity >= quantityToCheck);
        return returnValue;
    }
    ;
    itemEntitiesWithDefnNameJoin(defnName) {
        var itemEntitiesMatching = this.itemEntities.filter(x => x.item().defnName == defnName);
        var itemEntityJoined = itemEntitiesMatching[0];
        if (itemEntityJoined != null) {
            var itemJoined = itemEntityJoined.item();
            for (var i = 1; i < itemEntitiesMatching.length; i++) {
                var itemEntityToJoin = itemEntitiesMatching[i];
                itemJoined.quantity += itemEntityToJoin.item().quantity;
                ArrayHelper.remove(this.itemEntities, itemEntityToJoin);
            }
        }
        return itemEntityJoined;
    }
    ;
    itemEntityAdd(itemEntityToAdd) {
        var itemToAdd = itemEntityToAdd.item();
        var itemDefnName = itemToAdd.defnName;
        var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
        if (itemEntityExisting == null) {
            this.itemEntities.push(itemEntityToAdd);
        }
        else {
            itemEntityExisting.item().quantity += itemToAdd.quantity;
        }
    }
    ;
    itemEntityRemove(itemEntityToRemove) {
        var doesExist = this.itemEntities.indexOf(itemEntityToRemove) >= 0;
        if (doesExist) {
            ArrayHelper.remove(this.itemEntities, itemEntityToRemove);
        }
    }
    ;
    itemSubtract(itemToSubtract) {
        this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
    }
    ;
    itemSubtractDefnNameAndQuantity(itemDefnName, quantityToSubtract) {
        this.itemEntitiesWithDefnNameJoin(itemDefnName);
        var itemExisting = this.itemsByDefnName(itemDefnName)[0];
        if (itemExisting != null) {
            itemExisting.quantity -= quantityToSubtract;
            if (itemExisting.quantity <= 0) {
                var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
                ArrayHelper.remove(this.itemEntities, itemEntityExisting);
            }
        }
    }
    ;
    itemEntitiesAllTransferTo(other) {
        this.itemEntitiesTransferTo(this.itemEntities, other);
    }
    ;
    itemEntitiesTransferTo(itemEntitiesToTransfer, other) {
        for (var i = 0; i < itemEntitiesToTransfer.length; i++) {
            var itemEntity = itemEntitiesToTransfer[i];
            this.itemEntityTransferTo(itemEntity, other);
        }
    }
    ;
    itemEntitySplit(itemEntityToSplit, quantityToSplit) {
        var itemEntitySplitted = null;
        var itemToSplit = itemEntityToSplit.item();
        if (itemToSplit.quantity <= 1) {
            itemEntitySplitted = itemEntityToSplit;
        }
        else {
            quantityToSplit = quantityToSplit || Math.floor(itemToSplit.quantity / 2);
            if (quantityToSplit >= itemToSplit.quantity) {
                itemEntitySplitted = itemEntityToSplit;
            }
            else {
                itemToSplit.quantity -= quantityToSplit;
                itemEntitySplitted = itemEntityToSplit.clone();
                itemEntitySplitted.item().quantity = quantityToSplit;
                // Add with no join.
                ArrayHelper.insertElementAfterOther(this.itemEntities, itemEntitySplitted, itemEntityToSplit);
            }
        }
        return itemEntitySplitted;
    }
    ;
    itemEntityTransferTo(itemEntity, other) {
        other.itemEntityAdd(itemEntity);
        ArrayHelper.remove(this.itemEntities, itemEntity);
    }
    ;
    itemEntityTransferSingleTo(itemEntity, other) {
        var itemEntitySingle = this.itemEntitySplit(itemEntity, 1);
        this.itemEntityTransferTo(itemEntitySingle, other);
    }
    ;
    itemTransferTo(itemToTransfer, other) {
        var itemDefnName = itemToTransfer.defnName;
        this.itemEntitiesWithDefnNameJoin(itemDefnName);
        var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
        if (itemEntityExisting != null) {
            var itemEntityToTransfer = this.itemEntitySplit(itemEntityExisting, itemToTransfer.quantity);
            other.itemEntityAdd(itemEntityToTransfer);
            this.itemSubtract(itemToTransfer);
        }
    }
    ;
    itemEntitiesByDefnName(defnName) {
        return this.itemEntities.filter(x => x.item().defnName == defnName);
    }
    ;
    itemQuantityByDefnName(defnName) {
        return this.itemsByDefnName(defnName).map(y => y.quantity).reduce((a, b) => a + b, 0);
    }
    ;
    itemsByDefnName(defnName) {
        return this.itemEntitiesByDefnName(defnName).map(x => x.item());
    }
    ;
    tradeValueOfAllItems(world) {
        var tradeValueTotal = this.itemEntities.reduce((sumSoFar, itemEntity) => sumSoFar + itemEntity.item().tradeValue(world), 0 // sumSoFar
        );
        return tradeValueTotal;
    }
    ;
    // controls
    toControl(universe, size, entityItemHolder, venuePrev, includeTitleAndDoneButton) {
        this.statusMessage = "Use, drop, and sort items.";
        if (size == null) {
            size = universe.display.sizeDefault().clone();
        }
        var sizeBase = new Coords(200, 150, 1);
        var scaleMultiplier = size.clone().divide(sizeBase);
        var fontHeight = 10;
        var fontHeightSmall = fontHeight * .6;
        var fontHeightLarge = fontHeight * 1.5;
        var itemHolder = this;
        var world = universe.world;
        var back = function () {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var drop = function () {
            var itemEntityToKeep = itemHolder.itemEntitySelected;
            if (itemEntityToKeep != null) {
                var world = universe.world;
                var place = world.placeCurrent;
                var itemEntityToDrop = itemEntityToKeep.clone();
                var itemToDrop = itemEntityToDrop.item();
                itemToDrop.quantity = 1;
                var posToDropAt = itemEntityToDrop.locatable().loc.pos;
                var holderPos = entityItemHolder.locatable().loc.pos;
                posToDropAt.overwriteWith(holderPos);
                var collidable = itemEntityToDrop.collidable();
                if (collidable != null) {
                    collidable.ticksUntilCanCollide = 50;
                }
                place.entitySpawn(universe, world, itemEntityToDrop);
                itemHolder.itemSubtract(itemToDrop);
                if (itemEntityToKeep.item().quantity == 0) {
                    itemHolder.itemEntitySelected = null;
                }
                var itemToDropDefn = itemToDrop.defn(world);
                itemHolder.statusMessage = itemToDropDefn.appearance + " dropped.";
            }
        };
        var use = function () {
            var itemEntityToUse = itemHolder.itemEntitySelected;
            var itemToUse = itemEntityToUse.item();
            if (itemToUse.use != null) {
                var world = universe.world;
                var place = world.placeCurrent;
                var user = entityItemHolder;
                itemHolder.statusMessage =
                    itemToUse.use(universe, world, place, user, itemEntityToUse);
                if (itemToUse.quantity <= 0) {
                    itemHolder.itemEntitySelected = null;
                }
            }
        };
        var up = function () {
            var itemEntityToMove = itemHolder.itemEntitySelected;
            var itemEntitiesAll = itemHolder.itemEntities;
            var index = itemEntitiesAll.indexOf(itemEntityToMove);
            if (index > 0) {
                itemEntitiesAll.splice(index, 1);
                itemEntitiesAll.splice(index - 1, 0, itemEntityToMove);
            }
        };
        var down = function () {
            var itemEntityToMove = itemHolder.itemEntitySelected;
            var itemEntitiesAll = itemHolder.itemEntities;
            var index = itemEntitiesAll.indexOf(itemEntityToMove);
            if (index < itemEntitiesAll.length - 1) {
                itemEntitiesAll.splice(index, 1);
                itemEntitiesAll.splice(index + 1, 0, itemEntityToMove);
            }
        };
        var split = function (universe) {
            itemHolder.itemEntitySplit(itemHolder.itemEntitySelected, null);
        };
        var join = function () {
            var itemEntityToJoin = itemHolder.itemEntitySelected;
            var itemToJoin = itemEntityToJoin.item();
            var itemEntityJoined = itemHolder.itemEntitiesWithDefnNameJoin(itemToJoin.defnName);
            itemHolder.itemEntitySelected = itemEntityJoined;
        };
        var sort = function () {
            itemHolder.itemEntities.sort((x, y) => (x.item().defnName > y.item().defnName ? 1 : -1));
        };
        var equipItemInNumberedSlot = (slotNumber) => {
            var entityItemToEquip = itemHolder.itemEntitySelected;
            if (entityItemToEquip != null) {
                var world = universe.world;
                var place = world.placeCurrent;
                var equipmentUser = entityItemHolder.equipmentUser();
                var socketName = "Item" + slotNumber;
                var includeSocketNameInMessage = true;
                var message = equipmentUser.equipItemEntityInSocketWithName(universe, world, place, entityItemToEquip, socketName, includeSocketNameInMessage);
                itemHolder.statusMessage = message;
            }
        };
        var buttonSize = new Coords(20, 10, 0);
        var childControls = [
            new ControlLabel("labelItemsHeld", new Coords(10, 20, 0), // pos
            new Coords(70, 25, 0), // size
            false, // isTextCentered
            "Items Held:", fontHeightSmall),
            new ControlList("listItems", new Coords(10, 30, 0), // pos
            new Coords(70, 110, 0), // size
            new DataBinding(this.itemEntities, null, null), // items
            new DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
            fontHeightSmall, new DataBinding(this, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromContext(true), // isEnabled
            (universe) => // confirm
             {
                use();
            }, null),
            new ControlLabel("labelItemSelected", new Coords(150, 25, 0), // pos
            new Coords(100, 15, 0), // size
            true, // isTextCentered
            "Item Selected:", fontHeightSmall),
            new ControlLabel("infoItemSelected", new Coords(150, 35, 0), // pos
            new Coords(200, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => {
                var i = c.itemEntitySelected;
                return (i == null ? "-" : i.item().toString(world));
            }, null), // text
            fontHeightSmall),
            new ControlLabel("infoStatus", new Coords(150, 110, 0), // pos
            new Coords(200, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => {
                return c.statusMessage;
            }, null), // text
            fontHeightSmall),
            new ControlButton("buttonUp", new Coords(85, 30, 0), // pos
            new Coords(15, 10, 0), // size
            "Up", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var returnValue = (c.itemEntitySelected != null
                    && c.itemEntities.indexOf(c.itemEntitySelected) > 0);
                return returnValue;
            }, null), // isEnabled
            up, // click
            null, null),
            new ControlButton("buttonDown", new Coords(85, 45, 0), // pos
            new Coords(15, 10, 0), // size
            "Down", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var returnValue = (c.itemEntitySelected != null
                    && c.itemEntities.indexOf(c.itemEntitySelected) < c.itemEntities.length - 1);
                return returnValue;
            }, null), // isEnabled
            down, null, null),
            new ControlButton("buttonSplit", new Coords(85, 60, 0), // pos
            new Coords(15, 10, 0), // size
            "Split", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var itemEntity = c.itemEntitySelected;
                var returnValue = (itemEntity != null
                    && (itemEntity.item().quantity > 1));
                return returnValue;
            }, null), // isEnabled
            split, null, null),
            new ControlButton("buttonJoin", new Coords(85, 75, 0), // pos
            new Coords(15, 10, 0), // size
            "Join", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var returnValue = (c.itemEntitySelected != null
                    &&
                        (c.itemEntities.filter((x) => x.item().defnName == c.itemEntitySelected.item().defnName).length > 1));
                return returnValue;
            }, null), // isEnabled
            join, null, null),
            new ControlButton("buttonSort", new Coords(85, 90, 0), // pos
            new Coords(15, 10, 0), // size
            "Sort", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => (c.itemEntities.length > 1), null), // isEnabled
            sort, null, null),
            new ControlButton("buttonUse", new Coords(130, 90, 0), // pos
            new Coords(15, 10, 0), // size
            "Use", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => {
                var itemEntity = c.itemEntitySelected;
                return (itemEntity != null && itemEntity.item().isUsable(world));
            }, null), // isEnabled
            (universe) => {
                use();
            }, null, null),
            new ControlButton("buttonDrop", new Coords(150, 90, 0), // pos
            new Coords(15, 10, 0), // size
            "Drop", fontHeightSmall, true, // hasBorder
            new DataBinding(this, (c) => (c.itemEntitySelected != null), null), // isEnabled
            (universe) => // click
             {
                drop();
            }, null, null)
        ];
        var returnValue = new ControlContainer("Items", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        childControls, [
            new Action("Back", back),
            new Action("Up", up),
            new Action("Down", down),
            new Action("Split", split),
            new Action("Join", join),
            new Action("Sort", sort),
            new Action("Drop", drop),
            new Action("Use", use),
            new Action("Item0", function perform() { equipItemInNumberedSlot(0); }),
            new Action("Item1", function perform() { equipItemInNumberedSlot(1); }),
            new Action("Item2", function perform() { equipItemInNumberedSlot(2); }),
            new Action("Item3", function perform() { equipItemInNumberedSlot(3); }),
            new Action("Item4", function perform() { equipItemInNumberedSlot(4); }),
            new Action("Item5", function perform() { equipItemInNumberedSlot(5); }),
            new Action("Item6", function perform() { equipItemInNumberedSlot(6); }),
            new Action("Item7", function perform() { equipItemInNumberedSlot(7); }),
            new Action("Item8", function perform() { equipItemInNumberedSlot(8); }),
            new Action("Item9", function perform() { equipItemInNumberedSlot(9); }),
        ], [
            new ActionToInputsMapping("Back", [Input.Names().Escape], true),
            new ActionToInputsMapping("Up", ["["], true),
            new ActionToInputsMapping("Down", ["]"], true),
            new ActionToInputsMapping("Sort", ["\\"], true),
            new ActionToInputsMapping("Split", ["/"], true),
            new ActionToInputsMapping("Join", ["="], true),
            new ActionToInputsMapping("Drop", ["d"], true),
            new ActionToInputsMapping("Use", ["u"], true),
            new ActionToInputsMapping("Item0", ["_0"], true),
            new ActionToInputsMapping("Item1", ["_1"], true),
            new ActionToInputsMapping("Item2", ["_2"], true),
            new ActionToInputsMapping("Item3", ["_3"], true),
            new ActionToInputsMapping("Item4", ["_4"], true),
            new ActionToInputsMapping("Item5", ["_5"], true),
            new ActionToInputsMapping("Item6", ["_6"], true),
            new ActionToInputsMapping("Item7", ["_7"], true),
            new ActionToInputsMapping("Item8", ["_8"], true),
            new ActionToInputsMapping("Item9", ["_9"], true),
        ]);
        if (includeTitleAndDoneButton) {
            childControls.splice(0, // indexToInsertAt
            0, new ControlLabel("labelItems", new Coords(100, 10, 0), // pos
            new Coords(100, 25, 0), // size
            true, // isTextCentered
            "Items", fontHeightLarge));
            childControls.push(new ControlButton("buttonDone", new Coords(170, 130, 0), // pos
            buttonSize.clone(), "Done", fontHeightSmall, true, // hasBorder
            true, // isEnabled
            back, // click
            null, null));
        }
        else {
            var titleHeightInverted = new Coords(0, -15, 0);
            returnValue.size.add(titleHeightInverted);
            returnValue.shiftChildPositions(titleHeightInverted);
        }
        returnValue.scalePosAndSize(scaleMultiplier);
        return returnValue;
    }
    ;
    // cloneable
    clone() {
        return new ItemHolder(ArrayHelper.clone(this.itemEntities));
    }
    ;
}
