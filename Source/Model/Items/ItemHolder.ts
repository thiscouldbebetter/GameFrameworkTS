
namespace ThisCouldBeBetter.GameFramework
{

export class ItemHolder implements EntityProperty<ItemHolder>
{
	items: Item[];
	encumbranceMax: number;
	reachRadius: number;
	retainsItemsWithZeroQuantities: boolean

	itemSelected: Item;
	statusMessage: string;

	constructor
	(
		items: Item[],
		encumbranceMax: number,
		reachRadius: number,
		retainsItemsWithZeroQuantities: boolean
	)
	{
		this.items = items || [];
		this.encumbranceMax = encumbranceMax;
		this.reachRadius = reachRadius || 20;
		this.retainsItemsWithZeroQuantities = retainsItemsWithZeroQuantities || false;

		this.itemsAdd(items || []);
	}

	static create(): ItemHolder
	{
		return new ItemHolder(null, null, null, null);
	}

	static default(): ItemHolder
	{
		return ItemHolder.create();
	}

	static fromItems(items: Item[]): ItemHolder
	{
		return new ItemHolder(items, null, null, null);
	}

	static fromEncumbranceMax(encumbranceMax: number): ItemHolder
	{
		return new ItemHolder(null, encumbranceMax, null, null);
	}

	static of(entity: Entity): ItemHolder
	{
		return entity.propertyByName(ItemHolder.name) as ItemHolder;
	}

	// Instance methods.

	clear(): ItemHolder
	{
		if (this.retainsItemsWithZeroQuantities)
		{
			this.items.forEach(x => x.quantityClear() );
		}
		else
		{
			this.items.length = 0;
		}
		this.itemSelected = null;
		this.statusMessageSet("");

		return this;
	}

	encumbranceMaxSet(value: number): ItemHolder
	{
		this.encumbranceMax = value;
		return this;
	}

	encumbranceOfAllItems(world: World): number
	{
		var encumbranceTotal = this.items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.encumbrance(world),
			0 // sumSoFar
		);

		return encumbranceTotal;
	}

