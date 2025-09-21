
namespace ThisCouldBeBetter.GameFramework
{

export class EntityGenerator extends EntityPropertyBase<EntityGenerator>
{
	name: string;
	entityToGenerate: Entity;
	ticksPerGenerationAsRange: RangeExtent;
	entitiesPerGenerationAsRange: RangeExtent;
	entitiesToGenerateMaxConcurrent: number;
	entitiesToGenerateMaxAllTime: number;
	entitySpeedAsRange: RangeExtent;
	entityPositionRangeAsBox: BoxAxisAligned;

	entitiesGeneratedAllTimeCount: number;
	entitiesGeneratedActive: Entity[];
	ticksUntilNextGeneration: number

	constructor
	(
		name: string,
		entityToGenerate: Entity,
		ticksPerGenerationAsRange: RangeExtent,
		entitiesPerGenerationAsRange: RangeExtent,
		entitiesToGenerateMaxConcurrent: number,
		entitiesToGenerateMaxAllTime: number,
		entityPositionRangeAsBox: BoxAxisAligned,
		entitySpeedAsRange: RangeExtent
	)
	{
		super();

		this.name = name;
		this.entityToGenerate = entityToGenerate;
		this.ticksPerGenerationAsRange =
			ticksPerGenerationAsRange || RangeExtent.fromNumber(100);
		this.entitiesPerGenerationAsRange =
			entitiesPerGenerationAsRange || RangeExtent.fromNumber(1);
		this.entitiesToGenerateMaxConcurrent =
			entitiesToGenerateMaxConcurrent || 1;
		this.entitiesToGenerateMaxAllTime =
			entitiesToGenerateMaxAllTime;
		this.entityPositionRangeAsBox =
			entityPositionRangeAsBox;
		this.entitySpeedAsRange =
			entitySpeedAsRange || RangeExtent.fromNumber(0);

		this.entitiesGeneratedAllTimeCount = 0;
		this.entitiesGeneratedActive = new Array<Entity>();
		this.ticksUntilNextGeneration = null;
	}

	static fromNameEntityTicksBatchMaxesAndPosBox
	(
		name: string,
		entityToGenerate: Entity,
		ticksPerGeneration: number,
		entitiesPerGeneration: number,
		entitiesToGenerateMaxConcurrent: number,
		entitiesToGenerateMaxAllTime: number,
		entityPositionRangeAsBox: BoxAxisAligned 
	): EntityGenerator
	{
		return new EntityGenerator
		(
			name,
			entityToGenerate,
			RangeExtent.fromNumber(ticksPerGeneration),
			RangeExtent.fromNumber(entitiesPerGeneration),
			entitiesToGenerateMaxConcurrent,
			entitiesToGenerateMaxAllTime,
			entityPositionRangeAsBox,
			null
		);
	}

	static of(entity: Entity): EntityGenerator
	{
		return entity.propertyByName(EntityGenerator.name) as EntityGenerator;
	}

	exhaust(): void
	{
		this.entitiesToGenerateMaxAllTime = 0;
	}

	exhausted(): boolean
	{
		var isExhausted =
			this.entitiesToGenerateMaxAllTime != null
			&& this.entitiesGeneratedAllTimeCount >= this.entitiesToGenerateMaxAllTime;

		return isExhausted;
	}

	saturated(): boolean
	{
		return (this.entitiesGeneratedActive.length >= this.entitiesToGenerateMaxConcurrent);
	}

	toEntity(): Entity
	{
		return Entity.fromNameAndProperties(this.name, [ this ] );
	}

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.inactivated || this.exhausted() )
		{
			return;
		}

		var place = uwpe.place;

		this.entitiesGeneratedActive =
			this.entitiesGeneratedActive.filter
			(
				e => place.entityByName(e.name) != null
			);

		var saturated = this.saturated();

		if (saturated == false)
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
					var entityGeneratedPos = entityGeneratedLoc.pos;

					if (this.entityPositionRangeAsBox != null)
					{
						entityGeneratedPos.overwriteWith
						(
							this.entityPositionRangeAsBox
								.pointRandom(randomizer)
						);
					}
					else if (generatorLocatable == null)
					{
						var placeSize = place.size();
						entityGeneratedPos
							.randomize(randomizer)
							.multiply(placeSize);
					}
					else
					{
						entityGeneratedLoc.overwriteWith
						(
							generatorLocatable.loc
						);
					}

					var entityGeneratedSpeed =
						this.entitySpeedAsRange.random(randomizer);
					if (entityGeneratedSpeed > 0)
					{
						var entityGeneratedVel = entityGeneratedLoc.vel;
						Polar
							.create()
							.random(randomizer)
							.overwriteCoords(entityGeneratedVel)
							.multiplyScalar(entityGeneratedSpeed);
					}

					this.entitiesGeneratedActive.push(entityGenerated);
					var uwpe2 = uwpe.clone().entitySet(entityGenerated);
					place.entitySpawn(uwpe2);
					this.entitiesGeneratedAllTimeCount++;
				}
			}
		}
	}

	// Clonable.

	clone(): EntityGenerator
	{
		return new EntityGenerator
		(
			this.name,
			this.entityToGenerate,
			this.ticksPerGenerationAsRange.clone(),
			this.entitiesPerGenerationAsRange.clone(),
			this.entitiesToGenerateMaxConcurrent,
			this.entitiesToGenerateMaxAllTime,
			this.entityPositionRangeAsBox == null ? null : this.entityPositionRangeAsBox.clone(),
			this.entitySpeedAsRange.clone()
		);
	}

	overwriteWith(other: EntityGenerator): EntityGenerator
	{
		this.entityToGenerate =
			other.entityToGenerate; // todo
		this.ticksPerGenerationAsRange
			.overwriteWith(other.ticksPerGenerationAsRange);
		this.entitiesPerGenerationAsRange
			.overwriteWith(other.entitiesPerGenerationAsRange);
		this.entitiesToGenerateMaxConcurrent =
			other.entitiesToGenerateMaxConcurrent;
		this.entitiesToGenerateMaxAllTime =
			other.entitiesToGenerateMaxAllTime;
		this.entityPositionRangeAsBox
			.overwriteWith(other.entityPositionRangeAsBox);
		this.entitySpeedAsRange.overwriteWith(other.entitySpeedAsRange);
		return this;
	}

}

}
