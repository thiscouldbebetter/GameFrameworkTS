
class ItemStore
{
	constructor(itemDefnNameCurrency)
	{
		this.itemDefnNameCurrency = itemDefnNameCurrency;
	}

	transfer(world, entityFrom, entityTo, messagePrefix)
	{
		var itemHolderFrom = entityFrom.itemHolder;
		var itemHolderTo = entityTo.itemHolder;

		if (itemHolderFrom.itemEntityToOffer != null)
		{
			var itemEntityToTransfer = itemHolderFrom.itemEntityToOffer;
			var itemToTransfer = itemEntityToTransfer.item;
			var tradeValue = itemToTransfer.defn(world).tradeValue;
			var itemCurrencyNeeded = new Item(this.itemDefnNameCurrency);
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
	};

	toControl(universe, size, entityCustomer, entityStore, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = new Coords(4, 2).multiplyScalar(fontHeight);
		var listSize = new Coords
		(
			(size.x - margin * 3) / 2,
			size.y - margin * 4 - buttonSize.y - fontHeight
		);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder;
		var itemHolderStore = entityStore.itemHolder;

		var itemDefnNameCurrency = this.itemDefnNameCurrency;

		var world = universe.world;

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
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
					new Coords(margin, margin * 2), // pos
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
					buy // confirm
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

				new ControlButton
				(
					"buttonBuy",
					new Coords(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Buy",
					fontHeight,
					true, // hasBorder
					new DataBinding(true), // isEnabled
					buy
				),

				new ControlList
				(
					"listCustomerItems",
					new Coords(size.x - margin - listSize.x, margin * 2), // pos
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
					sell // confirm
				),

				new ControlButton
				(
					"buttonSell",
					new Coords(size.x / 2 + margin / 2, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Sell",
					fontHeight,
					true, // hasBorder
					new DataBinding(true), // isEnabled
					sell
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
					new Coords(size.x, fontHeight), // size
					true, // isTextCentered
					new DataBinding(this, c => c.statusMessage),
					fontHeight
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
