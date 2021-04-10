
namespace ThisCouldBeBetter.GameFramework
{

export class Idleable implements EntityProperty
{
	ticksUntilIdle: number;
	_idle: (u: Universe, w: World, p: Place, e: Entity) => void;

	tickLastActionPerformed: number;

	constructor(ticksUntilIdle: number, idle: (u: Universe, w: World, p: Place, e: Entity) => void)
	{
		this.ticksUntilIdle = ticksUntilIdle;
		this._idle = idle;
		this.tickLastActionPerformed = 0;
	}

	idle(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		if (this._idle != null)
		{
			this._idle(universe, world, place, entity);
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

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		var actor = entity.actor();
		var actorIsActing = actor.actions.length > 0;
		if (actorIsActing)
		{
			this.tickLastActionPerformed = world.timerTicksSoFar;
		}
		else if (this.isIdle(world))
		{
			this.idle(universe, world, place, entity);
		}
	}
}

}
