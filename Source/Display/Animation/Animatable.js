
function Animatable()
{
	this.animationDefnNameCurrent = null;
	this.timerTicksSoFar = 0;
}
{
	Animatable.prototype.animationStart = function(defnName)
	{
		if (this.animationDefnNameCurrent != defnName)
		{
			this.animationDefnNameCurrent = defnName;
			this.timerTicksSoFar = 0;
		}
	};

	Animatable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		this.timerTicksSoFar++;
	};
}
