"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentUser {
            constructor(socketDefnGroup) {
                this.socketGroup = new GameFramework.EquipmentSocketGroup(socketDefnGroup);
            }
            equipEntityWithItem(universe, world, place, entityEquipmentUser, itemEntityToEquip) {
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
                var message = "";
                if (socketFound == null) {
                    message = "Can't equip " + itemDefn.name + ".";
                }
                else {
                    var socketFoundName = socketFound.defnName;
                    message = this.equipItemEntityInSocketWithName(universe, world, place, entityEquipmentUser, itemEntityToEquip, socketFoundName, false);
                }
                return message;
            }
            equipItemEntityInFirstOpenQuickSlot(universe, world, place, entityEquipmentUser, itemEntityToEquip, includeSocketNameInMessage) {
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
                    this.equipItemEntityInSocketWithName(universe, world, place, entityEquipmentUser, itemEntityToEquip, socketFound.defnName, includeSocketNameInMessage);
                }
            }
            equipItemEntityInSocketWithName(universe, world, place, entityEquipmentUser, itemEntityToEquip, socketName, includeSocketNameInMessage) {
                if (itemEntityToEquip == null) {
                    return "Nothing to equip!";
                }
                var itemToEquip = itemEntityToEquip.item();
                var itemDefn = itemToEquip.defn(world);
                var equippable = itemEntityToEquip.equippable();
                var message = itemDefn.appearance;
                var socket = this.socketByName(socketName);
                if (socket == null) {
                    message += " cannot be equipped.";
                }
                else if (socket.itemEntityEquipped == itemEntityToEquip) {
                    if (equippable != null) {
                        equippable.unequip(universe, world, place, entityEquipmentUser, itemEntityToEquip);
                    }
                    socket.itemEntityEquipped = null;
                    message += " unequipped.";
                }
                else {
                    if (equippable != null) {
                        equippable.equip(universe, world, place, entityEquipmentUser, itemEntityToEquip);
                    }
                    socket.itemEntityEquipped = itemEntityToEquip;
                    message += " equipped";
                    if (includeSocketNameInMessage) {
                        message += " as " + socket.defnName;
                    }
                    message += ".";
                }
                return message;
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
                return message;
            }
            unequipItemsNoLongerHeld(entityEquipmentUser) {
                var itemHolder = entityEquipmentUser.itemHolder();
                var itemEntitiesHeld = itemHolder.itemEntities;
                var sockets = this.socketGroup.sockets;
                for (var i = 0; i < sockets.length; i++) {
                    var socket = sockets[i];
                    var socketItemEntity = socket.itemEntityEquipped;
                    if (socketItemEntity != null) {
                        var socketItemDefnName = socketItemEntity.item().defnName;
                        if (itemEntitiesHeld.indexOf(socketItemEntity) == -1) {
                            var itemEntityOfSameType = itemEntitiesHeld.filter(x => x.item().defnName == socketItemDefnName)[0];
                            socket.itemEntityEquipped = itemEntityOfSameType;
                        }
                    }
                }
            }
            unequipItemEntity(itemEntityToUnequip) {
                var socket = this.socketGroup.sockets.filter(x => x.itemEntityEquipped == itemEntityToUnequip)[0];
                if (socket != null) {
                    socket.itemEntityEquipped = null;
                }
            }
            useItemInSocketNumbered(universe, world, place, actor, socketNumber) {
                var equipmentUser = actor.equipmentUser();
                var socketName = "Item" + socketNumber;
                var entityItemEquipped = equipmentUser.itemEntityInSocketWithName(socketName);
                if (entityItemEquipped != null) {
                    var itemEquipped = entityItemEquipped.item();
                    itemEquipped.use(universe, world, place, actor, entityItemEquipped);
                }
                this.unequipItemsNoLongerHeld(actor);
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
            // control
            toControl(universe, size, entityEquipmentUser, venuePrev, includeTitleAndDoneButton) {
                this.statusMessage = "Equip items in available slots.";
                if (size == null) {
                    size = universe.display.sizeDefault().clone();
                }
                var sizeBase = GameFramework.Coords.fromXY(200, 135);
                var fontHeight = 10;
                var fontHeightSmall = fontHeight * .6;
                var fontHeightLarge = fontHeight * 1.5;
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
                var itemEntitiesEquippable = itemHolder.itemEntities.filter(x => x.equippable() != null);
                var world = universe.world;
                var place = world.placeCurrent;
                var listHeight = 100;
                var equipItemSelectedToSocketDefault = () => {
                    var itemEntityToEquip = equipmentUser.itemEntitySelected;
                    var message = equipmentUser.equipEntityWithItem(universe, world, place, entityEquipmentUser, itemEntityToEquip);
                    equipmentUser.statusMessage = message;
                };
                var listEquippables = new GameFramework.ControlList("listEquippables", GameFramework.Coords.fromXY(10, 15), // pos
                GameFramework.Coords.fromXY(70, listHeight), // size
                GameFramework.DataBinding.fromContext(itemEntitiesEquippable), // items
                GameFramework.DataBinding.fromGet((c) => c.item().toString(world)), // bindingForItemText
                fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                null, // bindingForIsEnabled
                equipItemSelectedToSocketDefault, null);
                var equipItemSelectedToSocketSelected = () => {
                    var itemEntityToEquip = equipmentUser.itemEntitySelected;
                    var message;
                    var socketSelected = equipmentUser.socketSelected;
                    if (socketSelected == null) {
                        message = equipmentUser.equipEntityWithItem(universe, world, place, entityEquipmentUser, itemEntityToEquip);
                    }
                    else {
                        message = equipmentUser.equipItemEntityInSocketWithName(universe, world, place, entityEquipmentUser, itemEntityToEquip, socketSelected.defnName, true // includeSocketNameInMessage
                        );
                    }
                    equipmentUser.statusMessage = message;
                };
                var equipItemSelectedInQuickSlot = (quickSlotNumber) => {
                    equipmentUser.equipItemEntityInSocketWithName(universe, universe.world, universe.world.placeCurrent, entityEquipmentUser, equipmentUser.itemEntitySelected, "Item" + quickSlotNumber, // socketName
                    true // includeSocketNameInMessage
                    );
                };
                var buttonEquip = GameFramework.ControlButton.from8("buttonEquip", GameFramework.Coords.fromXY(85, 50), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                ">", // text
                fontHeight * 0.8, true, // hasBorder
                true, // isEnabled - todo
                equipItemSelectedToSocketSelected);
                var unequipFromSocketSelected = () => {
                    var socketToUnequipFrom = equipmentUser.socketSelected;
                    var message = equipmentUser.unequipItemFromSocketWithName(world, socketToUnequipFrom.defnName);
                    equipmentUser.statusMessage = message;
                };
                var buttonUnequip = GameFramework.ControlButton.from8("buttonEquip", GameFramework.Coords.fromXY(85, 65), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                "<", // text
                fontHeight * 0.8, true, // hasBorder
                true, // isEnabled - todo
                unequipFromSocketSelected);
                var listEquipped = new GameFramework.ControlList("listEquipped", GameFramework.Coords.fromXY(100, 15), // pos
                GameFramework.Coords.fromXY(90, listHeight), // size
                GameFramework.DataBinding.fromContext(sockets), // items
                GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                fontHeightSmall, new GameFramework.DataBinding(this, (c) => c.socketSelected, (c, v) => c.socketSelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                null, // bindingForIsEnabled
                unequipFromSocketSelected, // confirm
                null);
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var returnValue = new GameFramework.ControlContainer("Equip", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                // children
                [
                    new GameFramework.ControlLabel("labelEquippable", GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    false, // isTextCentered
                    "Equippable:", fontHeightSmall),
                    listEquippables,
                    buttonEquip,
                    buttonUnequip,
                    new GameFramework.ControlLabel("labelEquipped", GameFramework.Coords.fromXY(100, 5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    false, // isTextCentered
                    "Equipped:", fontHeightSmall),
                    listEquipped,
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(sizeBase.x / 2, 125), // pos
                    GameFramework.Coords.fromXY(sizeBase.x, 15), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontHeightSmall)
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
                    true, // isTextCentered
                    "Equip", fontHeightLarge));
                    childControls.push(GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(170, 115), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Done", fontHeightSmall, true, // hasBorder
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
        }
        GameFramework.EquipmentUser = EquipmentUser;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
