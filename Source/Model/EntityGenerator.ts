
namespace ThisCouldBeBetter.GameFramework
{

export class EntityGenerator implements EntityProperty<EntityGenerator>
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var place = uwpe.place;
		var entityGenerator = uwpe.entity;

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
				var uwpe2 = uwpe.clone().entitySet(entityGenerated);
				place.entitySpawn(uwpe2);
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

	// Equatable

	equals(other: EntityGenerator): boolean { return false; } // todo

}

}
