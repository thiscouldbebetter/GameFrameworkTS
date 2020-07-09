
class VisualSound implements Visual
{
	soundNameToPlay: string;

	constructor(soundNameToPlay: string)
	{
		this.soundNameToPlay = soundNameToPlay;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		universe.soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
	};

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
