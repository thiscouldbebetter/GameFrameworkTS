
namespace ThisCouldBeBetter.GameFramework
{

export class EntityGenerator implements EntityProperty
{
	entityToGenerate: Entity;
	ticksToGenerate: number;
	entitiesGeneratedMax: number;

	entitiesGenerated: Entity[];
	tickLastGenerated: number

	constructor
	(
		entityToGenerate: Entity, ticksToGenerate: number,
		entitiesGeneratedMax: number
	)
	{
		this.entityToGenerate = entityToGenerate;
		this.ticksToGenerate = ticksToGenerate;
		this.entitiesGeneratedMax = entitiesGeneratedMax || 1;

		this.entitiesGenerated = new Array<Entity>();
		this.tickLastGenerated = 0 - this.ticksToGenerate;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entityGenerator: Entity
	): void
	{
		var placeEntitiesByName = place.entitiesByName;

		var entitiesGeneratedCountBefore = this.entitiesGenerated.length;
		this.entitiesGenerated = this.entitiesGenerated.filter
		(
			e => placeEntitiesByName.has(e.name)
		);
		var entitiesGeneratedCountAfter = this.entitiesGenerated.length;
		if (entitiesGeneratedCountAfter < entitiesGeneratedCountBefore)
		{
			this.tickLastGenerated = world.timerTicksSoFar;
		}

		if (this.entitiesGenerated.length < this.entitiesGeneratedMax)
		{
			var ticksSinceGenerated =
				world.timerTicksSoFar - this.tickLastGenerated;
			if (ticksSinceGenerated >= this.ticksToGenerate)
			{
				this.tickLastGenerated = world.timerTicksSoFar;
				var entityGenerated = this.entityToGenerate.clone();
				entityGenerated.locatable().loc.overwriteWith
				(
					entityGenerator.locatable().loc
				);
				this.entitiesGenerated.push(entityGenerated);
				place.entitySpawn(universe, world, entityGenerated);
			}
		}
	}

	// Clonable.

	clone(): EntityGenerator
	{
		return new EntityGenerator
		(
			this.entityToGenerate, this.ticksToGenerate, this.entitiesGeneratedMax
		);
	}

	overwriteWith(other: EntityGenerator): EntityGenerator
	{
		this.entityToGenerate = other.entityToGenerate; // todo
		this.ticksToGenerate = other.ticksToGenerate;
		this.entitiesGeneratedMax = other.entitiesGeneratedMax;
		return this;
	}
}

}
