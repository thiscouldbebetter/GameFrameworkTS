
namespace ThisCouldBeBetter.GameFramework
{

export class ItemHolder extends EntityProperty
{
	itemEntities: Entity[];
	massMax: number;
	reachRadius: number;

	itemEntitySelected: Entity;
	statusMessage: string;

	constructor
	(
		itemEntities: Entity[], massMax: number, reachRadius: number
	)
	{
		super();
		this.itemEntities = [];
		this.massMax = massMax;
		this.reachRadius = reachRadius || 20;

		itemEntities = itemEntities || [];
		for (var i = 0; i < itemEntities.length; i++)
		{
			var itemEntity = itemEntities[i];
			this.itemEntityAdd(itemEntity);
		}
	}

	static create(): ItemHolder
	{
		return new ItemHolder(null, null, null);
	}

	static fromItemEntities(itemEntities: Entity[]): ItemHolder
	{
		return new ItemHolder(itemEntities, null, null);
	}

	// Instance methods.

	clear()
	{
		this.itemEntities.length = 0;
		this.itemEntitySelected = null;
		this.statusMessage = "";
	}

	equipItemInNumberedSlot(universe: Universe, entityItemHolder: Entity, slotNumber: number)
	{
		var entityItemToEquip = this.itemEntitySelected;
		if (entityItemToEquip != null)
		{
			var world = universe.world;
			var place = world.placeCurrent;
			var equipmentUser = entityItemHolder.equipmentUser();
			var socketName = "Item" + slotNumber;
			var includeSocketNameInMessage = true;
			var message = equipmentUser.equipItemEntityInSocketWithName
			(
				universe, world, place, entityItemHolder, entityItemToEquip,
				socketName, includeSocketNameInMessage
			);
			this.statusMessage = message;
		}
	}

	hasItem(itemToCheck: Item)
	{
		return this.hasItemWithDefnNameAndQuantity(itemToCheck.defnName, itemToCheck.quantity);
	}

	hasItemWithDefnNameAndQuantity(defnName: string, quantityToCheck: number)
	{
		var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
		var returnValue = (itemExistingQuantity >= quantityToCheck);
		return returnValue;
	}

	itemEntitiesAdd(itemEntitiesToAdd: Entity[])
	{
		itemEntitiesToAdd.forEach(x => this.itemEntityAdd(x));
	}

	itemEntitiesAllTransferTo(other: ItemHolder)
	{
		this.itemEntitiesTransferTo(this.itemEntities, other);
	}

	itemEntitiesByDefnName(defnName: string)
	{
		return this.itemEntities.filter
		(
			x => x.item().defnName == defnName
		);
	}

	itemEntitiesTransferTo(itemEntitiesToTransfer: Entity[], other: ItemHolder)
	{
		if (itemEntitiesToTransfer == this.itemEntities)
		{
			// Create a new array to avoid modifying the one being looped through.
			itemEntitiesToTransfer = new Array<Entity>();
			itemEntitiesToTransfer.push(...this.itemEntities);
		}
		for (var i = 0; i < itemEntitiesToTransfer.length; i++)
		{
			var itemEntity = itemEntitiesToTransfer[i];
			this.itemEntityTransferTo(itemEntity, other);
		}
	}

	itemEntitiesWithDefnNameJoin(defnName: string)
	{
		var itemEntitiesMatching = this.itemEntities.filter(x => x.item().defnName == defnName);
		var itemEntityJoined = itemEntitiesMatching[0];
		if (itemEntityJoined != null)
		{
			var itemJoined = itemEntityJoined.item();
			for (var i = 1; i < itemEntitiesMatching.length; i++)
			{
				var itemEntityToJoin = itemEntitiesMatching[i];
				itemJoined.quantity += itemEntityToJoin.item().quantity;
				ArrayHelper.remove(this.itemEntities, itemEntityToJoin);
			}
		}
		return itemEntityJoined;
	}

