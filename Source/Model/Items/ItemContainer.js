
class ItemContainer
{
	toControl(universe, size, entityTransferrer, entityContainer, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;

		var itemHolderTransferrer = entityTransferrer.itemHolder;
		var itemHolderContainer = entityContainer.itemHolder;

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
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeightSmall,
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
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeightSmall,
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
							return (i == null ? "-" : i.item.toString(world));
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
							return (i == null ? "-" : i.item.toString(world));
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
