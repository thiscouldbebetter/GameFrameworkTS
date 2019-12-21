
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
		var itemEntityExisting = this.itemEntities[itemToCheck.defnName];
		var itemExistingQuantity = (itemEntityExisting == null ? 0 : itemEntityExisting.Item.quantity);
		var returnValue = (itemExistingQuantity >= itemToCheck.quantity);
		return returnValue;
	};

	ItemHolder.prototype.itemQuantityByDefnName = function(itemDefnName)
	{
		var itemEntity = this.itemEntities[itemDefnName];
		var returnValue = (itemEntity == null ? 0 : itemEntity.Item.quantity);
		return returnValue;
	};

	ItemHolder.prototype.itemEntityAdd = function(itemEntityToAdd)
	{
		var itemToAdd = itemEntityToAdd.Item;
		var itemDefnName = itemToAdd.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting == null)
		{
			this.itemEntities.push(itemEntityToAdd);
			this.itemEntities[itemDefnName] = itemEntityToAdd;
		}
		else
		{
			itemEntityExisting.Item.quantity += itemToAdd.quantity;
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
			var itemExisting = itemEntityExisting.Item;
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
		this.itemRemove(itemEntity.Item);
	};

	// controls

	ItemHolder.prototype.toControl = function(universe, size, entityItemHolder, venuePrev)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightHalf = fontHeight / 2;

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
					new Coords(100, 15), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Items:",
					fontHeight
				),

				new ControlList
				(
					"listItems",
					new Coords(50, 25), // pos
					new Coords(100, 40), // size
					new DataBinding(this.itemEntities), // items
					new DataBinding
					(
						null,
						function get(c) { return c.Item.toString(world); }
					), // bindingForItemText
					fontHeightHalf,
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
					new Coords(100, 70), // pos
					new Coords(100, 15), // size
					true, // isTextCentered
					"Selected:",
					fontHeight
				),

				new ControlLabel
				(
					"infoItemSelected",
					new Coords(100, 80), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						this,
						function get(c)
						{
							var i = c.itemEntitySelected;
							return (i == null ? "-" : i.Item.toString(world));
						}
					), // text
					fontHeight
				),

				new ControlButton
				(
					"buttonUse",
					new Coords(45, 90), // pos
					new Coords(50, 15), // size
					"Use",
					fontHeight,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c)
						{
							var itemEntity = c.itemEntitySelected;
							return (itemEntity != null && itemEntity.Item.isUsable(world));
						}
					), // isEnabled
					function click(universe)
					{
						var itemEntityToUse = itemHolder.itemEntitySelected;
						var itemToUse = itemEntityToUse.Item;
						if (itemToUse.use != null)
						{
							var world = universe.world;
							var place = world.placeCurrent;
							var user = entityItemHolder;
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
					new Coords(105, 90), // pos
					new Coords(50, 15), // size
					"Drop",
					fontHeight,
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
						var itemToDrop = itemEntityToDrop.Item;
						itemToDrop.quantity = 1;
						var posToDropAt = itemEntityToDrop.Locatable.loc.pos;
						var holderPos = entityItemHolder.Locatable.loc.pos;
						posToDropAt.overwriteWith(holderPos);
						itemEntityToDrop.Collidable.ticksUntilCanCollide = 50;
						place.entitySpawn(universe, world, itemEntityToDrop);
						itemHolder.itemSubtract(itemToDrop);
						if (itemEntityToKeep.Item.quantity == 0)
						{
							itemHolder.itemEntitySelected = null;
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

	// cloneable

	ItemHolder.prototype.clone = function()
	{
		return new ItemHolder(this.itemEntities.clone());
	};
}
