
namespace ThisCouldBeBetter.GameFramework
{

export class NamableProperty extends EntityPropertyBase<NamableProperty>
{
	name: string;

	constructor(name: string)
	{
		super();

		this.name = name;
	}

	static of(entity: Entity): NamableProperty
	{
		return entity.propertyByName(NamableProperty.name) as NamableProperty;
	}

	// Clonable.

	clone(): NamableProperty { return this; }

	overwriteWith(other: NamableProperty): NamableProperty { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return NamableProperty.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: NamableProperty) { return false; }
}

}
