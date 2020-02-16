
function ItemCrafter(recipes)
{
	this.recipes = recipes || [];

	this.recipeSelected = null;
	this.itemEntitiesStaged = [];
}
{
	ItemCrafter.prototype.isRecipeSelectedFulfilled = function()
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

	ItemCrafter.prototype.toControl = function(universe, size, entityItemHolder, venuePrev)
	{
		this.statusMessage = "-";

		if (size == null)
		{
			size = universe.display.sizeDefault();
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
			"containerCrafter",
			Coords.Instances().Zeroes, // pos
			sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelCrafting",
					new Coords(100, 10), // pos
					new Coords(100, 25), // size
					true, // isTextCentered
					"Crafting",
					fontHeightLarge
				),

				new ControlList
				(
					"listItemsHeld",
					new Coords(10, 25), // pos
					new Coords(80, 115), // size
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
				),

				new ControlButton
				(
					"buttonStage",
					new Coords(95, 75), // pos
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
					new Coords(95, 90), // pos
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

				new ControlSelect
				(
					"selectRecipe",
					new Coords(110, 25), // pos
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

				new ControlList
				(
					"listItemsStaged",
					new Coords(110, 70), // pos
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

				new ControlButton
				(
					"buttonCombine",
					new Coords(135, 100), // pos
					new Coords(30, 10), // size
					"Combine",
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

				new ControlLabel
				(
					"infoStatus",
					new Coords(150, 115), // pos
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
					new Coords(160, 130), // pos
					new Coords(30, 10), // size
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

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	};

	// cloneable

	ItemCrafter.prototype.clone = function()
	{
		return new ItemCrafter(this.recipes.clone());
	};
}