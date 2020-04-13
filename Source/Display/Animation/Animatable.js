
class Animatable
{
	constructor()
	{
		this.animationDefnNameCurrent = null;
		this.timerTicksSoFar = 0;
	}

	animationStart(defnName)
	{
		if (this.animationDefnNameCurrent != defnName)
		{
			this.animationDefnNameCurrent = defnName;
			this.timerTicksSoFar = 0;
		}
	};

	updateForTimerTick(universe, world, place, entity)
	{
		this.timerTicksSoFar++;
	};
}
