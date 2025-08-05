
namespace ThisCouldBeBetter.GameFramework
{

export class Triggerable extends EntityPropertyBase<Triggerable>
{
	triggers: Trigger[];

	constructor(triggers: Trigger[])
	{
		super();

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

	// EntityProperty.

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
