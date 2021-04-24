"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ItemBarterer extends GameFramework.EntityProperty {
            constructor() {
                super();
                this.itemHolderCustomerOffer = new GameFramework.ItemHolder(null, null, null);
                this.itemHolderStoreOffer = new GameFramework.ItemHolder(null, null, null);
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
                this.itemHolderCustomerOffer.itemsAllTransferTo(entityCustomer.itemHolder());
                this.itemHolderStoreOffer.itemsAllTransferTo(entityStore.itemHolder());
            }
            trade(entityCustomer, entityStore) {
                this.itemHolderCustomerOffer.itemsAllTransferTo(entityStore.itemHolder());
                this.itemHolderStoreOffer.itemsAllTransferTo(entityCustomer.itemHolder());
                var entities = [entityCustomer, entityStore];
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    var entityEquipmentUser = entity.equipmentUser();
                    if (entityEquipmentUser != null) {
                        entityEquipmentUser.unequipItemsNoLongerHeld(entity);
                    }
                }
            }
            // Controls.
            toControl(universe, size, entityCustomer, entityStore, venuePrev) {
                if (size == null) {
                    size = universe.display.sizeDefault();
                }
                var fontHeight = 10;
                var margin = fontHeight * 1.5;
                var buttonSize = GameFramework.Coords.fromXY(4, 2).multiplyScalar(fontHeight);
                var buttonSizeSmall = GameFramework.Coords.fromXY(2, 2).multiplyScalar(fontHeight);
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 3) / 2, 80);
                var itemBarterer = this;
                var itemHolderCustomer = entityCustomer.itemHolder();
                var itemHolderStore = entityStore.itemHolder();
                var world = universe.world;
                var back = () => {
                    itemBarterer.reset(entityCustomer, entityStore);
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
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
                            itemBarterer.trade(entityCustomer, entityStore);
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
                            itemBarterer.trade(entityCustomer, entityStore);
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
                    new GameFramework.ControlLabel("labelStoreName", GameFramework.Coords.fromXY(margin, margin - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(listSize.x, 25), // size
                    false, // isTextCentered
                    entityStore.name + ":", fontHeight),
                    new GameFramework.ControlList("listStoreItems", GameFramework.Coords.fromXY(margin, margin + fontHeight), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderStore, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderStore, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferStore, null),
                    GameFramework.ControlButton.from8("buttonStoreOffer", GameFramework.Coords.fromXY(listSize.x - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "v", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (itemHolderStore.itemSelected != null)), // isEnabled
                    itemOfferStore // click
                    ),
                    GameFramework.ControlButton.from8("buttonStoreUnoffer", GameFramework.Coords.fromXY(margin + listSize.x - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "^", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.itemHolderStoreOffer.itemSelected != null)), // isEnabled
                    itemUnofferStore // click
                    ),
                    new GameFramework.ControlLabel("labelItemsOfferedStore", GameFramework.Coords.fromXY(margin, margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    false, // isTextCentered
                    "Offered:", fontHeight),
                    new GameFramework.ControlList("listItemsOfferedByStore", GameFramework.Coords.fromXY(margin, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemHolderStoreOffer.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(this.itemHolderStoreOffer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemUnofferStore, null),
                    new GameFramework.ControlLabel("labelCustomerName", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(85, 25), // size
                    false, // isTextCentered
                    entityCustomer.name + ":", fontHeight),
                    new GameFramework.ControlList("listCustomerItems", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin + fontHeight), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(itemHolderCustomer, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    ), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderCustomer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferCustomer, null),
                    GameFramework.ControlButton.from8("buttonCustomerOffer", GameFramework.Coords.fromXY(size.x - margin * 2 - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "v", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (itemHolderCustomer.itemSelected != null)), // isEnabled
                    itemOfferCustomer // click
                    ),
                    GameFramework.ControlButton.from8("buttonCustomerUnoffer", GameFramework.Coords.fromXY(size.x - margin - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y), // pos
                    buttonSizeSmall.clone(), "^", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemHolderCustomerOffer.itemSelected != null), // isEnabled
                    itemUnofferCustomer // click
                    ),
                    new GameFramework.ControlLabel("labelItemsOfferedCustomer", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2), // pos
                    GameFramework.Coords.fromXY(100, 15), // size
                    false, // isTextCentered
                    "Offered:", fontHeight),
                    new GameFramework.ControlList("listItemsOfferedByCustomer", GameFramework.Coords.fromXY(size.x - margin - listSize.x, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y), // pos
                    listSize.clone(), GameFramework.DataBinding.fromContextAndGet(this, (c) => c.itemHolderCustomerOffer.items), // items
                    GameFramework.DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(this.itemHolderCustomerOffer, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferCustomer, null),
                    new GameFramework.ControlLabel("infoStatus", GameFramework.Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
                    GameFramework.Coords.fromXY(size.x, fontHeight), // size
                    true, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, c => c.statusMessage), fontHeight),
                    GameFramework.ControlButton.from8("buttonReset", GameFramework.Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Reset", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.isAnythingBeingOffered()), // isEnabled
                    () => // click
                     itemBarterer.reset(entityCustomer, entityStore)),
                    GameFramework.ControlButton.from8("buttonOffer", GameFramework.Coords.fromXY((size.x - buttonSize.x) / 2, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Offer", fontHeight, true, // hasBorder
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.isAnythingBeingOffered()), // isEnabled
                    offer // click
                    ),
                    GameFramework.ControlButton.from8("buttonDone", GameFramework.Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
                    buttonSize.clone(), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back // click
                    )
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemBarterer = ItemBarterer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
