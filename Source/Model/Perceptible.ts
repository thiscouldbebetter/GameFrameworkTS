
class Perceptible extends EntityProperty
{
	isHiding: boolean;
	visibility: (u: Universe, w: World, p: Place, e: Entity) => number;
	audibility: (u: Universe, w: World, p: Place, e: Entity) => number;

	_displacement: Coords;
	_isHidingPrev: boolean;

	constructor
	(
		isHiding: boolean,
		visibility: (u: Universe, w: World, p: Place, e: Entity) => number,
		audibility: (u: Universe, w: World, p: Place, e: Entity) => number
	)
	{
		super();

		this.isHiding = isHiding;
		this.visibility = visibility;
		this.audibility = audibility;

		this._displacement = new Coords(0, 0, 0);
		this._isHidingPrev = null;
	}

	canBeSeen(u: Universe, w: World, p: Place, entityPerceptible: Entity, entityPerceptor: Entity)
	{
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
				u, w, p, entityPerceptible
			);
			var visibilityAdjusted = visibilityBase / Math.abs(distance);
			var sightThreshold = entityPerceptor.perceptor().sightThreshold;
			isInSight = (visibilityAdjusted >= sightThreshold);
		}
		return isInSight;
	}

	canBeHeard(u: Universe, w: World, p: Place, entityPerceptible: Entity, entityPerceptor: Entity)
	{
		var perceptibleLoc = entityPerceptible.locatable().loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = entityPerceptor.locatable().loc;
		var perceptorPos = perceptorLoc.pos;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var audibilityBase = entityPerceptible.perceptible().audibility
		(
			u, w, p, entityPerceptible
		);
		var audibilityAdjusted = audibilityBase / (distance * distance);
		var hearingThreshold = entityPerceptor.perceptor().hearingThreshold;
		var isInHearing = (audibilityAdjusted >= hearingThreshold);
		return isInHearing;
	}

	updateForTimerTick(u: Universe, w: World, p: Place, entity: Entity)
	{
		if (this.isHiding != this._isHidingPrev)
		{
			this._isHidingPrev = this.isHiding;

			if (this.isHiding)
			{
				entity.drawable().isVisible = false;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = true;
				}
			}
			else
			{
				entity.drawable().isVisible = true;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = false;
				}
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
}
