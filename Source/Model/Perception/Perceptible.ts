
namespace ThisCouldBeBetter.GameFramework
{

export class Perceptible implements EntityProperty<Perceptible>
{
	isHiding: boolean;
	visibility: (uwpe: UniverseWorldPlaceEntities) => number;
	audibility: (uwpe: UniverseWorldPlaceEntities) => number;

	_displacement: Coords;
	_isHidingPrev: boolean;

	constructor
	(
		isHiding: boolean,
		visibility: (uwpe: UniverseWorldPlaceEntities) => number,
		audibility: (uwpe: UniverseWorldPlaceEntities) => number
	)
	{
		this.isHiding = isHiding;
		this.visibility = visibility;
		this.audibility = audibility;

		this._displacement = Coords.create();
		this._isHidingPrev = null;
	}

	canBeSeen(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var entityPerceptible = uwpe.entity;
		var entityPerceptor = uwpe.entity2;

		var perceptibleLoc = entityPerceptible.locatable().loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = entityPerceptor.locatable().loc;
		var perceptorPos = perceptorLoc.pos;
		var perceptorForward = perceptorLoc.orientation.forward;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var distanceForward = displacement.dotProduct(perceptorForward);
		var isInSight = false;
		if (distanceForward > 0)
		{
			var visibilityBase = entityPerceptible.perceptible().visibility
			(
				uwpe
			);
			var visibilityAdjusted = visibilityBase / Math.abs(distance);
			var sightThreshold = entityPerceptor.perceptor().sightThreshold;
			isInSight = (visibilityAdjusted >= sightThreshold);
		}
		return isInSight;
	}

	canBeHeard(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var entityPerceptible = uwpe.entity;
		var entityPerceptor = uwpe.entity2;

		var perceptibleLoc = entityPerceptible.locatable().loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = entityPerceptor.locatable().loc;
		var perceptorPos = perceptorLoc.pos;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var audibilityBase =
			entityPerceptible.perceptible().audibility(uwpe);
		var audibilityAdjusted = audibilityBase / (distance * distance);
		var hearingThreshold = entityPerceptor.perceptor().hearingThreshold;
		var isInHearing = (audibilityAdjusted >= hearingThreshold);
		return isInHearing;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isHiding != this._isHidingPrev)
		{
			this._isHidingPrev = this.isHiding;

			var entity = uwpe.entity;
			entity.drawable().isVisible = (this.isHiding == false);
			var usable = entity.usable();
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
