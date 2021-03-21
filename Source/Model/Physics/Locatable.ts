
namespace ThisCouldBeBetter.GameFramework
{

export class Locatable extends EntityProperty
{
	loc: Disposition;

	constructor(loc: Disposition)
	{
		super();
		this.loc = loc || Disposition.blank();
	}

	static fromPos(pos: Coords)
	{
		return new Locatable(Disposition.fromPos(pos));
	}

	approachOtherWithAccelerationAndSpeedMax
	(
		locatableToApproach: Locatable,
		accelerationPerTick: number,
		speedMax: number// ,distanceMin: number
	)
	{
		accelerationPerTick = accelerationPerTick || .1;
		speedMax = speedMax || 1;
		//distanceMin = distanceMin || 1;

		var targetLoc = locatableToApproach.loc;
		var targetPos = targetLoc.pos;

		var actorLoc = this.loc;
		var actorPos = actorLoc.pos;
		var actorOri = actorLoc.orientation;
		var actorVel = actorLoc.vel;

		var targetPosRelative = targetPos.clone().subtract(actorPos);
		var distanceToTarget = targetPosRelative.magnitude();

		/*
		if (distanceToTarget <= distanceMin)
		{
			distanceToTarget = 0;
			actorPos.overwriteWith(targetPos);
		}
		else
		{
		*/

			actorVel.trimToMagnitudeMax(speedMax);

			// hack
			var ticksToApproach = Math.sqrt(2 * distanceToTarget / accelerationPerTick);
			var targetVelRelative = targetLoc.vel.clone().subtract(actorVel);
			var targetPosRelativeProjected = targetVelRelative.multiplyScalar
			(
				ticksToApproach
			).add
			(
				targetPosRelative
			);

			actorLoc.accel.overwriteWith
			(
				targetPosRelativeProjected
			).normalize().multiplyScalar(accelerationPerTick).clearZ();

			actorOri.forwardSet(actorLoc.accel.clone().normalize());
		//}

		return distanceToTarget;
	}

	distanceFromEntity(entity: Entity)
	{
		return this.distanceFromPos(entity.locatable().loc.pos);
	}

	distanceFromPos(posToCheck: Coords)
	{
		return this.loc.pos.clone().subtract(posToCheck).magnitude();
	}

	entitySpawnWithDefnName(universe: Universe, world: World, place: Place, entitySpawning: Entity, entityToSpawnDefnName: string)
	{
		var entityDefns = world.defn.entityDefnsByName();
		var entityDefnToSpawn = entityDefns.get(entityToSpawnDefnName);
		var entityToSpawn = entityDefnToSpawn.clone();
		var loc = entityToSpawn.locatable().loc;
		loc.overwriteWith(entitySpawning.locatable().loc);
		loc.accel.clear();
		loc.vel.clear();
		place.entitySpawn(universe, world, entityToSpawn);
		return entityToSpawn;
	}

	// EntityProperty.

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var loc = this.loc;

		loc.vel.add(loc.accel);
		loc.accel.clear();
		loc.pos.add(loc.vel);

		var spin = loc.spin;
		if (spin.angleInTurns() != 0)
		{
			loc.spin.transformOrientation(loc.orientation);
		}
	}

	// Clonable.

	clone()
	{
		return new Locatable(this.loc.clone());
	}
}

}
