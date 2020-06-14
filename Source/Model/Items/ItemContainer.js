
class ItemContainer
{
	transfer(world, entityFrom, entityTo, messagePrefix)
	{
		var itemHolderFrom = entityFrom.itemHolder;
		var itemHolderTo = entityTo.itemHolder;

		if (itemHolderFrom.itemEntityToTransfer != null)
		{
			var itemEntityToTransfer = itemHolderFrom.itemEntityToTransfer;
			var itemToTransfer = itemEntityToTransfer.item;
			itemHolderFrom.itemEntityTransferSingleTo
			(
				itemEntityToTransfer, itemHolderTo
			);
			if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0)
			{
				itemHolderFrom.itemEntityToTransfer = null;
			}

			this.statusMessage =
				messagePrefix
				+ " " + itemToTransfer.defnName
				+ " for " + itemCurrencyNeeded.quantity + ".";
		}
	};

	// Controllable.

	toControl(universe, size, entityGetterPutter, entityContainer, venuePrev)
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

		var itemContainer = this;
		var itemHolderGetterPutter = entityGetterPutter.itemHolder;
		var itemHolderContainer = entityContainer.itemHolder;

		var world = universe.world;

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var get = () =>
		{
			itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
		};

		var put = () => 
		{
			itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
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
					entityContainer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listStoreItems",
					new Coords(margin, margin * 2), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderContainer,
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
						itemHolderContainer,
						function get(c) { return c.itemEntityToTransfer; },
						function set(c, v) { c.itemEntityToTransfer = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					get // confirm
				),

				new ControlLabel
				(
					"labelCustomerName",
					new Coords(size.x - margin - listSize.x, margin), // pos
					new Coords(85, 25), // size
					false, // isTextCentered
					entityGetterPutter.name + ":",
					fontHeight
				),

				new ControlButton
				(
					"buttonGet",
					new Coords(size.x / 2 - buttonSize.x - margin / 2, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					">",
					fontHeight,
					true, // hasBorder
					new DataBinding(true), // isEnabled
					get
				),

				new ControlList
				(
					"listOtherItems",
					new Coords(size.x - margin - listSize.x, margin * 2), // pos
					listSize.clone(),
					new DataBinding
					(
						itemHolderGetterPutter,
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
						itemHolderGetterPutter,
						function get(c) { return c.itemEntityToTransfer; },
						function set(c, v) { c.itemEntityToTransfer = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					put // confirm
				),

				new ControlButton
				(
					"buttonPut",
					new Coords(size.x / 2 + margin / 2, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"<",
					fontHeight,
					true, // hasBorder
					new DataBinding(true), // isEnabled
					put
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
