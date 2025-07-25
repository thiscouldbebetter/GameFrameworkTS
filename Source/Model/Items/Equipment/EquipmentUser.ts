
namespace ThisCouldBeBetter.GameFramework
{

export class EquipmentUser implements EntityProperty<EquipmentUser>
{
	socketGroup: EquipmentSocketGroup;
	socketDefnGroup: EquipmentSocketDefnGroup;

	itemEntitySelected: Entity;
	socketSelected: EquipmentSocket;
	statusMessage: string;

	constructor(socketDefnGroup: EquipmentSocketDefnGroup)
	{
		this.socketGroup = new EquipmentSocketGroup(socketDefnGroup);
	}

	static default(): EquipmentUser
	{
		var socketDefnGroup = EquipmentSocketDefnGroup.default();
		return new EquipmentUser(socketDefnGroup);
	}

	static fromSocketDefnGroup
	(
		socketDefnGroup: EquipmentSocketDefnGroup
	): EquipmentUser
	{
		return new EquipmentUser(socketDefnGroup);
	}

	static of(entity: Entity): EquipmentUser
	{
		return entity.propertyByName(EquipmentUser.name) as EquipmentUser;
	}

	equipAll(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var entityEquipmentUser = uwpe.entity;

		var itemHolder = ItemHolder.of(entityEquipmentUser);
		var itemsNotYetEquipped = itemHolder.items;
		var sockets = this.socketGroup.sockets;
		for (var s = 0; s < sockets.length; s++)
		{
			var socket = sockets[s];
			if (socket.itemEntityEquipped == null)
			{
				var socketDefn = socket.defn(this.socketGroup.defnGroup);
				var categoriesEquippableNames = socketDefn.categoriesAllowedNames;
				var itemsEquippable = itemsNotYetEquipped.filter
				(
					(x: Item) =>
						ArrayHelper.intersectArrays
						(
							x.defn(world).categoryNames, categoriesEquippableNames
						).length > 0
				);

				if (itemsEquippable.length > 0)
				{
					var itemToEquip = itemsEquippable[0];
					var itemToEquipAsEntity = itemToEquip.toEntity
					(
						uwpe
					);
					uwpe.entity2Set(itemToEquipAsEntity);
					this.equipItemEntityInSocketWithName
					(
						uwpe, socket.defnName, true // ?
					);
				}
			}
		}
	}

	equipEntityWithItem(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var itemEntityToEquip = uwpe.entity2;

		if (itemEntityToEquip == null)
		{
			return null;
		}
		var sockets = this.socketGroup.sockets;
		var socketDefnGroup = this.socketGroup.defnGroup;
		var itemToEquip = Item.of(itemEntityToEquip);
		var itemDefn = itemToEquip.defn(world);

		var socketFound = sockets.filter
		(
			(socket: EquipmentSocket) =>
			{
				var socketDefn = socket.defn(socketDefnGroup);
				var isItemAllowedInSocket = socketDefn.categoriesAllowedNames.some
				(
					(y: string) => itemDefn.categoryNames.indexOf(y) >= 0
				);
				return isItemAllowedInSocket;
			}
		)[0];

		if (socketFound == null)
		{
			this.statusMessage = "Can't equip " + itemDefn.name + ".";
		}
		else
		{
			var socketFoundName = socketFound.defnName;

			this.equipItemEntityInSocketWithName
			(
				uwpe, socketFoundName, false
			);
		}
	}

	equipItemEntityInFirstOpenQuickSlot
	(
		uwpe: UniverseWorldPlaceEntities, includeSocketNameInMessage: boolean
	): void
	{
		var itemEntityToEquip = uwpe.entity2;
		var itemToEquipDefnName = Item.of(itemEntityToEquip).defnName;
		var socketFound = null;

		var itemQuickSlotCount = 10;
		for (var i = 0; i < itemQuickSlotCount; i++)
		{
			var socketName = "Item" + i;
			var socket = this.socketByName(socketName);
			if (socketFound == null && socket.itemEntityEquipped == null)
			{
				socketFound = socket;
			}
			else if (socket.itemEntityEquipped != null)
			{
				var itemInSocketDefnName =
					Item.of(socket.itemEntityEquipped).defnName;
				if (itemInSocketDefnName == itemToEquipDefnName)
				{
					socketFound = socket;
					break;
				}
			}
		}
		if (socketFound != null)
		{
			this.equipItemEntityInSocketWithName
			(
				uwpe, socketFound.defnName, includeSocketNameInMessage
			);
		}
	}

