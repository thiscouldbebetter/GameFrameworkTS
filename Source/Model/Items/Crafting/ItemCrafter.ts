
class ItemCrafter
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
		this.recipesAvailable = recipesAvailable || [];

		this.itemHolderStaged = new ItemHolder([], null, null);
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

		var sizeBase = new Coords(200, 135, 1);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * 0.6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = entityItemHolder.itemHolder();
		var crafter = this;

		var back = () =>
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
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
			new Coords(0, 0, 0), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelRecipes",
					new Coords(10, 5, 0), // pos
					new Coords(70, 25, 0), // size
					false, // isTextCentered
					"Recipes:",
					fontHeightSmall
				),

				new ControlList
				(
					"listRecipes",
					new Coords(10, 15, 0), // pos
					new Coords(85, 100, 0), // size
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipesAvailable,
						null
					), // items
					new DataBinding
					(
						null,
						(c: CraftingRecipe) => c.name,
						null
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
					DataBinding.fromContext(true), // isEnabled
					addToQueue, // confirm
					null
				),

				new ControlLabel
				(
					"labelRecipeSelected",
					new Coords(105, 5, 0), // pos
					new Coords(70, 25, 0), // size
					false, // isTextCentered
					"Recipe Selected:",
					fontHeightSmall
				),

				new ControlButton
				(
					"buttonCraft",
					new Coords(170, 5, 0), // pos
					new Coords(20, 10, 0), // size
					"Craft",
					fontHeightSmall,
					true, // hasBorder
					new DataBinding
					(
						this,
						(c: ItemCrafter) =>
							c.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder()),
						null
					), // isEnabled
					addToQueue, // click
					null, null
				),

				new ControlLabel
				(
					"infoRecipeSelected",
					new Coords(105, 10, 0), // pos
					new Coords(75, 25, 0), // size
					false, // isTextCentered
					new DataBinding
					(
						this,
						(c: ItemCrafter) =>
							(
								(c.recipeAvailableSelected == null)
								? "-"
								: c.recipeAvailableSelected.nameAndSecondsToCompleteAsString(universe)
							),
						null
					),
					fontHeightSmall
				),

				new ControlList
				(
					"listItemsInRecipe",
					new Coords(105, 20, 0), // pos
					new Coords(85, 25, 0), // size
					new DataBinding
					(
						this,
						(c: ItemCrafter) =>
							(
								c.recipeAvailableSelected == null
								? []
								: c.recipeAvailableSelected.itemsInHeldOverRequiredForItemHolder(itemHolder)
							),
						null
					), // items
					new DataBinding
					(
						null,
						(c: string) => c,
						null
					), // bindingForItemText
					fontHeightSmall,
					null, // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					null, null, null
				),

				new ControlLabel
				(
					"labelCrafting",
					new Coords(105, 50, 0), // pos
					new Coords(75, 25, 0), // size
					false, // isTextCentered
					DataBinding.fromContext("Crafting:"),
					fontHeightSmall
				),

				new ControlButton
				(
					"buttonCancel",
					new Coords(170, 50, 0), // pos
					new Coords(20, 10, 0), // size
					"Cancel",
					fontHeightSmall,
					true, // hasBorder
					new DataBinding
					(
						this,
						(c: ItemCrafter) => (c.recipesQueued.length > 0),
						null
					), // isEnabled
					crafter.recipeInProgressCancel, // click
					null, null
				),

				new ControlLabel
				(
					"infoCrafting",
					new Coords(105, 55, 0), // pos
					new Coords(75, 25, 0), // size
					false, // isTextCentered
					new DataBinding(
						this,
						(c: ItemCrafter) => ( c.recipeProgressAsString(universe) ),
						null
					),
					fontHeightSmall
				),

				new ControlList
				(
					"listCraftingsQueued",
					new Coords(105, 65, 0), // pos
					new Coords(85, 35, 0), // size
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipesQueued,
						null
					), // items
					new DataBinding
					(
						null,
						(c: CraftingRecipe) => c.name,
						null
					), // bindingForItemText
					fontHeightSmall,
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipeQueuedSelected,
						(c: ItemCrafter, v: CraftingRecipe) => { c.recipeQueuedSelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
					null, null, null
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(100, 125, 0), // pos
					new Coords(200, 15, 0), // size
					true, // isTextCentered
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.statusMessage,
						null
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
					new Coords(100, -5, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Craft",
					fontHeightLarge
				)
			);

			returnValue.children.push
			(
				new ControlButton
				(
					"buttonDone",
					new Coords(170, 115, 0), // pos
					new Coords(20, 10, 0), // size
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				)
			);

			var titleHeight = new Coords(0, 15, 0);
			sizeBase.add(titleHeight);
			returnValue.size.add(titleHeight);
			returnValue.shiftChildPositions(titleHeight);
		}

		var scaleMultiplier = size.clone().divide(sizeBase);
		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	// cloneable

	clone()
	{
		return new ItemCrafter(ArrayHelper.clone(this.recipesAvailable) );
	};
}
