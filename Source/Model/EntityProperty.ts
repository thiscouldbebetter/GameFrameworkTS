
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityProperty
{
	finalize(u: Universe, w: World, p: Place, e: Entity): void
	initialize(u: Universe, w: World, p: Place, e: Entity): void
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void
}

}