	itemEntityAdd(itemEntityToAdd: Entity)
	{
		var itemToAdd = itemEntityToAdd.item();
		var itemDefnName = itemToAdd.defnName;
		var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
		if (itemEntityExisting == null)
		{
			this.itemEntities.push(itemEntityToAdd);
		}
		else
		{
			itemEntityExisting.item().quantity += itemToAdd.quantity;
		}
	}

	itemEntityFindClosest(universe: Universe, world: World, place: Place, entityItemHolder: Entity)
	{
		var entityItemsInPlace = place.items();
		var entityItemClosest = entityItemsInPlace.filter
		(
			x =>
				x.locatable().distanceFromEntity(entityItemHolder) < this.reachRadius
		).sort
		(
			(a, b) =>
				a.locatable().distanceFromEntity(entityItemHolder)
				- b.locatable().distanceFromEntity(entityItemHolder)
		)[0];

		return entityItemClosest;
	}

	itemEntityCanPickUp
	(
		universe: Universe, world: World, place: Place,
		entityItemHolder: Entity, entityItemToPickUp: Entity
	)
	{
		var massAlreadyHeld = this.massOfAllItems(world);
		var massOfItem = entityItemToPickUp.item().mass(world);
		var massAfterPickup = massAlreadyHeld + massOfItem;
		var canPickUp = (massAfterPickup <= this.massMax);
		return canPickUp;
	}

	itemEntityPickUp
	(
		universe: Universe, world: World, place: Place,
		entityItemHolder: Entity, entityItemToPickUp: Entity
	)
	{
		this.itemEntityAdd(entityItemToPickUp);
		place.entitiesToRemove.push(entityItemToPickUp);
	}

	itemEntityRemove(itemEntityToRemove: Entity)
	{
		var doesExist = this.itemEntities.indexOf(itemEntityToRemove) >= 0;
		if (doesExist)
		{
			ArrayHelper.remove(this.itemEntities, itemEntityToRemove);
		}
	}

	itemEntitySplit(itemEntityToSplit: Entity, quantityToSplit: number)
	{
		var itemEntitySplitted = null;

		var itemToSplit = itemEntityToSplit.item();
		if (itemToSplit.quantity <= 1)
		{
			itemEntitySplitted = itemEntityToSplit;
		}
		else
		{
			quantityToSplit = quantityToSplit || Math.floor(itemToSplit.quantity / 2);
			if (quantityToSplit >= itemToSplit.quantity)
			{
				itemEntitySplitted = itemEntityToSplit;
			}
			else
			{
				itemToSplit.quantity -= quantityToSplit;

				itemEntitySplitted = itemEntityToSplit.clone();
				itemEntitySplitted.item().quantity = quantityToSplit;
				// Add with no join.
				ArrayHelper.insertElementAfterOther
				(
					this.itemEntities, itemEntitySplitted, itemEntityToSplit
				);
			}
		}

		return itemEntitySplitted;
	}

	itemEntityTransferTo(itemEntity: Entity, other: ItemHolder)
	{
		other.itemEntityAdd(itemEntity);
		ArrayHelper.remove(this.itemEntities, itemEntity);
		if (this.itemEntitySelected == itemEntity)
		{
			this.itemEntitySelected = null;
		}
	}

	itemEntityTransferSingleTo(itemEntity: Entity, other: ItemHolder)
	{
		var itemEntitySingle = this.itemEntitySplit(itemEntity, 1);
		this.itemEntityTransferTo(itemEntitySingle, other);
	}

	itemQuantityByDefnName(defnName: string)
	{
		return this.itemsByDefnName(defnName).map
		(
			y => y.quantity
		).reduce
		(
			(a,b) => a + b, 0
		);
	}

	itemSubtract(itemToSubtract: Item)
	{
		this.itemSubtractDefnNameAndQuantity(itemToSubtract.defnName, itemToSubtract.quantity);
	}

