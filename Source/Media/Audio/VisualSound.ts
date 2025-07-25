
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSound implements Visual<VisualSound>
{
	// Yes, obviously sounds aren't really visual.

	soundToPlayName: string;
	repeats: boolean;

	hasBeenStarted: boolean;

	constructor(soundToPlayName: string, repeats: boolean)
	{
		this.soundToPlayName = soundToPlayName;
		this.repeats = repeats;
	}

	static default(): VisualSound
	{
		return new VisualSound("Effects__Default", false); // repeats
	}

	static fromSoundName(soundName: string): VisualSound
	{
		return new VisualSound(soundName, false); // repeats
	}

	static fromSoundNameAndRepeat(soundName: string, repeats: boolean): VisualSound
	{
		return new VisualSound(soundName, repeats);
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
				var sound =
					soundHelper.soundWithName(universe, this.soundToPlayName);
				var volume = soundHelper.effectVolume; // todo
				sound.play(universe, volume);
				audible.hasBeenHeard = true;
			}
		}
	}

	// Clonable.

	clone(): VisualSound
	{
		return new VisualSound(this.soundToPlayName, this.repeats);
	}

	overwriteWith(other: VisualSound): VisualSound
	{
		this.soundToPlayName = other.soundToPlayName;
		this.repeats = other.repeats;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualSound
	{
		return this; // todo
	}
}

}
