
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
	clone(): Modellable<TModel> { return this; }
	overwriteWith(other: Modellable<TModel>): Modellable<TModel> { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Modellable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Equatable

	equals(other: Modellable<TModel>): boolean { return false; } // todo

}

}