	itemSubtractDefnNameAndQuantity(itemDefnName: string, quantityToSubtract: number)
	{
		this.itemEntitiesWithDefnNameJoin(itemDefnName);
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting != null)
		{
			itemExisting.quantity -= quantityToSubtract;
			if (itemExisting.quantity <= 0)
			{
				var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
				ArrayHelper.remove(this.itemEntities, itemEntityExisting);
			}
		}
	}

	itemTransferTo(itemToTransfer: Item, other: ItemHolder)
	{
		var itemDefnName = itemToTransfer.defnName;
		this.itemEntitiesWithDefnNameJoin(itemDefnName);
		var itemEntityExisting = this.itemEntitiesByDefnName(itemDefnName)[0];
		if (itemEntityExisting != null)
		{
			var itemEntityToTransfer =
				this.itemEntitySplit(itemEntityExisting, itemToTransfer.quantity);
			other.itemEntityAdd(itemEntityToTransfer.clone());
			this.itemSubtract(itemToTransfer);
		}
	}

	items()
	{
		return this.itemEntities.map(x => x.item());
	}

	itemsByDefnName(defnName: string)
	{
		return this.itemEntitiesByDefnName(defnName).map(x => x.item());
	}

	massOfAllItems(world: World)
	{
		var massTotal = this.itemEntities.reduce
		(
			(sumSoFar, itemEntity) => sumSoFar + itemEntity.item().mass(world),
			0 // sumSoFar
		);

		return massTotal;
	}

	massOfAllItemsOverMax(world: World)
	{
		return "" + Math.ceil(this.massOfAllItems(world)) + "/" + this.massMax;
	}

	tradeValueOfAllItems(world: World)
	{
		var tradeValueTotal = this.itemEntities.reduce
		(
			(sumSoFar, itemEntity) => sumSoFar + itemEntity.item().tradeValue(world),
			0 // sumSoFar
		);

		return tradeValueTotal;
	}

	// controls

