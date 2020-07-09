
class Animatable
{
	animationDefnNameCurrent: string;
	timerTicksSoFar: number;

	constructor()
	{
		this.animationDefnNameCurrent = null;
		this.timerTicksSoFar = 0;
	}

	animationStart(defnName: string)
	{
		if (this.animationDefnNameCurrent != defnName)
		{
			this.animationDefnNameCurrent = defnName;
			this.timerTicksSoFar = 0;
		}
	};

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.timerTicksSoFar++;
	};
}
