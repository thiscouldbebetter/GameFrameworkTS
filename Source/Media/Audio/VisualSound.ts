
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound implements Visual<VisualSound>
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
		return new VisualSound("Effects__Default", false);
	}

	static fromSoundName(soundName: string): VisualSound
	{
		return new VisualSound(soundName, false); // isMusic
	}

	static fromSoundNameAndRepeat(soundName: string, repeat: boolean): VisualSound
	{
		return new VisualSound(soundName, repeat);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// todo - Initialize the sound.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true; // todo
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;

		var soundHelper = universe.soundHelper;

		var audible = Audible.of(entity);
		if (audible == null)
		{
			throw new Error("The entity has no Audible property!");
		}
		else
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

	transform(transformToApply: TransformBase): VisualSound
	{
		return this; // todo
	}
}

}
