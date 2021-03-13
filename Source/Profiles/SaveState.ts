
namespace ThisCouldBeBetter.GameFramework
{

export class SaveState
{
	name: string;
	placeName: string
	timePlayingAsString: string;
	timeSaved: DateTime;
	imageSnapshot: Image2;
	world: World;

	constructor
	(
		name: string, placeName: string, timePlayingAsString: string,
		timeSaved: DateTime, imageSnapshot: Image2, world: World
	)
	{
		this.name = name;
		this.placeName = placeName;
		this.timePlayingAsString = timePlayingAsString;
		this.timeSaved = timeSaved;
		this.imageSnapshot = imageSnapshot;
		this.world = world;
	}

	load()
	{
		// todo
	}

	unload()
	{
		this.world = null;
	}
}

}
