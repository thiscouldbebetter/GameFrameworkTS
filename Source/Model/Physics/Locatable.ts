
namespace ThisCouldBeBetter.GameFramework
{

export class Locatable extends EntityPropertyBase<Locatable>
{
	loc: Disposition;
	locPrev: Disposition;

	constructor(loc: Disposition)
	{
		super();

		this.loc = loc || Disposition.create();

		this.locPrev = this.loc.clone();
	}

	static create(): Locatable
	{
		return new Locatable(null);
	}

	static default(): Locatable
	{
		return new Locatable(Disposition.default() );
	}

	static fromDisp(disp: Disposition): Locatable
	{
		// "Disposition" used to be named "Location".
		return new Locatable(disp);
	}

	static fromDisposition(disposition: Disposition): Locatable
	{
		// "Disposition" used to be named "Location".
		return new Locatable(disposition);
	}

	static fromLoc(loc: Disposition): Locatable
	{
		return new Locatable(loc);
	}

	static fromPos(pos: Coords): Locatable
	{
		return new Locatable(Disposition.fromPos(pos));
	}

	static of(entity: Entity): Locatable
	{
		return entity.propertyByName(Locatable.name) as Locatable;
	}

	approachOtherWithAccelerationAndSpeedMax
	(
		locatableToApproach: Locatable,
		accelerationPerTick: number,
		speedMax: number
	): void
	{
		this.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance
		(
			locatableToApproach,
			accelerationPerTick,
			speedMax
		);
	}

	approachOtherWithAccelerationAndSpeedMaxAndReturnDistance
	(
		locatableToApproach: Locatable,
		accelerationPerTick: number,
		speedMax: number
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
		return this.distanceFromPos(Locatable.of(entity).loc.pos);
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
		var loc = Locatable.of(entityToSpawn).loc;
		loc.overwriteWith(Locatable.of(entitySpawning).loc);
		loc.accel.clear();
		loc.vel.clear();
		place.entitySpawn(uwpe);
		return entityToSpawn;
	}

	pos(): Coords
	{
		return this.loc.pos;
	}

	toEntity(): Entity
	{
		return new Entity(Locatable.name, [ this ] );
	}

	// EntityProperty.

	propertyName(): string { return Locatable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var loc = this.loc;

		this.locPrev.overwriteWith(loc);

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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var placeName = (uwpe.place == null ? null : uwpe.place.name);
		this.loc.placeNameSet(placeName);
	}

	// Equatable

	equals(other: Locatable): boolean
	{
		return this.loc.equals(other.loc);
	}

}

}
