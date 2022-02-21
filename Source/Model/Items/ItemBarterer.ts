
namespace ThisCouldBeBetter.GameFramework
{

export class ItemBarterer implements EntityProperty<ItemBarterer>
{
	itemHolderCustomerOffer: ItemHolder;
	itemHolderStoreOffer: ItemHolder;
	statusMessage: string;
	patience: number;
	patienceMax: number;

	itemDefnNameCurrency: string;

	constructor()
	{
		this.itemHolderCustomerOffer = ItemHolder.create();
		this.itemHolderStoreOffer = ItemHolder.create();
		this.statusMessage = "Choose items to trade and click the 'Offer' button.";
		this.patience = 10;

		this.patienceMax = 10;
	}

	isAnythingBeingOffered(): boolean
	{
		var returnValue =
		(
			this.itemHolderCustomerOffer.items.length > 0
			|| this.itemHolderStoreOffer.items.length > 0
		);
		return returnValue;
	}

	isOfferProfitableEnough(world: World): boolean
	{
		var profitMarginForStore = this.profitMarginOfOfferForStore(world);

		var isOfferProfitableToStore = (profitMarginForStore > 1);

		return isOfferProfitableToStore;
	}

	profitMarginOfOfferForStore(world: World): number
	{
		var valueOfferedByCustomer = this.itemHolderCustomerOffer.tradeValueOfAllItems(world);
		var valueOfferedByStore = this.itemHolderStoreOffer.tradeValueOfAllItems(world);

		var profitMarginForStore = valueOfferedByCustomer / valueOfferedByStore;

		return profitMarginForStore;
	}

	patienceAdd(patienceToAdd: number): void
	{
		this.patience = NumberHelper.trimToRangeMax
		(
			this.patience + patienceToAdd, this.patienceMax
		);
	}

	reset(entityCustomer: Entity, entityStore: Entity): void
	{
		this.itemHolderCustomerOffer.itemsAllTransferTo
		(
			entityCustomer.itemHolder()
		);
		this.itemHolderStoreOffer.itemsAllTransferTo
		(
			entityStore.itemHolder()
		);
	}

	trade(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityStore = uwpe.entity;
		var entityCustomer = uwpe.entity;

		this.itemHolderCustomerOffer.itemsAllTransferTo
		(
			entityStore.itemHolder()
		);
		this.itemHolderStoreOffer.itemsAllTransferTo
		(
			entityCustomer.itemHolder()
		);

		var entities = [ entityCustomer, entityStore ];
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityEquipmentUser = entity.equipmentUser();
			if (entityEquipmentUser != null)
			{
				entityEquipmentUser.unequipItemsNoLongerHeld
				(
					uwpe
				);
			}
		}
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ItemBarterer): boolean { return false; } // todo

