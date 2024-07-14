"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentUser {
            constructor(socketDefnGroup) {
                this.socketGroup = new GameFramework.EquipmentSocketGroup(socketDefnGroup);
            }
            equipAll(uwpe) {
                var world = uwpe.world;
                var entityEquipmentUser = uwpe.entity;
                var itemHolder = entityEquipmentUser.itemHolder();
                var itemsNotYetEquipped = itemHolder.items;
                var sockets = this.socketGroup.sockets;
                for (var s = 0; s < sockets.length; s++) {
                    var socket = sockets[s];
                    if (socket.itemEntityEquipped == null) {
                        var socketDefn = socket.defn(this.socketGroup.defnGroup);
                        var categoriesEquippableNames = socketDefn.categoriesAllowedNames;
                        var itemsEquippable = itemsNotYetEquipped.filter((x) => GameFramework.ArrayHelper.intersectArrays(x.defn(world).categoryNames, categoriesEquippableNames).length > 0);
                        if (itemsEquippable.length > 0) {
                            var itemToEquip = itemsEquippable[0];
                            var itemToEquipAsEntity = itemToEquip.toEntity(uwpe);
                            uwpe.entity2 = itemToEquipAsEntity;
                            this.equipItemEntityInSocketWithName(uwpe, socket.defnName, true // ?
                            );
                        }
                    }
                }
            }
            equipEntityWithItem(uwpe) {
                var world = uwpe.world;
                var itemEntityToEquip = uwpe.entity2;
                if (itemEntityToEquip == null) {
                    return null;
                }
                var sockets = this.socketGroup.sockets;
                var socketDefnGroup = this.socketGroup.defnGroup;
                var itemToEquip = itemEntityToEquip.item();
                var itemDefn = itemToEquip.defn(world);
                var socketFound = sockets.filter((socket) => {
                    var socketDefn = socket.defn(socketDefnGroup);
                    var isItemAllowedInSocket = socketDefn.categoriesAllowedNames.some((y) => itemDefn.categoryNames.indexOf(y) >= 0);
                    return isItemAllowedInSocket;
                })[0];
                if (socketFound == null) {
                    this.statusMessage = "Can't equip " + itemDefn.name + ".";
                }
                else {
                    var socketFoundName = socketFound.defnName;
                    this.equipItemEntityInSocketWithName(uwpe, socketFoundName, false);
                }
            }
            equipItemEntityInFirstOpenQuickSlot(uwpe, includeSocketNameInMessage) {
                var itemEntityToEquip = uwpe.entity2;
                var itemToEquipDefnName = itemEntityToEquip.item().defnName;
                var socketFound = null;
                var itemQuickSlotCount = 10;
                for (var i = 0; i < itemQuickSlotCount; i++) {
                    var socketName = "Item" + i;
                    var socket = this.socketByName(socketName);
                    if (socketFound == null && socket.itemEntityEquipped == null) {
                        socketFound = socket;
                    }
                    else if (socket.itemEntityEquipped != null) {
                        var itemInSocketDefnName = socket.itemEntityEquipped.item().defnName;
                        if (itemInSocketDefnName == itemToEquipDefnName) {
                            socketFound = socket;
                            break;
                        }
                    }
                }
                if (socketFound != null) {
                    this.equipItemEntityInSocketWithName(uwpe, socketFound.defnName, includeSocketNameInMessage);
                }
            }
            equipItemEntityInSocketWithName(uwpe, socketName, includeSocketNameInMessage) {
                var world = uwpe.world;
                var itemEntityToEquip = uwpe.entity2;
                var message;
                if (itemEntityToEquip == null) {
                    message = "Nothing to equip!";
                }
                else {
                    var itemToEquip = itemEntityToEquip.item();
                    var itemDefn = itemToEquip.defn(world);
                    var equippable = itemEntityToEquip.equippable();
                    message = itemDefn.appearance;
                    var socket = this.socketByName(socketName);
                    if (socket == null) {
                        message += " cannot be equipped.";
                    }
                    else if (socket.itemEntityEquipped == itemEntityToEquip) {
                        if (equippable != null) {
                            equippable.unequip(uwpe);
                        }
                        socket.itemEntityEquipped = null;
                        message += " unequipped.";
                    }
                    else {
                        if (equippable != null) {
                            equippable.equip(uwpe);
                        }
                        socket.itemEntityEquipped = itemEntityToEquip;
                        message += " equipped";
                        if (includeSocketNameInMessage) {
                            message += " as " + socket.defnName;
                        }
                        message += ".";
                    }
                }
                this.statusMessage = message;
            }
            itemEntityInSocketWithName(socketName) {
                var socket = this.socketByName(socketName);
                return socket.itemEntityEquipped;
            }
            socketByName(socketName) {
                return this.socketGroup.socketsByDefnName.get(socketName);
            }
            unequipItemFromSocketWithName(world, socketName) {
                var message;
                var socketToUnequipFrom = this.socketGroup.socketsByDefnName.get(socketName);
                if (socketToUnequipFrom == null) {
                    message = "Nothing to unequip!";
                }
                else {
                    var itemEntityToUnequip = socketToUnequipFrom.itemEntityEquipped;
                    if (itemEntityToUnequip == null) {
                        message = "Nothing to unequip!";
                    }
                    else {
                        socketToUnequipFrom.itemEntityEquipped = null;
                        var itemToUnequip = itemEntityToUnequip.item();
                        var itemDefn = itemToUnequip.defn(world);
                        message = itemDefn.appearance + " unequipped.";
                    }
                }
                this.statusMessage = message;
            }
            unequipItemsNoLongerHeld(uwpe) {
                var entityEquipmentUser = uwpe.entity;
                var itemHolder = entityEquipmentUser.itemHolder();
                var itemsHeld = itemHolder.items;
                var sockets = this.socketGroup.sockets;
                for (var i = 0; i < sockets.length; i++) {
                    var socket = sockets[i];
                    var socketItemEntity = socket.itemEntityEquipped;
                    if (socketItemEntity != null) {
                        var socketItem = socketItemEntity.item();
                        var socketItemDefnName = socketItem.defnName;
                        if (itemsHeld.indexOf(socketItem) == -1) {
                            var itemOfSameTypeStillHeld = itemsHeld.filter(x => x.defnName == socketItemDefnName)[0];
                            if (itemOfSameTypeStillHeld == null) {
                                socket.itemEntityEquipped = null;
                            }
                            else {
                                socket.itemEntityEquipped = itemOfSameTypeStillHeld.toEntity(uwpe);
                            }
                        }
                    }
                }
            }
            unequipItem(itemToUnequip) {
                var socket = this.socketGroup.sockets.filter(x => x.itemEntityEquipped.item() == itemToUnequip)[0];
                if (socket != null) {
                    socket.itemEntityEquipped = null;
                }
            }
            useItemInSocketNumbered(uwpe, socketNumber) {
                var actor = uwpe.entity;
                var equipmentUser = actor.equipmentUser();
                var socketName = "Item" + socketNumber;
                var entityItemEquipped = equipmentUser.itemEntityInSocketWithName(socketName);
                if (entityItemEquipped != null) {
                    var itemEquipped = entityItemEquipped.item();
                    uwpe.entity2 = entityItemEquipped;
                    itemEquipped.use(uwpe);
                }
                this.unequipItemsNoLongerHeld(uwpe);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return EquipmentUser.name; }
            updateForTimerTick(uwpe) { }
            // control
            toControl(universe, size, entityEquipmentUser, venuePrev, includeTitleAndDoneButton) {
                this.statusMessage = "Equip items in available slots.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = new GameFramework.Coords(200, 135, 1);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontSmall = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
                var fontHeightLarge = fontHeight * 1.5;
                var fontLarge = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightLarge);
                var itemHolder = entityEquipmentUser.itemHolder();
                var equipmentUser = this;
                var sockets = this.socketGroup.sockets;
                var socketDefnGroup = this.socketGroup.defnGroup;
                var itemCategoriesForAllSockets = [];
                for (var i = 0; i < sockets.length; i++) {
                    var socket = sockets[i];
                    var socketDefn = socket.defn(socketDefnGroup);
                    var socketCategoryNames = socketDefn.categoriesAllowedNames;
                    for (var j = 0; j < socketCategoryNames.length; j++) {
                        var categoryName = socketCategoryNames[j];
                        if (itemCategoriesForAllSockets.indexOf(categoryName) == -1) {
                            itemCategoriesForAllSockets.push(categoryName);
                        }
                    }
                }
                var world = universe.world;
                var place = world.placeCurrent;
                var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, place, entityEquipmentUser, null);
                var itemEntities = itemHolder.itemEntities(uwpe);
                var itemEntitiesEquippable = itemEntities.filter(x => x.equippable() != null);
                var world = universe.world;
                var place = world.placeCurrent;
                var listHeight = 100;
                var equipItemSelectedToSocketDefault = () => {
                    var itemEntityToEquip = equipmentUser.itemEntitySelected;
                    uwpe.entity2 = itemEntityToEquip;
                    equipmentUser.equipEntityWithItem(uwpe);
                };
                var listEquippables = new GameFramework.ControlList("listEquippables", GameFramework.Coords.fromXY(10, 15), // pos
                GameFramework.Coords.fromXY(70, listHeight), // size
                GameFramework.DataBinding.fromContextAndGet(this, (c) => itemEntitiesEquippable), // items
                GameFramework.DataBinding.fromGet((c) => c.item().toString(world)), // bindingForItemText
                fontSmall, new GameFramework.DataBinding(this, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                null, // bindingForIsEnabled
                equipItemSelectedToSocketDefault, null);
                var equipItemSelectedToSocketSelected = () => {
                    var itemEntityToEquip = equipmentUser.itemEntitySelected;
                    uwpe.entity2 = itemEntityToEquip;
                    var socketSelected = equipmentUser.socketSelected;
                    if (socketSelected == null) {
                        equipmentUser.equipEntityWithItem(uwpe);
                    }
                    else {
                        equipmentUser.equipItemEntityInSocketWithName(uwpe, socketSelected.defnName, true // includeSocketNameInMessage
                        );
                    }
                };
                var equipItemSelectedInQuickSlot = (quickSlotNumber) => {
                    uwpe.entity2 = equipmentUser.itemEntitySelected;
                    equipmentUser.equipItemEntityInSocketWithName(uwpe, "Item" + quickSlotNumber, // socketName
                    true // includeSocketNameInMessage
                    );
                };
                var fontButton = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 0.8);
                var buttonEquip = GameFramework.ControlButton.from8("buttonEquip", GameFramework.Coords.fromXY(85, 50), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                ">", // text
                fontButton, true, // hasBorder
                GameFramework.DataBinding.fromTrue(), // isEnabled - todo
                equipItemSelectedToSocketSelected);
                var unequipFromSocketSelected = () => {
                    var socketToUnequipFrom = equipmentUser.socketSelected;
                    equipmentUser.unequipItemFromSocketWithName(world, socketToUnequipFrom.defnName);
                };
                var buttonUnequip = GameFramework.ControlButton.from8("buttonEquip", GameFramework.Coords.fromXY(85, 65), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                "<", // text
                fontButton, true, // hasBorder
                GameFramework.DataBinding.fromTrue(), // isEnabled - todo
                unequipFromSocketSelected);
                var listEquipped = new GameFramework.ControlList("listEquipped", GameFramework.Coords.fromXY(100, 15), // pos
                GameFramework.Coords.fromXY(90, listHeight), // size
                GameFramework.DataBinding.fromContextAndGet(this, (c) => c.socketGroup.sockets), // items
                GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                fontSmall, new GameFramework.DataBinding(this, (c) => c.socketSelected, (c, v) => c.socketSelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                null, // bindingForIsEnabled
                unequipFromSocketSelected, // confirm
                null);
                var back = () => universe.venueTransitionTo(venuePrev);
                var returnValue = new GameFramework.ControlContainer("Equip", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelEquippable", GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Equippable:"), fontSmall),
                    listEquippables,
                    buttonEquip,
                    buttonUnequip,
                    new GameFramework.ControlLabel("labelEquipped", GameFramework.Coords.fromXY(100, 5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Equipped:"), fontSmall),
                    listEquipped,
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(sizeBase.x / 2, 125), // pos
                    GameFramework.Coords.fromXY(sizeBase.x, 15), // size
                    true, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontSmall)
                ], [
                    new GameFramework.Action("Back", back),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot0", () => equipItemSelectedInQuickSlot(0)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot1", () => equipItemSelectedInQuickSlot(1)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot2", () => equipItemSelectedInQuickSlot(2)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot3", () => equipItemSelectedInQuickSlot(3)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot4", () => equipItemSelectedInQuickSlot(4)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot5", () => equipItemSelectedInQuickSlot(5)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot6", () => equipItemSelectedInQuickSlot(6)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot7", () => equipItemSelectedInQuickSlot(7)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot8", () => equipItemSelectedInQuickSlot(8)),
                    new GameFramework.Action("EquipItemSelectedInQuickSlot9", () => equipItemSelectedInQuickSlot(9))
                ], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot0", ["_0"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot1", ["_1"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot2", ["_2"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot3", ["_3"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot4", ["_4"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot5", ["_5"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot6", ["_6"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot7", ["_7"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot8", ["_8"], true),
                    new GameFramework.ActionToInputsMapping("EquipItemSelectedInQuickSlot9", ["_9"], true)
                ]);
                if (includeTitleAndDoneButton) {
                    var childControls = returnValue.children;
                    childControls.splice(0, 0, new GameFramework.ControlLabel("labelEquipment", GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    true, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Equip"), fontLarge));
                    childControls.push(GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(170, 115), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Done", fontSmall, true, // hasBorder
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
            clone() { return this; }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.EquipmentUser = EquipmentUser;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
