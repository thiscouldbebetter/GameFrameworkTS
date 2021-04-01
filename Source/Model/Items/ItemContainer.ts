
namespace ThisCouldBeBetter.GameFramework
{

export class ItemContainer extends EntityProperty
{
	statusMessage: string;

	transfer(world: World, entityFrom: Entity, entityTo: Entity, messagePrefix: string)
	{
		var itemHolderFrom = entityFrom.itemHolder();
		var itemHolderTo = entityTo.itemHolder();

		if (itemHolderFrom.itemEntitySelected == null)
		{
			this.statusMessage = "Select and click buttons transfer items."
		}
		else
		{
			var itemEntityToTransfer = itemHolderFrom.itemEntitySelected;
			var itemToTransfer = itemEntityToTransfer.item();
			itemHolderFrom.itemEntityTransferSingleTo
			(
				itemEntityToTransfer, itemHolderTo
			);
			if (itemHolderFrom.itemQuantityByDefnName(itemToTransfer.defnName) <= 0)
			{
				itemHolderFrom.itemEntitySelected = null;
			}

			this.statusMessage =
				messagePrefix
				+ " " + itemToTransfer.defnName + ".";

			var equipmentUser = entityFrom.equipmentUser();
			if (equipmentUser != null)
			{
				equipmentUser.unequipItemsNoLongerHeld(entityFrom);
			}

		}
	}

	// Controllable.

	toControl
	(
		universe: Universe, size: Coords,
		entityGetterPutter: Entity, entityContainer: Entity, venuePrev: Venue
	)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
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

		var back = () =>
		{
			var venueNext: Venue = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

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
					false, // isTextCentered
					entityContainer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listContainerItems",
					Coords.fromXY(margin, margin * 2), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderContainer,
						(c: ItemHolder) =>
						{
							return c.itemEntities;
						}
					), // items
					DataBinding.fromGet
					(
						(c: Entity) => c.item().toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderContainer,
						(c: ItemHolder) => c.itemEntitySelected,
						(c: ItemHolder, v: Entity) => c.itemEntitySelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContext(true), // isEnabled
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContext(true), // isEnabled
					put // click
				),

				new ControlLabel
				(
					"labelGetterPutterName",
					Coords.fromXY(size.x - margin - listSize.x, margin), // pos
					Coords.fromXY(85, 25), // size
					false, // isTextCentered
					entityGetterPutter.name + ":",
					fontHeight
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
						{
							return c.itemEntities;//.filter(x => x.item().defnName != itemDefnNameCurrency);
						}
					), // items
					DataBinding.fromGet
					(
						(c: Entity) => c.item().toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderGetterPutter,
						(c: ItemHolder) => c.itemEntitySelected,
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					put, // confirm
					null
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(size.x / 2, size.y - margin - fontHeight), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCentered
					DataBinding.fromContextAndGet(this, c => c.statusMessage),
					fontHeight
				),

				new ControlButton
				(
					"buttonDone",
					Coords.fromXY
					(
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	}
}

}