	toControl(universe: Universe, size: Coords, entityItemHolder: Entity, venuePrev: Venue, includeTitleAndDoneButton: boolean)
	{
		this.statusMessage = "Use, drop, and sort items.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = Coords.fromXY(200, 135);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = this;
		var world = universe.world;

		var back = () =>
		{
			var venueNext: Venue = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var drop = () =>
		{
			var itemEntityToKeep = itemHolder.itemEntitySelected;
			if (itemEntityToKeep != null)
			{
				var world = universe.world;
				var place = world.placeCurrent;
				var itemEntityToDrop = itemEntityToKeep.clone();
				var itemToDrop = itemEntityToDrop.item();
				itemToDrop.quantity = 1;
				var itemToDropDefn = itemToDrop.defn(world);
				var itemLocatable = itemEntityToDrop.locatable();
				if (itemLocatable == null)
				{
					itemLocatable = Locatable.create();
					itemEntityToDrop.propertyAddForPlace(itemLocatable, place);
					itemEntityToDrop.propertyAddForPlace
					(
						Drawable.fromVisual(itemToDropDefn.visual), place
					);
					// todo - Other properties: Collidable, etc.
				}
				var posToDropAt = itemLocatable.loc.pos;
				var holderPos = entityItemHolder.locatable().loc.pos;
				posToDropAt.overwriteWith(holderPos);
				var collidable = itemEntityToDrop.collidable();
				if (collidable != null)
				{
					collidable.ticksUntilCanCollide = collidable.ticksToWaitBetweenCollisions;
				}
				place.entitySpawn(universe, world, itemEntityToDrop);
				itemHolder.itemSubtract(itemToDrop);
				if (itemEntityToKeep.item().quantity == 0)
				{
					itemHolder.itemEntitySelected = null;
				}
				itemHolder.statusMessage = itemToDropDefn.appearance + " dropped."
				var equipmentUser = entityItemHolder.equipmentUser();
				if (equipmentUser != null)
				{
					equipmentUser.unequipItemEntity(itemEntityToKeep);
				}
			}
		};

		var use = () =>
		{
			var itemEntityToUse = itemHolder.itemEntitySelected;
			if (itemEntityToUse != null)
			{
				var itemToUse = itemEntityToUse.item();
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
			}
		};

		var up = () =>
		{
			var itemEntityToMove = itemHolder.itemEntitySelected;
			var itemEntitiesAll = itemHolder.itemEntities;
			var index = itemEntitiesAll.indexOf(itemEntityToMove);
			if (index > 0)
			{
				itemEntitiesAll.splice(index, 1);
				itemEntitiesAll.splice(index - 1, 0, itemEntityToMove);
			}
		};

		var down = () =>
		{
			var itemEntityToMove = itemHolder.itemEntitySelected;
			var itemEntitiesAll = itemHolder.itemEntities;
			var index = itemEntitiesAll.indexOf(itemEntityToMove);
			if (index < itemEntitiesAll.length - 1)
			{
				itemEntitiesAll.splice(index, 1);
				itemEntitiesAll.splice(index + 1, 0, itemEntityToMove);
			}
		};

		var split = (universe: Universe) =>
		{
			itemHolder.itemEntitySplit(itemHolder.itemEntitySelected, null);
		};

		var join = () =>
		{
			var itemEntityToJoin = itemHolder.itemEntitySelected;
			var itemToJoin = itemEntityToJoin.item();
			var itemEntityJoined =
				itemHolder.itemEntitiesWithDefnNameJoin(itemToJoin.defnName);
			itemHolder.itemEntitySelected = itemEntityJoined;
		};

		var sort = () =>
		{
			itemHolder.itemEntities.sort
			(
				(x, y) => (x.item().defnName > y.item().defnName ? 1 : -1)
			);
		};

		var buttonSize = Coords.fromXY(20, 10);
		var visualNone = new VisualNone();

		var childControls =
		[
			new ControlLabel
			(
				"labelItemsHeld",
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				false, // isTextCentered
				"Items Held:",
				fontHeightSmall
			),

			ControlList.from10
			(
				"listItems",
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(70, 100), // size
				DataBinding.fromContext(this.itemEntities), // items
				DataBinding.fromGet
				(
					(c: Entity) => c.item().toString(world)
				), // bindingForItemText
				fontHeightSmall,
				new DataBinding
				(
					this,
					(c: ItemHolder) => c.itemEntitySelected,
					(c: ItemHolder, v: Entity) => c.itemEntitySelected = v
				), // bindingForItemSelected
				DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
				DataBinding.fromTrue(), // isEnabled
				(universe: Universe) => // confirm
				{
					use();
				}
			),

			new ControlLabel
			(
				"infoWeight",
				Coords.fromXY(10, 115), // pos
				Coords.fromXY(100, 25), // size
				false, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => "Weight: " + c.massOfAllItemsOverMax(world)
				),
				fontHeightSmall
			),

			ControlButton.from8
			(
				"buttonUp",
				Coords.fromXY(85, 15), // pos
				Coords.fromXY(15, 10), // size
				"Up",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
						c.itemEntitySelected != null
						&& c.itemEntities.indexOf(c.itemEntitySelected) > 0
				), // isEnabled
				up // click
			),

			ControlButton.from8
			(
				"buttonDown",
				Coords.fromXY(85, 30), // pos
				Coords.fromXY(15, 10), // size
				"Down",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
						c.itemEntitySelected != null
						&& c.itemEntities.indexOf(c.itemEntitySelected) < c.itemEntities.length - 1
				), // isEnabled
				down
			),

