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
            message = this.equipItemEntityInSocketWithName(universe, world, place, itemEntityToEquip, socketFoundName, false);
        }
        return message;
    }
    ;
    equipItemEntityInSocketWithName(universe, world, place, itemEntityToEquip, socketName, includeSocketNameInMessage) {
        var itemToEquip = itemEntityToEquip.item();
        var itemDefn = itemToEquip.defn(world);
        var equippable = itemEntityToEquip.equippable();
        var message = itemDefn.appearance;
        var socket = this.socketGroup.socketsByDefnName.get(socketName);
        if (socket == null) {
            message += " cannot be equipped.";
        }
        else if (socket.itemEntityEquipped == itemEntityToEquip) {
            if (equippable != null) {
                equippable.unequip(universe, world, place, itemEntityToEquip);
            }
            socket.itemEntityEquipped = null;
            message += " unequipped.";
        }
        else {
            if (equippable != null) {
                equippable.equip(universe, world, place, itemEntityToEquip);
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
    ;
    itemEntityInSocketWithName(socketName) {
        return this.socketGroup.socketsByDefnName.get(socketName).itemEntityEquipped;
    }
    ;
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
                if (itemEntitiesHeld.indexOf(socketItemEntity) == -1) {
                    socket.itemEntityEquipped = null;
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
        var listEquippables = new ControlList("listEquippables", new Coords(10, 15, 0), // pos
        new Coords(70, listHeight, 0), // size
        new DataBinding(itemEntitiesEquippable, null, null), // items
        new DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
        fontHeightSmall, new DataBinding(this, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        null, // bindingForIsEnabled
        function confirm() {
            var itemEntityToEquip = equipmentUser.itemEntitySelected;
            var message = equipmentUser.equipEntityWithItem(universe, world, place, entityEquipmentUser, itemEntityToEquip);
            equipmentUser.statusMessage = message;
        }, null);
        var listEquipped = new ControlList("listEquipped", new Coords(90, 15, 0), // pos
        new Coords(100, listHeight, 0), // size
        new DataBinding(sockets, null, null), // items
        new DataBinding(null, (c) => c.toString(world), null), // bindingForItemText
        fontHeightSmall, new DataBinding(this, (c) => c.socketSelected, (c, v) => { c.socketSelected = v; }), // bindingForItemSelected
        DataBinding.fromGet((c) => c), // bindingForItemValue
        null, // bindingForIsEnabled
        function confirm() {
            var socketToUnequipFrom = equipmentUser.socketSelected;
            var message = equipmentUser.unequipItemFromSocketWithName(world, socketToUnequipFrom.defnName);
            equipmentUser.statusMessage = message;
        }, null);
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
            new ControlLabel("labelEquipped", new Coords(90, 5, 0), // pos
            new Coords(100, 25, 0), // size
            false, // isTextCentered
            "Equipped:", fontHeightSmall),
            listEquipped,
            new ControlLabel("infoStatus", new Coords(sizeBase.x / 2, 125, 0), // pos
            new Coords(sizeBase.x, 15, 0), // size
            true, // isTextCentered
            new DataBinding(this, (c) => c.statusMessage, null), // text
            fontHeightSmall)
        ], [new Action("Back", back)], [new ActionToInputsMapping("Back", [Input.Names().Escape], true)]);
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
    ;
}
