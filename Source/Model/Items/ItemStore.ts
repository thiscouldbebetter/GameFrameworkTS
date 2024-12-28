
namespace ThisCouldBeBetter.GameFramework
{

export class ItemStore implements EntityProperty<ItemStore>
{
	itemDefnNameCurrency: string;

	statusMessage: string;

	constructor(itemDefnNameCurrency: string)
	{
		this.itemDefnNameCurrency = itemDefnNameCurrency;
		this.statusMessage = "-";
	}

	static of(entity: Entity): ItemStore
	{
		return entity.propertyByName(ItemStore.name) as ItemStore;
	}

	transfer
	(
		world: World,
		entityFrom: Entity,
		entityTo: Entity,
		messagePrefix: string
	): void
	{
		var itemHolderFrom = ItemHolder.of(entityFrom);
		var itemHolderTo = ItemHolder.of(entityTo);

		if (itemHolderFrom.itemSelected != null)
		{
			var itemToTransfer = itemHolderFrom.itemSelected;
			var tradeValue = itemToTransfer.defn(world).tradeValue;
			var itemCurrencyNeeded
				= new Item(this.itemDefnNameCurrency, tradeValue);
			var itemDefnCurrency = itemCurrencyNeeded.defn(world);
			itemCurrencyNeeded.quantitySet
			(
				Math.ceil(tradeValue / itemDefnCurrency.tradeValue)
			);

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
		var storeAsControl = ItemStore.of(entityUsed).toControl
		(
			universe,
			universe.display.sizeInPixels,
			entityUsing,
			entityUsed,
			universe.venueCurrent()
		);
		var venueNext = storeAsControl.toVenue();
		universe.venueTransitionTo(venueNext);
	}

	// Clonable.
	clone(): ItemStore { return this; }
	overwriteWith(other: ItemStore): ItemStore { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return ItemStore.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ItemStore): boolean { return false; } // todo

	// Controllable.

	toControl
	(
		universe: Universe,
		size: Coords,
		entityCustomer: Entity,
		entityStore: Entity,
		venuePrev: Venue
	): ControlBase
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var margin = fontHeight * 1.5;
		var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
		var listSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2,
			size.y - margin * 4 - buttonSize.y - fontHeight
		);

		var itemBarterer = this;
		var itemHolderCustomer = ItemHolder.of(entityCustomer);
		var itemHolderStore = ItemHolder.of(entityStore);

		var world = universe.world;

		var back = () =>
		{
			universe.venueTransitionTo(venuePrev);
		};

		var buy = () =>
		{
			itemBarterer.transfer(world, entityStore, entityCustomer, "Purchased");
		};

		var sell = () =>
		{
			itemBarterer.transfer(world, entityCustomer, entityStore, "Sold");
		};

		var labelStoreName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin), // pos
			Coords.fromXY(listSize.x, 25), // size
			DataBinding.fromContext(entityStore.name + ":"),
			font
		);

		var listStoreItems = ControlList.from10
		(
			"listStoreItems",
			Coords.fromXY(margin, margin * 2), // pos
			listSize.clone(),
			DataBinding.fromContextAndGet
			(
				itemHolderStore,
				(c: ItemHolder) =>
					c.items
			), // items
			DataBinding.fromGet
			(
				(c: Item) => c.toString(world)
			), // bindingForItemText
			font,
			new DataBinding
			(
				itemHolderStore,
				(c: ItemHolder) => c.itemSelected,
				(c: ItemHolder, v: Item) => c.itemSelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
			DataBinding.fromTrue(), // isEnabled
			buy // confirm
		);

		var labelCustomerName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(size.x - margin - listSize.x, margin), // pos
			Coords.fromXY(85, 25), // size
			DataBinding.fromContext(entityCustomer.name + ":"),
			font
		);

		var buttonBuy = ControlButton.from8
		(
			"buttonBuy",
			Coords.fromXY
			(
				size.x / 2 - buttonSize.x - margin / 2,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Buy",
			font,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			buy // click
		);

		var listCustomerItems = ControlList.from10
		(
			"listCustomerItems",
			Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
			listSize.clone(),
			DataBinding.fromContextAndGet
			(
				itemHolderCustomer,
				(c: ItemHolder) => 
					c.items
			), // items
			DataBinding.fromGet
			(
				(c: Item) => c.toString(world)
			), // bindingForItemText
			font,
			new DataBinding
			(
				itemHolderCustomer,
				(c: ItemHolder) => c.itemSelected,
				(c: ItemHolder, v: Item) => c.itemSelected = v
			), // bindingForItemSelected
			DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
			DataBinding.fromTrue(), // isEnabled
			sell // confirm
		);

		var buttonSell = ControlButton.from8
		(
			"buttonSell",
			Coords.fromXY
			(
				size.x / 2 + margin / 2,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Sell",
			font,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			sell // click
		);

		var infoStatus = ControlLabel.from4CenteredHorizontally
		(
			Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
			Coords.fromXY(size.x, fontHeight), // size
			DataBinding.fromContextAndGet(this, c => c.statusMessage),
			font
		);

		var buttonDone = ControlButton.from5
		(
			Coords.fromXY
			(
				size.x - margin - buttonSize.x,
				size.y - margin - buttonSize.y
			), // pos
			buttonSize.clone(),
			"Done",
			font,
			back // click
		);

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			Coords.create(), // pos
			size.clone(),
			// children
			[
				labelStoreName,
				listStoreItems,
				labelCustomerName,
				buttonBuy,
				listCustomerItems,
				buttonSell,
				infoStatus,
				buttonDone
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	}
}

}
