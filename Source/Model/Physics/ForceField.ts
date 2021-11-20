
namespace ThisCouldBeBetter.GameFramework
{

export class ForceField implements EntityProperty<ForceField>
{
	accelerationToApply: Coords;
	velocityToApply: Coords;

	constructor(accelerationToApply: Coords, velocityToApply: Coords)
	{
		this.accelerationToApply = accelerationToApply;
		this.velocityToApply = velocityToApply;
	}

	applyToEntity(entityToApplyTo: Entity): void
	{
		var entityLoc = entityToApplyTo.locatable().loc;

		if (this.accelerationToApply != null)
		{
			entityLoc.accel.add(this.accelerationToApply);
		}

		if (this.velocityToApply != null)
		{
			entityLoc.vel.overwriteWith(this.velocityToApply);
		}
	}

	// Clonable.

	clone(): ForceField
	{
		return new ForceField
		(
			this.accelerationToApply == null ? null : this.accelerationToApply.clone(),
			this.velocityToApply = null ? null : this.velocityToApply.clone()
		);
	}

	overwriteWith(other: ForceField): ForceField
	{
		if (this.accelerationToApply != null)
		{
			this.accelerationToApply.overwriteWith(other.accelerationToApply);
		}
		if (this.velocityToApply != null)
		{
			this.velocityToApply.overwriteWith(other.velocityToApply);
		}
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ForceField): boolean { return false; } // todo

}

}