	equipItemEntityInSocketWithName
	(
		uwpe: UniverseWorldPlaceEntities,
		socketName: string,
		includeSocketNameInMessage: boolean
	): void
	{
		var world = uwpe.world;
		var itemEntityToEquip = uwpe.entity2;
		var message;

		if (itemEntityToEquip == null)
		{
			message = "Nothing to equip!";
		}
		else
		{
			var itemToEquip = Item.of(itemEntityToEquip);
			var itemDefn = itemToEquip.defn(world);
			var equippable = Equippable.of(itemEntityToEquip);

			message = itemDefn.appearance;

			var socket = this.socketByName(socketName);

			if (socket == null)
			{
				message += " cannot be equipped."
			}
			else if (socket.itemEntityEquipped == itemEntityToEquip)
			{
				if (equippable != null)
				{
					equippable.unequip(uwpe);
				}
				socket.itemEntityEquipped = null;
				message += " unequipped."
			}
			else
			{
				if (equippable != null)
				{
					equippable.equip(uwpe);
				}
				socket.itemEntityEquipped = itemEntityToEquip;
				message += " equipped";
				if (includeSocketNameInMessage)
				{
					message += " as " + socket.defnName
				}
				message += ".";
			}
		}

		this.statusMessage = message;
	}

	entityIsInSocketWithName(name: string): boolean
	{
		var entityEquipped =
			this.itemEntityInSocketWithName(name);
		var entityIsEquipped = (entityEquipped != null);
		return entityIsEquipped;
	}

	entityIsInSocketWithNameWielding(): boolean
	{
		return this.entityIsInSocketWithName("Wielding");
	}

	itemEntityInSocketWithName(socketName: string): Entity
	{
		var socket = this.socketByName(socketName);
		var itemEntity =
			socket == null
			? null
			: socket.itemEntityEquipped;
		return itemEntity;
	}

	socketByName(socketName: string): EquipmentSocket
	{
		return this.socketGroup.socketsByDefnName.get(socketName);
	}

	unequipItemFromSocketWithName(world: World, socketName: string): void
	{
		var message;
		var socketToUnequipFrom = this.socketGroup.socketsByDefnName.get(socketName);
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
				var itemToUnequip = Item.of(itemEntityToUnequip);
				var itemDefn = itemToUnequip.defn(world);
				message = itemDefn.appearance + " unequipped."
			}
		}

