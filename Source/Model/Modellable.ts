
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

	// Clonable.
	clone(): Modellable<TModel> { throw new Error("Not yet implemented."); }
	overwriteWith(other: Modellable<TModel>): Modellable<TModel> { throw new Error("Not yet implemented."); }

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