	encumbranceOfAllItemsOverMax(world: World): string
	{
		var returnValue = "" + Math.ceil(this.encumbranceOfAllItems(world));
		if (this.encumbranceMax != null)
		{
			returnValue += "/" + this.encumbranceMax;
		}
		return returnValue;
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
			var equipmentUser = EquipmentUser.of(entityItemHolder);
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
			itemExisting.quantityAdd(itemToAdd.quantity);
		}
	}

	itemByDefnName(defnName: string): Item
	{
		return this.itemsByDefnName(defnName)[0];
	}

	itemCanPickUp
	(
		universe: Universe, world: World, place: Place, itemToPickUp: Item
	): boolean
	{
		var encumbranceAlreadyHeld = this.encumbranceOfAllItems(world);
		var encumbranceOfItem = itemToPickUp.encumbrance(world);
		var encumbranceAfterPickup = encumbranceAlreadyHeld + encumbranceOfItem;
		var canPickUp = (encumbranceAfterPickup <= this.encumbranceMax);
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
			var itemToKeep = Item.of(itemEntityToKeep);

			var itemToDrop = itemToKeep.clone();
			itemToDrop.quantitySet(1);
			var itemToDropDefn = itemToDrop.defn(world);

			var itemEntityToDrop = itemToDrop.toEntity(uwpe);
			var itemLocatable = Locatable.of(itemEntityToDrop);
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
			var holderPos = Locatable.of(entityItemHolder).loc.pos;
			posToDropAt.overwriteWith(holderPos);

			var collidable = Collidable.of(itemEntityToDrop);
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

			this.statusMessageSet(itemToDropDefn.appearance + " dropped.");

			var equipmentUser = EquipmentUser.of(entityItemHolder);
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
		var place = uwpe.place as PlaceBase;
		var entityItemHolder = uwpe.entity;

		var entityItemsInPlace = Item.entitiesFromPlace(place);
		var entityItemClosest = entityItemsInPlace.filter
		(
			(x: Entity) =>
				Locatable.of(x).distanceFromEntity(entityItemHolder) < this.reachRadius
		).sort
		(
			(a: Entity, b: Entity) =>
				Locatable.of(a).distanceFromEntity(entityItemHolder)
				- Locatable.of(b).distanceFromEntity(entityItemHolder)
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
		this.itemEntityPickUpFromPlace(itemEntityToPickUp, place);
	}

	itemEntityPickUpFromPlace
	(
		itemEntityToPickUp: Entity,
		place: Place
	): void
	{
		var itemToPickUp = Item.of(itemEntityToPickUp);
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
				itemToSplit.quantitySubtract(quantityToSplit);

				itemSplitted = itemToSplit.clone();
				itemSplitted.quantitySet(quantityToSplit);
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
		var itemExisting = this.itemByDefnName(itemDefnName);
		if (itemExisting == null)
		{
			throw new Error("Cannot subtract from nonexistent item '" + itemDefnName + "'.");
		}
		else
		{
			itemExisting.quantitySubtract(quantityToSubtract);

			if (itemExisting.quantity <= 0)
			{
				var itemExisting = this.itemsByDefnName(itemDefnName)[0];
				if (this.retainsItemsWithZeroQuantities)
				{
					itemExisting.quantityClear();
				}
				else
				{
					ArrayHelper.remove(this.items, itemExisting);
					if (this.itemSelected == itemExisting)
					{
						this.itemSelected = null;
					}
				}

			}
		}
	}

	itemsAdd(itemsToAdd: Item[]): ItemHolder
	{
		itemsToAdd.forEach( (x: Item) => this.itemAdd(x));
		return this;
	}

	itemsAllTransferTo(other: ItemHolder): void
	{
		this.itemsTransferTo(this.items, other);
	}

	itemsBelongingToCategory(category: ItemCategory, world: World): Item[]
	{
		return this.itemsBelongingToCategoryWithName(category.name, world);
	}

	itemsBelongingToCategoryWithName(categoryName: string, world: World): Item[]
	{
		return this.items.filter(x => x.belongsToCategoryWithName(categoryName, world) );
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
				itemJoined.quantityAdd(itemToJoin.quantity);
				ArrayHelper.remove(this.items, itemToJoin);
			}
		}

		return itemJoined;
	}

	itemsRemove(itemsToRemove: Item[]): void
	{
		itemsToRemove.forEach(x => this.itemRemove(x));
	}

	itemsByDefnName2(defnName: string): Item[]
	{
		return this.itemsByDefnName(defnName);
	}

	retainsItemsWithZeroQuantitiesSet(value: boolean): ItemHolder
	{
		this.retainsItemsWithZeroQuantities = value;
		return this;
	}

	statusMessageSet(value: string): ItemHolder
	{
		this.statusMessage = value;
		return this;
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

	propertyName(): string { return ItemHolder.name; }

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
		this.statusMessageSet("Use, drop, and sort items.");

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

		var buttonSize = Coords.fromXY(20, 10);
		var visualNone = new VisualNone();

		var childControls =
		[
			//controlVisualBackground,

			ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
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
				() => this.use(uwpe)
			),

			ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(10, 115), // pos
				Coords.fromXY(100, 25), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => "Weight: " + c.encumbranceOfAllItemsOverMax(world)
				),
				fontSmall
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(85, 15), // pos
				Coords.fromXY(15, 10), // size
				"Up",
				fontSmall,
				() => this.up() // click
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
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
				)
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(85, 30), // pos
				Coords.fromXY(15, 10), // size
				"Down",
				fontSmall,
				() => this.down()
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
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
				)
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(85, 45), // pos
				Coords.fromXY(15, 10), // size
				"Split",
				fontSmall,
				() => this.split()
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
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
				)
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(85, 60), // pos
				Coords.fromXY(15, 10), // size
				"Join",
				fontSmall,
				() => this.join()
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
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
				) // isEnabled
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(85, 75), // pos
				Coords.fromXY(15, 10), // size
				"Sort",
				fontSmall,
				() => this.sort()
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
				(
					this,
					(c: ItemHolder) => (c.itemEntities.length > 1)
				)
			),

			ControlLabel.fromPosTextFontCenteredHorizontally
			(
				Coords.fromXY(150, 10), // pos
				DataBinding.fromContext("Item Selected:"),
				fontSmall
			),

			ControlLabel.fromPosTextFontCenteredHorizontally
			(
				Coords.fromXY(150, 15), // pos
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

			ControlVisual.fromNamePosSizeVisualColorBackground
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
				Color.Instances().Black // colorBackground
			),

			ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(150, 115), // pos
				null, // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: ItemHolder) => c.statusMessage
				), // text
				fontSmall
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(132.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Use",
				fontSmall,
				() => this.use(uwpe) // click
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
				(
					this,
					(c: ItemHolder) =>
					{
						var item = c.itemSelected;
						return (item != null && item.isUsable(world));
					}
				)
			),

			ControlButton.fromPosSizeTextFontClick<ItemHolder>
			(
				Coords.fromXY(152.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Drop",
				fontSmall,
				() => this.drop(uwpe) // click
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<ItemHolder, boolean>
				(
					this,
					(c: ItemHolder) => (c.itemSelected != null)
				)
			)
		];

		var a = (a: string, b: any) => new Action(a, b);
		var atim = (a: string, b: string) =>
			new ActionToInputsMapping(a, [b], true);

		var itemNPerform = (quickSlotNumber: number) =>
			itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, quickSlotNumber);

		var actions = 
		[
			a("Back", () => this.back(universe, venuePrev) ),

			a("Up", () => this.up() ),
			a("Down", () => this.down() ),
			a("Split", () => this.split() ),
			a("Join", () => this.join() ),
			a("Sort", () => this.sort() ),
			a("Drop", () => this.drop(uwpe) ),
			a("Use", () => this.use(uwpe) ),

			a("Item0", () => itemNPerform(null) ),
			a("Item1", () => itemNPerform(1) ),
			a("Item2", () => itemNPerform(2) ),
			a("Item3", () => itemNPerform(3) ),
			a("Item4", () => itemNPerform(4) ),
			a("Item5", () => itemNPerform(5) ),
			a("Item6", () => itemNPerform(6) ),
			a("Item7", () => itemNPerform(7) ),
			a("Item8", () => itemNPerform(8) ),
			a("Item9", () => itemNPerform(9) ),
		];

		var inputs = Input.Instances();

		var mappings =
		[
			atim("Back", inputs.Escape.name),

			atim("Up",		"["),
			atim("Down",	"]"),
			atim("Sort",	"\\"),
			atim("Split",	"/"),
			atim("Join",	"="),
			atim("Drop",	inputs.d.name),
			atim("Use",		inputs.e.name),

			atim("Item0", inputs._0.name),
			atim("Item1", inputs._1.name),
			atim("Item2", inputs._2.name),
			atim("Item3", inputs._3.name),
			atim("Item4", inputs._4.name),
			atim("Item5", inputs._5.name),
			atim("Item6", inputs._6.name),
			atim("Item7", inputs._7.name),
			atim("Item8", inputs._8.name),
			atim("Item9", inputs._9.name),
		]

		var returnValue = new ControlContainer
		(
			"Items",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			actions,
			mappings
		);

		if (includeTitleAndDoneButton)
		{
			childControls.splice
			(
				0, // indexToInsertAt
				0,
				ControlLabel.fromPosSizeTextFontCenteredHorizontally
				(
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					DataBinding.fromContext("Items"),
					fontLarge
				)
			);
			childControls.push
			(
				ControlButton.fromPosSizeTextFontClick
				(
					Coords.fromXY(170, 115), // pos
					buttonSize.clone(),
					"Done",
					fontSmall,
					() => this.back(universe, venuePrev) // click
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

	// Control actions.

	back(universe: Universe, venuePrev: Venue): void
	{
		universe.venueTransitionTo(venuePrev)
	}

	drop(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.itemSelected != null)
		{
			var itemSelectedEntity =
				this.itemSelected.toEntity(uwpe);
			this.itemDrop
			(
				uwpe.entity2Set(itemSelectedEntity)
			);
		}
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var itemEntityToUse = this.itemSelected.toEntity
		(
			uwpe
		);

		if (itemEntityToUse != null)
		{
			var itemToUse = Item.of(itemEntityToUse);
			if (itemToUse.use != null)
			{
				itemToUse.use(uwpe);
				if (itemToUse.quantity <= 0)
				{
					this.itemSelected = null;
				}
			}
		}
	};

	up(): void
	{
		var itemToMove = this.itemSelected;
		var itemsAll = this.items;
		var index = itemsAll.indexOf(itemToMove);
		if (index > 0)
		{
			itemsAll.splice(index, 1);
			itemsAll.splice(index - 1, 0, itemToMove);
		}
	}

	down(): void
	{
		var itemToMove = this.itemSelected;
		var itemsAll = this.items;
		var index = itemsAll.indexOf(itemToMove);
		if (index < itemsAll.length - 1)
		{
			itemsAll.splice(index, 1);
			itemsAll.splice(index + 1, 0, itemToMove);
		}
	}

	split(): void
	{
		this.itemSplit(this.itemSelected, null);
	}

	join(): void
	{
		var itemToJoin = this.itemSelected;
		var itemJoined =
			this.itemsWithDefnNameJoin(itemToJoin.defnName);
		this.itemSelected = itemJoined;
	}

	sort(): void
	{
		this.items.sort
		(
			(x, y) => (x.defnName > y.defnName ? 1 : -1)
		);
	}

	// Clonable.

	clone(): ItemHolder
	{
		return new ItemHolder
		(
			ArrayHelper.clone(this.items),
			this.encumbranceMax,
			this.reachRadius,
			this.retainsItemsWithZeroQuantities
		);
	}

	overwriteWith(other: ItemHolder): ItemHolder { return this; } // todo

}

}