		this.statusMessage = message;
	}

	unequipItemsNoLongerHeld(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityEquipmentUser = uwpe.entity;
		var itemHolder = ItemHolder.of(entityEquipmentUser);
		var itemsHeld = itemHolder.items;
		var sockets = this.socketGroup.sockets;
		for (var i = 0; i < sockets.length; i++)
		{
			var socket = sockets[i];
			var socketItemEntity = socket.itemEntityEquipped;
			if (socketItemEntity != null)
			{
				var socketItem = Item.of(socketItemEntity);
				var socketItemDefnName = socketItem.defnName;
				if (itemsHeld.indexOf(socketItem) == -1)
				{
					var itemOfSameTypeStillHeld = itemsHeld.filter
					(
						x => x.defnName == socketItemDefnName
					)[0];
					if (itemOfSameTypeStillHeld == null)
					{
						socket.itemEntityEquipped = null;
					}
					else
					{
						socket.itemEntityEquipped = itemOfSameTypeStillHeld.toEntity
						(
							uwpe
						);
					}
				}
			}
		}
	}

	unequipItem(itemToUnequip: Item): void
	{
		var socket = this.socketGroup.sockets.filter
		(
			x => Item.of(x.itemEntityEquipped) == itemToUnequip
		)[0];
		if (socket != null)
		{
			socket.itemEntityEquipped = null;
		}
	}

	useItemInSocketNumbered
	(
		uwpe: UniverseWorldPlaceEntities, socketNumber: number
	): void
	{
		var actor = uwpe.entity;
		var equipmentUser = EquipmentUser.of(actor);
		var socketName = "Item" + socketNumber;
		var itemEntityToUse =
			equipmentUser.itemEntityInSocketWithName(socketName);
		if (itemEntityToUse != null)
		{
			var itemToUse = Item.of(itemEntityToUse);
			uwpe.entity2Set(itemEntityToUse);
			itemToUse.use(uwpe);
		}
		this.unequipItemsNoLongerHeld(uwpe);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return EquipmentUser.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// control

	toControl
	(
		universe: Universe, size: Coords, entityEquipmentUser: Entity,
		venuePrev: Venue, includeTitleAndDoneButton: boolean
	): ControlBase
	{
		this.statusMessage = "Equip items in available slots.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 135, 1);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontSmall = FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
		var fontHeightLarge = fontHeight * 1.5;
		var fontLarge = FontNameAndHeight.fromHeightInPixels(fontHeightLarge);

		var itemHolder = ItemHolder.of(entityEquipmentUser);
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
				if (itemCategoriesForAllSockets.indexOf(categoryName) == -1)
				{
					itemCategoriesForAllSockets.push(categoryName);
				}
			}
		}

		var world = universe.world;
		var place = world.placeCurrent;

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, place, entityEquipmentUser, null
		);

		var itemEntities = itemHolder.itemEntities
		(
			uwpe
		);
		var itemEntitiesEquippable = itemEntities.filter
		(
			x => Equippable.of(x) != null
		);

		var world = universe.world;
		var place = world.placeCurrent;

		var listHeight = 100;

		var equipItemSelectedToSocketDefault = () =>
			this.equipItemSelectedToSocketDefault(uwpe);

		var listEquippables = new ControlList
		(
			"listEquippables",
			Coords.fromXY(10, 15), // pos
			Coords.fromXY(70, listHeight), // size
			DataBinding.fromContextAndGet
			(
				this, (c: EquipmentUser) => itemEntitiesEquippable
			), // items
			DataBinding.fromGet
			(
				(c: Entity) => Item.of(c).toString(world),
			), // bindingForItemText
			fontSmall,
			new DataBinding
			(
				this,
				(c: EquipmentUser) => c.itemEntitySelected,
				(c: EquipmentUser, v: Entity) => c.itemEntitySelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
			null, // bindingForIsEnabled
			equipItemSelectedToSocketDefault,
			null
		);

		var fontButton = FontNameAndHeight.fromHeightInPixels(fontHeight * 0.8);

		var equipItemSelectedToSocketSelected = () =>
			this.equipItemSelectedToSocketSelected(uwpe);

		var buttonEquip = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(85, 50), // pos
			Coords.fromXY(10, 10), // size
			">", // text
			fontButton,
			equipItemSelectedToSocketSelected
		);

		var unequipFromSocketSelected = () =>
			this.unequipFromSocketSelected(uwpe);

		var buttonUnequip = ControlButton.fromPosSizeTextFontClick
		(
			Coords.fromXY(85, 65), // pos
			Coords.fromXY(10, 10), // size
			"<", // text
			fontButton,
			unequipFromSocketSelected
		);

		var listEquipped = new ControlList
		(
			"listEquipped",
			Coords.fromXY(100, 15), // pos
			Coords.fromXY(90, listHeight), // size
			DataBinding.fromContextAndGet
			(
				this,
				(c: EquipmentUser) => c.socketGroup.sockets
			), // items
			DataBinding.fromGet
			(
				(c: EquipmentSocket) => c.toString(world),
			), // bindingForItemText
			fontSmall,
			new DataBinding
			(
				this,
				(c: EquipmentUser) => c.socketSelected,
				(c: EquipmentUser, v: EquipmentSocket) => c.socketSelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: EquipmentSocket) => c ), // bindingForItemValue
			null, // bindingForIsEnabled
			unequipFromSocketSelected, // confirm
			null
		);

		var back = () => universe.venueTransitionTo(venuePrev);

		var equipItemSelectedInQuickSlot = (quickSlotNumber: number) =>
			this.equipItemSelectedInQuickSlot(uwpe, quickSlotNumber);

		var textEquipItemSelectedInQuickSlot = "EquipItemSelectedInQuickSlot";

		var containerChildControls =
		[
			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				DataBinding.fromContext("Equippable:"),
				fontSmall
			),

			listEquippables,

			buttonEquip,

			buttonUnequip,

			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(100, 5), // pos
				Coords.fromXY(100, 25), // size
				DataBinding.fromContext("Equipped:"),
				fontSmall
			),

			listEquipped,

			ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(sizeBase.x / 2, 125), // pos
				Coords.fromXY(sizeBase.x, 15), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: EquipmentUser) => c.statusMessage
				), // text
				fontSmall
			)
		];

		var a = (a: string, b: any) => new Action(a, b);

		var containerActions = 
		[
			a("Back", back),
			a(
				textEquipItemSelectedInQuickSlot + "0",
				() => equipItemSelectedInQuickSlot(0)
			),
			a(
				textEquipItemSelectedInQuickSlot + "1",
				() => equipItemSelectedInQuickSlot(1)
			),
			a(
				textEquipItemSelectedInQuickSlot + "2",
				() => equipItemSelectedInQuickSlot(2)
			),
			a(
				textEquipItemSelectedInQuickSlot + "3",
				() => equipItemSelectedInQuickSlot(3)
			),
			a(
				textEquipItemSelectedInQuickSlot + "4",
				() => equipItemSelectedInQuickSlot(4)
			),
			a(
				textEquipItemSelectedInQuickSlot + "5",
				() => equipItemSelectedInQuickSlot(5)
			),
			a(
				textEquipItemSelectedInQuickSlot + "6",
				() => equipItemSelectedInQuickSlot(6)
			),
			a(
				textEquipItemSelectedInQuickSlot + "7",
				() => equipItemSelectedInQuickSlot(7)
			),
			a(
				textEquipItemSelectedInQuickSlot + "8",
				() => equipItemSelectedInQuickSlot(8)
			),
			a(
				textEquipItemSelectedInQuickSlot + "9",
				() => equipItemSelectedInQuickSlot(9)
			)
		];

		var atim = (a: string, b: string) =>
			new ActionToInputsMapping(a, [b], true);

		var inputs = Input.Instances();

		var mappings =
		[
			atim("Back", inputs.Escape.name),
			atim(textEquipItemSelectedInQuickSlot + "0", inputs._0.name),
			atim(textEquipItemSelectedInQuickSlot + "1", inputs._1.name),
			atim(textEquipItemSelectedInQuickSlot + "2", inputs._2.name),
			atim(textEquipItemSelectedInQuickSlot + "3", inputs._3.name),
			atim(textEquipItemSelectedInQuickSlot + "4", inputs._4.name),
			atim(textEquipItemSelectedInQuickSlot + "5", inputs._5.name),
			atim(textEquipItemSelectedInQuickSlot + "6", inputs._6.name),
			atim(textEquipItemSelectedInQuickSlot + "7", inputs._7.name),
			atim(textEquipItemSelectedInQuickSlot + "8", inputs._8.name),
			atim(textEquipItemSelectedInQuickSlot + "9", inputs._9.name)
		];

		var returnValue = new ControlContainer
		(
			"Equip",
			Coords.create(), // pos
			sizeBase.clone(), // size
			containerChildControls,
			containerActions,
			mappings
		);

		if (includeTitleAndDoneButton)
		{
			var childControls = returnValue.children;

			childControls.splice
			(
				0, 0,
				ControlLabel.fromPosSizeTextFontCenteredHorizontally
				(
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					DataBinding.fromContext("Equip"),
					fontLarge
				)
			);
			childControls.push
			(
				ControlButton.fromPosSizeTextFontClick
				(
					Coords.fromXY(170, 115), // pos
					Coords.fromXY(20, 10), // size
					"Done",
					fontSmall,
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

	// Actions.

	equipItemSelectedToSocketDefault
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var itemEntityToEquip = this.itemEntitySelected;
		uwpe.entity2Set(itemEntityToEquip);
		this.equipEntityWithItem(uwpe);
	};

	equipItemSelectedToSocketSelected
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var itemEntityToEquip = this.itemEntitySelected;
		uwpe.entity2Set(itemEntityToEquip);

		var socketSelected = this.socketSelected;
		if (socketSelected == null)
		{
			this.equipEntityWithItem(uwpe);
		}
		else
		{
			this.equipItemEntityInSocketWithName
			(
				uwpe,
				socketSelected.defnName, true // includeSocketNameInMessage
			)
		}
	}

	equipItemSelectedInQuickSlot
	(
		uwpe: UniverseWorldPlaceEntities,
		quickSlotNumber: number
	): void
	{
		uwpe.entity2Set(this.itemEntitySelected);
		this.equipItemEntityInSocketWithName
		(
			uwpe,
			"Item" + quickSlotNumber, // socketName
			true // includeSocketNameInMessage
		);
	}

	unequipFromSocketSelected(uwpe: UniverseWorldPlaceEntities): void
	{
		var socketToUnequipFrom = this.socketSelected;
		this.unequipItemFromSocketWithName
		(
			uwpe.world, socketToUnequipFrom.defnName
		);
	}

	// Clonable.
	clone(): EquipmentUser { return this; }
	overwriteWith(other: EquipmentUser): EquipmentUser { return this; }

	// Equatable

	equals(other: EquipmentUser): boolean { return false; } // todo

}

}
