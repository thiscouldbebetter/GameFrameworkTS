
class ItemStore
{
	constructor(itemDefnNameCurrency)
	{
		this.itemDefnNameCurrency = itemDefnNameCurrency;
	}

	toControl(universe, size, entityCustomer, entityStore, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;

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

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			new Coords(0, 0), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelStoreName",
					new Coords(52, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					entityStore.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listStoreItems",
					new Coords(10, 25), // pos
					new Coords(85, 40), // size
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
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelCustomerName",
					new Coords(147, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listCustomerItems",
					new Coords(105, 25), // pos
					new Coords(85, 40), // size
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
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelItemSelectedStore",
					new Coords(50, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
				),

				new ControlLabel
				(
					"infoItemSelectedStore",
					new Coords(50, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						itemHolderStore,
						function get(c)
						{
							var i = c.itemEntitySelected;
							return (i == null ? "-" : i.item.toString(world));
						}
					), // text
					fontHeight
				),

				new ControlLabel
				(
					"labelItemSelectedCustomer",
					new Coords(150, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
				),

				new ControlLabel
				(
					"infoItemSelectedCustomer",
					new Coords(150, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						itemHolderCustomer,
						function get(c)
						{
							var i = c.itemEntitySelected;
							return (i == null ? "-" : i.item.toString(world));
						}
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonSell",
					new Coords(105, 90), // pos
					new Coords(30, 15), // size
					"Sell",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolderCustomer,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolderCustomer.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolderCustomer.itemEntityTransferTo(itemEntity, itemHolderStore);
							itemHolderCustomer.itemEntitySelected = null;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonBuy",
					new Coords(65, 90), // pos
					new Coords(30, 15), // size
					"Buy",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolderStore,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolderStore.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolderStore.itemEntityTransferTo(itemEntity, itemHolderCustomer);
							itemHolderStore.itemEntitySelected = null;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(75, 110), // pos
					new Coords(50, 15), // size
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

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};
}
