
namespace ThisCouldBeBetter.GameFramework
{

export class EntityGenerator implements EntityProperty<EntityGenerator>
{
	entityToGenerate: Entity;
	ticksPerGenerationAsRange: RangeExtent;
	entitiesPerGenerationAsRange: RangeExtent;
	entitiesGeneratedMax: number;
	entitySpeedAsRange: RangeExtent;

	entitiesGenerated: Entity[];
	ticksUntilNextGeneration: number

	constructor
	(
		entityToGenerate: Entity,
		ticksPerGenerationAsRange: RangeExtent,
		entitiesPerGenerationAsRange: RangeExtent,
		entitiesGeneratedMax: number,
		entitySpeedAsRange: RangeExtent
	)
	{
		this.entityToGenerate = entityToGenerate;
		this.ticksPerGenerationAsRange =
			ticksPerGenerationAsRange || new RangeExtent(100, 100);
		this.entitiesPerGenerationAsRange =
			entitiesPerGenerationAsRange || new RangeExtent(1, 1);
		this.entitiesGeneratedMax = entitiesGeneratedMax || 1;
		this.entitySpeedAsRange =
			entitySpeedAsRange || new RangeExtent(0, 0);

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

	propertyName(): string { return EntityGenerator.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;

		this.entitiesGenerated = this.entitiesGenerated.filter
		(
			e => place.entityByName(e.name) != null
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
				var generatorLocatable = Locatable.of(entityForGenerator);

				var entitiesToGenerateCount = Math.round
				(
					this.entitiesPerGenerationAsRange.random(randomizer)
				);

				for (var i = 0; i < entitiesToGenerateCount; i++)
				{
					var entityGenerated = this.entityToGenerate.clone();
					var entityGeneratedLoc = Locatable.of(entityGenerated).loc;

					if (generatorLocatable == null)
					{
						var placeSize = place.size();
						entityGeneratedLoc.pos.randomize
						(
							randomizer
						).multiply
						(
							placeSize
						);
					}
					else
					{
						entityGeneratedLoc.overwriteWith
						(
							generatorLocatable.loc
						);

						var entityGeneratedSpeed =
							this.entitySpeedAsRange.random(randomizer);
						if (entityGeneratedSpeed > 0)
						{
							var entityGeneratedVel = entityGeneratedLoc.vel;
							Polar.create().random(randomizer).toCoords
							(
								entityGeneratedVel
							).multiplyScalar
							(
								entityGeneratedSpeed
							);
						}
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
			this.entitiesGeneratedMax,
			this.entitySpeedAsRange.clone()
		);
	}

	overwriteWith(other: EntityGenerator): EntityGenerator
	{
		this.entityToGenerate = other.entityToGenerate; // todo
		this.ticksPerGenerationAsRange.overwriteWith(other.ticksPerGenerationAsRange);
		this.entitiesPerGenerationAsRange.overwriteWith(other.entitiesPerGenerationAsRange);
		this.entitiesGeneratedMax = other.entitiesGeneratedMax;
		this.entitySpeedAsRange.overwriteWith(other.entitySpeedAsRange);
		return this;
	}

	// Equatable

	equals(other: EntityGenerator): boolean { return false; } // todo

}

}
