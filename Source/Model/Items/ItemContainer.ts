
namespace ThisCouldBeBetter.GameFramework
{

export class ItemContainer implements EntityProperty<ItemContainer>
{
	statusMessage: string;

	transfer
	(
		world: World, entityFrom: Entity, entityTo: Entity, messagePrefix: string
	): void
	{
		var itemHolderFrom = entityFrom.itemHolder();
		var itemHolderTo = entityTo.itemHolder();

		if (itemHolderFrom.itemSelected == null)
		{
			this.statusMessage = "Select and click buttons transfer items."
		}
		else
		{
			var itemToTransfer = itemHolderFrom.itemSelected;
			itemHolderFrom.itemTransferSingleTo
			(
				itemToTransfer, itemHolderTo
			);
			if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0)
			{
				itemHolderFrom.itemSelected = null;
			}

			this.statusMessage =
				messagePrefix
				+ " " + itemToTransfer.defnName + ".";

			var equipmentUser = entityFrom.equipmentUser();
			if (equipmentUser != null)
			{
				var uwpe = new UniverseWorldPlaceEntities
				(
					null, world, null, entityFrom, entityTo
				);
				equipmentUser.unequipItemsNoLongerHeld
				(
					uwpe
				);
			}

		}
	}

	// Clonable.
	clone(): ItemContainer { return this; }
	overwriteWith(other: ItemContainer): ItemContainer { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return ItemContainer.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ItemContainer): boolean { return false; } // todo

	// Controllable.

	toControl
	(
		universe: Universe, size: Coords,
		entityGetterPutter: Entity, entityContainer: Entity, venuePrev: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var margin = fontHeight * 1.5;
		var buttonSize = Coords.fromXY(2, 2).multiplyScalar(fontHeight);
		var listSize = Coords.fromXY
		(
			(size.x - margin * 4 - buttonSize.x) / 2,
			size.y - margin * 4 - fontHeight * 2
		);

		var itemContainer = this;
		var itemHolderGetterPutter = entityGetterPutter.itemHolder();
		var itemHolderContainer = entityContainer.itemHolder();

		var world = universe.world;

		var back = () => universe.venueTransitionTo(venuePrev);

		var get = () =>
		{
			itemContainer.transfer(world, entityContainer, entityGetterPutter, "Took");
		};

		var put = () =>
		{
			itemContainer.transfer(world, entityGetterPutter, entityContainer, "Put");
		};

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			Coords.create(), // pos
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelContainerName",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(listSize.x, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(entityContainer.name + ":"),
					font
				),

				new ControlList
				(
					"listContainerItems",
					Coords.fromXY(margin, margin * 2), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderContainer,
						(c: ItemHolder) => c.items
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					font,
					new DataBinding
					(
						itemHolderContainer,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					get, // confirm
					null
				),

				ControlButton.from8
				(
					"buttonGet",
					Coords.fromXY
					(
						(size.x - buttonSize.x) / 2,
						(size.y - buttonSize.y - margin) / 2
					), // pos
					buttonSize.clone(),
					">",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					get // click
				),

				ControlButton.from8
				(
					"buttonPut",
					Coords.fromXY
					(
						(size.x - buttonSize.x) / 2,
						(size.y + buttonSize.y + margin) / 2
					), // pos
					buttonSize.clone(),
					"<",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					put // click
				),

				new ControlLabel
				(
					"labelGetterPutterName",
					Coords.fromXY(size.x - margin - listSize.x, margin), // pos
					Coords.fromXY(85, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(entityGetterPutter.name + ":"),
					font
				),

				new ControlList
				(
					"listOtherItems",
					Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderGetterPutter,
						(c: ItemHolder) =>
							c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					font,
					new DataBinding
					(
						itemHolderGetterPutter,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) =>
							c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					put, // confirm
					null
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(size.x / 2, size.y - margin - fontHeight), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet(this, c => c.statusMessage),
					font
				),

				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY
					(
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Done",
					font,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					back // click
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	}
}

}
