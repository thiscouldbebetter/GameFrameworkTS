
class ItemHolder
{
	constructor(itemEntities)
	{
		this.itemEntities = [];

		itemEntities = itemEntities || [];
		for (var i = 0; i < itemEntities.length; i++)
		{
			var itemEntity = itemEntities[i];
			this.itemEntityAdd(itemEntity);
		}
	}

	// Static methods.

	static fromItems(items)
	{
		var itemEntities = items.map(x => x.toEntity());
		return new ItemHolder(itemEntities);
	};

	// Instance methods.

	hasItem(itemToCheck)
	{
		return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
	};

	hasItemWithDefnNameAndQuantity(defnName, quantityToCheck)
	{
		var itemEntityExisting = this.itemEntities[defnName];
		var itemExistingQuantity = (itemEntityExisting == null ? 0 : itemEntityExisting.item.quantity);
		var returnValue = (itemExistingQuantity >= quantityToCheck);
		return returnValue;
	};

	itemQuantityByDefnName(itemDefnName)
	{
		var itemEntity = this.itemEntities[itemDefnName];
		var returnValue = (itemEntity == null ? 0 : itemEntity.item.quantity);
		return returnValue;
	};

	itemEntitiesWithDefnNameJoin(defnName)
	{
		var itemEntitiesMatching = this.itemEntities.filter(x => x.item.defnName == defnName);
		var itemEntityJoined = itemEntitiesMatching[0];
		var itemJoined = itemEntityJoined.item;
		for (var i = 1; i < itemEntitiesMatching.length; i++)
		{
			var itemEntityToJoin = itemEntitiesMatching[i];
			itemJoined.quantity += itemEntityToJoin.item.quantity;
			this.itemEntities.remove(itemEntityToJoin);
		}
		this.itemEntities[defnName] = itemEntityJoined;
		return itemEntityJoined;
	};

