
namespace ThisCouldBeBetter.GameFramework
{

export class EntityGenerator implements EntityProperty<EntityGenerator>
{
	entityToGenerate: Entity;
	ticksPerGenerationAsRange: RangeExtent;
	entitiesPerGenerationAsRange: RangeExtent;
	entitiesGeneratedMax: number;

	entitiesGenerated: Entity[];
	ticksUntilNextGeneration: number

	constructor
	(
		entityToGenerate: Entity,
		ticksPerGenerationAsRange: RangeExtent,
		entitiesPerGenerationAsRange: RangeExtent,
		entitiesGeneratedMax: number
	)
	{
		this.entityToGenerate = entityToGenerate;
		this.ticksPerGenerationAsRange =
			ticksPerGenerationAsRange || new RangeExtent(100, 100);
		this.entitiesPerGenerationAsRange =
			entitiesPerGenerationAsRange || new RangeExtent(1, 1);
		this.entitiesGeneratedMax = entitiesGeneratedMax || 1;

		this.entitiesGenerated = new Array<Entity>();
		this.ticksUntilNextGeneration = null;
	}

	toEntity(): Entity
	{
		return new Entity(EntityGenerator.name, [ this ] );
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;

		var placeEntitiesByName = place.entitiesByName;

		this.entitiesGenerated = this.entitiesGenerated.filter
		(
			e => placeEntitiesByName.has(e.name)
		);

		if (this.entitiesGenerated.length < this.entitiesGeneratedMax)
		{
			var randomizer = uwpe.universe.randomizer;

			if (this.ticksUntilNextGeneration == null)
			{
				this.ticksUntilNextGeneration = Math.round
				(
					this.ticksPerGenerationAsRange.random(randomizer)
				);
			}

			if (this.ticksUntilNextGeneration > 0)
			{
				this.ticksUntilNextGeneration--;
			}
			else
			{
				this.ticksUntilNextGeneration = null;

				var entityForGenerator = uwpe.entity;
				var generatorLocatable = entityForGenerator.locatable();

				var entitiesToGenerateCount = Math.round
				(
					this.entitiesPerGenerationAsRange.random(randomizer)
				);

				for (var i = 0; i < entitiesToGenerateCount; i++)
				{
					var entityGenerated = this.entityToGenerate.clone();
					var entityGeneratedLoc = entityGenerated.locatable().loc;

					if (generatorLocatable == null)
					{
						entityGeneratedLoc.pos.randomize
						(
							randomizer
						).multiply
						(
							place.size
						);
					}
					else
					{
						entityGeneratedLoc.overwriteWith
						(
							generatorLocatable.loc
						);
					}
					this.entitiesGenerated.push(entityGenerated);
					var uwpe2 = uwpe.clone().entitySet(entityGenerated);
					place.entitySpawn(uwpe2);
				}
			}
		}
	}

	// Clonable.

	clone(): EntityGenerator
	{
		return new EntityGenerator
		(
			this.entityToGenerate,
			this.ticksPerGenerationAsRange.clone(),
			this.entitiesPerGenerationAsRange.clone(),
			this.entitiesGeneratedMax
		);
	}

	overwriteWith(other: EntityGenerator): EntityGenerator
	{
		this.entityToGenerate = other.entityToGenerate; // todo
		this.ticksPerGenerationAsRange.overwriteWith(other.ticksPerGenerationAsRange);
		this.entitiesPerGenerationAsRange.overwriteWith(other.entitiesPerGenerationAsRange);
		this.entitiesGeneratedMax = other.entitiesGeneratedMax;
		return this;
	}

	// Equatable

	equals(other: EntityGenerator): boolean { return false; } // todo

}

}
