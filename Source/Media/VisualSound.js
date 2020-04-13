
class VisualSound
{
	constructor(soundNameToPlay)
	{
		this.soundNameToPlay = soundNameToPlay;
	}

	draw(universe, world, display, entity)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
	};
}
