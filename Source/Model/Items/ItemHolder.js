"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemHolder {
            constructor(items, encumbranceMax, reachRadius, retainsItemsWithZeroQuantities) {
                this.items = items || [];
                this.encumbranceMax = encumbranceMax;
                this.reachRadius = reachRadius || 20;
                this.retainsItemsWithZeroQuantities = retainsItemsWithZeroQuantities || false;
                this.itemsAdd(items || []);
            }
            static create() {
                return new ItemHolder(null, null, null, null);
            }
            static default() {
                return ItemHolder.create();
            }
            static fromItems(items) {
                return new ItemHolder(items, null, null, null);
            }
            static fromEncumbranceMax(encumbranceMax) {
                return new ItemHolder(null, encumbranceMax, null, null);
            }
            static of(entity) {
                return entity.propertyByName(ItemHolder.name);
            }
            // Instance methods.
            clear() {
                if (this.retainsItemsWithZeroQuantities) {
                    this.items.forEach(x => x.quantityClear());
                }
                else {
                    this.items.length = 0;
                }
                this.itemSelected = null;
                this.statusMessage = "";
                return this;
            }
            encumbranceMaxSet(value) {
                this.encumbranceMax = value;
                return this;
            }
            encumbranceOfAllItems(world) {
                var encumbranceTotal = this.items.reduce((sumSoFar, item) => sumSoFar + item.encumbrance(world), 0 // sumSoFar
                );
                return encumbranceTotal;
            }
            encumbranceOfAllItemsOverMax(world) {
                var returnValue = "" + Math.ceil(this.encumbranceOfAllItems(world));
                if (this.encumbranceMax != null) {
                    returnValue += "/" + this.encumbranceMax;
                }
                return returnValue;
            }
            equipItemInNumberedSlot(universe, entityItemHolder, slotNumber) {
                var itemToEquip = this.itemSelected;
                if (itemToEquip != null) {
                    var world = universe.world;
                    var place = world.placeCurrent;
                    var equipmentUser = GameFramework.EquipmentUser.of(entityItemHolder);
                    var socketName = "Item" + slotNumber;
                    var includeSocketNameInMessage = true;
                    var itemEntityToEquip = itemToEquip.toEntity(new GameFramework.UniverseWorldPlaceEntities(universe, world, place, entityItemHolder, null));
                    var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, place, entityItemHolder, itemEntityToEquip);
                    equipmentUser.equipItemEntityInSocketWithName(uwpe, socketName, includeSocketNameInMessage);
                }
            }
            hasItem(itemToCheck) {
                return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
            }
            hasItems(itemsToCheck) {
                var isMissingAtLeastOneItem = itemsToCheck.some(x => this.hasItem(x) == false);
                var hasAllItems = (isMissingAtLeastOneItem == false);
                return hasAllItems;
            }
            hasItemWithCategoryName(categoryName, world) {
                var returnValue = this.items.some(x => x.defn(world).categoryNames.indexOf(categoryName) >= 0);
                return returnValue;
            }
            hasItemWithDefnName(defnName) {
                return this.hasItemWithDefnNameAndQuantity(defnName, 1);
            }
            hasItemWithDefnNameAndQuantity(defnName, quantityToCheck) {
                var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
                var returnValue = (itemExistingQuantity >= quantityToCheck);
                return returnValue;
            }
            itemAdd(itemToAdd) {
                var itemDefnName = itemToAdd.defnName;
                var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                if (itemExisting == null) {
                    this.items.push(itemToAdd);
                }
                else {
                    itemExisting.quantityAdd(itemToAdd.quantity);
                }
            }
            itemByDefnName(defnName) {
                return this.itemsByDefnName(defnName)[0];
            }
            itemCanPickUp(universe, world, place, itemToPickUp) {
                var encumbranceAlreadyHeld = this.encumbranceOfAllItems(world);
                var encumbranceOfItem = itemToPickUp.encumbrance(world);
                var encumbranceAfterPickup = encumbranceAlreadyHeld + encumbranceOfItem;
                var canPickUp = (encumbranceAfterPickup <= this.encumbranceMax);
                return canPickUp;
            }
            itemDrop(uwpe) {
                var world = uwpe.world;
                var place = uwpe.place;
                var entityItemHolder = uwpe.entity;
                var itemEntityToKeep = uwpe.entity2;
                if (itemEntityToKeep != null) {
                    var itemToKeep = GameFramework.Item.of(itemEntityToKeep);
                    var itemToDrop = itemToKeep.clone();
                    itemToDrop.quantitySet(1);
                    var itemToDropDefn = itemToDrop.defn(world);
                    var itemEntityToDrop = itemToDrop.toEntity(uwpe);
                    var itemLocatable = GameFramework.Locatable.of(itemEntityToDrop);
                    if (itemLocatable == null) {
                        itemLocatable = GameFramework.Locatable.create();
                        itemEntityToDrop.propertyAdd(itemLocatable);
                        itemEntityToDrop.propertyAdd(GameFramework.Drawable.fromVisual(itemToDropDefn.visual));
                        // todo - Other properties: Collidable, etc.
                    }
                    var posToDropAt = itemLocatable.loc.pos;
                    var holderPos = GameFramework.Locatable.of(entityItemHolder).loc.pos;
                    posToDropAt.overwriteWith(holderPos);
                    var collidable = GameFramework.Collidable.of(itemEntityToDrop);
                    if (collidable != null) {
                        collidable.ticksUntilCanCollide =
                            collidable.ticksToWaitBetweenCollisions;
                    }
                    place.entitySpawn(uwpe.clone().entitiesSwap());
                    this.itemSubtract(itemToDrop);
                    this.statusMessage = itemToDropDefn.appearance + " dropped.";
                    var equipmentUser = GameFramework.EquipmentUser.of(entityItemHolder);
                    if (equipmentUser != null) {
                        equipmentUser.unequipItemsNoLongerHeld(uwpe);
                    }
                }
            }
            itemEntities(uwpe) {
                return this.items.map(x => x.toEntity(uwpe));
            }
            itemEntityFindClosest(uwpe) {
                var place = uwpe.place;
                var entityItemHolder = uwpe.entity;
                var entityItemsInPlace = GameFramework.Item.entitiesFromPlace(place);
                var entityItemClosest = entityItemsInPlace.filter((x) => GameFramework.Locatable.of(x).distanceFromEntity(entityItemHolder) < this.reachRadius).sort((a, b) => GameFramework.Locatable.of(a).distanceFromEntity(entityItemHolder)
                    - GameFramework.Locatable.of(b).distanceFromEntity(entityItemHolder))[0];
                return entityItemClosest;
            }
            itemEntityPickUp(uwpe) {
                var place = uwpe.place;
                var itemEntityToPickUp = uwpe.entity2;
                this.itemEntityPickUpFromPlace(itemEntityToPickUp, place);
            }
            itemEntityPickUpFromPlace(itemEntityToPickUp, place) {
                var itemToPickUp = GameFramework.Item.of(itemEntityToPickUp);
                this.itemAdd(itemToPickUp);
                place.entityToRemoveAdd(itemEntityToPickUp);
            }
            itemQuantityByDefnName(defnName) {
                return this.itemsByDefnName(defnName).map(y => y.quantity).reduce((a, b) => a + b, 0);
            }
            itemRemove(itemToRemove) {
                var doesExist = this.items.indexOf(itemToRemove) >= 0;
                if (doesExist) {
                    GameFramework.ArrayHelper.remove(this.items, itemToRemove);
                }
            }
            itemSplit(itemToSplit, quantityToSplit) {
                var itemSplitted = null;
                if (itemToSplit.quantity <= 1) {
                    itemSplitted = itemToSplit;
                }
                else {
                    quantityToSplit =
                        quantityToSplit || Math.floor(itemToSplit.quantity / 2);
                    if (quantityToSplit >= itemToSplit.quantity) {
                        itemSplitted = itemToSplit;
                    }
                    else {
                        itemToSplit.quantitySubtract(quantityToSplit);
                        itemSplitted = itemToSplit.clone();
                        itemSplitted.quantitySet(quantityToSplit);
                        // Add with no join.
                        GameFramework.ArrayHelper.insertElementAfterOther(this.items, itemSplitted, itemToSplit);
                    }
                }
                return itemSplitted;
            }
            itemTransferTo(item, other) {
                other.itemAdd(item);
                GameFramework.ArrayHelper.remove(this.items, item);
                if (this.itemSelected == item) {
                    this.itemSelected = null;
                }
            }
            itemTransferSingleTo(item, other) {
                var itemSingle = this.itemSplit(item, 1);
                this.itemTransferTo(itemSingle, other);
            }
            itemSubtract(itemToSubtract) {
                this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
            }
            itemSubtractDefnNameAndQuantity(itemDefnName, quantityToSubtract) {
                this.itemsWithDefnNameJoin(itemDefnName);
                var itemExisting = this.itemByDefnName(itemDefnName);
                if (itemExisting == null) {
                    throw new Error("Cannot subtract from nonexistent item '" + itemDefnName + "'.");
                }
                else {
                    itemExisting.quantitySubtract(quantityToSubtract);
                    if (itemExisting.quantity <= 0) {
                        var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                        if (this.retainsItemsWithZeroQuantities) {
                            itemExisting.quantityClear();
                        }
                        else {
                            GameFramework.ArrayHelper.remove(this.items, itemExisting);
                            if (this.itemSelected == itemExisting) {
                                this.itemSelected = null;
                            }
                        }
                    }
                }
            }
            itemsAdd(itemsToAdd) {
                itemsToAdd.forEach((x) => this.itemAdd(x));
                return this;
            }
            itemsAllTransferTo(other) {
                this.itemsTransferTo(this.items, other);
            }
            itemsBelongingToCategory(category, world) {
                return this.itemsBelongingToCategoryWithName(category.name, world);
            }
            itemsBelongingToCategoryWithName(categoryName, world) {
                return this.items.filter(x => x.belongsToCategoryWithName(categoryName, world));
            }
            itemsByDefnName(defnName) {
                return this.items.filter(x => x.defnName == defnName);
            }
            itemsTransferTo(itemsToTransfer, other) {
                if (itemsToTransfer == this.items) {
                    // Create a new array to avoid modifying the one being looped through.
                    itemsToTransfer = new Array();
                    itemsToTransfer.push(...this.items);
                }
                for (var i = 0; i < itemsToTransfer.length; i++) {
                    var item = itemsToTransfer[i];
                    this.itemTransferTo(item, other);
                }
            }
            itemsWithDefnNameJoin(defnName) {
                var itemsMatching = this.items.filter(x => x.defnName == defnName);
                var itemJoined = itemsMatching[0];
                if (itemJoined != null) {
                    for (var i = 1; i < itemsMatching.length; i++) {
                        var itemToJoin = itemsMatching[i];
                        itemJoined.quantityAdd(itemToJoin.quantity);
                        GameFramework.ArrayHelper.remove(this.items, itemToJoin);
                    }
                }
                return itemJoined;
            }
            itemsRemove(itemsToRemove) {
                itemsToRemove.forEach(x => this.itemRemove(x));
            }
            itemsByDefnName2(defnName) {
                return this.itemsByDefnName(defnName);
            }
            retainsItemsWithZeroQuantitiesSet(value) {
                this.retainsItemsWithZeroQuantities = value;
                return this;
            }
            tradeValueOfAllItems(world) {
                var tradeValueTotal = this.items.reduce((sumSoFar, item) => sumSoFar + item.tradeValue(world), 0 // sumSoFar
                );
                return tradeValueTotal;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ItemHolder.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Controllable.
            toControl(universe, size, entityItemHolder, venuePrev, includeTitleAndDoneButton) {
                this.statusMessage = "Use, drop, and sort items.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, universe.world, universe.world.placeCurrent, entityItemHolder, null);
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontHeightLarge = fontHeight * 1.5;
                var fontSmall = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
                var fontLarge = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightLarge);
                var itemHolder = this;
                var world = universe.world;
                var back = () => universe.venueTransitionTo(venuePrev);
                var drop = () => {
                    if (itemHolder.itemSelected != null) {
                        itemHolder.itemDrop(uwpe.entity2Set(itemHolder.itemSelected.toEntity(uwpe)));
                    }
                };
                var use = () => {
                    var itemEntityToUse = itemHolder.itemSelected.toEntity(uwpe);
                    if (itemEntityToUse != null) {
                        var itemToUse = GameFramework.Item.of(itemEntityToUse);
                        if (itemToUse.use != null) {
                            itemToUse.use(uwpe);
                            if (itemToUse.quantity <= 0) {
                                itemHolder.itemSelected = null;
                            }
                        }
                    }
                };
                var up = () => {
                    var itemToMove = itemHolder.itemSelected;
                    var itemsAll = itemHolder.items;
                    var index = itemsAll.indexOf(itemToMove);
                    if (index > 0) {
                        itemsAll.splice(index, 1);
                        itemsAll.splice(index - 1, 0, itemToMove);
                    }
                };
                var down = () => {
                    var itemToMove = itemHolder.itemSelected;
                    var itemsAll = itemHolder.items;
                    var index = itemsAll.indexOf(itemToMove);
                    if (index < itemsAll.length - 1) {
                        itemsAll.splice(index, 1);
                        itemsAll.splice(index + 1, 0, itemToMove);
                    }
                };
                var split = () => {
                    itemHolder.itemSplit(itemHolder.itemSelected, null);
                };
                var join = () => {
                    var itemToJoin = itemHolder.itemSelected;
                    var itemJoined = itemHolder.itemsWithDefnNameJoin(itemToJoin.defnName);
                    itemHolder.itemSelected = itemJoined;
                };
                var sort = () => {
                    itemHolder.items.sort((x, y) => (x.defnName > y.defnName ? 1 : -1));
                };
                var buttonSize = GameFramework.Coords.fromXY(20, 10);
                var visualNone = new GameFramework.VisualNone();
                var childControls = [
                    //controlVisualBackground,
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    GameFramework.DataBinding.fromContext("Items Held:"), fontSmall),
                    GameFramework.ControlList.from10("listItems", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(70, 100), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontSmall, new GameFramework.DataBinding(this, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    use),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(10, 115), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => "Weight: " + c.encumbranceOfAllItemsOverMax(world)), fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 15), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Up", fontSmall, up // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var returnValue = (c.itemSelected != null
                            && c.items.indexOf(c.itemSelected) > 0);
                        return returnValue;
                    })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 30), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Down", fontSmall, down).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var returnValue = (c.itemSelected != null
                            && c.items.indexOf(c.itemSelected) < c.items.length - 1);
                        return returnValue;
                    })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 45), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Split", fontSmall, split).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var item = c.itemSelected;
                        var returnValue = (item != null
                            && (item.quantity > 1));
                        return returnValue;
                    })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 60), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Join", fontSmall, join).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemSelected != null
                        &&
                            (c.items.filter((x) => x.defnName == c.itemSelected.defnName).length > 1)) // isEnabled
                    ),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 75), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Sort", fontSmall, sort).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemEntities.length > 1))),
                    GameFramework.ControlLabel.fromPosTextFontCenteredHorizontally(GameFramework.Coords.fromXY(150, 10), // pos
                    GameFramework.DataBinding.fromContext("Item Selected:"), fontSmall),
                    GameFramework.ControlLabel.fromPosTextFontCenteredHorizontally(GameFramework.Coords.fromXY(150, 15), // pos
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var i = c.itemSelected;
                        return (i == null ? "-" : i.toString(world));
                    }), // text
                    fontSmall),
                    GameFramework.ControlVisual.fromNamePosSizeVisualColorBackground("visualImage", GameFramework.Coords.fromXY(125, 25), // pos
                    GameFramework.Coords.fromXY(50, 50), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var i = c.itemSelected;
                        return (i == null ? visualNone : i.defn(world).visual);
                    }), GameFramework.Color.Instances().Black // colorBackground
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(150, 115), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontSmall),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(132.5, 95), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Use", fontSmall, use // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var item = c.itemSelected;
                        return (item != null && item.isUsable(world));
                    })),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(152.5, 95), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Drop", fontSmall, drop // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemSelected != null)))
                ];
                var returnValue = new GameFramework.ControlContainer("Items", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                childControls, [
                    new GameFramework.Action("Back", back),
                    new GameFramework.Action("Up", up),
                    new GameFramework.Action("Down", down),
                    new GameFramework.Action("Split", split),
                    new GameFramework.Action("Join", join),
                    new GameFramework.Action("Sort", sort),
                    new GameFramework.Action("Drop", drop),
                    new GameFramework.Action("Use", use),
                    new GameFramework.Action("Item0", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, null)),
                    new GameFramework.Action("Item1", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 1)),
                    new GameFramework.Action("Item2", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 2)),
                    new GameFramework.Action("Item3", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 3)),
                    new GameFramework.Action("Item4", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 4)),
                    new GameFramework.Action("Item5", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 5)),
                    new GameFramework.Action("Item6", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 6)),
                    new GameFramework.Action("Item7", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 7)),
                    new GameFramework.Action("Item8", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 8)),
                    new GameFramework.Action("Item9", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 9)),
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                    new GameFramework.ActionToInputsMapping("Up", ["["], true),
                    new GameFramework.ActionToInputsMapping("Down", ["]"], true),
                    new GameFramework.ActionToInputsMapping("Sort", ["\\"], true),
                    new GameFramework.ActionToInputsMapping("Split", ["/"], true),
                    new GameFramework.ActionToInputsMapping("Join", ["="], true),
                    new GameFramework.ActionToInputsMapping("Drop", ["d"], true),
                    new GameFramework.ActionToInputsMapping("Use", ["e"], true),
                    new GameFramework.ActionToInputsMapping("Item0", ["_0"], true),
                    new GameFramework.ActionToInputsMapping("Item1", ["_1"], true),
                    new GameFramework.ActionToInputsMapping("Item2", ["_2"], true),
                    new GameFramework.ActionToInputsMapping("Item3", ["_3"], true),
                    new GameFramework.ActionToInputsMapping("Item4", ["_4"], true),
                    new GameFramework.ActionToInputsMapping("Item5", ["_5"], true),
                    new GameFramework.ActionToInputsMapping("Item6", ["_6"], true),
                    new GameFramework.ActionToInputsMapping("Item7", ["_7"], true),
                    new GameFramework.ActionToInputsMapping("Item8", ["_8"], true),
                    new GameFramework.ActionToInputsMapping("Item9", ["_9"], true),
                ]);
                if (includeTitleAndDoneButton) {
                    childControls.splice(0, // indexToInsertAt
                    0, GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContext("Items"), fontLarge));
                    childControls.push(GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 115), // pos
                    buttonSize.clone(), "Done", fontSmall, back // click
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
            // cloneable
            clone() {
                return new ItemHolder(GameFramework.ArrayHelper.clone(this.items), this.encumbranceMax, this.reachRadius, this.retainsItemsWithZeroQuantities);
            }
            overwriteWith(other) { return this; } // todo
        }
        GameFramework.ItemHolder = ItemHolder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
