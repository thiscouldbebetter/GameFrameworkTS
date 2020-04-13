
class EquipmentUser
{
	constructor(socketDefnGroup)
	{
		this.socketGroup = new EquipmentSocketGroup(socketDefnGroup);
	}

	equipEntityWithItem
	(
		universe, world, place, entityEquipmentUser, itemEntityToEquip
	)
	{
		var sockets = this.socketGroup.sockets;
		var socketDefnGroup = this.socketGroup.defnGroup;
		var itemToEquip = itemEntityToEquip.item;
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

		var socketFoundName = socketFound.defnName;

		var message = this.equipItemEntityInSocketWithName
		(
			universe, world, place, itemEntityToEquip, socketFoundName, false
		);

		return message;
	};

	equipItemEntityInSocketWithName
	(
		universe, world, place, itemEntityToEquip, socketName, includeSocketNameInMessage
	)
	{
		var itemToEquip = itemEntityToEquip.item;
		var itemDefn = itemToEquip.defn(world);

		var message = itemDefn.appearance;

		var socket = this.socketGroup.sockets[socketName];

		if (socket == null)
		{
			message += " cannot be equipped."
		}
		else if (socket.itemEntityEquipped == itemEntityToEquip)
		{
			socket.itemEntityEquipped = null;
			message += " unequipped."
		}
		else
		{
			socket.itemEntityEquipped = itemEntityToEquip;
			message += " equipped";
			if (includeSocketNameInMessage)
			{
				message += " as " + socket.defnName
			}
			message += ".";
		}

		return message;
	};

	itemEntityInSocketWithName(socketName)
	{
		return this.socketGroup.sockets[socketName].itemEntityEquipped;
	};

	unequipItemFromSocket
	(
		universe, world, place, entityEquipmentUser, socketToUnequipFrom
	)
	{
		var message;
		if (socketToUnequipFrom == null)
		{
			message = "Nothing to unequip!";
		}
		else
		{
			var itemEntityToUnequip = socketToUnequipFrom.itemEntityEquipped;
			if (itemEntityToUnequip == null)
			{
				message = "Nothing to unequip!";
			}
			else
			{
				socketToUnequipFrom.itemEntityEquipped = null;
				var itemToUnequip = itemEntityToUnequip.item;
				var itemDefn = itemToUnequip.defn(world);
				message = itemDefn.appearance + " unequipped."
			}
		}
		return message;
	};

	// control

	toControl(universe, size, entityEquipmentUser, venuePrev, includeTitle)
	{
		this.statusMessage = "Equip items in available slots.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = entityEquipmentUser.itemHolder;
		var equipmentUser = this;
		var sockets = this.socketGroup.sockets;
		var socketDefnGroup = this.socketGroup.defnGroup;

		var itemCategoriesForAllSockets = [];
		for (var i = 0; i < sockets.length; i++)
		{
			var socket = sockets[i];
			var socketDefn = socket.defn(socketDefnGroup);
			var socketCategoryNames = socketDefn.categoriesAllowedNames;
			for (var j = 0; j < socketCategoryNames.length; j++)
			{
				var categoryName = socketCategoryNames[j];
				if (itemCategoriesForAllSockets.contains(categoryName) == false)
				{
					itemCategoriesForAllSockets.push(categoryName);
				}
			}
		}
		var itemEntitiesEquippable = itemHolder.itemEntities;
		// todo

		var world = universe.world;
		var place = world.placeCurrent;

		var listHeight = 90;

		var listEquippables = new ControlList
		(
			"listEquippables",
			new Coords(10, 30), // pos
			new Coords(70, listHeight), // size
			new DataBinding(itemEntitiesEquippable), // items
			new DataBinding
			(
				null,
				function get(c) { return c.item.toString(world); }
			), // bindingForItemText
			fontHeightSmall,
			new DataBinding
			(
				this,
				function get(c) { return c.itemEntitySelected; },
				function set(c, v) { c.itemEntitySelected = v; }
			), // bindingForItemSelected
			new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
			null, // bindingForIsEnabled
			function confirm()
			{
				var itemEntityToEquip = equipmentUser.itemEntitySelected;
				var itemToEquip = itemEntityToEquip.item;
				var itemToEquipName = itemToEquip.appearance;

				var message = equipmentUser.equipEntityWithItem
				(
					universe, world, place, entityEquipmentUser, itemEntityToEquip
				);
				equipmentUser.statusMessage = message;
			}
		);

		var listEquipped = new ControlList
		(
			"listEquipped",
			new Coords(90, 30), // pos
			new Coords(100, listHeight), // size
			new DataBinding(sockets), // items
			new DataBinding
			(
				null,
				function get(c) { return c.toString(world); }
			), // bindingForItemText
			fontHeightSmall,
			new DataBinding
			(
				this,
				function get(c) { return c.socketSelected; },
				function set(c, v) { c.socketSelected = v; }
			), // bindingForItemSelected
			new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
			null, // bindingForIsEnabled
			function confirm()
			{
				var socketToUnequipFrom = equipmentUser.socketSelected;

				var message = equipmentUser.unequipItemFromSocket
				(
					universe, world, place, entityEquipmentUser, socketToUnequipFrom
				);
				equipmentUser.statusMessage = message;
			}
		);

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"Equipment",
			new Coords(0, 0), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelEquippable",
					new Coords(10, 20), // pos
					new Coords(70, 25), // size
					false, // isTextCentered
					"Equippable:",
					fontHeightSmall
				),

				listEquippables,

				new ControlLabel
				(
					"labelEquipped",
					new Coords(90, 20), // pos
					new Coords(100, 25), // size
					false, // isTextCentered
					"Equipped:",
					fontHeightSmall
				),

				listEquipped,

				new ControlLabel
				(
					"infoStatus",
					new Coords(10, 130), // pos
					new Coords(160, 15), // size
					false, // isTextCentered
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.statusMessage;
						}
					), // text
					fontHeightSmall
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(170, 130), // pos
					new Coords(20, 10), // size
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ) ],

		);

		if (includeTitle)
		{
			childControls.insertElementAt
			(
				new ControlLabel
				(
					"labelEquipment",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Equipment",
					fontHeightLarge
				),
				0 // indexToInsertAt
			);
		}
		else
		{
			var titleHeightInverted = new Coords(0, -15);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};
}
