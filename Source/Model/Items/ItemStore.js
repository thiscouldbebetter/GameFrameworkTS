"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemStore extends GameFramework.EntityPropertyBase {
            constructor(itemDefnNameCurrency) {
                super();
                this.itemDefnNameCurrency = itemDefnNameCurrency;
                this.statusMessage = "-";
            }
            static of(entity) {
                return entity.propertyByName(ItemStore.name);
            }
            transfer(world, entityFrom, entityTo, messagePrefix) {
                var itemHolderFrom = GameFramework.ItemHolder.of(entityFrom);
                var itemHolderTo = GameFramework.ItemHolder.of(entityTo);
                if (itemHolderFrom.itemSelected != null) {
                    var itemToTransfer = itemHolderFrom.itemSelected;
                    var tradeValue = itemToTransfer.defn(world).tradeValue;
                    var itemCurrencyNeeded = new GameFramework.Item(this.itemDefnNameCurrency, tradeValue);
                    var itemDefnCurrency = itemCurrencyNeeded.defn(world);
                    itemCurrencyNeeded.quantitySet(Math.ceil(tradeValue / itemDefnCurrency.tradeValue));
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
            use(uwpe) {
                var universe = uwpe.universe;
                var entityUsing = uwpe.entity;
                var entityUsed = uwpe.entity2;
                var storeAsControl = ItemStore.of(entityUsed).toControl(universe, universe.display.sizeInPixels, entityUsing, entityUsed, universe.venueCurrent());
                var venueNext = storeAsControl.toVenue();
                universe.venueTransitionTo(venueNext);
            }
            // Clonable.
            clone() { return this; }
            // Controllable.
            toControl(universe, size, entityCustomer, entityStore, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var margin = fontHeight * 1.5;
                var buttonSize = GameFramework.Coords.fromXY(4, 2).multiplyScalar(fontHeight);
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 3) / 2, size.y - margin * 4 - buttonSize.y - fontHeight);
                var itemBarterer = this;
                var itemHolderCustomer = GameFramework.ItemHolder.of(entityCustomer);
                var itemHolderStore = GameFramework.ItemHolder.of(entityStore);
                var world = universe.world;
                var back = () => {
                    universe.venueTransitionTo(venuePrev);
                };
                var buy = () => {
                    itemBarterer.transfer(world, entityStore, entityCustomer, "Purchased");
                };
                var sell = () => {
                    itemBarterer.transfer(world, entityCustomer, entityStore, "Sold");
                };
                var labelStoreName = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin), // pos
                GameFramework.Coords.fromXY(listSize.x, 25), // size
                GameFramework.DataBinding.fromContext(entityStore.name + ":"), font);
                var listStoreItems = GameFramework.ControlList.from10("listStoreItems", GameFramework.Coords.fromXY(margin, margin * 2), // pos
                listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderStore, (c) => c.items), // items
                GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                font, new GameFramework.DataBinding(itemHolderStore, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                GameFramework.DataBinding.fromTrue(), // isEnabled
                buy // confirm
                );
                var labelCustomerName = GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin), // pos
                GameFramework.Coords.fromXY(85, 25), // size
                GameFramework.DataBinding.fromContext(entityCustomer.name + ":"), font);
                var buttonBuy = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y), // pos
                buttonSize.clone(), "Buy", font, buy // click
                );
                var listCustomerItems = GameFramework.ControlList.from10("listCustomerItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
                listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderCustomer, (c) => c.items), // items
                GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                font, new GameFramework.DataBinding(itemHolderCustomer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                GameFramework.DataBinding.fromTrue(), // isEnabled
                sell // confirm
                );
                var buttonSell = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x / 2 + margin / 2, size.y - margin - buttonSize.y), // pos
                buttonSize.clone(), "Sell", font, sell // click
                );
                var infoStatus = GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
                GameFramework.Coords.fromXY(size.x, fontHeight), // size
                GameFramework.DataBinding.fromContextAndGet(this, c => c.statusMessage), font);
                var buttonDone = GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                buttonSize.clone(), "Done", font, back // click
                );
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildrenActionsAndMappings("containerTransfer", GameFramework.Coords.create(), // pos
                size.clone(), 
                // children
                [
                    labelStoreName,
                    listStoreItems,
                    labelCustomerName,
                    buttonBuy,
                    listCustomerItems,
                    buttonSell,
                    infoStatus,
                    buttonDone
                ], [GameFramework.Action.fromNameAndPerform("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemStore = ItemStore;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
