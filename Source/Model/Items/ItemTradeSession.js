
function ItemTradeSession(entitiesForItemHolders, venuePrev)
{
	this.entitiesForItemHolders = entitiesForItemHolders;
	this.venuePrev = venuePrev;
}
{
	ItemTradeSession.prototype.toControl = function(universe, size)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;

		var itemHolder0 = this.entitiesForItemHolders[0].ItemHolder;
		var itemHolder1 = this.entitiesForItemHolders[1].ItemHolder;

		var itemTradeSession = this;

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			Coords.Instances().Zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelHolder0Name",
					new Coords(52, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					this.entitiesForItemHolders[0].name + ":",
					fontHeight
				),

				new ControlList
				(
					"listHolder0Items",
					new Coords(10, 25), // pos
					new Coords(85, 40), // size
					new DataBinding
					(
						itemHolder0,
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
						itemHolder0,
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"labelHolder1Name",
					new Coords(147, 15), // pos
					new Coords(85, 25), // size
					true, // isTextCentered
					this.entitiesForItemHolders[1].name + ":",
					fontHeight
				),

				new ControlList
				(
					"listHolder1Items",
					new Coords(105, 25), // pos
					new Coords(85, 40), // size
					new DataBinding
					(
						itemHolder1,
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
						itemHolder1,
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
						itemHolder0,
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
						itemHolder1,
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
					"buttonTransferRight",
					new Coords(80, 90), // pos
					new Coords(15, 15), // size
					">",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolder0,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolder0.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolder0.itemEntityTransferTo(itemEntity, itemHolder1);
							itemHolder0.itemEntitySelected = null;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonTransferLeft",
					new Coords(105, 90), // pos
					new Coords(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						itemHolder1,
						function get(c) { return c.itemEntitySelected != null}
					), // isEnabled
					function click(universe)
					{
						var itemEntity = itemHolder1.itemEntitySelected;
						if (itemEntity != null)
						{
							itemHolder1.itemEntityTransferTo(itemEntity, itemHolder0);
							itemHolder1.itemEntitySelected = null;
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
						var venueNext = itemTradeSession.venuePrev;
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
