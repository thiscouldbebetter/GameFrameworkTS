namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator
	implements EntityProperty<ProjectileGenerator>
{
	name: string;
	generations: ProjectileGeneration[];

	constructor
	(
		name: string,
		generations: ProjectileGeneration[]
	)
	{
		this.name = name;
		this.generations = generations;
	}

	static fromNameAndGenerations
	(
		name: string,
		generations: ProjectileGeneration[]
	)
	{
		return new ProjectileGenerator
		(
			name, generations
		);
	}

	static of(entity: Entity): ProjectileGenerator
	{
		return entity.propertyByName(ProjectileGenerator.name) as ProjectileGenerator;
	}

	static actionFire(): Action
	{
		return Action.fromNameAndPerform
		(
			"Fire",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var place = uwpe.place;
				var entityShooter = uwpe.entity;

				var generator =
					ProjectileGenerator.of(entityShooter);
				var shotEntities =
					generator.toEntitiesFromEntityFiring(entityShooter);
				place.entitiesToSpawnAdd(shotEntities);
			}
		)
	}

	toEntitiesFromEntityFiring(entityFiring: Entity): Entity[]
	{
		var returnValues = this.generations.map
		(
			x => x.toEntityFromEntityFiring(entityFiring)
		);
		return returnValues;
	}

	// Clonable.
	clone(): ProjectileGenerator { return this; }
	overwriteWith(other: ProjectileGenerator): ProjectileGenerator { return this; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return ProjectileGenerator.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ProjectileGenerator): boolean { return false; } // todo

}

}
