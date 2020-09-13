
class Alive extends EntityProperty
{
	tickBorn: number;
	ticksToRunAtAndUpdatesToRun: Array<[number, Function]>;

	haveUpdatesBeenRun: boolean[];
	
	constructor(tickBorn: number, ticksToRunAtAndUpdatesToRun: Array<[number, Function]>)
	{
		super();
		this.tickBorn = tickBorn;
		this.ticksToRunAtAndUpdatesToRun = ticksToRunAtAndUpdatesToRun;

		this.haveUpdatesBeenRun =
			this.ticksToRunAtAndUpdatesToRun.map(x => false);
	}
			
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity)
	{
		var ticksSinceBorn = w.timerTicksSoFar - this.tickBorn;
		for (var i = 0; i < this.ticksToRunAtAndUpdatesToRun.length; i++)
		{
			var tickToRunAtAndUpdateToRun = this.ticksToRunAtAndUpdatesToRun[i];
			var tickToRunAt = tickToRunAtAndUpdateToRun[0];
			if (ticksSinceBorn < tickToRunAt)
			{
				break;
			}
			else
			{
				var hasUpdateBeenRun = this.haveUpdatesBeenRun[i];
				if (hasUpdateBeenRun == false)
				{
					var updateToRun = tickToRunAtAndUpdateToRun[1];
					updateToRun(u, w, p, e);
					this.haveUpdatesBeenRun[i] = true;
				}
			}
		}
	}
	
	// Clonable.
	
	clone()
	{
		return new Alive(this.tickBorn, this.ticksToRunAtAndUpdatesToRun);
	}

	overwriteWith(other: Alive)
	{
		this.tickBorn = other.tickBorn;
		return this;
	}

}
