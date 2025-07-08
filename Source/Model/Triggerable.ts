
namespace ThisCouldBeBetter.GameFramework
{

export class Triggerable implements EntityProperty<Triggerable>
{
	triggers: Trigger[];

	constructor(triggers: Trigger[])
	{
		this.triggers = triggers;
	}

	static fromTriggers(triggers: Trigger[]): Triggerable
	{
		return new Triggerable(triggers);
	}

	// Clonable.

	clone(): Triggerable
	{
		return new Triggerable(this.triggers.map(x => x.clone() ) );
	}

	overwriteWith(other: Triggerable): Triggerable
	{
		return this; // todo
	}

	// Equatable

	equals(other: Triggerable): boolean { return false; } // todo

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Triggerable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i < this.triggers.length; i++)
		{
			var trigger = this.triggers[i];
			trigger.updateForTimerTick(uwpe);
		}
	}
}

}
