
namespace ThisCouldBeBetter.GameFramework
{

export class ItemHolder implements EntityProperty<ItemHolder>
{
	items: Item[];
	massMax: number;
	reachRadius: number;

	itemSelected: Item;
	statusMessage: string;

	constructor
	(
		items: Item[], massMax: number, reachRadius: number
	)
	{
		this.items = [];
		this.massMax = massMax;
		this.reachRadius = reachRadius || 20;

		this.itemsAdd(items || []);
	}

	static create(): ItemHolder
	{
		return new ItemHolder([], null, null);
	}

	static fromItems(items: Item[]): ItemHolder
	{
		return new ItemHolder(items, null, null);
	}

	static fromMassMax(massMax: number): ItemHolder
	{
		return new ItemHolder(null, massMax, null);
	}

	// Instance methods.

	clear(): ItemHolder
	{
		this.items.length = 0;
		this.itemSelected = null;
		this.statusMessage = "";

		return this;
	}

	equipItemInNumberedSlot
	(
		universe: Universe, entityItemHolder: Entity, slotNumber: number
	): void
	{
		var itemToEquip = this.itemSelected;
		if (itemToEquip != null)
		{
			var world = universe.world;
			var place = world.placeCurrent;
			var equipmentUser = entityItemHolder.equipmentUser();
			var socketName = "Item" + slotNumber;
			var includeSocketNameInMessage = true;
			var itemEntityToEquip = itemToEquip.toEntity
			(
				new UniverseWorldPlaceEntities
				(
					universe, world, place, entityItemHolder, null
				)
			);
			var uwpe = new UniverseWorldPlaceEntities
			(
				universe, world, place, entityItemHolder, itemEntityToEquip
			);
			equipmentUser.equipItemEntityInSocketWithName
			(
				uwpe, socketName, includeSocketNameInMessage
			);
		}
	}

	hasItem(itemToCheck: Item): boolean
	{
		return this.hasItemWithDefnNameAndQuantity
		(
			itemToCheck.defnName, itemToCheck.quantity
		);
	}

	hasItems(itemsToCheck: Item[]): boolean
	{
		var isMissingAtLeastOneItem =
			itemsToCheck.some(x => this.hasItem(x) == false);

		var hasAllItems = (isMissingAtLeastOneItem == false);

		return hasAllItems;
	}

	hasItemWithCategoryName(categoryName: string, world: World): boolean
	{
		var returnValue =
			this.items.some(x => x.defn(world).categoryNames.indexOf(categoryName) >= 0)

		return returnValue;
	}

	hasItemWithDefnName(defnName: string): boolean
	{
		return this.hasItemWithDefnNameAndQuantity(defnName, 1);
	}

	hasItemWithDefnNameAndQuantity
	(
		defnName: string, quantityToCheck: number
	): boolean
	{
		var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
		var returnValue = (itemExistingQuantity >= quantityToCheck);
		return returnValue;
	}

	itemAdd(itemToAdd: Item): void
	{
		var itemDefnName = itemToAdd.defnName;
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting == null)
		{
			this.items.push(itemToAdd);
		}
		else
		{
			itemExisting.quantity += itemToAdd.quantity;
		}
	}

	itemCanPickUp
	(
		universe: Universe, world: World, place: Place, itemToPickUp: Item
	): boolean
	{
		var massAlreadyHeld = this.massOfAllItems(world);
		var massOfItem = itemToPickUp.mass(world);
		var massAfterPickup = massAlreadyHeld + massOfItem;
		var canPickUp = (massAfterPickup <= this.massMax);
		return canPickUp;
	}

