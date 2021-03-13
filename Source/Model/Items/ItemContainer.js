"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemContainer extends GameFramework.EntityProperty {
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
            // Controllable.
            toControl(universe, size, entityGetterPutter, entityContainer, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var margin = fontHeight * 1.5;
                var buttonSize = new GameFramework.Coords(2, 2, 0).multiplyScalar(fontHeight);
                var listSize = new GameFramework.Coords((size.x - margin * 4 - buttonSize.x) / 2, size.y - margin * 4 - fontHeight * 2, 0);
                var itemContainer = this;
                var itemHolderGetterPutter = entityGetterPutter.itemHolder();
                var itemHolderContainer = entityContainer.itemHolder();
                var world = universe.world;
                var back = function () {
                    var venueNext = venuePrev;
                    venueNext = new GameFramework.VenueFader(venueNext, universe.venueCurrent, null, null);
                    universe.venueNext = venueNext;
                };
                var get = () => {
                    itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
                };
                var put = () => {
                    itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
                };
                var returnValue = new GameFramework.ControlContainer("containerTransfer", new GameFramework.Coords(0, 0, 0), // pos
                size.clone(), 
                // children
                [
                    new GameFramework.ControlLabel("labelContainerName", new GameFramework.Coords(margin, margin, 0), // pos
                    new GameFramework.Coords(listSize.x, 25, 0), // size
                    false, // isTextCentered
                    entityContainer.name + ":", fontHeight),
                    new GameFramework.ControlList("listContainerItems", new GameFramework.Coords(margin, margin * 2, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderContainer, (c) => {
                        return c.itemEntities;
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderContainer, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    get, // confirm
                    null),
                    new GameFramework.ControlButton("buttonGet", new GameFramework.Coords((size.x - buttonSize.x) / 2, (size.y - buttonSize.y - margin) / 2, 0), // pos
                    buttonSize.clone(), ">", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    get, // click
                    null, null),
                    new GameFramework.ControlButton("buttonPut", new GameFramework.Coords((size.x - buttonSize.x) / 2, (size.y + buttonSize.y + margin) / 2, 0), // pos
                    buttonSize.clone(), "<", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    put, // click
                    null, null),
                    new GameFramework.ControlLabel("labelGetterPutterName", new GameFramework.Coords(size.x - margin - listSize.x, margin, 0), // pos
                    new GameFramework.Coords(85, 25, 0), // size
                    false, // isTextCentered
                    entityGetterPutter.name + ":", fontHeight),
                    new GameFramework.ControlList("listOtherItems", new GameFramework.Coords(size.x - margin - listSize.x, margin * 2, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderGetterPutter, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderGetterPutter, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    put, // confirm
                    null),
                    new GameFramework.ControlLabel("infoStatus", new GameFramework.Coords(size.x / 2, size.y - margin - fontHeight, 0), // pos
                    new GameFramework.Coords(size.x, fontHeight, 0), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(this, c => c.statusMessage, null), fontHeight),
                    new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y, 0), // pos
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
