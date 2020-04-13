
class ItemBarterer
{
	constructor()
	{
		this.itemHolderCustomerOffer = new ItemHolder();
		this.itemHolderStoreOffer = new ItemHolder();
		this.statusMessage = "Choose items to trade and click the 'Offer' button.";
		this.patience = 10;

		this.patienceMax = 10;
	}

	isAnythingBeingOffered()
	{
		var returnValue =
		(
			this.itemHolderCustomerOffer.itemEntities.length > 0
			|| this.itemHolderStoreOffer.itemEntities.length > 0
		);
		return returnValue;
	};

	isOfferProfitableEnough(world)
	{
		var profitMarginForStore = this.profitMarginOfOfferForStore(world);

		var isOfferProfitableToStore = (profitMarginForStore > 1);

		return isOfferProfitableToStore;
	};

	profitMarginOfOfferForStore(world)
	{
		var valueOfferedByCustomer = this.itemHolderCustomerOffer.tradeValueOfAllItems(world);
		var valueOfferedByStore = this.itemHolderStoreOffer.tradeValueOfAllItems(world);

		var profitMarginForStore = valueOfferedByCustomer / valueOfferedByStore;

		return profitMarginForStore;
	};

	patienceAdd(patienceToAdd)
	{
		this.patience = (this.patience + patienceToAdd).trimToRangeMax(this.patienceMax);
	};

	reset(entityCustomer, entityStore)
	{
		this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder);
		this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityStore.itemHolder);
	};

	trade(entityCustomer, entityStore)
	{
		var itemHoldersForOfferers =
		[
			entityCustomer.itemHolder,
			entityStore.itemHolder
		];

		var itemHoldersForOffers =
		[
			this.itemHolderCustomerOffer,
			this.itemHolderStoreOffer
		];

		for (var e = 0; e < itemHoldersForOffers.length; e++)
		{
			var itemHolderFrom = itemHoldersForOffers[e];
			var itemHolderTo = itemHoldersForOfferers[1 - e];

			itemHolderFrom.itemEntitiesAllTransferTo(itemHolderTo);
		}
	};

	// Controls.

	toControl(universe, size, entityCustomer, entityStore, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = new Coords(4, 2).multiplyScalar(fontHeight);
		var listSize = new Coords((size.x - margin * 3) / 2, 90);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder;
		var itemHolderStore = entityStore.itemHolder;

		var itemDefnNameCurrency = this.itemDefnNameCurrency;

		var world = universe.world;

		var back = function()
		{
			itemBarterer.reset(entityCustomer, entityStore);
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			new Coords(0, 0), // pos
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelStoreName",
					new Coords(margin, margin), // pos
					new Coords(listSize.x, 25), // size
					false, // isTextCentered
					entityStore.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listStoreItems",
					new Coords(margin, margin + fontHeight), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderStore,
						function get(c)
						{
							return c.itemEntities;//.filter(x => x.item.defnName != itemDefnNameCurrency);
						}
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						function get(c) { return c.itemEntityToOffer; },
						function set(c, v) { c.itemEntityToOffer = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					function confirm()
					{
						if (itemHolderStore.itemEntityToOffer != null)
						{
							var offer = itemBarterer.itemHolderStoreOffer;
							itemHolderStore.itemEntityTransferSingleTo(itemHolderStore.itemEntityToOffer, offer);
						}
					}
				),

				new ControlLabel
				(
					"labelCustomerName",
					new Coords(size.x - margin - listSize.x, margin), // pos
					new Coords(85, 25), // size
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listCustomerItems",
					new Coords(size.x - margin - listSize.x, margin + fontHeight), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderCustomer,
						function get(c)
						{
							return c.itemEntities;//.filter(x => x.item.defnName != itemDefnNameCurrency);
						}
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						function get(c) { return c.itemEntityToOffer; },
						function set(c, v) { c.itemEntityToOffer = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					function confirm()
					{
						if (itemHolderCustomer.itemEntityToOffer != null)
						{
							var offer = itemBarterer.itemHolderCustomerOffer;
							itemHolderCustomer.itemEntityTransferSingleTo(itemHolderCustomer.itemEntityToOffer, offer);
						}
					}
				),

				new ControlLabel
				(
					"labelItemsOfferedStore",
					new Coords(margin, margin * 2 + listSize.y), // pos
					new Coords(100, 15), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				new ControlList
				(
					"listItemsOfferedByStore",
					new Coords(margin, margin * 3 + listSize.y), // pos
					listSize.clone(),
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.itemHolderStoreOffer.itemEntities;
						}
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						function get(c) { return c.itemEntityToWithdraw; },
						function set(c, v) { c.itemEntityToWithdraw = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					function confirm()
					{
						if (itemHolderStore.itemEntityToWithdraw != null)
						{
							var offer = itemBarterer.itemHolderStoreOffer;
							offer.itemEntityTransferSingleTo(itemHolderStore.itemEntityToWithdraw, itemHolderStore);
						}
					}
				),

				new ControlLabel
				(
					"labelItemsOfferedCustomer",
					new Coords(size.x - margin - listSize.x, margin * 2 + listSize.y), // pos
					new Coords(100, 15), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				new ControlList
				(
					"listItemsOfferedByCustomer",
					new Coords(size.x - margin - listSize.x, margin * 3 + listSize.y), // pos
					listSize.clone(),
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.itemHolderCustomerOffer.itemEntities;
						}
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						function get(c) { return c.itemEntityToWithdraw; },
						function set(c, v) { c.itemEntityToWithdraw = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					function confirm()
					{
						if (itemHolderCustomer.itemEntityToWithdraw != null)
						{
							var offer = itemBarterer.itemHolderCustomerOffer;
							offer.itemEntityTransferSingleTo(itemHolderCustomer.itemEntityToWithdraw, itemHolderCustomer);
						}
					}
				),

				new ControlButton
				(
					"buttonReset",
					new Coords(margin, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Reset",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c) { return c.isAnythingBeingOffered(); }
					), // isEnabled
					function click()
					{
						itemBarterer.reset(entityCustomer, entityStore);
					}
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(size.x / 2, size.y - margin * 2 - buttonSize.y - fontHeight), // pos
					new Coords(size.x, fontHeight), // size
					true, // isTextCentered
					new DataBinding(this, c => c.statusMessage),
					fontHeight
				),

				new ControlButton
				(
					"buttonOffer",
					new Coords((size.x - buttonSize.x)/ 2, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Offer",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c) { return c.isAnythingBeingOffered(); }
					), // isEnabled
					function click()
					{
						if (itemBarterer.patience <= 0)
						{
							var profitMargin = itemBarterer.profitMarginOfOfferForStore(world);
							var isCustomerDonatingToStore = (profitMargin == Number.POSITIVE_INFINITY);
							if (isCustomerDonatingToStore)
							{
								itemBarterer.statusMessage = "Very well, I accept your gift.";
								itemBarterer.trade(entityCustomer, entityStore);
								itemBarterer.patienceAdd(1);
							}
							else
							{
								itemBarterer.statusMessage = "No.  I'm sick of your nonsense.";
							}
						}
						else
						{
							var isOfferAccepted = itemBarterer.isOfferProfitableEnough(world);
							if (isOfferAccepted)
							{
								itemBarterer.statusMessage = "It's a deal!";
								itemBarterer.trade(entityCustomer, entityStore);
								itemBarterer.patienceAdd(1);
							}
							else
							{
								itemBarterer.statusMessage = "This deal is not acceptable.";
								itemBarterer.patienceAdd(-1);
							}
						}
					}
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back // click
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ) ],

		);

		return returnValue;
	};
}