			ControlButton.from8
			(
				"buttonSplit",
				Coords.fromXY(85, 45), // pos
				Coords.fromXY(15, 10), // size
				"Split",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var itemEntity = c.itemEntitySelected;
						var returnValue =
						(
							itemEntity != null
							&& (itemEntity.item().quantity > 1)
						);
						return returnValue;
					}
				), // isEnabled
				split
			),

			ControlButton.from8
			(
				"buttonJoin",
				Coords.fromXY(85, 60), // pos
				Coords.fromXY(15, 10), // size
				"Join",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => 
						c.itemEntitySelected != null
						&&
						(
							c.itemEntities.filter
							(
								(x: Entity) => x.item().defnName == c.itemEntitySelected.item().defnName
							).length > 1
						)
				), // isEnabled
				join
			),

			ControlButton.from8
			(
				"buttonSort",
				Coords.fromXY(85, 75), // pos
				Coords.fromXY(15, 10), // size
				"Sort",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => (c.itemEntities.length > 1)
				), // isEnabled
				sort
			),

			new ControlLabel
			(
				"labelItemSelected",
				Coords.fromXY(150, 10), // pos
				Coords.fromXY(100, 15), // size
				true, // isTextCentered
				"Item Selected:",
				fontHeightSmall
			),

			new ControlLabel
			(
				"infoItemSelected",
				Coords.fromXY(150, 20), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var i = c.itemEntitySelected;
						return (i == null ? "-" : i.item().toString(world));
					}
				), // text
				fontHeightSmall
			),

			ControlVisual.from5
			(
				"visualImage",
				Coords.fromXY(125, 25), // pos
				Coords.fromXY(50, 50), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var i = c.itemEntitySelected;
						return (i == null ? visualNone : i.item().defn(world).visual);
					}
				),
				Color.byName("Black") // colorBackground
			),

			new ControlLabel
			(
				"infoStatus",
				Coords.fromXY(150, 115), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => c.statusMessage
				), // text
				fontHeightSmall
			),

			ControlButton.from8
			(
				"buttonUse",
				Coords.fromXY(132.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Use",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var itemEntity = c.itemEntitySelected;
						return (itemEntity != null && itemEntity.item().isUsable(world));
					}
				), // isEnabled
				(universe: Universe) => 
				{
					use();
				}
			),

			ControlButton.from8
			(
				"buttonDrop",
				Coords.fromXY(152.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Drop",
				fontHeightSmall,
				true, // hasBorder
				new DataBinding
				(
					this,
					(c: ItemHolder) => (c.itemEntitySelected != null),
					null
				), // isEnabled
				(universe: Universe) => // click
				{
					drop();
				}
			)
		];

		var returnValue = new ControlContainer
		(
			"Items",
			Coords.create(), // pos
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

				new Action("Item0", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 0) ),
				new Action("Item1", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 1) ),
				new Action("Item2", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 2) ),
				new Action("Item3", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 3) ),
				new Action("Item4", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 4) ),
				new Action("Item5", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 5) ),
				new Action("Item6", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 6) ),
				new Action("Item7", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 7) ),
				new Action("Item8", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 8) ),
				new Action("Item9", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 9) ),
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ),

				new ActionToInputsMapping( "Up", [ "[" ], true ),
				new ActionToInputsMapping( "Down", [ "]" ], true ),
				new ActionToInputsMapping( "Sort", [ "\\" ], true ),
				new ActionToInputsMapping( "Split", [ "/" ], true ),
				new ActionToInputsMapping( "Join", [ "=" ], true ),
				new ActionToInputsMapping( "Drop", [ "d" ], true ),
				new ActionToInputsMapping( "Use", [ "e" ], true ),

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

		if (includeTitleAndDoneButton)
		{
			childControls.splice
			(
				0, // indexToInsertAt
				0,
				new ControlLabel
				(
					"labelItems",
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Items",
					fontHeightLarge
				)
			);
			childControls.push
			(
				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(170, 115), // pos
					buttonSize.clone(),
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back // click
				)
			);
			var titleHeight = Coords.fromXY(0, 15);
			sizeBase.add(titleHeight);
			returnValue.size.add(titleHeight);
			returnValue.shiftChildPositions(titleHeight);
		}

		var scaleMultiplier = size.clone().divide(sizeBase);
		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	// cloneable

	clone()
	{
		return new ItemHolder
		(
			ArrayHelper.clone(this.itemEntities),
			this.massMax,
			this.reachRadius
		);
	}
}

}
