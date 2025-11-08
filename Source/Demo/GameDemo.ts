
class GameDemo
{
	configuration: Configuration;

	constructor(configuration: Configuration)
	{
		this.configuration = configuration;
	}

	static fromConfiguration(configuration: Configuration): GameDemo
	{
		return new GameDemo(configuration);
	}

	start(): void
	{
		var contentDirectoryPath = this.configuration.contentDirectoryPath;
		var manifestFileName = "Manifest.txt";
		MediaLibrary.mediaFilePathsReadFromContentDirectoryPathAndManifestFileNameThen
		(
			contentDirectoryPath,
			manifestFileName,
			this.start_MediaFilePathsLoaded
		);
	}

	start_MediaFilePathsLoaded(mediaFilePaths: string[])
	{
		var ticksPerSecond = 20;
		var worldCreator = WorldCreator.fromWorldCreate(WorldDemo.create);

		var universe = Universe.fromNameTicksPerSecondMediaFilePathsAndWorldCreator
		(
			"Game Framework Demo Game",
			ticksPerSecond,
			mediaFilePaths,
			worldCreator
		);

		universe.profileHelper
			.profilesMultipleAreAllowedSet(true)
			.gameCanBeSavedSet(true);

		universe.initializeAndStart();
	}
}