	itemDrop(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var place = uwpe.place;
		var entityItemHolder = uwpe.entity;
		var itemEntityToKeep = uwpe.entity2;

		if (itemEntityToKeep != null)
		{
			var itemToKeep = itemEntityToKeep.item();

			var itemToDrop = itemToKeep.clone();
			itemToDrop.quantity = 1;
			var itemToDropDefn = itemToDrop.defn(world);

			var itemEntityToDrop = itemToDrop.toEntity(uwpe);
			var itemLocatable = itemEntityToDrop.locatable();
			if (itemLocatable == null)
			{
				itemLocatable = Locatable.create();
				itemEntityToDrop.propertyAdd(itemLocatable);
				itemEntityToDrop.propertyAdd
				(
					Drawable.fromVisual(itemToDropDefn.visual)
				);
				// todo - Other properties: Collidable, etc.
			}

			var posToDropAt = itemLocatable.loc.pos;
			var holderPos = entityItemHolder.locatable().loc.pos;
			posToDropAt.overwriteWith(holderPos);

			var collidable = itemEntityToDrop.collidable();
			if (collidable != null)
			{
				collidable.ticksUntilCanCollide =
					collidable.ticksToWaitBetweenCollisions;
			}

			place.entitySpawn
			(
				uwpe.clone().entitiesSwap()
			);
			this.itemSubtract(itemToDrop);
			if (itemToKeep.quantity == 0)
			{
				this.itemSelected = null;
			}

			this.statusMessage = itemToDropDefn.appearance + " dropped."

			var equipmentUser = entityItemHolder.equipmentUser();
			if (equipmentUser != null)
			{
				equipmentUser.unequipItemsNoLongerHeld
				(
					uwpe
				);
			}
		}
	}

	itemEntities(uwpe: UniverseWorldPlaceEntities): Entity[]
	{
		return this.items.map(x => x.toEntity(uwpe));
	}

	itemEntityFindClosest(uwpe: UniverseWorldPlaceEntities): Entity
	{
		var place = uwpe.place;
		var entityItemHolder = uwpe.entity;

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

	itemEntityPickUp
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var place = uwpe.place;
		var itemEntityToPickUp = uwpe.entity2;
		var itemToPickUp = itemEntityToPickUp.item();
		this.itemAdd(itemToPickUp);
		place.entityToRemoveAdd(itemEntityToPickUp);
	}

	itemQuantityByDefnName(defnName: string): number
	{
		return this.itemsByDefnName(defnName).map
		(
			y => y.quantity
		).reduce
		(
			(a,b) => a + b, 0
		);
	}

	itemRemove(itemToRemove: Item): void
	{
		var doesExist = this.items.indexOf(itemToRemove) >= 0;
		if (doesExist)
		{
			ArrayHelper.remove(this.items, itemToRemove);
		}
	}

	itemSplit(itemToSplit: Item, quantityToSplit: number): Item
	{
		var itemSplitted = null;

		if (itemToSplit.quantity <= 1)
		{
			itemSplitted = itemToSplit;
		}
		else
		{
			quantityToSplit =
				quantityToSplit || Math.floor(itemToSplit.quantity / 2);
			if (quantityToSplit >= itemToSplit.quantity)
			{
				itemSplitted = itemToSplit;
			}
			else
			{
				itemToSplit.quantity -= quantityToSplit;

				itemSplitted = itemToSplit.clone();
				itemSplitted.quantity = quantityToSplit;
				// Add with no join.
				ArrayHelper.insertElementAfterOther
				(
					this.items, itemSplitted, itemToSplit
				);
			}
		}

		return itemSplitted;
	}

	itemTransferTo(item: Item, other: ItemHolder): void
	{
		other.itemAdd(item);
		ArrayHelper.remove(this.items, item);
		if (this.itemSelected == item)
		{
			this.itemSelected = null;
		}
	}

	itemTransferSingleTo(item: Item, other: ItemHolder): void
	{
		var itemSingle = this.itemSplit(item, 1);
		this.itemTransferTo(itemSingle, other);
	}

	itemSubtract(itemToSubtract: Item): void
	{
		this.itemSubtractDefnNameAndQuantity
		(
			itemToSubtract.defnName, itemToSubtract.quantity
		);
	}

