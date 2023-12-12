
namespace ThisCouldBeBetter.GameFramework
{

export class ItemCrafter implements EntityProperty<ItemCrafter>
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

		this.itemHolderStaged = ItemHolder.create();
		this.recipeAvailableSelected = null;
		this.recipeInProgressTicksSoFar = 0;
		this.recipeQueuedSelected = null;
		this.recipesQueued = [];
		this.statusMessage = "-";
	}

	isRecipeAvailableSelectedFulfilled(itemHolder: ItemHolder): boolean
	{
		var returnValue =
		(
			this.recipeAvailableSelected == null
			? false
			: this.recipeAvailableSelected.isFulfilledByItemHolder(itemHolder)
		);

		return returnValue;
	}

	isRecipeInProgressFulfilled(): boolean
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

	recipeInProgressCancel(): void
	{
		// todo
	}

	recipeInProgressSecondsSoFar(universe: Universe): number
	{
		return this.recipeInProgressTicksSoFar / universe.timerHelper.ticksPerSecond;
	}

	recipeInProgressFinish(entityCrafter: Entity): void
	{
		var recipe = this.recipesQueued[0];

		var itemsOut = recipe.itemsOut;
		for (var i = 0; i < itemsOut.length; i++)
		{
			var itemOut = itemsOut[i];
			entityCrafter.itemHolder().itemAdd(itemOut);
		}

		this.itemHolderStaged.items.length = 0;
		this.recipeInProgressTicksSoFar = 0;
		this.recipesQueued.splice(0, 1);
	}

	recipeProgressAsString(universe: Universe): string
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

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.recipesQueued.length > 0)
		{
			var recipeInProgress = this.recipesQueued[0];
			if (this.isRecipeInProgressFulfilled())
			{
				if (this.recipeInProgressTicksSoFar >= recipeInProgress.ticksToComplete)
				{
					var entityCrafter = uwpe.entity;
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
	): ControlBase
	{
		var itemCrafter = this;

		this.statusMessage = "Select a recipe and click Craft.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 135, 1);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * 0.6;
		var fontSmall = FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
		var fontHeightLarge = fontHeight * 1.5;
		var fontLarge = FontNameAndHeight.fromHeightInPixels(fontHeightLarge);

		var itemHolder = entityItemHolder.itemHolder();
		var crafter = this;

		var back = () => universe.venueTransitionTo(venuePrev);

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
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Recipes:"),
					fontSmall
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
					fontSmall,
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipeAvailableSelected,
						(c: ItemCrafter, v: CraftingRecipe) =>
							c.recipeAvailableSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet
					(
						(c: CraftingRecipe) => c
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
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Recipe Selected:"),
					fontSmall
				),

				new ControlButton
				(
					"buttonCraft",
					Coords.fromXY(170, 5), // pos
					Coords.fromXY(20, 10), // size
					"Craft",
					fontSmall,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) =>
							c.isRecipeAvailableSelectedFulfilled(entityCrafter.itemHolder())
					), // isEnabled
					addToQueue, // click
					null // ?
				),

				new ControlLabel
				(
					"infoRecipeSelected",
					Coords.fromXY(105, 10), // pos
					Coords.fromXY(75, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
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
					fontSmall
				),

				ControlList.from8
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
								: c.recipeAvailableSelected.itemsIn
							)
					), // items
					DataBinding.fromGet
					(
						(c: Item) =>
						{
							var recipe = itemCrafter.recipeAvailableSelected;
							var itemInAsString =
								"(" + c.quantity + "/"
								+ recipe.itemsIn.find(x => x.defnName == c.defnName).quantity
								+ ")";
							return itemInAsString;
						}
					), // bindingForItemText
					fontSmall,
					null, // bindingForItemSelected
					null // bindingForItemValue
				),

				new ControlLabel
				(
					"labelCrafting",
					Coords.fromXY(105, 50), // pos
					Coords.fromXY(75, 25), // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Crafting:"),
					fontSmall
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(170, 50), // pos
					Coords.fromXY(20, 10), // size
					"Cancel",
					fontSmall,
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
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.recipeProgressAsString(universe)
					),
					fontSmall
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
					fontSmall,
					new DataBinding
					(
						this,
						(c: ItemCrafter) => c.recipeQueuedSelected,
						(c: ItemCrafter, v: CraftingRecipe) =>
							c.recipeQueuedSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c: CraftingRecipe) => c ) // bindingForItemValue
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(100, 125), // pos
					Coords.fromXY(200, 15), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this,
						(c: ItemCrafter) => c.statusMessage
					), // text
					fontSmall
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
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Craft"),
					fontLarge
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
					fontSmall,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
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

	// Clonable.

	clone(): ItemCrafter
	{
		return new ItemCrafter(ArrayHelper.clone(this.recipesAvailable) );
	}

	overwriteWith(other: ItemCrafter): ItemCrafter { return this; }


	// Equatable

	equals(other: ItemCrafter): boolean { return false; } // todo
}

}
