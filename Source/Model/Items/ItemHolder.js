"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemHolder {
            constructor(items, massMax, reachRadius) {
                this.items = [];
                this.massMax = massMax;
                this.reachRadius = reachRadius || 20;
                this.itemsAdd(items || []);
            }
            static create() {
                return new ItemHolder([], null, null);
            }
            static fromItems(items) {
                return new ItemHolder(items, null, null);
            }
            // Instance methods.
            clear() {
                this.items.length = 0;
                this.itemSelected = null;
                this.statusMessage = "";
                return this;
            }
            equipItemInNumberedSlot(universe, entityItemHolder, slotNumber) {
                var itemToEquip = this.itemSelected;
                if (itemToEquip != null) {
                    var world = universe.world;
                    var place = world.placeCurrent;
                    var equipmentUser = entityItemHolder.equipmentUser();
                    var socketName = "Item" + slotNumber;
                    var includeSocketNameInMessage = true;
                    var itemEntityToEquip = itemToEquip.toEntity(universe, world, place, entityItemHolder);
                    var message = equipmentUser.equipItemEntityInSocketWithName(universe, world, place, entityItemHolder, itemEntityToEquip, socketName, includeSocketNameInMessage);
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
            itemEntities(u, w, p, e) {
                return this.items.map(x => x.toEntity(u, w, p, e));
            }
            itemsAdd(itemsToAdd) {
                itemsToAdd.forEach((x) => this.itemAdd(x));
            }
            itemsAllTransferTo(other) {
                this.itemsTransferTo(this.items, other);
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
                        itemJoined.quantity += itemToJoin.quantity;
                        GameFramework.ArrayHelper.remove(this.items, itemToJoin);
                    }
                }
                return itemJoined;
            }
            itemAdd(itemToAdd) {
                var itemDefnName = itemToAdd.defnName;
                var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                if (itemExisting == null) {
                    this.items.push(itemToAdd);
                }
                else {
                    itemExisting.quantity += itemToAdd.quantity;
                }
            }
            itemEntityFindClosest(universe, world, place, entityItemHolder) {
                var entityItemsInPlace = place.items();
                var entityItemClosest = entityItemsInPlace.filter(x => x.locatable().distanceFromEntity(entityItemHolder) < this.reachRadius).sort((a, b) => a.locatable().distanceFromEntity(entityItemHolder)
                    - b.locatable().distanceFromEntity(entityItemHolder))[0];
                return entityItemClosest;
            }
            itemCanPickUp(universe, world, place, itemToPickUp) {
                var massAlreadyHeld = this.massOfAllItems(world);
                var massOfItem = itemToPickUp.mass(world);
                var massAfterPickup = massAlreadyHeld + massOfItem;
                var canPickUp = (massAfterPickup <= this.massMax);
                return canPickUp;
            }
            itemEntityPickUp(universe, world, place, entityItemHolder, itemEntityToPickUp) {
                var itemToPickUp = itemEntityToPickUp.item();
                this.itemAdd(itemToPickUp);
                place.entityToRemoveAdd(itemEntityToPickUp);
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
                        itemToSplit.quantity -= quantityToSplit;
                        itemSplitted = itemToSplit.clone();
                        itemSplitted.quantity = quantityToSplit;
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
            itemQuantityByDefnName(defnName) {
                return this.itemsByDefnName(defnName).map(y => y.quantity).reduce((a, b) => a + b, 0);
            }
            itemSubtract(itemToSubtract) {
                this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
            }
            itemSubtractDefnNameAndQuantity(itemDefnName, quantityToSubtract) {
                this.itemsWithDefnNameJoin(itemDefnName);
                var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                if (itemExisting != null) {
                    itemExisting.quantity -= quantityToSubtract;
                    if (itemExisting.quantity <= 0) {
                        var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                        GameFramework.ArrayHelper.remove(this.items, itemExisting);
                    }
                }
            }
            /*
            itemTransferTo2(itemToTransfer: Item, other: ItemHolder): void
            {
                var itemDefnName = itemToTransfer.defnName;
                this.itemsWithDefnNameJoin(itemDefnName);
                var itemExisting = this.itemsByDefnName(itemDefnName)[0];
                if (itemExisting != null)
                {
                    var itemToTransfer =
                        this.itemSplit(itemExisting, itemToTransfer.quantity);
                    other.itemAdd(itemToTransfer.clone());
                    this.itemSubtract(itemToTransfer);
                }
            }
            */
            itemsByDefnName2(defnName) {
                return this.itemsByDefnName(defnName);
            }
            massOfAllItems(world) {
                var massTotal = this.items.reduce((sumSoFar, item) => sumSoFar + item.mass(world), 0 // sumSoFar
                );
                return massTotal;
            }
            massOfAllItemsOverMax(world) {
                return "" + Math.ceil(this.massOfAllItems(world)) + "/" + this.massMax;
            }
            tradeValueOfAllItems(world) {
                var tradeValueTotal = this.items.reduce((sumSoFar, item) => sumSoFar + item.tradeValue(world), 0 // sumSoFar
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
                var sizeBase = new GameFramework.Coords(200, 135, 1);
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
                    if (itemHolder.itemSelected == null) {
                        return;
                    }
                    var itemToKeep = itemHolder.itemSelected;
                    if (itemToKeep != null) {
                        var world = universe.world;
                        var place = world.placeCurrent;
                        var itemToDrop = itemToKeep.clone();
                        itemToDrop.quantity = 1;
                        var itemToDropDefn = itemToDrop.defn(world);
                        var itemEntityToDrop = itemToDrop.toEntity(universe, world, place, entityItemHolder);
                        var itemLocatable = itemEntityToDrop.locatable();
                        if (itemLocatable == null) {
                            itemLocatable = GameFramework.Locatable.create();
                            itemEntityToDrop.propertyAdd(itemLocatable);
                            itemEntityToDrop.propertyAdd(GameFramework.Drawable.fromVisual(itemToDropDefn.visual));
                            // todo - Other properties: Collidable, etc.
                        }
                        var posToDropAt = itemLocatable.loc.pos;
                        var holderPos = entityItemHolder.locatable().loc.pos;
                        posToDropAt.overwriteWith(holderPos);
                        var collidable = itemEntityToDrop.collidable();
                        if (collidable != null) {
                            collidable.ticksUntilCanCollide =
                                collidable.ticksToWaitBetweenCollisions;
                        }
                        place.entitySpawn(universe, world, itemEntityToDrop);
                        itemHolder.itemSubtract(itemToDrop);
                        if (itemToKeep.quantity == 0) {
                            itemHolder.itemSelected = null;
                        }
                        itemHolder.statusMessage = itemToDropDefn.appearance + " dropped.";
                        var equipmentUser = entityItemHolder.equipmentUser();
                        if (equipmentUser != null) {
                            equipmentUser.unequipItemsNoLongerHeld(universe, world, world.placeCurrent, entityItemHolder);
                        }
                    }
                };
                var use = () => {
                    var itemEntityToUse = itemHolder.itemSelected.toEntity(universe, universe.world, universe.world.placeCurrent, entityItemHolder);
                    if (itemEntityToUse != null) {
                        var itemToUse = itemEntityToUse.item();
                        if (itemToUse.use != null) {
                            var world = universe.world;
                            var place = world.placeCurrent;
                            var user = entityItemHolder;
                            itemHolder.statusMessage =
                                itemToUse.use(universe, world, place, user, itemEntityToUse);
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
                var split = (universe) => {
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
                /*
                // todo
                var controlVisualBackground = ControlVisual.from4
                (
                    "imageBackground",
                    Coords.zeroes(),
                    sizeBase.clone(), // size
                    DataBinding.fromContext<Visual>
                    (
                        new VisualGroup
                        ([
                            new VisualImageScaled
                            (
                                new VisualImageFromLibrary("Title"), size
                            )
                        ])
                    )
                );
                */
                var childControls = [
                    //controlVisualBackground,
                    new GameFramework.ControlLabel("labelItemsHeld", GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    false, // isTextCentered
                    "Items Held:", fontHeightSmall),
                    GameFramework.ControlList.from10("listItems", GameFramework.Coords.fromXY(10, 15), // pos
                    GameFramework.Coords.fromXY(70, 100), // size
                    GameFramework.DataBinding.fromContext(this.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    use),
                    new GameFramework.ControlLabel("infoWeight", GameFramework.Coords.fromXY(10, 115), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    false, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => "Weight: " + c.massOfAllItemsOverMax(world)), fontHeightSmall),
                    GameFramework.ControlButton.from8("buttonUp", GameFramework.Coords.fromXY(85, 15), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Up", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var returnValue = (c.itemSelected != null
                            && c.items.indexOf(c.itemSelected) > 0);
                        return returnValue;
                    }), // isEnabled
                    up // click
                    ),
                    GameFramework.ControlButton.from8("buttonDown", GameFramework.Coords.fromXY(85, 30), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Down", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var returnValue = (c.itemSelected != null
                            && c.items.indexOf(c.itemSelected) < c.items.length - 1);
                        return returnValue;
                    }), // isEnabled
                    down),
                    GameFramework.ControlButton.from8("buttonSplit", GameFramework.Coords.fromXY(85, 45), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Split", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var item = c.itemSelected;
                        var returnValue = (item != null
                            && (item.quantity > 1));
                        return returnValue;
                    }), // isEnabled
                    split),
                    GameFramework.ControlButton.from8("buttonJoin", GameFramework.Coords.fromXY(85, 60), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Join", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemSelected != null
                        &&
                            (c.items.filter((x) => x.defnName == c.itemSelected.defnName).length > 1)), // isEnabled
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
                        var i = c.itemSelected;
                        return (i == null ? "-" : i.toString(world));
                    }), // text
                    fontHeightSmall),
                    GameFramework.ControlVisual.from5("visualImage", GameFramework.Coords.fromXY(125, 25), // pos
                    GameFramework.Coords.fromXY(50, 50), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var i = c.itemSelected;
                        return (i == null ? visualNone : i.defn(world).visual);
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
                        var item = c.itemSelected;
                        return (item != null && item.isUsable(world));
                    }), // isEnabled
                    use // click
                    ),
                    GameFramework.ControlButton.from8("buttonDrop", GameFramework.Coords.fromXY(152.5, 95), // pos
                    GameFramework.Coords.fromXY(15, 10), // size
                    "Drop", fontHeightSmall, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemSelected != null)), // isEnabled
                    drop // click
                    )
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
                return new ItemHolder(GameFramework.ArrayHelper.clone(this.items), this.massMax, this.reachRadius);
            }
        }
        GameFramework.ItemHolder = ItemHolder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
