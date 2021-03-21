"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemStore extends GameFramework.EntityProperty {
            constructor(itemDefnNameCurrency) {
                super();
                this.itemDefnNameCurrency = itemDefnNameCurrency;
                this.statusMessage = "-";
            }
            transfer(world, entityFrom, entityTo, messagePrefix) {
                var itemHolderFrom = entityFrom.itemHolder();
                var itemHolderTo = entityTo.itemHolder();
                if (itemHolderFrom.itemEntitySelected != null) {
                    var itemEntityToTransfer = itemHolderFrom.itemEntitySelected;
                    var itemToTransfer = itemEntityToTransfer.item();
                    var tradeValue = itemToTransfer.defn(world).tradeValue;
                    var itemCurrencyNeeded = new GameFramework.Item(this.itemDefnNameCurrency, 0);
                    var itemDefnCurrency = itemCurrencyNeeded.defn(world);
                    itemCurrencyNeeded.quantity = Math.ceil(tradeValue / itemDefnCurrency.tradeValue);
                    if (itemHolderTo.hasItem(itemCurrencyNeeded)) {
                        itemHolderFrom.itemEntityTransferSingleTo(itemEntityToTransfer, itemHolderTo);
                        itemHolderTo.itemTransferTo(itemCurrencyNeeded, itemHolderFrom);
                        this.statusMessage =
                            messagePrefix
                                + " " + itemToTransfer.defnName
                                + " for " + itemCurrencyNeeded.quantity + ".";
                    }
                    else {
                        this.statusMessage = "Not enough currency!";
                    }
                }
            }
            use(universe, world, place, entityUsing, entityUsed) {
                //entityUsed.collidable().ticksUntilCanCollide = 50; // hack
                var storeAsControl = entityUsed.itemStore().toControl(universe, universe.display.sizeInPixels, entityUsing, entityUsed, universe.venueCurrent);
                var venueNext = storeAsControl.toVenue();
                venueNext = GameFramework.VenueFader.fromVenueTo(venueNext);
                universe.venueNext = venueNext;
            }
            // Controllable.
            toControl(universe, size, entityCustomer, entityStore, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var margin = fontHeight * 1.5;
                var buttonSize = new GameFramework.Coords(4, 2, 0).multiplyScalar(fontHeight);
                var listSize = new GameFramework.Coords((size.x - margin * 3) / 2, size.y - margin * 4 - buttonSize.y - fontHeight, 0);
                var itemBarterer = this;
                var itemHolderCustomer = entityCustomer.itemHolder();
                var itemHolderStore = entityStore.itemHolder();
                var world = universe.world;
                var back = function () {
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var buy = () => {
                    itemBarterer.transfer(world, entityStore, entityCustomer, "Purchased");
                };
                var sell = () => {
                    itemBarterer.transfer(world, entityCustomer, entityStore, "Sold");
                };
                var returnValue = new GameFramework.ControlContainer("containerTransfer", GameFramework.Coords.create(), // pos
                size.clone(), 
                // children
                [
                    new GameFramework.ControlLabel("labelStoreName", new GameFramework.Coords(margin, margin, 0), // pos
                    new GameFramework.Coords(listSize.x, 25, 0), // size
                    false, // isTextCentered
                    entityStore.name + ":", fontHeight),
                    new GameFramework.ControlList("listStoreItems", new GameFramework.Coords(margin, margin * 2, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderStore, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderStore, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    buy, // confirm
                    null),
                    new GameFramework.ControlLabel("labelCustomerName", new GameFramework.Coords(size.x - margin - listSize.x, margin, 1), // pos
                    new GameFramework.Coords(85, 25, 1), // size
                    false, // isTextCentered
                    entityCustomer.name + ":", fontHeight),
                    new GameFramework.ControlButton("buttonBuy", new GameFramework.Coords(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y, 1), // pos
                    buttonSize.clone(), "Buy", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    buy, // click
                    null, null),
                    new GameFramework.ControlList("listCustomerItems", new GameFramework.Coords(size.x - margin - listSize.x, margin * 2, 1), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderCustomer, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderCustomer, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    sell, // confirm
                    null),
                    new GameFramework.ControlButton("buttonSell", new GameFramework.Coords(size.x / 2 + margin / 2, size.y - margin - buttonSize.y, 0), // pos
                    buttonSize.clone(), "Sell", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    sell, // click
                    null, null),
                    new GameFramework.ControlLabel("infoStatus", new GameFramework.Coords(size.x / 2, size.y - margin * 2 - buttonSize.y, 0), // pos
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
        GameFramework.ItemStore = ItemStore;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
