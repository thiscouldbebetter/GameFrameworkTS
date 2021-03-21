
namespace ThisCouldBeBetter.GameFramework
{

export interface Constraint 
{
	constrain: (universe: Universe, world: World, place: Place, entity: Entity) => void;
}

export class Constraint_None implements Constraint
{
	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		// Do nothing.
	}
}

export class Constraint_AttachToEntityWithName implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe: Universe, world: World, place: Place, entityToConstrain: Entity)
	{
		var targetEntityName = this.targetEntityName;
		var targetEntity = place.entitiesByName.get(targetEntityName);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}

export class Constraint_Conditional implements Constraint
{
	shouldChildApply: (u: Universe, w: World, p: Place, e: Entity) => boolean;
	child: Constraint;

	constructor(shouldChildApply: (u: Universe, w: World, p: Place, e: Entity) => boolean, child: Constraint)
	{
		this.shouldChildApply = shouldChildApply;
		this.child = child;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var willChildApply = this.shouldChildApply(universe, world, place, entity);
		if (willChildApply)
		{
			this.child.constrain(universe, world, place, entity);
		}
	}
}

export class Constraint_ContainInBox implements Constraint
{
	boxToContainWithin: Box;

	constructor(boxToContainWithin: Box)
	{
		this.boxToContainWithin = boxToContainWithin;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.boxToContainWithin.trimCoords(entity.locatable().loc.pos);
	}
}

export class Constraint_ContainInHemispace implements Constraint
{
	hemispaceToContainWithin: Hemispace;
	_coordsTemp: Coords;

	constructor(hemispaceToContainWithin: Hemispace)
	{
		this.hemispaceToContainWithin = hemispaceToContainWithin;

		this._coordsTemp = Coords.create();
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var hemispace = this.hemispaceToContainWithin;
		var plane = hemispace.plane;
		var loc = entity.locatable().loc;
		var pos = loc.pos;

		// Can't use Hemispace.trimCoords(),
		// because we also need to trim velocity and acceleration.
		var distanceOfPointAbovePlane =
			plane.distanceToPointAlongNormal(pos);
		var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
		if (areCoordsOutsideHemispace)
		{
			var planeNormal = plane.normal;
			pos.subtract
			(
				this._coordsTemp.overwriteWith
				(
					planeNormal
				).multiplyScalar
				(
					distanceOfPointAbovePlane
				)
			);

			var vel = loc.vel;
			var speedAlongNormal = vel.dotProduct(planeNormal);
			if (speedAlongNormal > 0)
			{
				vel.subtract
				(
					this._coordsTemp.overwriteWith
					(
						planeNormal
					).multiplyScalar
					(
						speedAlongNormal
					)
				);
			}

			var accel = loc.accel;
			var accelerationAlongNormal = accel.dotProduct(planeNormal);
			if (accelerationAlongNormal > 0)
			{
				accel.subtract
				(
					this._coordsTemp.overwriteWith
					(
						planeNormal
					).multiplyScalar
					(
						accelerationAlongNormal
					)
				);
			}
		}
	}
}

export class Constraint_FrictionXY implements Constraint
{
	target: number;
	speedBelowWhichToStop: number;

	constructor(target: number, speedBelowWhichToStop: number)
	{
		this.target = target;
		this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetFrictionCoefficient = this.target;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var entityVelZSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed < this.speedBelowWhichToStop)
		{
			entityVel.clear();
		}
		else
		{
			var frictionMagnitude = speed * targetFrictionCoefficient;
			entityVel.add
			(
				entityVel.clone().multiplyScalar(-frictionMagnitude)
			);
		}
		entityVel.z = entityVelZSaved;
	}
}

export class Constraint_FrictionDry implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetFrictionCoefficient = this.target;
		var frictionMagnitude = targetFrictionCoefficient;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var entitySpeed = entityVel.magnitude();
		if (entitySpeed <= frictionMagnitude)
		{
			entityVel.clear();
		}
		else
		{
			var entityDirection = entityVel.clone().normalize();
			entityVel.add
			(
				entityDirection.multiplyScalar(-frictionMagnitude)
			);
		}
	}
}

export class Constraint_Gravity implements Constraint
{
	accelerationPerTick: Coords;

	constructor(accelerationPerTick: Coords)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var loc = entity.locatable().loc;
		if (loc.pos.z < 0) // hack
		{
			loc.accel.add(this.accelerationPerTick);
		}
	}
}

export class Constraint_Offset implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetOffset = this.target;
		entity.locatable().loc.pos.add(targetOffset);
	}
}

export class Constraint_OrientToward implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetEntityName = this.targetEntityName;

		var constrainableLoc = entity.locatable().loc;
		var constrainablePos = constrainableLoc.pos;
		var constrainableOrientation = constrainableLoc.orientation;
		var constrainableForward = constrainableOrientation.forward;

		var target = place.entitiesByName.get(targetEntityName);
		var targetPos = target.locatable().loc.pos;

		constrainableForward.overwriteWith
		(
			targetPos
		).subtract
		(
			constrainablePos
		).normalize();

		constrainableOrientation.forwardSet(constrainableForward);
	}
}

export class Constraint_SpeedMaxXY implements Constraint
{
	targetSpeedMax: number;

	constructor(targetSpeedMax: number)
	{
		this.targetSpeedMax = targetSpeedMax;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSpeedMax = this.targetSpeedMax;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var zSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed > targetSpeedMax)
		{
			entityVel.normalize().multiplyScalar(targetSpeedMax);
		}
		entityVel.z = zSaved;
	}
}

export class Constraint_StopBelowSpeedMin implements Constraint
{
	target: number;

	constructor(target: number)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSpeedMin = this.target;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		if (speed < targetSpeedMin)
		{
			entityVel.clear();
		}
	}
}

export class Constraint_TrimToRange implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetSize = this.target;
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.trimToRangeMax(targetSize);
	}
}

export class Constraint_WrapToRange implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var targetRange = this.target;
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.wrapToRangeMax(targetRange);
	}
}

export class Constraint_WrapXTrimY implements Constraint
{
	target: Coords;

	constructor(target: Coords)
	{
		this.target = target;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;
		var max = this.target;

		while (entityPos.x < 0)
		{
			entityPos.x += max.x;
		}
		while (entityPos.x >= max.x)
		{
			entityPos.x -= max.x;
		}

		if (entityPos.y < 0)
		{
			entityPos.y = 0;
		}
		else if (entityPos.y > max.y)
		{
			entityPos.y = max.y;
		}
	}
}

}
