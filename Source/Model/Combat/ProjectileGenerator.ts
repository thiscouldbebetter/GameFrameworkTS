namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator
	extends EntityPropertyBase<ProjectileGenerator>
{
	name: string;
	_fire: (uwpe: UniverseWorldPlaceEntities) => void;
	generations: ProjectileGeneration[];

	constructor
	(
		name: string,
		fire: (uwpe: UniverseWorldPlaceEntities) => void,
		generations: ProjectileGeneration[]
	)
	{
		super();

		this.name = name;
		this._fire = fire || ProjectileGenerator.fireDefault;
		this.generations = generations;
	}

	static default(): ProjectileGenerator
	{
		var projectileGeneration = ProjectileGeneration.default();

		var projectileGenerator = ProjectileGenerator.fromNameFireAndGenerations
		(
			ProjectileGenerator.name,
			ProjectileGenerator.fireDefault,
			[
				projectileGeneration
			]
		);

		return projectileGenerator;
	}

	static fromNameAndGenerations
	(
		name: string,
		generations: ProjectileGeneration[]
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			name, null, generations
		);
	}

	static fromNameFireAndGenerations
	(
		name: string,
		fire: (uwpe: UniverseWorldPlaceEntities) => void,
		generations: ProjectileGeneration[]
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			name, fire, generations
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
			this.actionFire_Perform
		)
	}

	static actionFire_Perform(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityFiring = uwpe.entity;
		var projectileGenerator =
			ProjectileGenerator.of(entityFiring);
		projectileGenerator.fire(uwpe);
	}

	static fireDefault(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entityShooter = uwpe.entity;

		var generator =
			ProjectileGenerator.of(entityShooter);
		var shotEntities =
			generator.toEntitiesFromEntityFiring(entityShooter);
		place.entitiesToSpawnAdd(shotEntities);
	}

	fire(uwpe: UniverseWorldPlaceEntities): void
	{
		this._fire(uwpe);
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

}

}
