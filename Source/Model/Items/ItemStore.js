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
                if (itemHolderFrom.itemSelected != null) {
                    var itemToTransfer = itemHolderFrom.itemSelected;
                    var tradeValue = itemToTransfer.defn(world).tradeValue;
                    var itemCurrencyNeeded = new GameFramework.Item(this.itemDefnNameCurrency, 0);
                    var itemDefnCurrency = itemCurrencyNeeded.defn(world);
                    itemCurrencyNeeded.quantity = Math.ceil(tradeValue / itemDefnCurrency.tradeValue);
                    if (itemHolderTo.hasItem(itemCurrencyNeeded)) {
                        itemHolderFrom.itemTransferSingleTo(itemToTransfer, itemHolderTo);
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
                var back = () => {
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
                    new GameFramework.ControlLabel("labelStoreName", GameFramework.Coords.fromXY(margin, margin), // pos
                    GameFramework.Coords.fromXY(listSize.x, 25), // size
                    false, // isTextCentered
                    entityStore.name + ":", fontHeight),
                    new GameFramework.ControlList("listStoreItems", GameFramework.Coords.fromXY(margin, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderStore, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderStore, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    buy, // confirm
                    null),
                    new GameFramework.ControlLabel("labelCustomerName", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    false, // isTextCentered
                    entityCustomer.name + ":", fontHeight),
                    GameFramework.ControlButton.from8("buttonBuy", GameFramework.Coords.fromXY(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Buy", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    buy // click
                    ),
                    new GameFramework.ControlList("listCustomerItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderCustomer, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderCustomer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    sell, // confirm
                    null),
                    GameFramework.ControlButton.from8("buttonSell", GameFramework.Coords.fromXY(size.x / 2 + margin / 2, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Sell", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    sell // click
                    ),
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(this, c => c.statusMessage, null), fontHeight),
                    GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back // click
                    )
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemStore = ItemStore;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
