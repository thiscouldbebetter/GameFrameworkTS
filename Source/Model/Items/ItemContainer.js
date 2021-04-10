"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemContainer {
            transfer(world, entityFrom, entityTo, messagePrefix) {
                var itemHolderFrom = entityFrom.itemHolder();
                var itemHolderTo = entityTo.itemHolder();
                if (itemHolderFrom.itemEntitySelected == null) {
                    this.statusMessage = "Select and click buttons transfer items.";
                }
                else {
                    var itemEntityToTransfer = itemHolderFrom.itemEntitySelected;
                    var itemToTransfer = itemEntityToTransfer.item();
                    itemHolderFrom.itemEntityTransferSingleTo(itemEntityToTransfer, itemHolderTo);
                    if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0) {
                        itemHolderFrom.itemEntitySelected = null;
                    }
                    this.statusMessage =
                        messagePrefix
                            + " " + itemToTransfer.defnName + ".";
                    var equipmentUser = entityFrom.equipmentUser();
                    if (equipmentUser != null) {
                        equipmentUser.unequipItemsNoLongerHeld(entityFrom);
                    }
                }
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) { }
            // Controllable.
            toControl(universe, size, entityGetterPutter, entityContainer, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var margin = fontHeight * 1.5;
                var buttonSize = GameFramework.Coords.fromXY(2, 2).multiplyScalar(fontHeight);
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 4 - buttonSize.x) / 2, size.y - margin * 4 - fontHeight * 2);
                var itemContainer = this;
                var itemHolderGetterPutter = entityGetterPutter.itemHolder();
                var itemHolderContainer = entityContainer.itemHolder();
                var world = universe.world;
                var back = () => {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var get = () => {
                    itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
                };
                var put = () => {
                    itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
                };
                var returnValue = new GameFramework.ControlContainer("containerTransfer", GameFramework.Coords.create(), // pos
                size.clone(), 
                // children
                [
                    new GameFramework.ControlLabel("labelContainerName", GameFramework.Coords.fromXY(margin, margin), // pos
                    GameFramework.Coords.fromXY(listSize.x, 25), // size
                    false, // isTextCentered
                    entityContainer.name + ":", fontHeight),
                    new GameFramework.ControlList("listContainerItems", GameFramework.Coords.fromXY(margin, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderContainer, (c) => {
                        return c.itemEntities;
                    }), // items
                    GameFramework.DataBinding.fromGet((c) => c.item().toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderContainer, (c) => c.itemEntitySelected, (c, v) => c.itemEntitySelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    get, // confirm
                    null),
                    GameFramework.ControlButton.from8("buttonGet", GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, (size.y - buttonSize.y - margin) / 2), // pos
                    buttonSize.clone(), ">", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    get // click
                    ),
                    GameFramework.ControlButton.from8("buttonPut", GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, (size.y + buttonSize.y + margin) / 2), // pos
                    buttonSize.clone(), "<", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    put // click
                    ),
                    new GameFramework.ControlLabel("labelGetterPutterName", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    false, // isTextCentered
                    entityGetterPutter.name + ":", fontHeight),
                    new GameFramework.ControlList("listOtherItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderGetterPutter, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }), // items
                    GameFramework.DataBinding.fromGet((c) => c.item().toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderGetterPutter, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    put, // confirm
                    null),
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(size.x / 2, size.y - margin - fontHeight), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, c => c.statusMessage), fontHeight),
                    new GameFramework.ControlButton("buttonDone", GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null)
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemContainer = ItemContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
