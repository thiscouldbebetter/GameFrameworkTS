"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemHolder {
            constructor(itemEntities, massMax, reachRadius) {
                this.itemEntities = [];
                this.massMax = massMax;
                this.reachRadius = reachRadius || 20;
                itemEntities = itemEntities || [];
                for (var i = 0; i < itemEntities.length; i++) {
                    var itemEntity = itemEntities[i];
                    this.itemEntityAdd(itemEntity);
                }
            }
            static create() {
                return new ItemHolder(null, null, null);
            }
            static fromItemEntities(itemEntities) {
                return new ItemHolder(itemEntities, null, null);
            }
            // Instance methods.
            clear() {
                this.itemEntities.length = 0;
                this.itemEntitySelected = null;
                this.statusMessage = "";
            }
            equipItemInNumberedSlot(universe, entityItemHolder, slotNumber) {
                var entityItemToEquip = this.itemEntitySelected;
                if (entityItemToEquip != null) {
                    var world = universe.world;
                    var place = world.placeCurrent;
                    var equipmentUser = entityItemHolder.equipmentUser();
                    var socketName = "Item" + slotNumber;
                    var includeSocketNameInMessage = true;
                    var message = equipmentUser.equipItemEntityInSocketWithName(universe, world, place, entityItemHolder, entityItemToEquip, socketName, includeSocketNameInMessage);
                    this.statusMessage = message;
                }
            }
            hasItem(itemToCheck) {
                return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
            }
            hasItemWithDefnNameAndQuantity(defnName, quantityToCheck) {
                var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
                var returnValue = (itemExistingQuantity >= quantityToCheck);
                return returnValue;
            }
            itemEntitiesAdd(itemEntitiesToAdd) {
                itemEntitiesToAdd.forEach(x => this.itemEntityAdd(x));
            }
            itemEntitiesAllTransferTo(other) {
                this.itemEntitiesTransferTo(this.itemEntities, other);
            }
            itemEntitiesByDefnName(defnName) {
                return this.itemEntities.filter(x => x.item().defnName == defnName);
            }
            itemEntitiesTransferTo(itemEntitiesToTransfer, other) {
                if (itemEntitiesToTransfer == this.itemEntities) {
                    // Create a new array to avoid modifying the one being looped through.
                    itemEntitiesToTransfer = new Array();
                    itemEntitiesToTransfer.push(...this.itemEntities);
                }
                for (var i = 0; i < itemEntitiesToTransfer.length; i++) {
                    var itemEntity = itemEntitiesToTransfer[i];
                    this.itemEntityTransferTo(itemEntity, other);
                }
            }
            itemEntitiesWithDefnNameJoin(defnName) {
                var itemEntitiesMatching = this.itemEntities.filter(x => x.item().defnName == defnName);
                var itemEntityJoined = itemEntitiesMatching[0];
                if (itemEntityJoined != null) {
                    var itemJoined = itemEntityJoined.item();
                    for (var i = 1; i < itemEntitiesMatching.length; i++) {
                        var itemEntityToJoin = itemEntitiesMatching[i];
                        itemJoined.quantity += itemEntityToJoin.item().quantity;
                        GameFramework.ArrayHelper.remove(this.itemEntities, itemEntityToJoin);
                    }
                }
                return itemEntityJoined;
            }
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
            itemEntityFindClosest(universe, world, place, entityItemHolder) {
                var entityItemsInPlace = place.items();
                var entityItemClosest = entityItemsInPlace.filter(x => x.locatable().distanceFromEntity(entityItemHolder) < this.reachRadius).sort((a, b) => a.locatable().distanceFromEntity(entityItemHolder)
                    - b.locatable().distanceFromEntity(entityItemHolder))[0];
                return entityItemClosest;
            }
            itemEntityCanPickUp(universe, world, place, entityItemHolder, entityItemToPickUp) {
                var massAlreadyHeld = this.massOfAllItems(world);
                var massOfItem = entityItemToPickUp.item().mass(world);
                var massAfterPickup = massAlreadyHeld + massOfItem;
                var canPickUp = (massAfterPickup <= this.massMax);
                return canPickUp;
            }
            itemEntityPickUp(universe, world, place, entityItemHolder, entityItemToPickUp) {
                this.itemEntityAdd(entityItemToPickUp);
                place.entitiesToRemove.push(entityItemToPickUp);
            }
            itemEntityRemove(itemEntityToRemove) {
                var doesExist = this.itemEntities.indexOf(itemEntityToRemove) >= 0;
                if (doesExist) {
                    GameFramework.ArrayHelper.remove(this.itemEntities, itemEntityToRemove);
                }
            }
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
                        GameFramework.ArrayHelper.insertElementAfterOther(this.itemEntities, itemEntitySplitted, itemEntityToSplit);
                    }
                }
                return itemEntitySplitted;
            }
            itemEntityTransferTo(itemEntity, other) {
                other.itemEntityAdd(itemEntity);
                GameFramework.ArrayHelper.remove(this.itemEntities, itemEntity);
                if (this.itemEntitySelected == itemEntity) {
                    this.itemEntitySelected = null;
                }
            }
            itemEntityTransferSingleTo(itemEntity, other) {
                var itemEntitySingle = this.itemEntitySplit(itemEntity, 1);
                this.itemEntityTransferTo(itemEntitySingle, other);
            }
            itemQuantityByDefnName(defnName) {
                return this.itemsByDefnName(defnName).map(y => y.quantity).reduce((a, b) => a + b, 0);
            }
            itemSubtract(itemToSubtract) {
                this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
            }
            itemSubtractDefnNameAndQuantity(itemDefnName, quantityToSubtract) {
                this.itemEntitiesWithDefnNameJoin(itemDefnName);
                var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                if (itemExisting != null) {
                    itemExisting.quantity -= quantityToSubtract;
                    if (itemExisting.quantity <= 0) {
                        var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
                        GameFramework.ArrayHelper.remove(this.itemEntities, itemEntityExisting);
                    }
                }
            }
            itemTransferTo(itemToTransfer, other) {
                var itemDefnName = itemToTransfer.defnName;
                this.itemEntitiesWithDefnNameJoin(itemDefnName);
                var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
                if (itemEntityExisting != null) {
                    var itemEntityToTransfer = this.itemEntitySplit(itemEntityExisting, itemToTransfer.quantity);
                    other.itemEntityAdd(itemEntityToTransfer.clone());
                    this.itemSubtract(itemToTransfer);
                }
            }
            items() {
                return this.itemEntities.map(x => x.item());
            }
            itemsByDefnName(defnName) {
                return this.itemEntitiesByDefnName(defnName).map(x => x.item());
            }
            massOfAllItems(world) {
                var massTotal = this.itemEntities.reduce((sumSoFar, itemEntity) => sumSoFar + itemEntity.item().mass(world), 0 // sumSoFar
                );
                return massTotal;
            }
            massOfAllItemsOverMax(world) {
                return "" + Math.ceil(this.massOfAllItems(world)) + "/" + this.massMax;
            }
            tradeValueOfAllItems(world) {
                var tradeValueTotal = this.itemEntities.reduce((sumSoFar, itemEntity) => sumSoFar + itemEntity.item().tradeValue(world), 0 // sumSoFar
                );
                return tradeValueTotal;
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
            // Controllable.
            toControl(universe, size, entityItemHolder, venuePrev, includeTitleAndDoneButton) {
                this.statusMessage = "Use, drop, and sort items.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = GameFramework.Coords.fromXY(200, 135);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontHeightLarge = fontHeight * 1.5;
                var itemHolder = this;
                var world = universe.world;
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var drop = () => {
                    var itemEntityToKeep = itemHolder.itemEntitySelected;
                    if (itemEntityToKeep != null) {
                        var world = universe.world;
                        var place = world.placeCurrent;
                        var itemEntityToDrop = itemEntityToKeep.clone();
                        var itemToDrop = itemEntityToDrop.item();
                        itemToDrop.quantity = 1;
                        var itemToDropDefn = itemToDrop.defn(world);
                        var itemLocatable = itemEntityToDrop.locatable();
                        if (itemLocatable == null) {
                            itemLocatable = GameFramework.Locatable.create();
                            itemEntityToDrop.propertyAddForPlace(itemLocatable, place);
                            itemEntityToDrop.propertyAddForPlace(GameFramework.Drawable.fromVisual(itemToDropDefn.visual), place);
                            // todo - Other properties: Collidable, etc.
                        }
                        var posToDropAt = itemLocatable.loc.pos;
                        var holderPos = entityItemHolder.locatable().loc.pos;
                        posToDropAt.overwriteWith(holderPos);
                        var collidable = itemEntityToDrop.collidable();
                        if (collidable != null) {
                            collidable.ticksUntilCanCollide = collidable.ticksToWaitBetweenCollisions;
                        }
                        place.entitySpawn(universe, world, itemEntityToDrop);
                        itemHolder.itemSubtract(itemToDrop);
                        if (itemEntityToKeep.item().quantity == 0) {
                            itemHolder.itemEntitySelected = null;
                        }
                        itemHolder.statusMessage = itemToDropDefn.appearance + " dropped.";
                        var equipmentUser = entityItemHolder.equipmentUser();
                        if (equipmentUser != null) {
                            equipmentUser.unequipItemEntity(itemEntityToKeep);
                        }
                    }
                };
                var use = () => {
                    var itemEntityToUse = itemHolder.itemEntitySelected;
                    if (itemEntityToUse != null) {
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
                    }
                };
                var up = () => {
                    var itemEntityToMove = itemHolder.itemEntitySelected;
                    var itemEntitiesAll = itemHolder.itemEntities;
                    var index = itemEntitiesAll.indexOf(itemEntityToMove);
                    if (index > 0) {
                        itemEntitiesAll.splice(index, 1);
                        itemEntitiesAll.splice(index - 1, 0, itemEntityToMove);
                    }
                };
                var down = () => {
                    var itemEntityToMove = itemHolder.itemEntitySelected;
                    var itemEntitiesAll = itemHolder.itemEntities;
                    var index = itemEntitiesAll.indexOf(itemEntityToMove);
                    if (index < itemEntitiesAll.length - 1) {
                        itemEntitiesAll.splice(index, 1);
                        itemEntitiesAll.splice(index + 1, 0, itemEntityToMove);
                    }
                };
                var split = (universe) => {
                    itemHolder.itemEntitySplit(itemHolder.itemEntitySelected, null);
                };
                var join = () => {
                    var itemEntityToJoin = itemHolder.itemEntitySelected;
                    var itemToJoin = itemEntityToJoin.item();
                    var itemEntityJoined = itemHolder.itemEntitiesWithDefnNameJoin(itemToJoin.defnName);
                    itemHolder.itemEntitySelected = itemEntityJoined;
                };
                var sort = () => {
                    itemHolder.itemEntities.sort((x, y) => (x.item().defnName > y.item().defnName ? 1 : -1));
                };
                var buttonSize = GameFramework.Coords.fromXY(20, 10);
                var visualNone = new GameFramework.VisualNone();
                var childControls = [
                    new GameFramework.ControlLabel("labelItemsHeld", GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    false, // isTextCentered
                    "Items Held:", fontHeightSmall),
                    GameFramework.ControlList.from10("listItems", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(70, 100), // size
                    GameFramework.DataBinding.fromContext(this.itemEntities), // items
                    GameFramework.DataBinding.fromGet((c) => c.item().toString(world)), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    (universe) => // confirm
                     {
                        use();
                    }),
                    new GameFramework.ControlLabel("infoWeight", GameFramework.Coords.fromXY(10, 115), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    false, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => "Weight: " + c.massOfAllItemsOverMax(world)), fontHeightSmall),
                    GameFramework.ControlButton.from8("buttonUp", GameFramework.Coords.fromXY(85, 15), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Up", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemEntitySelected != null
                        && c.itemEntities.indexOf(c.itemEntitySelected) > 0), // isEnabled
                    up // click
                    ),
                    GameFramework.ControlButton.from8("buttonDown", GameFramework.Coords.fromXY(85, 30), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Down", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemEntitySelected != null
                        && c.itemEntities.indexOf(c.itemEntitySelected) < c.itemEntities.length - 1), // isEnabled
                    down),
                    GameFramework.ControlButton.from8("buttonSplit", GameFramework.Coords.fromXY(85, 45), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Split", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var itemEntity = c.itemEntitySelected;
                        var returnValue = (itemEntity != null
                            && (itemEntity.item().quantity > 1));
                        return returnValue;
                    }), // isEnabled
                    split),
                    GameFramework.ControlButton.from8("buttonJoin", GameFramework.Coords.fromXY(85, 60), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Join", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemEntitySelected != null
                        &&
                            (c.itemEntities.filter((x) => x.item().defnName == c.itemEntitySelected.item().defnName).length > 1)), // isEnabled
                    join),
                    GameFramework.ControlButton.from8("buttonSort", GameFramework.Coords.fromXY(85, 75), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Sort", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemEntities.length > 1)), // isEnabled
                    sort),
                    new GameFramework.ControlLabel("labelItemSelected", GameFramework.Coords.fromXY(150, 10), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    true, // isTextCentered
                    "Item Selected:", fontHeightSmall),
                    new GameFramework.ControlLabel("infoItemSelected", GameFramework.Coords.fromXY(150, 20), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var i = c.itemEntitySelected;
                        return (i == null ? "-" : i.item().toString(world));
                    }), // text
                    fontHeightSmall),
                    GameFramework.ControlVisual.from5("visualImage", GameFramework.Coords.fromXY(125, 25), // pos
                    GameFramework.Coords.fromXY(50, 50), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var i = c.itemEntitySelected;
                        return (i == null ? visualNone : i.item().defn(world).visual);
                    }), GameFramework.Color.byName("Black") // colorBackground
                    ),
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(150, 115), // pos
                    GameFramework.Coords.fromXY(200, 15), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontHeightSmall),
                    GameFramework.ControlButton.from8("buttonUse", GameFramework.Coords.fromXY(132.5, 95), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Use", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var itemEntity = c.itemEntitySelected;
                        return (itemEntity != null && itemEntity.item().isUsable(world));
                    }), // isEnabled
                    (universe) => {
                        use();
                    }),
                    GameFramework.ControlButton.from8("buttonDrop", GameFramework.Coords.fromXY(152.5, 95), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Drop", fontHeightSmall, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => (c.itemEntitySelected != null), null), // isEnabled
                    (universe) => // click
                     {
                        drop();
                    })
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
                    new GameFramework.Action("Item0", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 0)),
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
                    0, new GameFramework.ControlLabel("labelItems", GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    true, // isTextCentered
                    "Items", fontHeightLarge));
                    childControls.push(GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(170, 115), // pos
                    buttonSize.clone(), "Done", fontHeightSmall, true, // hasBorder
                    true, // isEnabled
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
            // cloneable
            clone() {
                return new ItemHolder(GameFramework.ArrayHelper.clone(this.itemEntities), this.massMax, this.reachRadius);
            }
        }
        GameFramework.ItemHolder = ItemHolder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
