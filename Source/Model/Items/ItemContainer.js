
function ItemContainer()
{
	// Do nothing.
}
{
	ItemContainer.prototype.toControl = function(universe, size, entityTransferrer, entityContainer, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;

		var itemHolderTransferrer = entityTransferrer.ItemHolder;
		var itemHolderContainer = entityContainer.ItemHolder;

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			Coords.Instances().Zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelContainerName",
					new Coords(52, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					entityContainer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listContainerItems",
					new Coords(10, 25), // pos
					new Coords(85, 40), // size
					new DataBinding
					(
						itemHolderContainer,
						function get(c) { return c.itemEntities; }
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.Item.toString(); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderContainer,
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelHolderTransferrerName",
					new Coords(147, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					entityTransferrer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listHolder1Items",
					new Coords(105, 25), // pos
					new Coords(85, 40), // size
					new DataBinding
					(
						itemHolderTransferrer,
						function get(c) { return c.itemEntities; }
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.Item.toString(); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderTransferrer,
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelItemSelected0",
					new Coords(50, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
				),

				new ControlLabel
				(
					"infoItemSelected0",
					new Coords(50, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						itemHolderContainer,
						function get(c)
						{
							var i = c.itemEntitySelected;
							return (i == null ? "-" : i.Item.toString());
						}
					), // text
					fontHeight
				),

				new ControlLabel
				(
					"labelItemSelected1",
					new Coords(150, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
				),

				new ControlLabel
				(
					"infoItemSelected1",
					new Coords(150, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						itemHolderTransferrer,
						function get(c)
						{
							var i = c.itemEntitySelected;
							return (i == null ? "-" : i.Item.toString());
						}
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonTransferFromContainer",
					new Coords(80, 90), // pos
					new Coords(15, 15), // size
					">",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolderContainer,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolderContainer.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolderContainer.itemEntityTransferTo(itemEntity, itemHolderTransferrer);
							itemHolderContainer.itemEntitySelected = null;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonTransferToContainer",
					new Coords(105, 90), // pos
					new Coords(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolderTransferrer,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolderTransferrer.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolderTransferrer.itemEntityTransferTo(itemEntity, itemHolderContainer);
							itemHolderTransferrer.itemEntitySelected = null;
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
					function click(universe)
					{
						var venueNext = venuePrev;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				)
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};
}