	// Controls.

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

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, universe.world.placeCurrent,
			entityCustomer, entityStore
		);

		var fontHeight = 10;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeight);
		var margin = fontHeight * 1.5;
		var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
		var buttonSizeSmall = Coords.fromXY(2, 2).multiplyScalar(fontHeight);
		var listSize = Coords.fromXY((size.x - margin * 3) / 2, 80);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder();
		var itemHolderStore = entityStore.itemHolder();

		var world = universe.world;

		var back = () =>
		{
			itemBarterer.reset(entityCustomer, entityStore);
			universe.venueTransitionTo(venuePrev);
		};

		var itemOfferCustomer = () =>
		{
			if (itemHolderCustomer.itemSelected != null)
			{
				var offer = itemBarterer.itemHolderCustomerOffer;
				itemHolderCustomer.itemTransferSingleTo
				(
					itemHolderCustomer.itemSelected, offer
				);
			}
		};

		var itemOfferStore = () =>
		{
			if (itemHolderStore.itemSelected != null)
			{
				var offer = itemBarterer.itemHolderStoreOffer;
				itemHolderStore.itemTransferSingleTo
				(
					itemHolderStore.itemSelected, offer
				);
			}
		};

		var itemUnofferCustomer = () =>
		{
			var offer = itemBarterer.itemHolderCustomerOffer;

			if (offer.itemSelected != null)
			{
				offer.itemTransferSingleTo
				(
					offer.itemSelected, itemHolderCustomer
				);
			}
		};

		var itemUnofferStore = () =>
		{
			var offer = itemBarterer.itemHolderStoreOffer;

			if (offer.itemSelected != null)
			{
				offer.itemTransferSingleTo
				(
					offer.itemSelected, itemHolderStore
				);
			}
		};

		var offer = () =>
		{
			if (itemBarterer.patience <= 0)
			{
				var profitMargin =
					itemBarterer.profitMarginOfOfferForStore(world);
				var isCustomerDonatingToStore =
					(profitMargin == Number.POSITIVE_INFINITY);
				if (isCustomerDonatingToStore)
				{
					itemBarterer.statusMessage = "Very well, I accept your gift.";
					itemBarterer.trade(uwpe);
					itemBarterer.patienceAdd(1);
				}
				else
				{
					itemBarterer.statusMessage = "No.  I'm sick of your nonsense.";
				}
			}
			else
			{
				var isOfferAccepted = itemBarterer.isOfferProfitableEnough(world);
				if (isOfferAccepted)
				{
					itemBarterer.statusMessage = "It's a deal!";
					itemBarterer.trade(uwpe);
					itemBarterer.patienceAdd(1);
				}
				else
				{
					itemBarterer.statusMessage = "This deal is not acceptable.";
					itemBarterer.patienceAdd(-1);
				}
			}
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
					Coords.fromXY(margin, margin - fontHeight / 2), // pos
					Coords.fromXY(listSize.x, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(entityStore.name + ":"),
					font
				),

				new ControlList
				(
					"listStoreItems",
					Coords.fromXY(margin, margin + fontHeight), // pos
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
					font,
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferStore,
					null
				),

				ControlButton.from8
				(
					"buttonStoreOffer",
					Coords.fromXY
					(
						listSize.x - buttonSizeSmall.x * 2,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"v",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) =>
							(itemHolderStore.itemSelected != null)
					), // isEnabled
					itemOfferStore // click
				),

				ControlButton.from8
				(
					"buttonStoreUnoffer",
					Coords.fromXY
					(
						margin + listSize.x - buttonSizeSmall.x,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"^",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) =>
							(c.itemHolderStoreOffer.itemSelected != null)
					), // isEnabled
					itemUnofferStore // click
				),

				new ControlLabel
				(
					"labelItemsOfferedStore",
					Coords.fromXY
					(
						margin,
						margin * 2 + fontHeight + listSize.y
						+ buttonSize.y - fontHeight / 2
					), // pos
					Coords.fromXY(100, 15), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Offered:"),
					font
				),

				new ControlList
				(
					"listItemsOfferedByStore",
					Coords.fromXY
					(
						margin,
						margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y
					), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						this.itemHolderStoreOffer,
						(c: ItemHolder) => c.items
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					font,
					new DataBinding
					(
						this.itemHolderStoreOffer,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemUnofferStore,
					null
				),

				new ControlLabel
				(
					"labelCustomerName",
					Coords.fromXY
					(
						size.x - margin - listSize.x, margin - fontHeight / 2
					), // pos
					Coords.fromXY(85, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(entityCustomer.name + ":"),
					font
				),

				new ControlList
				(
					"listCustomerItems",
					Coords.fromXY
					(
						size.x - margin - listSize.x, margin + fontHeight
					), // pos
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
					font,
					new DataBinding
					(
						itemHolderCustomer,
						(c: ItemHolder) => c.itemSelected,
						(c: ItemHolder, v: Item) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferCustomer,
					null
				),

				ControlButton.from8
				(
					"buttonCustomerOffer",
					Coords.fromXY
					(
						size.x - margin * 2 - buttonSizeSmall.x * 2,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"v",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) =>
							(itemHolderCustomer.itemSelected != null)
					), // isEnabled
					itemOfferCustomer // click
				),

				ControlButton.from8
				(
					"buttonCustomerUnoffer",
					Coords.fromXY
					(
						size.x - margin - buttonSizeSmall.x,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"^",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) =>
							c.itemHolderCustomerOffer.itemSelected != null
					), // isEnabled
					itemUnofferCustomer // click
				),

				new ControlLabel
				(
					"labelItemsOfferedCustomer",
					Coords.fromXY
					(
						size.x - margin - listSize.x,
						margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2
					), // pos
					Coords.fromXY(100, 15), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Offered:"),
					font
				),

				ControlList.from10
				(
					"listItemsOfferedByCustomer",
					Coords.fromXY
					(
						size.x - margin - listSize.x,
						margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y
					), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => c.itemHolderCustomerOffer.items
					), // items
					DataBinding.fromGet
					(
						(c: Item) => c.toString(world)
					), // bindingForItemText
					font,
					new DataBinding
					(
						this,
						(c: ItemBarterer) =>
							c.itemHolderCustomerOffer.itemSelected,
						(c: ItemBarterer, v: Item) =>
							c.itemHolderCustomerOffer.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Item) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferCustomer
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet(this, c => c.statusMessage),
					font
				),

				ControlButton.from8
				(
					"buttonReset",
					Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Reset",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => c.isAnythingBeingOffered()
					), // isEnabled
					() => // click
						itemBarterer.reset(entityCustomer, entityStore)
				),

				ControlButton.from8
				(
					"buttonOffer",
					Coords.fromXY
					(
						(size.x - buttonSize.x) / 2,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Offer",
					font,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => c.isAnythingBeingOffered()
					), // isEnabled
					offer // click
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
