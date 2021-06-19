
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityProperty
{
	finalize(uwpe: UniverseWorldPlaceEntities): void
	initialize(uwpe: UniverseWorldPlaceEntities): void
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
}

}
