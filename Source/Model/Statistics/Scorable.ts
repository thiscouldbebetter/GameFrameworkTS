
namespace ThisCouldBeBetter.GameFramework
{

export class Scorable extends EntityPropertyBase<Scorable>
{
	_scoreGet: (uwpe: UniverseWorldPlaceEntities) => number;

	constructor(scoreGet: (uwpe: UniverseWorldPlaceEntities) => number)
	{
		super();

		this._scoreGet = scoreGet;
	}

	static create(): Scorable
	{
		return new Scorable(null);
	}

	static fromPoints(pointsToScore: number): Scorable
	{
		return Scorable.fromScoreGet
		(
			(uwpe: UniverseWorldPlaceEntities) => pointsToScore
		);
	}

	static fromScoreGet(scoreGet: (uwpe: UniverseWorldPlaceEntities) => number): Scorable
	{
		return new Scorable(scoreGet);
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
}

}
