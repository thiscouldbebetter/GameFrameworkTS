
namespace ThisCouldBeBetter.GameFramework
{

export class ItemStore implements EntityProperty
{
	itemDefnNameCurrency: string;

	statusMessage: string;

	constructor(itemDefnNameCurrency: string)
	{
		this.itemDefnNameCurrency = itemDefnNameCurrency;
		this.statusMessage = "-";
	}

	transfer
	(
		world: World, entityFrom: Entity, entityTo: Entity, messagePrefix: string
	): void
	{
		var itemHolderFrom = entityFrom.itemHolder();
		var itemHolderTo = entityTo.itemHolder();

		if (itemHolderFrom.itemSelected != null)
		{
			var itemToTransfer = itemHolderFrom.itemSelected;
			var tradeValue = itemToTransfer.defn(world).tradeValue;
			var itemCurrencyNeeded = new Item(this.itemDefnNameCurrency, tradeValue);
			var itemDefnCurrency = itemCurrencyNeeded.defn(world);
			itemCurrencyNeeded.quantity = Math.ceil(tradeValue / itemDefnCurrency.tradeValue);
			if (itemHolderTo.hasItem(itemCurrencyNeeded))
			{
				itemHolderFrom.itemTransferSingleTo
				(
					itemToTransfer, itemHolderTo
				);

				itemHolderTo.itemTransferTo
				(
					itemCurrencyNeeded, itemHolderFrom
				);
				this.statusMessage =
					messagePrefix
					+ " " + itemToTransfer.defnName
					+ " for " + itemCurrencyNeeded.quantity + ".";
			}
			else
			{
				this.statusMessage = "Not enough currency!";
			}
		}
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityUsing = uwpe.entity;
		var entityUsed = uwpe.entity2;
		//entityUsed.collidable().ticksUntilCanCollide = 50; // hack
		var storeAsControl = entityUsed.itemStore().toControl
		(
			universe, universe.display.sizeInPixels,
			entityUsing, entityUsed,
			universe.venueCurrent
		);
		var venueNext: Venue = storeAsControl.toVenue();
		venueNext = VenueFader.fromVenueTo(venueNext);
		universe.venueNext = venueNext;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Controllable.

	toControl
	(
		universe: Universe, size: Coords, entityCustomer: Entity,
		entityStore: Entity, venuePrev: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
		var listSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2,
			size.y - margin * 4 - buttonSize.y - fontHeight
		);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder();
		var itemHolderStore = entityStore.itemHolder();

		var world = universe.world;

		var back = () =>
		{
			var venueNext: Venue = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var buy = () =>
		{
			itemBarterer.transfer(world, entityStore, entityCustomer, "Purchased");
		};

		var sell = () =>
		{
			itemBarterer.transfer(world, entityCustomer, entityStore, "Sold");
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
					"labelStoreName",
					Coords.fromXY(margin, margin), // pos
					Coords.fromXY(listSize.x, 25), // size
					false, // isTextCentered
					entityStore.name + ":",
					fontHeight
				),

				ControlList.from10
				(
					"listStoreItems",
					Coords.fromXY(margin, margin * 2), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderStore,
						(c: ItemHolder) =>
							c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					buy // confirm
				),

				new ControlLabel
				(
					"labelCustomerName",
					Coords.fromXY(size.x - margin - listSize.x, margin), // pos
					Coords.fromXY(85, 25), // size
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				ControlButton.from8
				(
					"buttonBuy",
					Coords.fromXY
					(
						size.x / 2 - buttonSize.x - margin / 2,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Buy",
					fontHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					buy // click
				),

				ControlList.from10
				(
					"listCustomerItems",
					Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderCustomer,
						(c: ItemHolder) => 
							c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					sell // confirm
				),

				ControlButton.from8
				(
					"buttonSell",
					Coords.fromXY
					(
						size.x / 2 + margin / 2,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Sell",
					fontHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					sell // click
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCentered
					DataBinding.fromContextAndGet(this, c => c.statusMessage),
					fontHeight
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
					fontHeight,
					true, // hasBorder
					true, // isEnabled
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
