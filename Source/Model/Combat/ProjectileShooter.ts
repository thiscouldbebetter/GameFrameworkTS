namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileShooter
	extends EntityPropertyBase<ProjectileShooter>
{
	name: string;
	generators: ProjectileGenerator[];

	constructor(name: string, generators: ProjectileGenerator[] )
	{
		super();

		this.name = name;
		this.generators = generators;
	}

	static default()
	{
		return ProjectileShooter.fromNameAndGenerator
		(
			ProjectileShooter.name,
			ProjectileGenerator.default()
		);
	}

	static fromNameAndGenerator(name: string, generator: ProjectileGenerator): ProjectileShooter
	{
		return new ProjectileShooter(name, [ generator ] );
	}

	static fromNameAndGenerators(name: string, generators: ProjectileGenerator[] ): ProjectileShooter
	{
		return new ProjectileShooter(name, generators);
	}

	static of(entity: Entity): ProjectileShooter
	{
		return entity.propertyByName(ProjectileShooter.name) as ProjectileShooter;
	}

	collideOnlyWithEntitiesHavingPropertiesNamedSet(values: string[]): ProjectileShooter
	{
		this.generators.forEach
		(
			generator =>
				generator.generations.forEach
				(
					generation =>
						generation.collideOnlyWithEntitiesHavingPropertiesNamedSet(values)
				)
		);

		return this;
	}

	generatorByName(name: string): ProjectileGenerator
	{
		return this.generators.find(x => x.name == name);
	}

	generatorDefault(): ProjectileGenerator
	{
		return this.generators[0];
	}

	// Clonable.

	clone(): ProjectileShooter
	{
		return this;
	}
}

}