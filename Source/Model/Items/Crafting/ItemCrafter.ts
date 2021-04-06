
namespace ThisCouldBeBetter.GameFramework
{

export class ItemCrafter extends EntityProperty
{
	recipesAvailable: CraftingRecipe[];

	itemHolderStaged: ItemHolder;
	recipeAvailableSelected: CraftingRecipe;
	recipeInProgressTicksSoFar: number;
	recipeQueuedSelected: CraftingRecipe;
	recipesQueued: CraftingRecipe[];
	statusMessage: string;

	constructor(recipesAvailable: CraftingRecipe[])
	{
		super();

		this.recipesAvailable = recipesAvailable || [];

		this.itemHolderStaged = ItemHolder.create();
		this.recipeAvailableSelected = null;
		this.recipeInProgressTicksSoFar = 0;
		this.recipeQueuedSelected = null;
		this.recipesQueued = [];
		this.statusMessage = "-";
	}

	isRecipeAvailableSelectedFulfilled(itemHolder: ItemHolder)
	{
		var returnValue =
		(
			this.recipeAvailableSelected == null
			? false
			: this.recipeAvailableSelected.isFulfilledByItemHolder(itemHolder)
		);

		return returnValue;
	}

	isRecipeInProgressFulfilled()
	{
		var recipeInProgress = this.recipesQueued[0];
		var returnValue =
		(
			recipeInProgress == null
			? false
			: recipeInProgress.isFulfilledByItemHolder(this.itemHolderStaged)
		);

		return returnValue;
	}

	recipeInProgressCancel()
	{
		// todo
	}

	recipeInProgressSecondsSoFar(universe: Universe)
	{
		return this.recipeInProgressTicksSoFar / universe.timerHelper.ticksPerSecond;
	}

	recipeInProgressFinish(entityCrafter: Entity)
	{
		var recipe = this.recipesQueued[0];

		var itemEntitiesOut = recipe.itemEntitiesOut;
		for (var i = 0; i < itemEntitiesOut.length; i++)
		{
			var itemEntityOut = itemEntitiesOut[i];
			entityCrafter.itemHolder().itemEntityAdd(itemEntityOut);
		}

		this.itemHolderStaged.itemEntities.length = 0;
		this.recipeInProgressTicksSoFar = 0;
		this.recipesQueued.splice(0, 1);
	}

	recipeProgressAsString(universe: Universe)
	{
		var returnValue = null;
		var recipeInProgress = this.recipesQueued[0];
		if (recipeInProgress == null)
		{
			returnValue = "-";
		}
		else
		{
			returnValue =
				recipeInProgress.name
				+ " ("
				+ this.recipeInProgressSecondsSoFar(universe)
				+ "/"
				+ recipeInProgress.secondsToComplete(universe)
				+ "s)";
		}
		return returnValue;
	}

	// venue

	updateForTimerTick(universe: Universe, world: World, place: Place, entityCrafter: Entity)
	{
		if (this.recipesQueued.length > 0)
		{
			var recipeInProgress = this.recipesQueued[0];
			if (this.isRecipeInProgressFulfilled())
			{
				if (this.recipeInProgressTicksSoFar >= recipeInProgress.ticksToComplete)
				{
					this.recipeInProgressFinish(entityCrafter);
				}
				else
				{
					this.recipeInProgressTicksSoFar++;
				}
			}
			else
			{
				this.recipeInProgressTicksSoFar = 0;
				this.recipesQueued.splice(0, 1);
			}
		}
	}

	// controls

