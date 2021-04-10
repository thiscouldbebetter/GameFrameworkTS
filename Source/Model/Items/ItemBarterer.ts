
namespace ThisCouldBeBetter.GameFramework
{

export class ItemBarterer implements EntityProperty
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
			this.itemHolderCustomerOffer.itemEntities.length > 0
			|| this.itemHolderStoreOffer.itemEntities.length > 0
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
		this.patience = NumberHelper.trimToRangeMax(this.patience + patienceToAdd, this.patienceMax);
	}

	reset(entityCustomer: Entity, entityStore: Entity): void
	{
		this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder() );
		this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityStore.itemHolder() );
	}

	trade(entityCustomer: Entity, entityStore: Entity): void
	{
		this.itemHolderCustomerOffer.itemEntitiesAllTransferTo(entityStore.itemHolder());
		this.itemHolderStoreOffer.itemEntitiesAllTransferTo(entityCustomer.itemHolder());

		var entities = [ entityCustomer, entityStore ];
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityEquipmentUser = entity.equipmentUser();
			if (entityEquipmentUser != null)
			{
				entityEquipmentUser.unequipItemsNoLongerHeld(entity);
			}
		}
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

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

		var fontHeight = 10;
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
			var venueNext: Venue = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var itemOfferCustomer = () =>
		{
			if (itemHolderCustomer.itemEntitySelected != null)
			{
				var offer = itemBarterer.itemHolderCustomerOffer;
				itemHolderCustomer.itemEntityTransferSingleTo(itemHolderCustomer.itemEntitySelected, offer);
			}
		};

		var itemOfferStore = () =>
		{
			if (itemHolderStore.itemEntitySelected != null)
			{
				var offer = itemBarterer.itemHolderStoreOffer;
				itemHolderStore.itemEntityTransferSingleTo(itemHolderStore.itemEntitySelected, offer);
			}
		};

		var itemUnofferCustomer = () =>
		{
			var offer = itemBarterer.itemHolderCustomerOffer;

			if (offer.itemEntitySelected != null)
			{
				offer.itemEntityTransferSingleTo
				(
					offer.itemEntitySelected, itemHolderCustomer
				);
			}
		};

		var itemUnofferStore = () =>
		{
			var offer = itemBarterer.itemHolderStoreOffer;

			if (offer.itemEntitySelected != null)
			{
				offer.itemEntityTransferSingleTo
				(
					offer.itemEntitySelected, itemHolderStore
				);
			}
		};

		var offer = () =>
		{
			if (itemBarterer.patience <= 0)
			{
				var profitMargin = itemBarterer.profitMarginOfOfferForStore(world);
				var isCustomerDonatingToStore = (profitMargin == Number.POSITIVE_INFINITY);
				if (isCustomerDonatingToStore)
				{
					itemBarterer.statusMessage = "Very well, I accept your gift.";
					itemBarterer.trade(entityCustomer, entityStore);
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
					itemBarterer.trade(entityCustomer, entityStore);
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
					false, // isTextCentered
					entityStore.name + ":",
					fontHeight
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
							c.itemEntities //.filter(x => x.item().defnName != itemDefnNameCurrency)
					), // items
					DataBinding.fromGet
					(
						(c: Entity) => c.item().toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => itemHolderStore.itemEntitySelected != null
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) =>
							c.itemHolderStoreOffer.itemEntitySelected != null
					), // isEnabled
					itemUnofferStore // click
				),

				new ControlLabel
				(
					"labelItemsOfferedStore",
					Coords.fromXY
					(
						margin,
						margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2
					), // pos
					Coords.fromXY(100, 15), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
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
						this,
						(c: ItemBarterer) =>
						{
							return c.itemHolderStoreOffer.itemEntities;
						}
					), // items
					DataBinding.fromGet
					(
						(c: Entity) => { return c.item().toString(world); }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						this.itemHolderStoreOffer,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
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
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
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
						itemHolderCustomer,
						(c: ItemHolder) => c.itemEntitySelected,
						(c: ItemHolder, v: Entity) => c.itemEntitySelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => itemHolderCustomer.itemEntitySelected != null
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => c.itemHolderCustomerOffer.itemEntitySelected != null
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
					false, // isTextCentered
					"Offered:",
					fontHeight
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
						(c: ItemBarterer) => c.itemHolderCustomerOffer.itemEntities
					), // items
					DataBinding.fromGet
					(
						(c: Entity) => c.item().toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						this.itemHolderCustomerOffer,
						(c: ItemHolder) => { return c.itemEntitySelected; },
						(c: ItemHolder, v: Entity) => { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferCustomer
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
					"buttonReset",
					Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Reset",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => c.isAnythingBeingOffered()
					), // isEnabled
					() => // click
					{
						itemBarterer.reset(entityCustomer, entityStore);
					}
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
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemBarterer) => { return c.isAnythingBeingOffered(); },
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
