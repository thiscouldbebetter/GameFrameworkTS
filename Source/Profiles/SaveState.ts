
namespace ThisCouldBeBetter.GameFramework
{

export class SaveStateBase
{
	name: string;
	placeName: string
	timePlayingAsString: string;
	timeSaved: DateTime;
	imageSnapshot: Image2;

	constructor
	(
		name: string,
		placeName: string,
		timePlayingAsString: string,
		timeSaved: DateTime,
		imageSnapshot: Image2
	)
	{
		this.name = name;
		this.placeName = placeName;
		this.timePlayingAsString = timePlayingAsString;
		this.timeSaved = timeSaved;
		this.imageSnapshot = imageSnapshot;
	}

	fromWorld(world: World): SaveStateBase
	{
		throw new Error("Must be implemented in subclass!");
	}

	toWorld(universe: Universe): World
	{
		throw new Error("Must be implemented in subclass!");
	}

	// Loadable.

	load(): void
	{
		throw new Error("Must be implemented in subclass!");
	}

	unload(): void
	{
		throw new Error("Must be implemented in subclass!");
	}
}

export class SaveStateWorld extends SaveStateBase
{
	world: World;

	constructor
	(
		name: string,
		placeName: string,
		timePlayingAsString: string,
		timeSaved: DateTime,
		imageSnapshot: Image2
	)
	{
		super
		(
			name,
			placeName,
			timePlayingAsString,
			timeSaved,
			imageSnapshot
		);
	}

	fromWorld(world: World): SaveStateBase
	{
		this.world = world;
		return this;
	}

	toWorld(universe: Universe): World
	{
		return this.world;
	}

	// Loadable.

	load(): void
	{
		// todo
	}

	unload(): void
	{
		this.world = null;
	}
}

}
