
class Locatable
{
	loc: Disposition;

	constructor(loc: Disposition)
	{
		this.loc = loc || new Disposition(null, null, null);
	}

	distanceFromEntity(entity: Entity)
	{
		return this.loc.pos.clone().subtract(entity.locatable().loc.pos).magnitude();
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
	};

	// cloneable

	clone()
	{
		return new Locatable(this.loc.clone());
	};
}
