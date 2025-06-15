
namespace ThisCouldBeBetter.GameFramework
{

export class CraftingRecipe
{
	name: string;
	ticksToComplete: number;
	itemsIn: Item[];
	itemsOut: Item[];

	constructor
	(
		name: string,
		ticksToComplete: number,
		itemsIn: Item[],
		itemsOut: Item[]
	)
	{
		this.name = name;
		this.ticksToComplete = ticksToComplete;
		this.itemsIn = itemsIn;
		this.itemsOut = itemsOut;
	}

	static fromItemsInAndItemOut(itemsIn: Item[], itemOut: Item): CraftingRecipe
	{
		return new CraftingRecipe
		(
			itemOut.defnName,
			0, // ticksToComplete
			itemsIn,
			[ itemOut ]
		);
	}

	isFulfilledByItemHolder(itemHolderStaged: ItemHolder): boolean
	{
		var itemsStaged = itemHolderStaged.items;
		var areAllRequirementsFulfilledSoFar = true;

		for (var i = 0; i < this.itemsIn.length; i++)
		{
			var itemRequired = this.itemsIn[i];
			var itemStaged = itemsStaged.filter
			(
				x => x.defnName == itemRequired.defnName
			)[0];
			var isRequirementFulfilled =
			(
				itemStaged != null
				&& itemStaged.quantity >= itemRequired.quantity
			);

			if (isRequirementFulfilled == false)
			{
				areAllRequirementsFulfilledSoFar = false;
				break;
			}
		}

		return areAllRequirementsFulfilledSoFar;
	}

	nameAndSecondsToCompleteAsString(universe: Universe): string
	{
		return this.name + " (" + this.secondsToComplete(universe) + "s)";
	}

	secondsToComplete(universe: Universe): number
	{
		return (this.ticksToComplete / universe.timerHelper.ticksPerSecond);
	}

	// Cloneable.

	clone(): CraftingRecipe
	{
		return new CraftingRecipe
		(
			this.name, this.ticksToComplete, ArrayHelper.clone(this.itemsIn),
			ArrayHelper.clone(this.itemsOut)
		);
	}

	overwriteWith(other: CraftingRecipe): CraftingRecipe
	{
		this.name = other.name;
		this.ticksToComplete = other.ticksToComplete;
		ArrayHelper.overwriteWith(this.itemsIn, other.itemsIn);
		ArrayHelper.overwriteWith(this.itemsOut, other.itemsOut);
		return this;
	}
}

}
