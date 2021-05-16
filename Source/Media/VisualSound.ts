
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound implements Visual
{
	// Yes, obviously sounds aren't really visual.

	soundNameToPlay: string;
	isMusic: boolean;

	hasBeenStarted: boolean;

	constructor(soundNameToPlay: string, isMusic: boolean)
	{
		this.soundNameToPlay = soundNameToPlay;
		this.isMusic = isMusic;
	}

	static default(): VisualSound
	{
		return new VisualSound("Effects_Sound", false);
	}

	static fromSoundName(soundName: string): VisualSound
	{
		return new VisualSound(soundName, false); // isMusic
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display): void
	{
		var soundHelper = universe.soundHelper;

		var audible = entity.audible();
		if (audible != null)
		{
			if (audible.hasBeenHeard == false)
			{
				if (this.isMusic)
				{
					soundHelper.soundWithNamePlayAsMusic(universe, this.soundNameToPlay);
				}
				else
				{
					soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
				}

				audible.hasBeenHeard = true;
			}
		}
	}

	// Clonable.

	clone(): VisualSound
	{
		return new VisualSound(this.soundNameToPlay, this.isMusic);
	}

	overwriteWith(other: VisualSound): VisualSound
	{
		this.soundNameToPlay = other.soundNameToPlay;
		this.isMusic = other.isMusic;
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
