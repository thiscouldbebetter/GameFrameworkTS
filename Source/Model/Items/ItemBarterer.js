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
                var returnValue = (this.itemHolderCustomerOffer.itemEntities.length > 0
                    || this.itemHolderStoreOffer.itemEntities.length > 0);
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
            ;
            patienceAdd(patienceToAdd) {
                this.patience = GameFramework.NumberHelper.trimToRangeMax(this.patience + patienceToAdd, this.patienceMax);
            }
            reset(entityCustomer, entityStore) {
                this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder());
                this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityStore.itemHolder());
            }
            trade(entityCustomer, entityStore) {
                this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityStore.itemHolder());
                this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder());
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
                var buttonSize = new GameFramework.Coords(4, 2, 0).multiplyScalar(fontHeight);
                var buttonSizeSmall = new GameFramework.Coords(2, 2, 0).multiplyScalar(fontHeight);
                var listSize = new GameFramework.Coords((size.x - margin * 3) / 2, 80, 0);
                var itemBarterer = this;
                var itemHolderCustomer = entityCustomer.itemHolder();
                var itemHolderStore = entityStore.itemHolder();
                var world = universe.world;
                var back = function () {
                    itemBarterer.reset(entityCustomer, entityStore);
                    var venueNext = venuePrev;
                    venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                    universe.venueNext = venueNext;
                };
                var itemOfferCustomer = () => {
                    if (itemHolderCustomer.itemEntitySelected != null) {
                        var offer = itemBarterer.itemHolderCustomerOffer;
                        itemHolderCustomer.itemEntityTransferSingleTo(itemHolderCustomer.itemEntitySelected, offer);
                    }
                };
                var itemOfferStore = () => {
                    if (itemHolderStore.itemEntitySelected != null) {
                        var offer = itemBarterer.itemHolderStoreOffer;
                        itemHolderStore.itemEntityTransferSingleTo(itemHolderStore.itemEntitySelected, offer);
                    }
                };
                var itemUnofferCustomer = () => {
                    var offer = itemBarterer.itemHolderCustomerOffer;
                    if (offer.itemEntitySelected != null) {
                        offer.itemEntityTransferSingleTo(offer.itemEntitySelected, itemHolderCustomer);
                    }
                };
                var itemUnofferStore = () => {
                    var offer = itemBarterer.itemHolderStoreOffer;
                    if (offer.itemEntitySelected != null) {
                        offer.itemEntityTransferSingleTo(offer.itemEntitySelected, itemHolderStore);
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
                    new GameFramework.ControlLabel("labelStoreName", new GameFramework.Coords(margin, margin - fontHeight / 2, 0), // pos
                    new GameFramework.Coords(listSize.x, 25, 0), // size
                    false, // isTextCentered
                    entityStore.name + ":", fontHeight),
                    new GameFramework.ControlList("listStoreItems", new GameFramework.Coords(margin, margin + fontHeight, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderStore, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderStore, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferStore, null),
                    new GameFramework.ControlButton("buttonStoreOffer", new GameFramework.Coords(listSize.x - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y, 0), // pos
                    buttonSizeSmall.clone(), "v", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => itemHolderStore.itemEntitySelected != null, null), // isEnabled
                    itemOfferStore, // click
                    null, null),
                    new GameFramework.ControlButton("buttonStoreUnoffer", new GameFramework.Coords(margin + listSize.x - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y, 0), // pos
                    buttonSizeSmall.clone(), "^", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => c.itemHolderStoreOffer.itemEntitySelected != null, null), // isEnabled
                    itemUnofferStore, // click
                    null, null),
                    new GameFramework.ControlLabel("labelItemsOfferedStore", new GameFramework.Coords(margin, margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2, 0), // pos
                    new GameFramework.Coords(100, 15, 0), // size
                    false, // isTextCentered
                    "Offered:", fontHeight),
                    new GameFramework.ControlList("listItemsOfferedByStore", new GameFramework.Coords(margin, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(this, (c) => {
                        return c.itemHolderStoreOffer.itemEntities;
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(this.itemHolderStoreOffer, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemUnofferStore, null),
                    new GameFramework.ControlLabel("labelCustomerName", new GameFramework.Coords(size.x - margin - listSize.x, margin - fontHeight / 2, 0), // pos
                    new GameFramework.Coords(85, 25, 0), // size
                    false, // isTextCentered
                    entityCustomer.name + ":", fontHeight),
                    new GameFramework.ControlList("listCustomerItems", new GameFramework.Coords(size.x - margin - listSize.x, margin + fontHeight, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(itemHolderCustomer, (c) => {
                        return c.itemEntities; //.filter(x => x.item().defnName != itemDefnNameCurrency);
                    }, null), // items
                    new GameFramework.DataBinding(null, (c) => { return c.item().toString(world); }, null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(itemHolderCustomer, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferCustomer, null),
                    new GameFramework.ControlButton("buttonCustomerOffer", new GameFramework.Coords(size.x - margin * 2 - buttonSizeSmall.x * 2, margin * 2 + fontHeight + listSize.y, 0), // pos
                    buttonSizeSmall.clone(), "v", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => itemHolderCustomer.itemEntitySelected != null, null), // isEnabled
                    itemOfferCustomer, // click
                    null, null),
                    new GameFramework.ControlButton("buttonCustomerUnoffer", new GameFramework.Coords(size.x - margin - buttonSizeSmall.x, margin * 2 + fontHeight + listSize.y, 0), // pos
                    buttonSizeSmall.clone(), "^", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => c.itemHolderCustomerOffer.itemEntitySelected != null, null), // isEnabled
                    itemUnofferCustomer, // click
                    null, null),
                    new GameFramework.ControlLabel("labelItemsOfferedCustomer", new GameFramework.Coords(size.x - margin - listSize.x, margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2, null), // pos
                    new GameFramework.Coords(100, 15, null), // size
                    false, // isTextCentered
                    "Offered:", fontHeight),
                    new GameFramework.ControlList("listItemsOfferedByCustomer", new GameFramework.Coords(size.x - margin - listSize.x, margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y, 0), // pos
                    listSize.clone(), new GameFramework.DataBinding(this, (c) => c.itemHolderCustomerOffer.itemEntities, null), // items
                    new GameFramework.DataBinding(null, (c) => c.item().toString(world), null), // bindingForItemText
                    fontHeight, new GameFramework.DataBinding(this.itemHolderCustomerOffer, (c) => { return c.itemEntitySelected; }, (c, v) => { c.itemEntitySelected = v; }), // bindingForItemSelected
                    GameFramework.DataBinding.fromGet((c) => c), // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    itemOfferCustomer, null),
                    new GameFramework.ControlLabel("infoStatus", new GameFramework.Coords(size.x / 2, size.y - margin * 2 - buttonSize.y, 0), // pos
                    new GameFramework.Coords(size.x, fontHeight, 0), // size
                    true, // isTextCentered
                    new GameFramework.DataBinding(this, c => c.statusMessage, null), fontHeight),
                    new GameFramework.ControlButton("buttonReset", new GameFramework.Coords(margin, size.y - margin - buttonSize.y, 0), // pos
                    buttonSize.clone(), "Reset", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => c.isAnythingBeingOffered(), null), // isEnabled
                    () => // click
                     {
                        itemBarterer.reset(entityCustomer, entityStore);
                    }, null, null),
                    new GameFramework.ControlButton("buttonOffer", new GameFramework.Coords((size.x - buttonSize.x) / 2, size.y - margin - buttonSize.y, 0), // pos
                    buttonSize.clone(), "Offer", fontHeight, true, // hasBorder
                    new GameFramework.DataBinding(this, (c) => { return c.isAnythingBeingOffered(); }, null), // isEnabled
                    offer, // click
                    null, null),
                    new GameFramework.ControlButton("buttonDone", new GameFramework.Coords(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y, null), // pos
                    buttonSize.clone(), "Done", fontHeight, true, // hasBorder
                    true, // isEnabled
                    back, // click
                    null, null)
                ], [new GameFramework.Action("Back", back)], [new GameFramework.ActionToInputsMapping("Back", [GameFramework.Input.Names().Escape], true)]);
                return returnValue;
            }
        }
        GameFramework.ItemBarterer = ItemBarterer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
