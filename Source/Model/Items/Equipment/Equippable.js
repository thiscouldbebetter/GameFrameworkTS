
function Equippable(socketDefnGroup)
{
	this.socketGroup = new EquipmentSocketGroup
	(
		socketDefnGroup
	);
}

{
	Equippable.prototype.equipEntityWithItem = function(universe, world, place, entityEquippable, itemEntityToEquip, itemToEquip)
	{
		var sockets = this.socketGroup.sockets;
		var socketDefnGroup = this.socketGroup.defnGroup;
		var itemDefn = itemToEquip.defn(world);

		var socketFound = sockets.filter
		(
			function(socket)
			{
				var socketDefn = socket.defn(socketDefnGroup);
				var isItemAllowedInSocket = socketDefn.categoriesAllowedNames.some
				(
					y => itemDefn.categoryNames.contains(y)
				);
				return isItemAllowedInSocket;
			}
		)[0];

		var message = itemDefn.appearance;

		if (socketFound == null)
		{
			message += " cannot be equipped."
		}
		else if (socketFound.itemEntityEquipped == itemEntityToEquip)
		{
			socketFound.itemEntityEquipped = null;
			message += " unequipped."
		}
		else
		{
			socketFound.itemEntityEquipped = itemEntityToEquip;
			message += " equipped."
		}

		return message;
	};

	// control

	Equippable.prototype.toControl = function(universe, size, entityEquippable, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightHalf = fontHeight / 2;
		var fontHeightLarge = fontHeight * 1.5;

		var equippable = this;
		var sockets = this.socketGroup.sockets;
		var world = universe.world;

		var returnValue = new ControlContainer
		(
			"containerEquipment",
			Coords.Instances().Zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelEquipment",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Equipment",
					fontHeightLarge
				),

				new ControlList
				(
					"listItems",
					new Coords(50, 25), // pos
					new Coords(100, 40), // size
					new DataBinding(sockets), // items
					new DataBinding
					(
						null,
						function get(c) { return c.toString(world); }
					), // bindingForItemText
					fontHeightHalf,
					new DataBinding
					(
						this,
						function get(c) { return c.socketSelected; },
						function set(c, v) { c.socketSelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
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