	itemEntityAdd(itemEntityToAdd)
	{
		var itemToAdd = itemEntityToAdd.item;
		var itemDefnName = itemToAdd.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting == null)
		{
			this.itemEntities.push(itemEntityToAdd);
			this.itemEntities[itemDefnName] = itemEntityToAdd;
		}
		else
		{
			itemEntityExisting.item.quantity += itemToAdd.quantity;
		}
	};

	itemEntityRemove(itemEntityToRemove)
	{
		var doesExist = this.itemEntities.contains(itemEntityToRemove);
		if (doesExist)
		{
			this.itemEntities.remove(itemEntityToRemove);
			var defnName = itemEntityToRemove.item.defnName;
			var areOtherItemsOfSameType = this.itemEntities.some(x => x.item.defnName == defnName);
			if (areOtherItemsOfSameType == false)
			{
				delete this.itemEntities[itemDefnName];
			}
		}
	};

	itemRemove(itemToRemove)
	{
		var itemDefnName = itemToRemove.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting != null)
		{
			this.itemEntities.remove(itemEntityExisting);
			delete this.itemEntities[itemDefnName];
		}
	};

	itemSubtract(itemToSubtract)
	{
		this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
	};

	itemSubtractDefnNameAndQuantity(itemDefnName, quantityToSubtract)
	{
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting != null)
		{
			var itemExisting = itemEntityExisting.item;
			itemExisting.quantity -= quantityToSubtract;
			if (itemExisting.quantity <= 0)
			{
				this.itemEntities.remove(itemEntityExisting);
				delete this.itemEntities[itemDefnName];
			}
		}
	};

	itemEntitiesAllTransferTo(other)
	{
		this.itemEntitiesTransferTo(this.itemEntities, other);
	};

	itemEntitiesTransferTo(itemEntitiesToTransfer, other)
	{
		for (var i = 0; i < itemEntitiesToTransfer.length; i++)
		{
			var itemEntity = itemEntitiesToTransfer[i];
			this.itemEntityTransferTo(itemEntity, other);
		}
	};

	itemEntitySplit(itemEntityToSplit, quantityToSplit)
	{
		var itemEntitySplitted = null;

		var itemToSplit = itemEntityToSplit.item;
		if (itemToSplit.quantity <= 1)
		{
			itemEntitySplitted = itemEntityToSplit;
		}
		else
		{
			quantityToSplit = quantityToSplit || Math.floor(itemToSplit.quantity / 2);
			if (quantityToSplit >= itemEntityToSplit.quantity)
			{
				itemEntitySplitted = itemEntityToSplit;
			}
			else
			{
				itemToSplit.quantity -= quantityToSplit;

				itemEntitySplitted = itemEntityToSplit.clone();
				itemEntitySplitted.item.quantity = quantityToSplit;
				// Add with no join.
				this.itemEntities.insertElementAfterOther(itemEntitySplitted, itemEntityToSplit);
			}
		}

		this.itemEntities[itemToSplit.defnName] = itemEntitySplitted;

		return itemEntitySplitted;
	};

	itemEntityTransferTo(itemEntity, other)
	{
		other.itemEntityAdd(itemEntity);
		this.itemRemove(itemEntity.item);
	};

	itemEntityTransferSingleTo(itemEntity, other)
	{
		var itemEntitySingle = this.itemEntitySplit(itemEntity, 1);
		this.itemEntityTransferTo(itemEntitySingle, other);
	};

	tradeValueOfAllItems(world)
	{
		var items = this.itemEntities.map(x => x.item);

		var tradeValueTotal = items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.tradeValue(world),
			0 // sumSoFar
		);

		return tradeValueTotal;
	};

	// controls

	toControl(universe, size, entityItemHolder, venuePrev, includeTitle)
	{
		this.statusMessage = "Use, drop, and sort items.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = this;
		var world = universe.world;
		var place = world.placeCurrent;

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var drop = function()
		{
			var itemEntityToKeep = itemHolder.itemEntitySelected;
			if (itemEntityToKeep != null)
			{
				var world = universe.world;
				var place = world.placeCurrent;
				var itemEntityToDrop = itemEntityToKeep.clone();
				var itemToDrop = itemEntityToDrop.item;
				itemToDrop.quantity = 1;
				var posToDropAt = itemEntityToDrop.locatable.loc.pos;
				var holderPos = entityItemHolder.locatable.loc.pos;
				posToDropAt.overwriteWith(holderPos);
				itemEntityToDrop.collidable.ticksUntilCanCollide = 50;
				place.entitySpawn(universe, world, itemEntityToDrop);
				itemHolder.itemSubtract(itemToDrop);
				if (itemEntityToKeep.item.quantity == 0)
				{
					itemHolder.itemEntitySelected = null;
				}
				var itemToDropDefn = itemToDrop.defn(world);
				itemHolder.statusMessage = itemToDropDefn.appearance + " dropped."
			}
		};

		var use = function()
		{
			var itemEntityToUse = itemHolder.itemEntitySelected;
			var itemToUse = itemEntityToUse.item;
			if (itemToUse.use != null)
			{
				var world = universe.world;
				var place = world.placeCurrent;
				var user = entityItemHolder;
				itemHolder.statusMessage =
					itemToUse.use(universe, world, place, user, itemEntityToUse);
				if (itemToUse.quantity <= 0)
				{
					itemHolder.itemEntitySelected = null;
				}
			}
		};

		var up = function()
		{
			var itemEntityToMove = itemHolder.itemEntitySelected;
			var itemEntitiesAll = itemHolder.itemEntities;
			var index = itemEntitiesAll.indexOf(itemEntityToMove);
			if (index > 0)
			{
				itemEntitiesAll.removeAt(index);
				itemEntitiesAll.insertElementAt(itemEntityToMove, index - 1);
			}
		};

		var down = function()
		{
			var itemEntityToMove = itemHolder.itemEntitySelected;
			var itemEntitiesAll = itemHolder.itemEntities;
			var index = itemEntitiesAll.indexOf(itemEntityToMove);
			if (index < itemEntitiesAll.length - 1)
			{
				itemEntitiesAll.removeAt(index);
				itemEntitiesAll.insertElementAt(itemEntityToMove, index + 1);
			}
		};

		var split = function(universe)
		{
			itemHolder.itemEntitySplit(itemHolder.itemEntitySelected);
		};

		var join = function()
		{
			var itemEntityToJoin = itemHolder.itemEntitySelected;
			var itemToJoin = itemEntityToJoin.item;
			var itemEntityJoined =
				itemHolder.itemEntitiesWithDefnNameJoin(itemToJoin.defnName);
			itemHolder.itemEntitySelected = itemEntityJoined;
		};

		var sort = function()
		{
			itemHolder.itemEntities.sortByProperty
			(
				x => x.item.defnName
			).addLookups
			(
				y => y.item.defnName
			);
		};

		var equipItemInNumberedSlot = function(slotNumber)
		{
			var entityItemToEquip = itemHolder.itemEntitySelected;
			if (entityItemToEquip != null)
			{
				var world = universe.world;
				var place = world.placeCurrent;
				var equipmentUser = entityItemHolder.equipmentUser;
				var socketName = "Item" + slotNumber;
				var includeSocketNameInMessage = true;
				var message = equipmentUser.equipItemEntityInSocketWithName
				(
					universe, world, place, entityItemToEquip,
					socketName, includeSocketNameInMessage
				);
				itemHolder.statusMessage = message;
			}
		};

		var buttonSize = new Coords(20, 10);

		var childControls =
		[
			new ControlLabel
			(
				"labelEquippable",
				new Coords(10, 20), // pos
				new Coords(70, 25), // size
				false, // isTextCentered
				"Items Held:",
				fontHeightSmall
			),

			new ControlList
			(
				"listItems",
				new Coords(10, 30), // pos
				new Coords(70, 110), // size
				new DataBinding(this.itemEntities), // items
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
				true, // isEnabled
				function confirm(context, universe)
				{
					use();
				}
			),

			new ControlLabel
			(
				"labelItemSelected",
				new Coords(150, 25), // pos
				new Coords(100, 15), // size
				true, // isTextCentered
				"Item Selected:",
				fontHeightSmall
			),

			new ControlLabel
			(
				"infoItemSelected",
				new Coords(150, 35), // pos
				new Coords(200, 15), // size
				true, // isTextCentered
				new DataBinding
				(
					this,
					function get(c)
					{
						var i = c.itemEntitySelected;
						return (i == null ? "-" : i.item.toString(world));
					}
				), // text
				fontHeightSmall
			),

			new ControlLabel
			(
				"infoStatus",
				new Coords(150, 110), // pos
				new Coords(200, 15), // size
				true, // isTextCentered
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
				"buttonUp",
				new Coords(85, 30), // pos
				new Coords(15, 10), // size
				"Up",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						var returnValue =
						(
							c.itemEntitySelected != null
							&& c.itemEntities.indexOf(c.itemEntitySelected) > 0
						);
						return returnValue;
					}
				), // isEnabled
				up // click
			),

			new ControlButton
			(
				"buttonDown",
				new Coords(85, 45), // pos
				new Coords(15, 10), // size
				"Down",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						var returnValue =
						(
							c.itemEntitySelected != null
							&& c.itemEntities.indexOf(c.itemEntitySelected) < c.itemEntities.length - 1
						);
						return returnValue;
					}
				), // isEnabled
				down
			),

			new ControlButton
			(
				"buttonSplit",
				new Coords(85, 60), // pos
				new Coords(15, 10), // size
				"Split",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						var itemEntity = c.itemEntitySelected;
						var returnValue =
						(
							itemEntity != null
							&& (itemEntity.item.quantity > 1)
						);
						return returnValue;
					}
				), // isEnabled
				split
			),

			new ControlButton
			(
				"buttonJoin",
				new Coords(85, 75), // pos
				new Coords(15, 10), // size
				"Join",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						var returnValue =
						(
							c.itemEntitySelected != null
							&&
							(
								c.itemEntities.filter
								(
									x => x.item.defnName == c.itemEntitySelected.item.defnName
								).length > 1
							)
						);
						return returnValue;
					}
				), // isEnabled
				join
			),

			new ControlButton
			(
				"buttonSort",
				new Coords(85, 90), // pos
				new Coords(15, 10), // size
				"Sort",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						return c.itemEntities.length > 1;
					}
				), // isEnabled
				sort
			),

			new ControlButton
			(
				"buttonUse",
				new Coords(130, 90), // pos
				new Coords(15, 10), // size
				"Use",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c)
					{
						var itemEntity = c.itemEntitySelected;
						return (itemEntity != null && itemEntity.item.isUsable(world));
					}
				), // isEnabled
				function click(universe)
				{
					use();
				},
				universe // context
			),

			new ControlButton
			(
				"buttonDrop",
				new Coords(150, 90), // pos
				new Coords(15, 10), // size
				"Drop",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					function get(c) { return c.itemEntitySelected != null}
				), // isEnabled
				function click(universe)
				{
					drop();
				}
			),

			new ControlButton
			(
				"buttonDone",
				new Coords(170, 130), // pos
				buttonSize.clone(),
				"Done",
				fontHeightSmall,
				true, // hasBorder
				true, // isEnabled
				back
			)
		];

		var returnValue = new ControlContainer
		(
			"Items",
			new Coords(0, 0), // pos
			sizeBase.clone(), // size
			childControls,
			[
				new Action("Back", back),

				new Action("Up", up),
				new Action("Down", down),
				new Action("Split", split),
				new Action("Join", join),
				new Action("Sort", sort),
				new Action("Drop", drop),
				new Action("Use", use),

				new Action("Item0", function perform() { equipItemInNumberedSlot(0) } ),
				new Action("Item1", function perform() { equipItemInNumberedSlot(1) } ),
				new Action("Item2", function perform() { equipItemInNumberedSlot(2) } ),
				new Action("Item3", function perform() { equipItemInNumberedSlot(3) } ),
				new Action("Item4", function perform() { equipItemInNumberedSlot(4) } ),
				new Action("Item5", function perform() { equipItemInNumberedSlot(5) } ),
				new Action("Item6", function perform() { equipItemInNumberedSlot(6) } ),
				new Action("Item7", function perform() { equipItemInNumberedSlot(7) } ),
				new Action("Item8", function perform() { equipItemInNumberedSlot(8) } ),
				new Action("Item9", function perform() { equipItemInNumberedSlot(9) } ),
			],

			[
				new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ),

				new ActionToInputsMapping( "Up", [ "[" ], true ),
				new ActionToInputsMapping( "Down", [ "]" ], true ),
				new ActionToInputsMapping( "Sort", [ "\\" ], true ),
				new ActionToInputsMapping( "Split", [ "/" ], true ),
				new ActionToInputsMapping( "Join", [ "=" ], true ),
				new ActionToInputsMapping( "Drop", [ "d" ], true ),
				new ActionToInputsMapping( "Use", [ "u" ], true ),

				new ActionToInputsMapping( "Item0", [ "_0" ], true ),
				new ActionToInputsMapping( "Item1", [ "_1" ], true ),
				new ActionToInputsMapping( "Item2", [ "_2" ], true ),
				new ActionToInputsMapping( "Item3", [ "_3" ], true ),
				new ActionToInputsMapping( "Item4", [ "_4" ], true ),
				new ActionToInputsMapping( "Item5", [ "_5" ], true ),
				new ActionToInputsMapping( "Item6", [ "_6" ], true ),
				new ActionToInputsMapping( "Item7", [ "_7" ], true ),
				new ActionToInputsMapping( "Item8", [ "_8" ], true ),
				new ActionToInputsMapping( "Item9", [ "_9" ], true ),

			]
		);

		if (includeTitle)
		{
			childControls.insertElementAt
			(
				new ControlLabel
				(
					"labelItems",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Items",
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

	// cloneable

	clone()
	{
		return new ItemHolder(this.itemEntities.clone());
	};
}
