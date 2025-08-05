
namespace ThisCouldBeBetter.GameFramework
{

export class ForceField extends EntityPropertyBase<ForceField>
{
	accelerationToApply: Coords;
	velocityToApply: Coords;

	constructor(accelerationToApply: Coords, velocityToApply: Coords)
	{
		super();

		this.accelerationToApply = accelerationToApply;
		this.velocityToApply = velocityToApply;
	}

	static of(entity: Entity): ForceField
	{
		return entity.propertyByName(ForceField.name) as ForceField;
	}

	applyToEntity(entityToApplyTo: Entity): void
	{
		var entityLoc = Locatable.of(entityToApplyTo).loc;

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

}

}
