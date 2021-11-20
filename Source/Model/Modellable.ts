
namespace ThisCouldBeBetter.GameFramework
{

export interface ModellableBase extends EntityPropertyBase
{}

export class Modellable<TModel> implements EntityProperty<Modellable<TModel>>
{
	model: TModel;

	constructor(model: TModel)
	{
		this.model = model;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Equatable

	equals(other: Modellable<TModel>): boolean { return false; } // todo

}

}

