
class ItemCrafter
{
	constructor(recipes)
	{
		this.recipes = recipes || [];

		this.recipeSelected = null;
		this.itemEntitiesStaged = [];
	}

	isRecipeSelectedFulfilled()
	{
		var returnValue =
		(
			this.recipeSelected == null
			? false
			: this.recipeSelected.isFulfilledByItemEntities(this.itemEntitiesStaged)
		);

		return returnValue;
	};

	// controls

	toControl(universe, size, entityItemHolder, venuePrev, includeTitle)
	{
		this.statusMessage = "1. Select recipe.\n2. Stage materials.\n3.Click Combine.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 150, 1);
		var scaleMultiplier = size.clone().divide(sizeBase);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = entityItemHolder.itemHolder;
		var itemEntities = itemHolder.itemEntities;
		var crafter = this;
		var world = universe.world;

		var back = function()
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var stage = function()
		{
			var itemEntityToStage = crafter.itemEntitySelected;
			if (itemEntityToStage != null)
			{
				var itemEntitiesStaged = crafter.itemEntitiesStaged;
				if (itemEntitiesStaged.contains(itemEntityToStage) == false)
				{
					itemEntitiesStaged.push(itemEntityToStage);
				}
			}
		};

		var unstage = function()
		{
			var itemEntityToUnstage = crafter.itemEntityStagedSelected;
			if (itemEntityToUnstage != null)
			{
				var itemEntitiesStaged = crafter.itemEntitiesStaged;
				if (itemEntitiesStaged.contains(itemEntityToUnstage))
				{
					itemEntitiesStaged.remove(itemEntityToUnstage);
				}
			}
		};

		var combine = function()
		{
			var recipe = crafter.recipeSelected;

			var itemsIn = recipe.itemsIn;
			for (var i = 0; i < itemsIn.length; i++)
			{
				var itemIn = itemsIn[i];
				itemHolder.itemSubtract(itemIn);
			}

			var itemEntitiesOut = recipe.itemEntitiesOut;
			for (var i = 0; i < itemEntitiesOut.length; i++)
			{
				var itemEntityOut = itemEntitiesOut[i];
				itemHolder.itemEntityAdd(itemEntityOut);
			}
			crafter.itemEntitiesStaged.clear();
		};

		var returnValue = new ControlContainer
		(
			"Crafting",
			new Coords(0, 0), // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelMaterials",
					new Coords(10, 20), // pos
					new Coords(70, 25), // size
					false, // isTextCentered
					"Materials Held:",
					fontHeightSmall
				),

				new ControlList
				(
					"listItemsHeld",
					new Coords(10, 30), // pos
					new Coords(80, 110), // size
					new DataBinding(itemEntities), // items
					new DataBinding
					(
						null,
						function get(c) { return c.item.toString(world); }
					), // bindingForItemText
					fontHeightSmall,
					new DataBinding
					(
						this,
						function get(c) { return c.itemEntitySelected; },
						function set(c, v) { c.itemEntitySelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
					true, // isEnabled
					function confirm(context, universe)
					{
						stage();
					}
				),

				new ControlButton
				(
					"buttonStage",
					new Coords(95, 80), // pos
					new Coords(10, 10), // size
					">",
					fontHeightSmall,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c)
						{
							var returnValue =
							(
								c.itemEntitySelected != null
								&& c.itemEntitiesStaged.contains(c.itemEntitySelected) == false
							);
							return returnValue;
						}
					), // isEnabled
					stage, // click
					universe // context
				),

				new ControlButton
				(
					"buttonUnstage",
					new Coords(95, 95), // pos
					new Coords(10, 10), // size
					"<",
					fontHeightSmall,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c)
						{
							return (c.itemEntityStagedSelected != null);
						}
					), // isEnabled
					unstage, // click
					universe // context
				),

				new ControlLabel
				(
					"labelRecipe",
					new Coords(110, 20), // pos
					new Coords(70, 25), // size
					false, // isTextCentered
					"Recipe:",
					fontHeightSmall
				),

				new ControlSelect
				(
					"selectRecipe",
					new Coords(110, 30), // pos
					new Coords(80, 10), // size
					new DataBinding
					(
						this,
						function get(c) { return c.recipeSelected; },
						function set(c, v) { c.recipeSelected = v; }
					), // valueSelected
					this.recipes, // options
					new DataBinding
					(
						null, function get(c) { return c; } // hack
					), // bindingForOptionValues
					new DataBinding
					(
						null, function get(c) { return c.name; }
					), // bindingForOptionText
					fontHeightSmall
				),

				new ControlList
				(
					"listItemsInRecipe",
					new Coords(110, 40), // pos
					new Coords(80, 25), // size
					new DataBinding
					(
						this,
						function get(c)
						{
							return (c.recipeSelected == null ? [] : c.recipeSelected.itemsIn);
						}
					), // items
					new DataBinding
					(
						null,
						function get(c) { return c.toString(world); }
					), // bindingForItemText
					fontHeightSmall,
					null, // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlButton
				(
					"buttonCombine",
					new Coords(110, 70), // pos
					new Coords(30, 10), // size
					"Combine:",
					fontHeightSmall,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c)
						{
							return (c.isRecipeSelectedFulfilled());
						}
					), // isEnabled
					combine // click
				),

				new ControlList
				(
					"listItemsStaged",
					new Coords(110, 80), // pos
					new Coords(80, 25), // size
					new DataBinding
					(
						this,
						function get(c) { return c.itemEntitiesStaged; }
					), // items
					new DataBinding
					(
						null,
						function get(c)
						{
							return c.item.toString(world);
						}
					), // bindingForItemText
					fontHeightSmall,
					new DataBinding
					(
						this,
						function get(c) { return c.itemEntityStagedSelected; },
						function set(c, v) { c.itemEntityStagedSelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, function(c) { return c; } ), // bindingForItemValue
				),

				new ControlLabel
				(
					"infoStatus",
					new Coords(150, 110), // pos
					new Coords(200, 15), // size
					true, // isTextCentered
					new DataBinding
					(
						this,
						function get(c)
						{
							return c.statusMessage;
						}
					), // text
					fontHeightSmall
				),

				new ControlButton
				(
					"buttonDone",
					new Coords(170, 130), // pos
					new Coords(20, 10), // size
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back
				)
			], // end children

			[
				new Action("Back", back),
			],

			[
				new ActionToInputsMapping("Back", [ universe.inputHelper.inputNames.Escape ], true ),
			]
		);

		if (includeTitle)
		{
			returnValue.children.insertElementAt
			(
				new ControlLabel
				(
					"labelCrafting",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Crafting",
					fontHeightLarge
				),
				0 // indexToInsertAt
			);
		}
		else
		{
			var titleHeightInverted = new Coords(0, -15);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	// cloneable

	clone()
	{
		return new ItemCrafter(this.recipes.clone());
	};
}
