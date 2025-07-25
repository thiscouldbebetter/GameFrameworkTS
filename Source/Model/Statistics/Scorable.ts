
namespace ThisCouldBeBetter.GameFramework
{

export class Scorable implements EntityProperty<Scorable>
{
	_scoreGet: (uwpe: UniverseWorldPlaceEntities) => number;

	constructor(scoreGet: (uwpe: UniverseWorldPlaceEntities) => number)
	{
		this._scoreGet = scoreGet;
	}

	static create(): Scorable
	{
		return new Scorable(null);
	}

	static of(entity: Entity): Scorable
	{
		return entity.propertyByName(Scorable.name) as Scorable;
	}

	scoreGet(uwpe: UniverseWorldPlaceEntities): number
	{
		var score =
			this._scoreGet == null
			? 0
			: this._scoreGet(uwpe);

		return score;
	}

	// Clonable.

	clone(): Scorable
	{
		return new Scorable(this._scoreGet);
	}

	overwriteWith(other: Scorable): Scorable
	{
		this._scoreGet = other._scoreGet;
		return this;
	}

	// Equatable

	equals(other: Scorable): boolean { return false; } // todo

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Scorable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
