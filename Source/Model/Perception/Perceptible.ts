
namespace ThisCouldBeBetter.GameFramework
{

export class Perceptible extends EntityPropertyBase<Perceptible>
{
	isHiding: boolean;
	_visibilityGet: (uwpe: UniverseWorldPlaceEntities) => number;
	_audibilityGet: (uwpe: UniverseWorldPlaceEntities) => number;

	_displacement: Coords;
	_isHidingPrev: boolean;

	constructor
	(
		isHiding: boolean,
		visibilityGet: (uwpe: UniverseWorldPlaceEntities) => number,
		audibilityGet: (uwpe: UniverseWorldPlaceEntities) => number
	)
	{
		super();

		this.isHiding = isHiding;
		this._visibilityGet = visibilityGet;
		this._audibilityGet = audibilityGet;

		this._displacement = Coords.create();
		this._isHidingPrev = null;
	}

	static fromHidingVisibilityGetAndAudibilityGet
	(
		isHiding: boolean,
		visibilityGet: (uwpe: UniverseWorldPlaceEntities) => number,
		audibilityGet: (uwpe: UniverseWorldPlaceEntities) => number
	)
	{
		return new Perceptible(isHiding, visibilityGet, audibilityGet);
	}

	static default(): Perceptible
	{
		return new Perceptible(false, () => 0, () => 0);
	}

	static of(entity: Entity): Perceptible
	{
		return entity.propertyByName(Perceptible.name) as Perceptible;
	}

	audibility(uwpe: UniverseWorldPlaceEntities): number
	{
		return this._audibilityGet(uwpe);
	}

	canBeSeen(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var entityPerceptible = uwpe.entity;
		var entityPerceptor = uwpe.entity2;

		var perceptibleLoc = Locatable.of(entityPerceptible).loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = Locatable.of(entityPerceptor).loc;
		var perceptorPos = perceptorLoc.pos;
		var perceptorForward = perceptorLoc.orientation.forward;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var distanceForward = displacement.dotProduct(perceptorForward);
		var isInSight = false;
		if (distanceForward > 0)
		{
			var visibilityBase = Perceptible.of(entityPerceptible).visibility
			(
				uwpe
			);
			var visibilityAdjusted = visibilityBase / Math.abs(distance);
			var sightThreshold = Perceptor.of(entityPerceptor).sightThreshold;
			isInSight = (visibilityAdjusted >= sightThreshold);
		}
		return isInSight;
	}

	canBeHeard(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var entityPerceptible = uwpe.entity;
		var entityPerceptor = uwpe.entity2;

		var perceptibleLoc = Locatable.of(entityPerceptible).loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = Locatable.of(entityPerceptor).loc;
		var perceptorPos = perceptorLoc.pos;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var audibilityBase =
			Perceptible.of(entityPerceptible).audibility(uwpe);
		var audibilityAdjusted = audibilityBase / (distance * distance);
		var hearingThreshold = Perceptor.of(entityPerceptor).hearingThreshold;
		var isInHearing = (audibilityAdjusted >= hearingThreshold);
		return isInHearing;
	}

	visibility(uwpe: UniverseWorldPlaceEntities): number
	{
		return this._visibilityGet(uwpe);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Perceptible.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isHiding != this._isHidingPrev)
		{
			this._isHidingPrev = this.isHiding;

			var entity = uwpe.entity;
			Drawable.of(entity).hiddenSet(this.isHiding);
			var usable = Usable.of(entity);
			if (usable != null)
			{
				usable.isDisabled = this.isHiding;
			}
		}
	}

	// Clonable.

	clone()
	{
		return new Perceptible(this.isHiding, this.visibility, this.audibility);
	}

	overwriteWith(other: Perceptible)
	{
		this.isHiding = other.isHiding;
		this.visibility = other.visibility;
		this.audibility = other.audibility;
		return this;
	}

	// Equatable

	equals(other: Perceptible): boolean { return false; } // todo

}

}
