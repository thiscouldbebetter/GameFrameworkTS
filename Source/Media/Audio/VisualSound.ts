
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound implements Visual<VisualSound>
{
	// Yes, obviously sounds aren't really visual.

	soundPlayback: SoundPlayback;

	constructor(soundPlayback: SoundPlayback)
	{
		this.soundPlayback = soundPlayback;
	}

	static fromSoundName(soundName: string): VisualSound
	{
		var sound = SoundFromLibrary.fromName(soundName);
		var soundPlayback = SoundPlayback.fromSound(sound);
		return new VisualSound(soundPlayback);
	}

	static fromSoundNameRepeating(soundName: string): VisualSound
	{
		var sound = SoundFromLibrary.fromName(soundName);
		var soundPlayback = SoundPlayback.fromSound(sound).repeatsForever();
		return new VisualSound(soundPlayback);
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

		var audible = Audible.of(entity);
		if (audible == null)
		{
			throw new Error("The entity has no Audible property!");
		}
		else
		{
			var soundHelper = universe.soundHelper;
			soundHelper.soundPlaybackRegister(this.soundPlayback);
			audible.soundPlaybackSet(this.soundPlayback);
		}
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
