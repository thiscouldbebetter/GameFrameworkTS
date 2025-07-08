namespace ThisCouldBeBetter.GameFramework
{

export class Trigger
{
	name: string;
	isTriggered: (uwpe: UniverseWorldPlaceEntities) => boolean;
	reactToBeingTriggered: (uwpe: UniverseWorldPlaceEntities) => void;

	hasBeenTriggered: boolean;

	constructor
	(
		name: string,
		isTriggered: (uwpe: UniverseWorldPlaceEntities) => boolean,
		reactToBeingTriggered: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.isTriggered = isTriggered;
		this.reactToBeingTriggered = reactToBeingTriggered;

		this.hasBeenTriggered = false;
	}

	static fromNameIsTriggeredAndReactToBeingTriggered
	(
		name: string,
		isTriggered: (uwpe: UniverseWorldPlaceEntities) => boolean,
		reactToBeingTriggered: (uwpe: UniverseWorldPlaceEntities) => void
	): Trigger
	{
		return new Trigger(name, isTriggered, reactToBeingTriggered);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.hasBeenTriggered == false)
		{
			this.hasBeenTriggered = this.isTriggered(uwpe);
			if (this.hasBeenTriggered)
			{
				this.reactToBeingTriggered(uwpe);
			}
		}
	}

	// Clonable.

	clone(): Trigger
	{
		return new Trigger
		(
			this.name, this.isTriggered, this.reactToBeingTriggered
		);
	}

	overwriteWith(other: Trigger): Trigger
	{
		return this; // todo
	}
}

}

