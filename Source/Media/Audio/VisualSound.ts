
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound extends VisualBase<VisualSound>
{
	// Yes, obviously sounds aren't really visual.

	soundPlayback: SoundPlayback;

	constructor(soundPlayback: SoundPlayback)
	{
		super();

		this.soundPlayback = soundPlayback;
	}

	static fromSoundName(soundName: string): VisualSound
	{
		var sound = SoundFromLibrary.fromName(soundName);
		var soundPlayback =
			SoundPlayback.fromSoundAndCallbackForStop
			(
				sound,
				this.soundPlaybackCallbackForStop
			);
		return new VisualSound(soundPlayback);
	}

	static fromSoundNameRepeating(soundName: string): VisualSound
	{
		var sound = SoundFromLibrary.fromName(soundName);
		var soundPlayback = SoundPlayback.fromSound(sound).repeatsForever();
		return new VisualSound(soundPlayback);
	}

	static silence(): VisualSound
	{
		return new VisualSound(null);
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
		var entity = uwpe.entity;

		var audible = Audible.of(entity);
		if (audible == null)
		{
			throw new Error("The entity has no Audible property!");
		}
		else
		{
			if (audible.soundPlayback == null)
			{
				if (this.soundPlayback != null)
				{
					var soundPlayback = this.soundPlayback.clone();
					audible.soundPlaybackSet(soundPlayback);
					soundPlayback.startIfNotStartedYet(uwpe);
				}
			}
			else
			{
				if (this.soundPlayback == null)
				{
					// Silence the previous sound.
					audible.soundPlaybackClear();
				}
			}
		}
	}

	static soundPlaybackCallbackForStop(uwpe: UniverseWorldPlaceEntities): void
	{
		// This may result in the sound being played continuously while the VisualSound is being drawn.
		/*
		var entity = uwpe.entity;
		var audible = Audible.of(entity);
		audible.soundPlaybackClear();
		*/
	}

	// Clonable.

	clone(): VisualSound
	{
		return new VisualSound(this.soundPlayback.clone() );
	}

	overwriteWith(other: VisualSound): VisualSound
	{
		this.soundPlayback.overwriteWith(other.soundPlayback);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualSound
	{
		return this; // todo
	}
}

}
