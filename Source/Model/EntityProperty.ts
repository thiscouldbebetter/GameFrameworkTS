
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityPropertyBase extends Equatable<EntityPropertyBase>
{
	finalize(uwpe: UniverseWorldPlaceEntities): void
	initialize(uwpe: UniverseWorldPlaceEntities): void
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
}

export interface EntityProperty<T extends EntityPropertyBase>
	extends Equatable<T>, Clonable<T>
{}

}