	toControl
	(
		universe: Universe,
		size: Coords,
		entityCrafter: Entity,
		entityItemHolder: Entity,
		venuePrev: Venue,
		includeTitleAndDoneButton: boolean
	)
	{
		this.statusMessage = "Select a recipe and click Craft.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = Coords.fromXY(200, 135);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * 0.6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = entityItemHolder.itemHolder();
		var crafter = this;

		var back = () =>
		{
			var venueNext = venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var addToQueue = () =>
		{
			if (crafter.isRecipeAvailableSelectedFulfilled( entityCrafter.itemHolder() ) )
			{
				var recipe = crafter.recipeAvailableSelected;

				var itemsIn = recipe.itemsIn;
				for (var i = 0; i < itemsIn.length; i++)
				{
					var itemIn = itemsIn[i];
					itemHolder.itemTransferTo(itemIn, this.itemHolderStaged);
				}
				crafter.recipesQueued.push(crafter.recipeAvailableSelected);
			}
		};

		var returnValue = new ControlContainer
		(
			"Craft",
			Coords.create(), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelRecipes",
					Coords.fromXY(10, 5), // pos
					Coords.fromXY(70, 25), // size
					false, // isTextCentered
					"Recipes:",
					fontHeightSmall
				),

				new ControlList
				(
					"listRecipes",
					Coords.fromXY(10, 15), // pos
					Coords.fromXY(85, 100), // size
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.recipesAvailable
					), // items
					DataBinding.fromGet
					(
						(c: CraftingRecipe) => c.name
					), // bindingForItemText
					fontHeightSmall,
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipeAvailableSelected,
						(c: ItemCrafter, v: CraftingRecipe) => { c.recipeAvailableSelected = v; }
					), // bindingForItemSelected
					new DataBinding
					(
						null, (c: CraftingRecipe) => c, null
					), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					addToQueue, // confirm
					null
				),

				new ControlLabel
				(
					"labelRecipeSelected",
					Coords.fromXY(105, 5), // pos
					Coords.fromXY(70, 25), // size
					false, // isTextCentered
					"Recipe Selected:",
					fontHeightSmall
				),

				new ControlButton
				(
					"buttonCraft",
					Coords.fromXY(170, 5), // pos
					Coords.fromXY(20, 10), // size
					"Craft",
					fontHeightSmall,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) =>
							c.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder())
					), // isEnabled
					addToQueue, // click
					null, null
				),

				new ControlLabel
				(
					"infoRecipeSelected",
					Coords.fromXY(105, 10), // pos
					Coords.fromXY(75, 25), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) =>
							(
								(c.recipeAvailableSelected == null)
								? "-"
								: c.recipeAvailableSelected.nameAndSecondsToCompleteAsString(universe)
							)
					),
					fontHeightSmall
				),

				new ControlList
				(
					"listItemsInRecipe",
					Coords.fromXY(105, 20), // pos
					Coords.fromXY(85, 25), // size
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) =>
							(
								c.recipeAvailableSelected == null
								? []
								: c.recipeAvailableSelected.itemsInHeldOverRequiredForItemHolder(itemHolder)
							)
					), // items
					DataBinding.fromGet
					(
						(c: string) => c
					), // bindingForItemText
					fontHeightSmall,
					null, // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					null, null, null
				),

				new ControlLabel
				(
					"labelCrafting",
					Coords.fromXY(105, 50), // pos
					Coords.fromXY(75, 25), // size
					false, // isTextCentered
					DataBinding.fromContext("Crafting:"),
					fontHeightSmall
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(170, 50), // pos
					Coords.fromXY(20, 10), // size
					"Cancel",
					fontHeightSmall,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => (c.recipesQueued.length > 0)
					), // isEnabled
					crafter.recipeInProgressCancel // click
				),

				new ControlLabel
				(
					"infoCrafting",
					Coords.fromXY(105, 55), // pos
					Coords.fromXY(75, 25), // size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.recipeProgressAsString(universe)
					),
					fontHeightSmall
				),

				ControlList.from8
				(
					"listCraftingsQueued",
					Coords.fromXY(105, 65), // pos
					Coords.fromXY(85, 35), // size
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.recipesQueued
					), // items
					DataBinding.fromGet
					(
						(c: CraftingRecipe) => c.name
					), // bindingForItemText
					fontHeightSmall,
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipeQueuedSelected,
						(c: ItemCrafter, v: CraftingRecipe) => { c.recipeQueuedSelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ) // bindingForItemValue
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(100, 125), // pos
					Coords.fromXY(200, 15), // size
					true, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.statusMessage
					), // text
					fontHeightSmall
				)

			], // end children

			[
				new Action("Back", back),
			],

			[
				new ActionToInputsMapping("Back", [ Input.Names().Escape ], true ),
			]
		);

		if (includeTitleAndDoneButton)
		{
			returnValue.children.splice
			(
				0, 0,
				new ControlLabel
				(
					"labelCrafting",
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Craft",
					fontHeightLarge
				)
			);

			returnValue.children.push
			(
				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(170, 115), // pos
					Coords.fromXY(20, 10), // size
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
		return new ItemCrafter(ArrayHelper.clone(this.recipesAvailable) );
	}
}

}
