
namespace ThisCouldBeBetter.GameFramework
{

export class Idleable implements EntityProperty<Idleable>
{
	ticksUntilIdle: number;
	_idle: (uwpe: UniverseWorldPlaceEntities) => void;

	tickLastActionPerformed: number;

	constructor(ticksUntilIdle: number, idle: (uwpe: UniverseWorldPlaceEntities) => void)
	{
		this.ticksUntilIdle = ticksUntilIdle;
		this._idle = idle;
		this.tickLastActionPerformed = 0;
	}

	idle(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._idle != null)
		{
			this._idle(uwpe);
		}
	}

	isIdle(world: World): boolean
	{
		return this.ticksSinceLastAction(world) >= this.ticksUntilIdle;
	}

	ticksSinceLastAction(world: World): number
	{
		return world.timerTicksSoFar - this.tickLastActionPerformed;
	}

	// Clonable.

	clone(): Idleable
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: Idleable): Idleable
	{
		throw new Error("Not yet implemented.");
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;
		var actor = entity.actor();
		var actorIsActing = actor.actions.length > 0;
		if (actorIsActing)
		{
			this.tickLastActionPerformed = world.timerTicksSoFar;
		}
		else if (this.isIdle(world))
		{
			this.idle(uwpe);
		}
	}

	// Equatable

	equals(other: Idleable): boolean { return false; } // todo

}

}
