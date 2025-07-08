namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator
	implements EntityProperty<ProjectileGenerator>
{
	name: string;
	projectileGenerations: ProjectileGeneration[];

	constructor
	(
		name: string,
		projectileGenerations: ProjectileGeneration[]
	)
	{
		this.name = name;
		this.projectileGenerations = projectileGenerations;
	}

	static fromNameAndGenerations
	(
		name: string,
		projectileGenerations: ProjectileGeneration[]
	)
	{
		return new ProjectileGenerator
		(
			name, projectileGenerations
		);
	}

	static of(entity: Entity): ProjectileGenerator
	{
		return entity.propertyByName(ProjectileGenerator.name) as ProjectileGenerator;
	}

	static actionFire(): Action
	{
		return new Action
		(
			"Fire",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var place = uwpe.place;
				var entityActor = uwpe.entity;

				var projectileGenerator =
					ProjectileGenerator.of(entityActor);
				var projectileEntities =
					projectileGenerator.projectileEntitiesFromEntityFiring(entityActor);
				place.entitiesToSpawnAdd(projectileEntities);
			}
		)
	}

	projectileEntitiesFromEntityFiring(entityFiring: Entity): Entity[]
	{
		var returnValues = this.projectileGenerations.map
		(
			x => x.projectileEntityFromEntityFiring(entityFiring)
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
