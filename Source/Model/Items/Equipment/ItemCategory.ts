
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
