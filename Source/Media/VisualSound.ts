
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound implements Visual
{
	// Yes, obviously sounds aren't really visual.

	soundNameToPlay: string;
	isMusic: boolean;

	constructor(soundNameToPlay: string, isMusic: boolean)
	{
		this.soundNameToPlay = soundNameToPlay;
		this.isMusic = isMusic;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var soundHelper = universe.soundHelper;
		if (this.isMusic)
		{
			soundHelper.soundWithNamePlayAsMusic(universe, this.soundNameToPlay);
		}
		else
		{
			soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
		}
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