	itemSubtractDefnNameAndQuantity
	(
		itemDefnName: string, quantityToSubtract: number
	): void
	{
		this.itemsWithDefnNameJoin(itemDefnName);
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting != null)
		{
			itemExisting.quantity -= quantityToSubtract;
			if (itemExisting.quantity <= 0)
			{
				var itemExisting = this.itemsByDefnName(itemDefnName)[0];
				ArrayHelper.remove(this.items, itemExisting);
			}
		}
	}

	itemsAdd(itemsToAdd: Item[]): void
	{
		itemsToAdd.forEach( (x: Item) => this.itemAdd(x));
	}

	itemsAllTransferTo(other: ItemHolder): void
	{
		this.itemsTransferTo(this.items, other);
	}

	itemsByDefnName(defnName: string): Item[]
	{
		return this.items.filter
		(
			x => x.defnName == defnName
		);
	}

	itemsTransferTo(itemsToTransfer: Item[], other: ItemHolder): void
	{
		if (itemsToTransfer == this.items)
		{
			// Create a new array to avoid modifying the one being looped through.
			itemsToTransfer = new Array<Item>();
			itemsToTransfer.push(...this.items);
		}

		for (var i = 0; i < itemsToTransfer.length; i++)
		{
			var item = itemsToTransfer[i];
			this.itemTransferTo(item, other);
		}
	}

	itemsWithDefnNameJoin(defnName: string): Item
	{
		var itemsMatching = this.items.filter
		(
			x => x.defnName == defnName
		);
		var itemJoined = itemsMatching[0];
		if (itemJoined != null)
		{
			for (var i = 1; i < itemsMatching.length; i++)
			{
				var itemToJoin = itemsMatching[i];
				itemJoined.quantity += itemToJoin.quantity;
				ArrayHelper.remove(this.items, itemToJoin);
			}
		}

		return itemJoined;
	}

	itemsRemove(itemsToRemove: Item[]): void
	{
		itemsToRemove.forEach(x => this.itemRemove(x));
	}

	/*
	itemTransferTo2(itemToTransfer: Item, other: ItemHolder): void
	{
		var itemDefnName = itemToTransfer.defnName;
		this.itemsWithDefnNameJoin(itemDefnName);
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting != null)
		{
			var itemToTransfer =
				this.itemSplit(itemExisting, itemToTransfer.quantity);
			other.itemAdd(itemToTransfer.clone());
			this.itemSubtract(itemToTransfer);
		}
	}
	*/

	itemsByDefnName2(defnName: string): Item[]
	{
		return this.itemsByDefnName(defnName);
	}

	massOfAllItems(world: World): number
	{
		var massTotal = this.items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.mass(world),
			0 // sumSoFar
		);

		return massTotal;
	}

	massOfAllItemsOverMax(world: World): string
	{
		var returnValue = "" + Math.ceil(this.massOfAllItems(world));
		if (this.massMax != null)
		{
			returnValue += "/" + this.massMax;
		}
		return returnValue;
	}

	tradeValueOfAllItems(world: World): number
	{
		var tradeValueTotal = this.items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.tradeValue(world),
			0 // sumSoFar
		);

		return tradeValueTotal;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ItemHolder): boolean { return false; } // todo

	// Controllable.

	toControl
	(
		universe: Universe, size: Coords, entityItemHolder: Entity,
		venuePrev: Venue, includeTitleAndDoneButton: boolean
	): ControlBase
	{
		this.statusMessage = "Use, drop, and sort items.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, universe.world.placeCurrent,
			entityItemHolder, null
		);

		var sizeBase = new Coords(200, 135, 1);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;
		var fontSmall = FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
		var fontLarge = FontNameAndHeight.fromHeightInPixels(fontHeightLarge);

		var itemHolder = this;
		var world = universe.world;

		var back = () => universe.venueTransitionTo(venuePrev);

		var drop = () =>
		{
			if (itemHolder.itemSelected != null)
			{
				itemHolder.itemDrop
				(
					uwpe.entity2Set(itemHolder.itemSelected.toEntity(uwpe))
				);
			}
			
		};

		var use = () =>
		{
			var itemEntityToUse = itemHolder.itemSelected.toEntity
			(
				uwpe
			);
			if (itemEntityToUse != null)
			{
				var itemToUse = itemEntityToUse.item();
				if (itemToUse.use != null)
				{
					itemToUse.use(uwpe);
					if (itemToUse.quantity <= 0)
					{
						itemHolder.itemSelected = null;
					}
				}
			}
		};

		var up = () =>
		{
			var itemToMove = itemHolder.itemSelected;
			var itemsAll = itemHolder.items;
			var index = itemsAll.indexOf(itemToMove);
			if (index > 0)
			{
				itemsAll.splice(index, 1);
				itemsAll.splice(index - 1, 0, itemToMove);
			}
		};

		var down = () =>
		{
			var itemToMove = itemHolder.itemSelected;
			var itemsAll = itemHolder.items;
			var index = itemsAll.indexOf(itemToMove);
			if (index < itemsAll.length - 1)
			{
				itemsAll.splice(index, 1);
				itemsAll.splice(index + 1, 0, itemToMove);
			}
		};

		var split = () =>
		{
			itemHolder.itemSplit(itemHolder.itemSelected, null);
		};

		var join = () =>
		{
			var itemToJoin = itemHolder.itemSelected;
			var itemJoined =
				itemHolder.itemsWithDefnNameJoin(itemToJoin.defnName);
			itemHolder.itemSelected = itemJoined;
		};

		var sort = () =>
		{
			itemHolder.items.sort
			(
				(x, y) => (x.defnName > y.defnName ? 1 : -1)
			);
		};

		var buttonSize = Coords.fromXY(20, 10);
		var visualNone = new VisualNone();

		/*
		// todo
		var controlVisualBackground = ControlVisual.from4
		(
			"imageBackground",
			Coords.zeroes(),
			sizeBase.clone(), // size
			DataBinding.fromContext<Visual>
			(
				new VisualGroup
				([
					new VisualImageScaled
					(
						new VisualImageFromLibrary("Titles_Title"), size
					)
				])
			)
		);
		*/

		var childControls =
		[
			//controlVisualBackground,

			new ControlLabel
			(
				"labelItemsHeld",
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Items Held:"),
				fontSmall
			),

			ControlList.from10
			(
				"listItems",
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(70, 100), // size
				DataBinding.fromContextAndGet
				(
					this, (c: ItemHolder) => c.items
				), // items
				DataBinding.fromGet
				(
					(c: Item) => c.toString(world)
				), // bindingForItemText
				fontSmall,
				new DataBinding
				(
					this,
					(c: ItemHolder) => c.itemSelected,
					(c: ItemHolder, v: Item) => c.itemSelected = v
				), // bindingForItemSelected
				DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
				DataBinding.fromTrue(), // isEnabled
				use
			),

			new ControlLabel
			(
				"infoWeight",
				Coords.fromXY(10, 115), // pos
				Coords.fromXY(100, 25), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => "Weight: " + c.massOfAllItemsOverMax(world)
				),
				fontSmall
			),

			ControlButton.from8
			(
				"buttonUp",
				Coords.fromXY(85, 15), // pos
				Coords.fromXY(15, 10), // size
				"Up",
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var returnValue =
						(
							c.itemSelected != null
							&& c.items.indexOf(c.itemSelected) > 0
						);
						return returnValue;
					}
				), // isEnabled
				up // click
			),

			ControlButton.from8
			(
				"buttonDown",
				Coords.fromXY(85, 30), // pos
				Coords.fromXY(15, 10), // size
				"Down",
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var returnValue =
						(
							c.itemSelected != null
							&& c.items.indexOf(c.itemSelected) < c.items.length - 1
						);
						return returnValue;
					}
				), // isEnabled
				down
			),

			ControlButton.from8
			(
				"buttonSplit",
				Coords.fromXY(85, 45), // pos
				Coords.fromXY(15, 10), // size
				"Split",
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var item = c.itemSelected;
						var returnValue =
						(
							item != null
							&& (item.quantity > 1)
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
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
						c.itemSelected != null
						&&
						(
							c.items.filter
							(
								(x: Item) => x.defnName == c.itemSelected.defnName
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
				fontSmall,
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
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Item Selected:"),
				fontSmall
			),

			new ControlLabel
			(
				"infoItemSelected",
				Coords.fromXY(150, 20), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var i = c.itemSelected;
						return (i == null ? "-" : i.toString(world));
					}
				), // text
				fontSmall
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
						var i = c.itemSelected;
						return (i == null ? visualNone : i.defn(world).visual);
					}
				),
				Color.byName("Black") // colorBackground
			),

			new ControlLabel
			(
				"infoStatus",
				Coords.fromXY(150, 115), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => c.statusMessage
				), // text
				fontSmall
			),

			ControlButton.from8
			(
				"buttonUse",
				Coords.fromXY(132.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Use",
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) =>
					{
						var item = c.itemSelected;
						return (item != null && item.isUsable(world));
					}
				), // isEnabled
				use // click
			),

			ControlButton.from8
			(
				"buttonDrop",
				Coords.fromXY(152.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Drop",
				fontSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => (c.itemSelected != null)
				), // isEnabled
				drop // click
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

				new Action("Item0", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, null) ),
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
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Items"),
					fontLarge
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
					fontSmall,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
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

	clone(): ItemHolder
	{
		return new ItemHolder
		(
			ArrayHelper.clone(this.items),
			this.massMax,
			this.reachRadius
		);
	}
}

}
