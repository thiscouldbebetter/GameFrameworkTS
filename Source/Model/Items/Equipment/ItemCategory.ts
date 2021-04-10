
namespace ThisCouldBeBetter.GameFramework
{

export class ItemCategory
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
