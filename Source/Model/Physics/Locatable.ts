
namespace ThisCouldBeBetter.GameFramework
{

export class Locatable implements EntityProperty<Locatable>
{
	loc: Disposition;

	constructor(loc: Disposition)
	{
		this.loc = loc || Disposition.create();
	}

	static create(): Locatable
	{
		return new Locatable(null);
	}

	static fromPos(pos: Coords): Locatable
	{
		return new Locatable(Disposition.fromPos(pos));
	}

	approachOtherWithAccelerationAndSpeedMaxAndReturnDistance
	(
		locatableToApproach: Locatable,
		accelerationPerTick: number,
		speedMax: number// ,distanceMin: number
	): number
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

		actorVel.trimToMagnitudeMax(speedMax);

		// hack
		var ticksToApproach =
			Math.sqrt(2 * distanceToTarget / accelerationPerTick);
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

		return distanceToTarget;
	}

	distanceFromEntity(entity: Entity): number
	{
		return this.distanceFromPos(entity.locatable().loc.pos);
	}

	distanceFromPos(posToCheck: Coords): number
	{
		return this.loc.pos.clone().subtract(posToCheck).magnitude();
	}

	entitySpawnWithDefnName
	(
		uwpe: UniverseWorldPlaceEntities, entityToSpawnDefnName: string
	): Entity
	{
		var world = uwpe.world;
		var place = uwpe.place;
		var entitySpawning = uwpe.entity;

		var entityDefnToSpawn =
			world.defn.entityDefnByName(entityToSpawnDefnName);
		var entityToSpawn = entityDefnToSpawn.clone();
		var loc = entityToSpawn.locatable().loc;
		loc.overwriteWith(entitySpawning.locatable().loc);
		loc.accel.clear();
		loc.vel.clear();
		place.entitySpawn(uwpe);
		return entityToSpawn;
	}

	toEntity(): Entity
	{
		return new Entity(Locatable.name, [ this ] );
	}

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
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

	clone(): Locatable
	{
		return new Locatable(this.loc.clone());
	}

	overwriteWith(other: Locatable): Locatable
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.loc.placeName = (uwpe.place == null ? null : uwpe.place.name);
	}

	// Equatable

	equals(other: Locatable): boolean
	{
		return this.loc.equals(other.loc);
	}

}

}
