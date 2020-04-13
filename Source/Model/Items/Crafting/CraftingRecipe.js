
class CraftingRecipe
{
	constructor(name, itemsIn, itemEntitiesOut)
	{
		this.name = name;
		this.itemsIn = itemsIn;
		this.itemEntitiesOut = itemEntitiesOut;
	}

	isFulfilledByItemEntities(itemEntitiesStaged)
	{
		var areAllRequirementsFulfilledSoFar = true;

		for (var i = 0; i < this.itemsIn.length; i++)
		{
			var itemRequired = this.itemsIn[i];
			var itemEntityStaged = itemEntitiesStaged.filter
			(
				x => x.item.defnName == itemRequired.defnName
			)[0];
			var isRequirementFulfilled =
				(itemEntityStaged != null && itemEntityStaged.item.quantity >= itemRequired.quantity);

			if (isRequirementFulfilled == false)
			{
				areAllRequirementsFulfilledSoFar = false;
				break;
			}
		}

		return areAllRequirementsFulfilledSoFar;
	};

	// Cloneable.

	clone()
	{
		return new CraftingRecipe
		(
			this.name, this.itemsIn.clone(), this.itemEntitiesOut.clone()
		);
	}
}
