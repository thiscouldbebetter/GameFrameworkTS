
class ItemBarterer
{
	itemHolderCustomerOffer: ItemHolder;
	itemHolderStoreOffer: ItemHolder;
	statusMessage: string;
	patience: number;
	patienceMax: number;

	itemDefnNameCurrency: string;

	constructor()
	{
		this.itemHolderCustomerOffer = new ItemHolder(null);
		this.itemHolderStoreOffer = new ItemHolder(null);
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

	isOfferProfitableEnough(world: World)
	{
		var profitMarginForStore = this.profitMarginOfOfferForStore(world);

		var isOfferProfitableToStore = (profitMarginForStore > 1);

		return isOfferProfitableToStore;
	};

	profitMarginOfOfferForStore(world: World)
	{
		var valueOfferedByCustomer = this.itemHolderCustomerOffer.tradeValueOfAllItems(world);
		var valueOfferedByStore = this.itemHolderStoreOffer.tradeValueOfAllItems(world);

		var profitMarginForStore = valueOfferedByCustomer / valueOfferedByStore;

		return profitMarginForStore;
	};

	patienceAdd(patienceToAdd: number)
	{
		this.patience = NumberHelper.trimToRangeMax(this.patience + patienceToAdd, this.patienceMax);
	};

	reset(entityCustomer: Entity, entityStore: Entity)
	{
		this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder() );
		this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityStore.itemHolder() );
	};

	trade(entityCustomer: Entity, entityStore: Entity)
	{
		var itemHoldersForOfferers =
		[
			entityCustomer.itemHolder(),
			entityStore.itemHolder()
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

	toControl(universe: Universe, size: Coords, entityCustomer: Entity, entityStore: Entity, venuePrev: Venue)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = new Coords(4, 2, 0).multiplyScalar(fontHeight);
		var listSize = new Coords((size.x - margin * 3) / 2, 90, 0);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder();
		var itemHolderStore = entityStore.itemHolder();

		var world = universe.world;

		var back = function()
		{
			itemBarterer.reset(entityCustomer, entityStore);
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null) as Venue;
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			new Coords(0, 0, 0), // pos
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelStoreName",
					new Coords(margin, margin, 0), // pos
					new Coords(listSize.x, 25, 0), // size
					false, // isTextCentered
					entityStore.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listStoreItems",
					new Coords(margin, margin * 2 + fontHeight, 0), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) =>
						{
							return c.itemEntities;//.filter(x => x.item().defnName != itemDefnNameCurrency);
						},
						null
					), // items
					new DataBinding
					(
						null,
						(c: Entity) => { return c.item().toString(world); },
						null
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					function confirm()
					{
						if (itemHolderStore.itemEntitySelected != null)
						{
							var offer = itemBarterer.itemHolderStoreOffer;
							itemHolderStore.itemEntityTransferSingleTo(itemHolderStore.itemEntitySelected, offer);
						}
					},
					null
				),

				new ControlLabel
				(
					"labelCustomerName",
					new Coords(size.x - margin - listSize.x, margin, 0), // pos
					new Coords(85, 25, 0), // size
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listCustomerItems",
					new Coords(size.x - margin - listSize.x, margin * 2 + fontHeight, 0), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderCustomer,
						(c: ItemHolder) =>
						{
							return c.itemEntities;//.filter(x => x.item().defnName != itemDefnNameCurrency);
						},
						null
					), // items
					new DataBinding
					(
						null,
						(c: Entity) => { return c.item().toString(world); },
						null
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					function confirm()
					{
						if (itemHolderCustomer.itemEntitySelected != null)
						{
							var offer = itemBarterer.itemHolderCustomerOffer;
							itemHolderCustomer.itemEntityTransferSingleTo
							(
								itemHolderCustomer.itemEntitySelected, offer
							);
						}
					},
					null
				),

				new ControlLabel
				(
					"labelItemsOfferedStore",
					new Coords(margin, margin * 3 + listSize.y, 0), // pos
					new Coords(100, 15, 0), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				new ControlList
				(
					"listItemsOfferedByStore",
					new Coords(margin, margin * 4 + listSize.y, 0), // pos
					listSize.clone(),
					new DataBinding
					(
						this,
						(c: ItemBarterer) =>
						{
							return c.itemHolderStoreOffer.itemEntities;
						},
						null
					), // items
					new DataBinding
					(
						null,
						(c: Entity) => { return c.item().toString(world); },
						null
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					function confirm()
					{
						if (itemHolderStore.itemEntitySelected != null)
						{
							var offer = itemBarterer.itemHolderStoreOffer;
							offer.itemEntityTransferSingleTo(itemHolderStore.itemEntitySelected, itemHolderStore);
						}
					},
					null
				),

				new ControlLabel
				(
					"labelItemsOfferedCustomer",
					new Coords(size.x - margin - listSize.x, margin * 3 + listSize.y, null), // pos
					new Coords(100, 15, null), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				new ControlList
				(
					"listItemsOfferedByCustomer",
					new Coords(size.x - margin - listSize.x, margin * 4 + listSize.y, 0), // pos
					listSize.clone(),
					new DataBinding
					(
						this,
						(c: ItemBarterer) => c.itemHolderCustomerOffer.itemEntities,
						null
					), // items
					new DataBinding
					(
						null,
						(c: Entity) => c.item().toString(world),
						null
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					function confirm()
					{
						if (itemHolderCustomer.itemEntitySelected != null)
						{
							var offer = itemBarterer.itemHolderCustomerOffer;
							offer.itemEntityTransferSingleTo(itemHolderCustomer.itemEntitySelected, itemHolderCustomer);
						}
					},
					null
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(size.x / 2, size.y - margin * 2 - buttonSize.y, 0), // pos
					new Coords(size.x, fontHeight, 0), // size
					true, // isTextCentered
					new DataBinding(this, c => c.statusMessage, null),
					fontHeight
				),

				new ControlButton
				(
					"buttonReset",
					new Coords(margin, size.y - margin - buttonSize.y, 0), // pos
					buttonSize.clone(),
					"Reset",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						this,
						(c: ItemBarterer) => c.isAnythingBeingOffered(),
						null
					), // isEnabled
					() => // click
					{
						itemBarterer.reset(entityCustomer, entityStore);
					},
					null, null
				),

				new ControlButton
				(
					"buttonOffer",
					new Coords
					(
						(size.x - buttonSize.x) / 2,
						size.y - margin - buttonSize.y,
						0
					), // pos
					buttonSize.clone(),
					"Offer",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						this,
						(c: ItemBarterer) => { return c.isAnythingBeingOffered(); },
						null
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
					},
					null, null
				),

				new ControlButton
				(
					"buttonDone",
					new Coords
					(
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y,
						null
					), // pos
					buttonSize.clone(),
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	};
}
