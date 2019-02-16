
function VisualSound(soundNameToPlay)
{
	this.soundNameToPlay = soundNameToPlay;
}
{
	VisualSound.prototype.draw = function(universe, world, display, drawable, entity)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
	};
}
