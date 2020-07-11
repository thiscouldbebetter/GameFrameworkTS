
class Generator
{
	entityToGenerate: Entity;
	ticksToGenerate: number;
	entitiesGeneratedMax: number;

	entitiesGenerated: Entity[];
	tickLastGenerated: number

	constructor(entityToGenerate: Entity, ticksToGenerate: number, entitiesGeneratedMax: number)
	{
		this.entityToGenerate = entityToGenerate;
		this.ticksToGenerate = ticksToGenerate;
		this.entitiesGeneratedMax = entitiesGeneratedMax || 1;

		this.entitiesGenerated = new Array<Entity>();
		this.tickLastGenerated = 0 - this.ticksToGenerate;
	}

	finalize(u: Universe, w: World, p: Place, e: Entity) {}
	initialize(u: Universe, w: World, p: Place, e: Entity) {}

	updateForTimerTick(u: Universe, world: World, place: Place, entityGenerator: Entity)
	{
		var placeEntitiesByName = place.entitiesByName;
		var entitiesGeneratedButNoLongerExtant =
			this.entitiesGenerated.filter(e => placeEntitiesByName.has(e.name) == false);
		entitiesGeneratedButNoLongerExtant.forEach
		(
			e => this.entitiesGenerated.splice(this.entitiesGenerated.indexOf(e), 1)
		);

		if (this.entitiesGenerated.length < this.entitiesGeneratedMax)
		{
			var ticksSinceGenerated = world.timerTicksSoFar - this.tickLastGenerated;
			if (ticksSinceGenerated >= this.ticksToGenerate)
			{
				this.tickLastGenerated = world.timerTicksSoFar;
				var entityGenerated = this.entityToGenerate.clone();
				entityGenerated.locatable().loc.overwriteWith
				(
					entityGenerator.locatable().loc
				);
				this.entitiesGenerated.push(entityGenerated);
				place.entitiesToSpawn.push(entityGenerated);
			}
		}
	}

	// Clonable.

	clone()
	{
		return new Generator
		(
			this.entityToGenerate, this.ticksToGenerate, this.entitiesGeneratedMax
		);
	}

	overwriteWith(other: Generator)
	{
		this.entityToGenerate = other.entityToGenerate; // todo
		this.ticksToGenerate = other.ticksToGenerate;
		this.entitiesGeneratedMax = other.entitiesGeneratedMax;
		return this;
	}
}
