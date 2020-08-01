
class ItemStore
{
	itemDefnNameCurrency: string;

	statusMessage: string;

	constructor(itemDefnNameCurrency: string)
	{
		this.itemDefnNameCurrency = itemDefnNameCurrency;
		this.statusMessage = "-";
	}

	transfer(world: World, entityFrom: Entity, entityTo: Entity, messagePrefix: string)
	{
		var itemHolderFrom = entityFrom.itemHolder();
		var itemHolderTo = entityTo.itemHolder();

		if (itemHolderFrom.itemEntitySelected != null)
		{
			var itemEntityToTransfer = itemHolderFrom.itemEntitySelected;
			var itemToTransfer = itemEntityToTransfer.item();
			var tradeValue = itemToTransfer.defn(world).tradeValue;
			var itemCurrencyNeeded = new Item(this.itemDefnNameCurrency, 0);
			var itemDefnCurrency = itemCurrencyNeeded.defn(world);
			itemCurrencyNeeded.quantity = Math.ceil(tradeValue / itemDefnCurrency.tradeValue);
			if (itemHolderTo.hasItem(itemCurrencyNeeded))
			{
				itemHolderFrom.itemEntityTransferSingleTo
				(
					itemEntityToTransfer, itemHolderTo
				);

				itemHolderTo.itemTransferTo
				(
					itemCurrencyNeeded, itemHolderFrom
				);
				this.statusMessage =
					messagePrefix
					+ " " + itemToTransfer.defnName
					+ " for " + itemCurrencyNeeded.quantity + ".";
			}
			else
			{
				this.statusMessage = "Not enough currency!";
			}
		}
	}

	use(universe: Universe, world: World, place: Place, entityUsing: Entity, entityUsed: Entity)
	{
		entityUsed.collidable().ticksUntilCanCollide = 50; // hack
		var storeAsControl = entityUsed.itemStore().toControl
		(
			universe, universe.display.sizeInPixels,
			entityUsing, entityUsed,
			universe.venueCurrent
		);
		var venueNext: Venue = new VenueControls(storeAsControl);
		venueNext = new VenueFader(venueNext, null, null, null);
		universe.venueNext = venueNext;
	}


	// Controllable.

	toControl(universe: Universe, size: Coords, entityCustomer: Entity, entityStore: Entity, venuePrev: Venue)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = new Coords(4, 2, 0).multiplyScalar(fontHeight);
		var listSize = new Coords
		(
			(size.x - margin * 3) / 2,
			size.y - margin * 4 - buttonSize.y - fontHeight,
			0
		);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder();
		var itemHolderStore = entityStore.itemHolder();

		var world = universe.world;

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null) as Venue;
			universe.venueNext = venueNext;
		};

		var buy = () =>
		{
			itemBarterer.transfer(world, entityStore, entityCustomer, "Purchased");
		};

		var sell = () =>
		{
			itemBarterer.transfer(world, entityCustomer, entityStore, "Sold");
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
					new Coords(margin, margin * 2, 0), // pos
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
					buy, // confirm
					null
				),

				new ControlLabel
				(
					"labelCustomerName",
					new Coords(size.x - margin - listSize.x, margin, 1), // pos
					new Coords(85, 25, 1), // size
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				new ControlButton
				(
					"buttonBuy",
					new Coords(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y, 1), // pos
					buttonSize.clone(),
					"Buy",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContext(true), // isEnabled
					buy, // click
					null, null
				),

				new ControlList
				(
					"listCustomerItems",
					new Coords(size.x - margin - listSize.x, margin * 2, 1), // pos
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
					sell, // confirm
					null
				),

				new ControlButton
				(
					"buttonSell",
					new Coords
					(
						size.x / 2 + margin / 2,
						size.y - margin - buttonSize.y,
						0
					), // pos
					buttonSize.clone(),
					"Sell",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContext(true), // isEnabled
					sell, // click
					null, null
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
					"buttonDone",
					new Coords(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y, 0), // pos
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
