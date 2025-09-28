namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator
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

	static fromGeneration
	(
		generation: ProjectileGeneration
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			ProjectileGenerator.name, null, [ generation ]
		);
	}

	static fromNameAndGeneration
	(
		name: string,
		generation: ProjectileGeneration
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			name, null, [ generation ]
		);
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

	static fromNameGenerationAndFire
	(
		name: string,
		generation: ProjectileGeneration,
		fire: (uwpe: UniverseWorldPlaceEntities) => void
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			name, fire, [ generation ]
		);
	}

	static fromNameGenerationsAndFire
	(
		name: string,
		generations: ProjectileGeneration[],
		fire: (uwpe: UniverseWorldPlaceEntities) => void
	): ProjectileGenerator
	{
		return new ProjectileGenerator
		(
			name, fire, generations
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

	static actionFire(generatorName: string): Action
	{
		return Action.fromNameAndPerform
		(
			generatorName,
			(uwpe: UniverseWorldPlaceEntities) => this.actionFire_Perform(generatorName, uwpe)
		)
	}

	static actionFire_Perform(generatorName: string, uwpe: UniverseWorldPlaceEntities): void
	{
		var entityFiring = uwpe.entity;
		var projectileShooter =
			ProjectileShooter.of(entityFiring);
		var projectileGenerator = projectileShooter.generatorByName(generatorName);
		projectileGenerator.fire(uwpe);
	}

	static fireDefault(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entityShooter = uwpe.entity;

		var shooter =
			ProjectileShooter.of(entityShooter);
		var generator = shooter.generatorDefault();
		var shotEntities =
			generator.toEntitiesFromEntityFiring(entityShooter);
		place.entitiesToSpawnAdd(shotEntities);
	}

	static fireGeneratorByName(generatorName: string, uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entityShooter = uwpe.entity;

		var shooter =
			ProjectileShooter.of(entityShooter);
		var generator = shooter.generatorByName(generatorName);
		var shotEntities =
			generator.toEntitiesFromEntityFiring(entityShooter);
		place.entitiesToSpawnAdd(shotEntities);
	}

	fire(uwpe: UniverseWorldPlaceEntities): void
	{
		this._fire(uwpe);
	}

	range(): number
	{
		var generation0Range = this.generations[0].range();
		return generation0Range;
	}

	toEntitiesFromEntityFiring(entityFiring: Entity): Entity[]
	{
		var returnValues = this.generations.map
		(
			x => x.toEntityFromEntityFiring(entityFiring)
		);
		return returnValues;
	}

}

}
