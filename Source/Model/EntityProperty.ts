
namespace ThisCouldBeBetter.GameFramework
{

export interface EntityPropertyBase
	extends Equatable<EntityPropertyBase>, Clonable<EntityPropertyBase>
{
	finalize(uwpe: UniverseWorldPlaceEntities): void;
	initialize(uwpe: UniverseWorldPlaceEntities): void;
	propertyName(): string;
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void;
}

export interface EntityProperty<T extends EntityPropertyBase>
	extends Equatable<T>, Clonable<T>
{}

}
