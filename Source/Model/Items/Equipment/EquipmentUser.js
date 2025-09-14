"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EquipmentUser extends GameFramework.EntityPropertyBase {
            constructor(socketDefnGroup) {
                super();
                this.socketGroup = new GameFramework.EquipmentSocketGroup(socketDefnGroup);
            }
            static default() {
                var socketDefnGroup = GameFramework.EquipmentSocketDefnGroup.default();
                return new EquipmentUser(socketDefnGroup);
            }
            static fromSocketDefnGroup(socketDefnGroup) {
                return new EquipmentUser(socketDefnGroup);
            }
            static of(entity) {
                return entity.propertyByName(EquipmentUser.name);
            }
            equipAll(uwpe) {
                var world = uwpe.world;
                var entityEquipmentUser = uwpe.entity;
                var itemHolder = GameFramework.ItemHolder.of(entityEquipmentUser);
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
                            uwpe.entity2Set(itemToEquipAsEntity);
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
                var itemToEquip = GameFramework.Item.of(itemEntityToEquip);
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
                var itemToEquipDefnName = GameFramework.Item.of(itemEntityToEquip).defnName;
                var socketFound = null;
                var itemQuickSlotCount = 10;
                for (var i = 0; i < itemQuickSlotCount; i++) {
                    var socketName = "Item" + i;
                    var socket = this.socketByName(socketName);
                    if (socketFound == null && socket.itemEntityEquipped == null) {
                        socketFound = socket;
                    }
                    else if (socket.itemEntityEquipped != null) {
                        var itemInSocketDefnName = GameFramework.Item.of(socket.itemEntityEquipped).defnName;
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
                    var itemToEquip = GameFramework.Item.of(itemEntityToEquip);
                    var itemDefn = itemToEquip.defn(world);
                    var equippable = GameFramework.Equippable.of(itemEntityToEquip);
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
            entityIsInSocketWithName(name) {
                var entityEquipped = this.itemEntityInSocketWithName(name);
                var entityIsEquipped = (entityEquipped != null);
                return entityIsEquipped;
            }
            entityIsInSocketWithNameWielding() {
                return this.entityIsInSocketWithName("Wielding");
            }
            itemEntityInSocketWithName(socketName) {
                var socket = this.socketByName(socketName);
                var itemEntity = socket == null
                    ? null
                    : socket.itemEntityEquipped;
                return itemEntity;
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
                        var itemToUnequip = GameFramework.Item.of(itemEntityToUnequip);
                        var itemDefn = itemToUnequip.defn(world);
                        message = itemDefn.appearance + " unequipped.";
                    }
                }
                this.statusMessage = message;
            }
            unequipItemsNoLongerHeld(uwpe) {
                var entityEquipmentUser = uwpe.entity;
                var itemHolder = GameFramework.ItemHolder.of(entityEquipmentUser);
                var itemsHeld = itemHolder.items;
                var sockets = this.socketGroup.sockets;
                for (var i = 0; i < sockets.length; i++) {
                    var socket = sockets[i];
                    var socketItemEntity = socket.itemEntityEquipped;
                    if (socketItemEntity != null) {
                        var socketItem = GameFramework.Item.of(socketItemEntity);
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
                var socket = this.socketGroup.sockets.filter(x => GameFramework.Item.of(x.itemEntityEquipped) == itemToUnequip)[0];
                if (socket != null) {
                    socket.itemEntityEquipped = null;
                }
            }
            useItemInSocketNumbered(uwpe, socketNumber) {
                var actor = uwpe.entity;
                var equipmentUser = EquipmentUser.of(actor);
                var socketName = "Item" + socketNumber;
                var itemEntityToUse = equipmentUser.itemEntityInSocketWithName(socketName);
                if (itemEntityToUse != null) {
                    var itemToUse = GameFramework.Item.of(itemEntityToUse);
                    uwpe.entity2Set(itemEntityToUse);
                    itemToUse.use(uwpe);
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
                var itemHolder = GameFramework.ItemHolder.of(entityEquipmentUser);
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
                var itemEntitiesEquippable = itemEntities.filter(x => GameFramework.Equippable.of(x) != null);
                var world = universe.world;
                var place = world.placeCurrent;
                var listHeight = 100;
                var equipItemSelectedToSocketDefault = () => this.equipItemSelectedToSocketDefault(uwpe);
                var listEquippables = new GameFramework.ControlList("listEquippables", GameFramework.Coords.fromXY(10, 15), // pos
                GameFramework.Coords.fromXY(70, listHeight), // size
                GameFramework.DataBinding.fromContextAndGet(this, (c) => itemEntitiesEquippable), // items
                GameFramework.DataBinding.fromGet((c) => GameFramework.Item.of(c).toString(world)), // bindingForItemText
                fontSmall, new GameFramework.DataBinding(this, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                null, // bindingForIsEnabled
                equipItemSelectedToSocketDefault, null);
                var fontButton = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight * 0.8);
                var equipItemSelectedToSocketSelected = () => this.equipItemSelectedToSocketSelected(uwpe);
                var buttonEquip = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 50), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                ">", // text
                fontButton, equipItemSelectedToSocketSelected);
                var unequipFromSocketSelected = () => this.unequipFromSocketSelected(uwpe);
                var buttonUnequip = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(85, 65), // pos
                GameFramework.Coords.fromXY(10, 10), // size
                "<", // text
                fontButton, unequipFromSocketSelected);
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
                var equipItemSelectedInQuickSlot = (quickSlotNumber) => this.equipItemSelectedInQuickSlot(uwpe, quickSlotNumber);
                var textEquipItemSelectedInQuickSlot = "EquipItemSelectedInQuickSlot";
                var containerChildControls = [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(10, 5), // pos
                    GameFramework.Coords.fromXY(70, 25), // size
                    GameFramework.DataBinding.fromContext("Equippable:"), fontSmall),
                    listEquippables,
                    buttonEquip,
                    buttonUnequip,
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(100, 5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContext("Equipped:"), fontSmall),
                    listEquipped,
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(sizeBase.x / 2, 125), // pos
                    GameFramework.Coords.fromXY(sizeBase.x, 15), // size
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.statusMessage), // text
                    fontSmall)
                ];
                var a = (a, b) => new GameFramework.Action(a, b);
                var containerActions = [
                    a("Back", back),
                    a(textEquipItemSelectedInQuickSlot + "0", () => equipItemSelectedInQuickSlot(0)),
                    a(textEquipItemSelectedInQuickSlot + "1", () => equipItemSelectedInQuickSlot(1)),
                    a(textEquipItemSelectedInQuickSlot + "2", () => equipItemSelectedInQuickSlot(2)),
                    a(textEquipItemSelectedInQuickSlot + "3", () => equipItemSelectedInQuickSlot(3)),
                    a(textEquipItemSelectedInQuickSlot + "4", () => equipItemSelectedInQuickSlot(4)),
                    a(textEquipItemSelectedInQuickSlot + "5", () => equipItemSelectedInQuickSlot(5)),
                    a(textEquipItemSelectedInQuickSlot + "6", () => equipItemSelectedInQuickSlot(6)),
                    a(textEquipItemSelectedInQuickSlot + "7", () => equipItemSelectedInQuickSlot(7)),
                    a(textEquipItemSelectedInQuickSlot + "8", () => equipItemSelectedInQuickSlot(8)),
                    a(textEquipItemSelectedInQuickSlot + "9", () => equipItemSelectedInQuickSlot(9))
                ];
                var atim = (a, b) => new GameFramework.ActionToInputsMapping(a, [b], true);
                var inputs = GameFramework.Input.Instances();
                var mappings = [
                    atim("Back", inputs.Escape.name),
                    atim(textEquipItemSelectedInQuickSlot + "0", inputs._0.name),
                    atim(textEquipItemSelectedInQuickSlot + "1", inputs._1.name),
                    atim(textEquipItemSelectedInQuickSlot + "2", inputs._2.name),
                    atim(textEquipItemSelectedInQuickSlot + "3", inputs._3.name),
                    atim(textEquipItemSelectedInQuickSlot + "4", inputs._4.name),
                    atim(textEquipItemSelectedInQuickSlot + "5", inputs._5.name),
                    atim(textEquipItemSelectedInQuickSlot + "6", inputs._6.name),
                    atim(textEquipItemSelectedInQuickSlot + "7", inputs._7.name),
                    atim(textEquipItemSelectedInQuickSlot + "8", inputs._8.name),
                    atim(textEquipItemSelectedInQuickSlot + "9", inputs._9.name)
                ];
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenActionsAndMappings("Equip", GameFramework.Coords.create(), // pos
                sizeBase.clone(), // size
                containerChildControls, containerActions, mappings);
                if (includeTitleAndDoneButton) {
                    var childControls = returnValue.children;
                    childControls.splice(0, 0, GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(100, -5), // pos
                    GameFramework.Coords.fromXY(100, 25), // size
                    GameFramework.DataBinding.fromContext("Equip"), fontLarge));
                    childControls.push(GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(170, 115), // pos
                    GameFramework.Coords.fromXY(20, 10), // size
                    "Done", fontSmall, back // click
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
            // Actions.
            equipItemSelectedToSocketDefault(uwpe) {
                var itemEntityToEquip = this.itemEntitySelected;
                uwpe.entity2Set(itemEntityToEquip);
                this.equipEntityWithItem(uwpe);
            }
            ;
            equipItemSelectedToSocketSelected(uwpe) {
                var itemEntityToEquip = this.itemEntitySelected;
                uwpe.entity2Set(itemEntityToEquip);
                var socketSelected = this.socketSelected;
                if (socketSelected == null) {
                    this.equipEntityWithItem(uwpe);
                }
                else {
                    this.equipItemEntityInSocketWithName(uwpe, socketSelected.defnName, true // includeSocketNameInMessage
                    );
                }
            }
            equipItemSelectedInQuickSlot(uwpe, quickSlotNumber) {
                uwpe.entity2Set(this.itemEntitySelected);
                this.equipItemEntityInSocketWithName(uwpe, "Item" + quickSlotNumber, // socketName
                true // includeSocketNameInMessage
                );
            }
            unequipFromSocketSelected(uwpe) {
                var socketToUnequipFrom = this.socketSelected;
                this.unequipItemFromSocketWithName(uwpe.world, socketToUnequipFrom.defnName);
            }
            // Clonable.
            clone() { return this; }
        }
        GameFramework.EquipmentUser = EquipmentUser;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
