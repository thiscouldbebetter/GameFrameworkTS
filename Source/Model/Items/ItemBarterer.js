"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemBarterer {
            constructor() {
                this.itemHolderCustomerOffer = GameFramework.ItemHolder.create();
                this.itemHolderStoreOffer = GameFramework.ItemHolder.create();
                this.statusMessage = "Choose items to trade and click the 'Offer' button.";
                this.patience = 10;
                this.patienceMax = 10;
            }
            isAnythingBeingOffered() {
                var returnValue = (this.itemHolderCustomerOffer.items.length > 0
                    || this.itemHolderStoreOffer.items.length > 0);
                return returnValue;
            }
            isOfferProfitableEnough(world) {
                var profitMarginForStore = this.profitMarginOfOfferForStore(world);
                var isOfferProfitableToStore = (profitMarginForStore > 1);
                return isOfferProfitableToStore;
            }
            profitMarginOfOfferForStore(world) {
                var valueOfferedByCustomer = this.itemHolderCustomerOffer.tradeValueOfAllItems(world);
                var valueOfferedByStore = this.itemHolderStoreOffer.tradeValueOfAllItems(world);
                var profitMarginForStore = valueOfferedByCustomer / valueOfferedByStore;
                return profitMarginForStore;
            }
            patienceAdd(patienceToAdd) {
                this.patience = GameFramework.NumberHelper.trimToRangeMax(this.patience + patienceToAdd, this.patienceMax);
            }
            reset(entityCustomer, entityStore) {
                this.itemHolderCustomerOffer.itemsAllTransferTo(GameFramework.ItemHolder.of(entityCustomer));
                this.itemHolderStoreOffer.itemsAllTransferTo(GameFramework.ItemHolder.of(entityStore));
            }
            trade(uwpe) {
                var entityStore = uwpe.entity;
                var entityCustomer = uwpe.entity;
                this.itemHolderCustomerOffer.itemsAllTransferTo(GameFramework.ItemHolder.of(entityStore));
                this.itemHolderStoreOffer.itemsAllTransferTo(GameFramework.ItemHolder.of(entityCustomer));
                var entities = [entityCustomer, entityStore];
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    var entityEquipmentUser = GameFramework.EquipmentUser.of(entity);
                    if (entityEquipmentUser != null) {
                        entityEquipmentUser.unequipItemsNoLongerHeld(uwpe);
                    }
                }
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return ItemBarterer.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
            // Controls.
            toControl(universe, size, entityCustomer, entityStore, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, universe.world, universe.world.placeCurrent, entityCustomer, entityStore);
                var fontHeight = 10;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeight);
                var margin = fontHeight * 1.5;
                var buttonSize = GameFramework.Coords.fromXY(4, 2).multiplyScalar(fontHeight);
                var buttonSizeSmall = GameFramework.Coords.fromXY(2, 2).multiplyScalar(fontHeight);
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 3) / 2, 80);
                var itemBarterer = this;
                var itemHolderCustomer = GameFramework.ItemHolder.of(entityCustomer);
                var itemHolderStore = GameFramework.ItemHolder.of(entityStore);
                var world = universe.world;
                var back = () => {
                    itemBarterer.reset(entityCustomer, entityStore);
                    universe.venueTransitionTo(venuePrev);
                };
                var itemOfferCustomer = () => {
                    if (itemHolderCustomer.itemSelected != null) {
                        var offer = itemBarterer.itemHolderCustomerOffer;
                        itemHolderCustomer.itemTransferSingleTo(itemHolderCustomer.itemSelected, offer);
                    }
                };
                var itemOfferStore = () => {
                    if (itemHolderStore.itemSelected != null) {
                        var offer = itemBarterer.itemHolderStoreOffer;
                        itemHolderStore.itemTransferSingleTo(itemHolderStore.itemSelected, offer);
                    }
                };
                var itemUnofferCustomer = () => {
                    var offer = itemBarterer.itemHolderCustomerOffer;
                    if (offer.itemSelected != null) {
                        offer.itemTransferSingleTo(offer.itemSelected, itemHolderCustomer);
                    }
                };
                var itemUnofferStore = () => {
                    var offer = itemBarterer.itemHolderStoreOffer;
                    if (offer.itemSelected != null) {
                        offer.itemTransferSingleTo(offer.itemSelected, itemHolderStore);
                    }
                };
                var offer = () => {
                    if (itemBarterer.patience <= 0) {
                        var profitMargin = itemBarterer.profitMarginOfOfferForStore(world);
                        var isCustomerDonatingToStore = (profitMargin == Number.POSITIVE_INFINITY);
                        if (isCustomerDonatingToStore) {
                            itemBarterer.statusMessage = "Very well, I accept your gift.";
                            itemBarterer.trade(uwpe);
                            itemBarterer.patienceAdd(1);
                        }
                        else {
                            itemBarterer.statusMessage = "No.  I'm sick of your nonsense.";
                        }
                    }
                    else {
                        var isOfferAccepted = itemBarterer.isOfferProfitableEnough(world);
                        if (isOfferAccepted) {
                            itemBarterer.statusMessage = "It's a deal!";
                            itemBarterer.trade(uwpe);
                            itemBarterer.patienceAdd(1);
                        }
                        else {
                            itemBarterer.statusMessage = "This deal is not acceptable.";
                            itemBarterer.patienceAdd(-1);
                        }
                    }
                };
                var returnValue = new GameFramework.ControlContainer("containerTransfer", GameFramework.Coords.create(), // pos
                size.clone(), 
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(listSize.x, 25), // size
                    GameFramework.DataBinding.fromContext(entityStore.name + ":"), font),
                    new GameFramework.ControlList("listStoreItems", GameFramework.Coords.fromXY(margin, margin + fontHeight), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderStore, (c) => c.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(itemHolderStore, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    itemOfferStore, null),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(listSize.x - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "v", font, itemOfferStore // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (itemHolderStore.itemSelected != null))),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin + listSize.x - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "^", font, itemUnofferStore // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemHolderStoreOffer.itemSelected != null))),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, margin * 2 + fontHeight + listSize.y
                        + buttonSize.y - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Offered:"), font),
                    new GameFramework.ControlList("listItemsOfferedByStore", GameFramework.Coords.fromXY(margin, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(this.itemHolderStoreOffer, (c) => c.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(this.itemHolderStoreOffer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    itemUnofferStore, null),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    GameFramework.DataBinding.fromContext(entityCustomer.name + ":"), font),
                    new GameFramework.ControlList("listCustomerItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin + fontHeight), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderCustomer, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(itemHolderCustomer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    itemOfferCustomer, null),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin * 2 - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "v", font, itemOfferCustomer // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => (itemHolderCustomer.itemSelected != null))),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "^", font, itemUnofferCustomer // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemHolderCustomerOffer.itemSelected != null)),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    GameFramework.DataBinding.fromContext("Offered:"), font),
                    GameFramework.ControlList.from10("listItemsOfferedByCustomer", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemHolderCustomerOffer.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    font, new GameFramework.DataBinding(this, (c) => c.itemHolderCustomerOffer.itemSelected, (c, v) => c.itemHolderCustomerOffer.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    itemOfferCustomer),
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(0, size.y - margin * 2 - buttonSize.y), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    GameFramework.DataBinding.fromContextAndGet(this, c => c.statusMessage), font),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Reset", font, () => // click
                     itemBarterer.reset(entityCustomer, entityStore)).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => c.isAnythingBeingOffered())),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Offer", font, offer // click
                    ).isEnabledSet(GameFramework.DataBinding.fromContextAndGet(this, (c) => c.isAnythingBeingOffered())),
                    GameFramework.ControlButton.fromPosSizeTextFontClick(GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Done", font, back // click
                    )
                ], [new GameFramework.Action("Back", back)], [
                    new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Instances().Escape.name], true)
                ]);
                return returnValue;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
        }
        GameFramework.ItemBarterer = ItemBarterer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
