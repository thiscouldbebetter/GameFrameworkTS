"use strict";
class EquipmentUser extends EntityProperty {
    constructor(socketDefnGroup) {
        super();
        this.socketGroup = new EquipmentSocketGroup(socketDefnGroup);
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
    // control
    toControl(universe, size, entityEquipmentUser, venuePrev, includeTitleAndDoneButton) {
        this.statusMessage = "Equip items in available slots.";
        if (size == null) {
            size = universe.display.sizeDefault().clone();
        }
        var sizeBase = new Coords(200, 135, 1);
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
        var listEquippables = new ControlList("listEquippables", new Coords(10, 15, 0), // pos
        new Coords(70, listHeight, 0), // size
        new DataBinding(itemEntitiesEquippable, null, null), // items
        new DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
        fontHeightSmall, new DataBinding(this, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
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
        var buttonEquip = new ControlButton("buttonEquip", new Coords(85, 50, 0), // pos
        new Coords(10, 10, 0), // size
        ">", // text
        fontHeight * 0.8, true, // hasBorder
        true, // isEnabled - todo
        equipItemSelectedToSocketSelected, null, null);
        var unequipFromSocketSelected = () => {
            var socketToUnequipFrom = equipmentUser.socketSelected;
            var message = equipmentUser.unequipItemFromSocketWithName(world, socketToUnequipFrom.defnName);
            equipmentUser.statusMessage = message;
        };
        var buttonUnequip = new ControlButton("buttonEquip", new Coords(85, 65, 0), // pos
        new Coords(10, 10, 0), // size
        "<", // text
        fontHeight * 0.8, true, // hasBorder
        true, // isEnabled - todo
        unequipFromSocketSelected, null, null);
        var listEquipped = new ControlList("listEquipped", new Coords(100, 15, 0), // pos
        new Coords(90, listHeight, 0), // size
        new DataBinding(sockets, null, null), // items
        new DataBinding(null, (c) => c.toString(world), null), // bindingForItemText
        fontHeightSmall, new DataBinding(this, (c) => c.socketSelected, (c, v) => { c.socketSelected = v; }), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        null, // bindingForIsEnabled
        unequipFromSocketSelected, // confirm
        null);
        var back = function () {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var returnValue = new ControlContainer("Equip", new Coords(0, 0, 0), // pos
        sizeBase.clone(), // size
        // children
        [
            new ControlLabel("labelEquippable", new Coords(10, 5, 0), // pos
            new Coords(70, 25, 0), // size
            false, // isTextCentered
            "Equippable:", fontHeightSmall),
            listEquippables,
            buttonEquip,
            buttonUnequip,
            new ControlLabel("labelEquipped", new Coords(100, 5, 0), // pos
            new Coords(100, 25, 0), // size
            false, // isTextCentered
            "Equipped:", fontHeightSmall),
            listEquipped,
            new ControlLabel("infoStatus", new Coords(sizeBase.x / 2, 125, 0), // pos
            new Coords(sizeBase.x, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => c.statusMessage, null), // text
            fontHeightSmall)
        ], [
            new Action("Back", back),
            new Action("EquipItemSelectedInQuickSlot0", () => equipItemSelectedInQuickSlot(0)),
            new Action("EquipItemSelectedInQuickSlot1", () => equipItemSelectedInQuickSlot(1)),
            new Action("EquipItemSelectedInQuickSlot2", () => equipItemSelectedInQuickSlot(2)),
            new Action("EquipItemSelectedInQuickSlot3", () => equipItemSelectedInQuickSlot(3)),
            new Action("EquipItemSelectedInQuickSlot4", () => equipItemSelectedInQuickSlot(4)),
            new Action("EquipItemSelectedInQuickSlot5", () => equipItemSelectedInQuickSlot(5)),
            new Action("EquipItemSelectedInQuickSlot6", () => equipItemSelectedInQuickSlot(6)),
            new Action("EquipItemSelectedInQuickSlot7", () => equipItemSelectedInQuickSlot(7)),
            new Action("EquipItemSelectedInQuickSlot8", () => equipItemSelectedInQuickSlot(8)),
            new Action("EquipItemSelectedInQuickSlot9", () => equipItemSelectedInQuickSlot(9))
        ], [
            new ActionToInputsMapping("Back", [Input.Names().Escape], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot0", ["_0"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot1", ["_1"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot2", ["_2"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot3", ["_3"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot4", ["_4"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot5", ["_5"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot6", ["_6"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot7", ["_7"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot8", ["_8"], true),
            new ActionToInputsMapping("EquipItemSelectedInQuickSlot9", ["_9"], true)
        ]);
        if (includeTitleAndDoneButton) {
            var childControls = returnValue.children;
            childControls.splice(0, 0, new ControlLabel("labelEquipment", new Coords(100, -5, 0), // pos
            new Coords(100, 25, 0), // size
            true, // isTextCentered
            "Equip", fontHeightLarge));
            childControls.push(new ControlButton("buttonDone", new Coords(170, 115, 0), // pos
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
}
