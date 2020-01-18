
function VisualSound(soundNameToPlay)
{
	this.soundNameToPlay = soundNameToPlay;
}
{
	VisualSound.prototype.draw = function(universe, world, display, entity)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
	};
}
