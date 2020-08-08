"use strict";
class ItemContainer {
    transfer(world, entityFrom, entityTo, messagePrefix) {
        var itemHolderFrom = entityFrom.itemHolder();
        var itemHolderTo = entityTo.itemHolder();
        if (itemHolderFrom.itemEntitySelected != null) {
            var itemEntityToTransfer = itemHolderFrom.itemEntitySelected;
            var itemToTransfer = itemEntityToTransfer.item();
            itemHolderFrom.itemEntityTransferSingleTo(itemEntityToTransfer, itemHolderTo);
            if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0) {
                itemHolderFrom.itemEntitySelected = null;
            }
            this.statusMessage =
                messagePrefix
                    + " " + itemToTransfer.defnName + ".";
        }
    }
    ;
    // Controllable.
    toControl(universe, size, entityGetterPutter, entityContainer, venuePrev) {
        if (size == null) {
            size = universe.display.sizeDefault();
        }
        var fontHeight = 10;
        var margin = fontHeight * 1.5;
        var buttonSize = new Coords(4, 2, 0).multiplyScalar(fontHeight);
        var listSize = new Coords((size.x - margin * 3) / 2, size.y - margin * 4 - buttonSize.y - fontHeight, 0);
        var itemContainer = this;
        var itemHolderGetterPutter = entityGetterPutter.itemHolder();
        var itemHolderContainer = entityContainer.itemHolder();
        var world = universe.world;
        var back = function () {
            var venueNext = venuePrev;
            venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
            universe.venueNext = venueNext;
        };
        var get = () => {
            itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
        };
        var put = () => {
            itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
        };
        var returnValue = new ControlContainer("containerTransfer", new Coords(0, 0, 0), // pos
        size.clone(), 
        // children
        [
            new ControlLabel("labelStoreName", new Coords(margin, margin, 0), // pos
            new Coords(listSize.x, 25, 0), // size
            false, // isTextCentered
            entityContainer.name + ":", fontHeight),
            new ControlList("listStoreItems", new Coords(margin, margin * 2, 0), // pos
            listSize.clone(), new DataBinding(itemHolderContainer, (c) => {
                return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
            }, null), // items
            new DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
            fontHeight, new DataBinding(itemHolderContainer, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromContext(true), // isEnabled
            get, // confirm
            null),
            new ControlLabel("labelCustomerName", new Coords(size.x - margin - listSize.x, margin, 0), // pos
            new Coords(85, 25, 0), // size
            false, // isTextCentered
            entityGetterPutter.name + ":", fontHeight),
            new ControlList("listOtherItems", new Coords(size.x - margin - listSize.x, margin * 2, 0), // pos
            listSize.clone(), new DataBinding(itemHolderGetterPutter, (c) => {
                return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
            }, null), // items
            new DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
            fontHeight, new DataBinding(itemHolderGetterPutter, (c) => c.itemEntitySelected, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromContext(true), // isEnabled
            put, // confirm
            null),
            new ControlButton("buttonGet", new Coords(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y, 0), // pos
            buttonSize.clone(), ">", fontHeight, true, // hasBorder
            DataBinding.fromContext(true), // isEnabled
            get, // click
            null, null),
            new ControlButton("buttonPut", new Coords(size.x / 2 + margin / 2, size.y - margin - buttonSize.y, 0), // pos
            buttonSize.clone(), "<", fontHeight, true, // hasBorder
            DataBinding.fromContext(true), // isEnabled
            put, // click
            null, null),
            new ControlLabel("infoStatus", new Coords(size.x / 2, size.y - margin * 2 - buttonSize.y, 0), // pos
            new Coords(size.x, fontHeight, 0), // size
            true, // isTextCentered
            new DataBinding(this, c => c.statusMessage, null), fontHeight),
            new ControlButton("buttonDone", new Coords(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y, 0), // pos
            buttonSize.clone(), "Done", fontHeight, true, // hasBorder
            true, // isEnabled
            back, // click
            null, null)
        ], [new Action("Back", back)], [new ActionToInputsMapping("Back", [Input.Names().Escape], true)]);
        return returnValue;
    }
    ;
}
