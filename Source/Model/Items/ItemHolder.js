
function ItemHolder(itemEntities)
{
	this.itemEntities = [];

	itemEntities = itemEntities || [];
	for (var i = 0; i < itemEntities.length; i++)
	{
		var itemEntity = itemEntities[i];
		this.itemEntityAdd(itemEntity);
	}
}
{
	ItemHolder.prototype.hasItem = function(itemToCheck)
	{
		return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
	};

	ItemHolder.prototype.hasItemWithDefnNameAndQuantity = function(defnName, quantityToCheck)
	{
		var itemEntityExisting = this.itemEntities[defnName];
		var itemExistingQuantity = (itemEntityExisting == null ? 0 : itemEntityExisting.item.quantity);
		var returnValue = (itemExistingQuantity >= quantityToCheck);
		return returnValue;
	};

	ItemHolder.prototype.itemQuantityByDefnName = function(itemDefnName)
	{
		var itemEntity = this.itemEntities[itemDefnName];
		var returnValue = (itemEntity == null ? 0 : itemEntity.item.quantity);
		return returnValue;
	};

	ItemHolder.prototype.itemEntitiesWithDefnNameJoin = function(defnName)
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

	ItemHolder.prototype.itemEntityAdd = function(itemEntityToAdd)
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

	ItemHolder.prototype.itemEntityRemove = function(itemEntityToRemove)
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

	ItemHolder.prototype.itemRemove = function(itemToRemove)
	{
		var itemDefnName = itemToRemove.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting != null)
		{
			this.itemEntities.remove(itemEntityExisting);
			delete this.itemEntities[itemDefnName];
		}
	};

	ItemHolder.prototype.itemSubtract = function(itemToSubtract)
	{
		this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
	};

	ItemHolder.prototype.itemSubtractDefnNameAndQuantity = function(itemDefnName, quantityToSubtract)
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

	ItemHolder.prototype.itemEntitiesTransferTo = function(other)
	{
		for (var i = 0; i < this.itemEntities.length; i++)
		{
			var itemEntity = this.itemEntities[i];
			this.itemEntityTransferTo(itemEntity, other);
		}
	};

	ItemHolder.prototype.itemEntityTransferTo = function(itemEntity, other)
	{
		other.itemEntityAdd(itemEntity);
		this.itemRemove(itemEntity.item);
	};

	// controls

	ItemHolder.prototype.toControl = function(universe, size, entityItemHolder, venuePrev)
	{
		this.statusMessage = "-";

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = this;
		var world = universe.world;

		var returnValue = new ControlContainer
		(
			"containerItems",
			Coords.Instances().Zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelItems",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Items",
					fontHeightLarge
				),

				new ControlList
				(
					"listItems",
					new Coords(10, 25), // pos
					new Coords(70, 70), // size
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
				),

				new ControlLabel
				(
					"labelItemSelected",
					new Coords(150, 25), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
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
					fontHeight
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(100, 105), // pos
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
					fontHeight
				),

				new ControlButton
				(
					"buttonUp",
					new Coords(85, 25), // pos
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
					function click(universe)
					{
						var itemEntityToMove = itemHolder.itemEntitySelected;
						var itemEntitiesAll = itemHolder.itemEntities;
						var index = itemEntitiesAll.indexOf(itemEntityToMove);
						if (index > 0)
						{
							itemEntitiesAll.removeAt(index);
							itemEntitiesAll.insertElementAt(itemEntityToMove, index - 1);
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDown",
					new Coords(85, 40), // pos
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
					function click(universe)
					{
						var itemEntityToMove = itemHolder.itemEntitySelected;
						var itemEntitiesAll = itemHolder.itemEntities;
						var index = itemEntitiesAll.indexOf(itemEntityToMove);
						if (index < itemEntitiesAll.length - 1)
						{
							itemEntitiesAll.removeAt(index);
							itemEntitiesAll.insertElementAt(itemEntityToMove, index + 1);
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSplit",
					new Coords(85, 55), // pos
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
					function click(universe)
					{
						var itemEntityToSplit = itemHolder.itemEntitySelected;
						var itemToSplit = itemEntityToSplit.item;
						if (itemToSplit.quantity > 1)
						{
							var quantityToSplit = Math.floor(itemToSplit.quantity / 2);

							itemToSplit.quantity -= quantityToSplit;

							var itemEntitySplitted = itemEntityToSplit.clone();
							itemEntitySplitted.item.quantity = quantityToSplit;
							// Add with no join.
							var itemEntities = itemHolder.itemEntities;
							itemEntities.insertElementAfterOther(itemEntitySplitted, itemEntityToSplit);
							itemEntities[itemToSplit.defnName] = itemEntitySplitted;
						}
					},
					universe // context
				),

				new ControlButton
				(
					"buttonJoin",
					new Coords(85, 70), // pos
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
					function click(universe)
					{
						var itemEntityToJoin = itemHolder.itemEntitySelected;
						var itemToJoin = itemEntityToJoin.item;
						var itemEntityJoined =
							itemHolder.itemEntitiesWithDefnNameJoin(itemToJoin.defnName);
						itemHolder.itemEntitySelected = itemEntityJoined;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonSort",
					new Coords(85, 85), // pos
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
					function click(universe)
					{
						itemHolder.itemEntities.sortByProperty
						(
							x => x.item.defnName
						).addLookups
						(
							y => y.item.defnName
						);
					},
					universe // context
				),

				new ControlButton
				(
					"buttonUse",
					new Coords(130, 85), // pos
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
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDrop",
					new Coords(150, 85), // pos
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
						var world = universe.world;
						var place = world.placeCurrent;
						var itemEntityToKeep = itemHolder.itemEntitySelected;
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
					},
					universe // context
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(75, 130), // pos
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

	// cloneable

	ItemHolder.prototype.clone = function()
	{
		return new ItemHolder(this.itemEntities.clone());
	};
}
