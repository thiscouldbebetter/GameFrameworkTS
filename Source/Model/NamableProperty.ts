
namespace ThisCouldBeBetter.GameFramework
{

export class NamableProperty implements EntityProperty<NamableProperty>
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	// Clonable.

	clone(): NamableProperty { return this; }

	overwriteWith(other: NamableProperty): NamableProperty { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: NamableProperty) { return false; }
}

}
