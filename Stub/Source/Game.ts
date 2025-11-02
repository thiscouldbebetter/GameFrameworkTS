
class Game
{
	name: string;
	contentDirectoryPath: string;

	constructor(name: string, contentDirectoryPath: string)
	{
		this.name = name;
		this.contentDirectoryPath = contentDirectoryPath;
	}

	static fromNameAndContentDirectoryPath
	(
		name: string, contentDirectoryPath: string
	): Game
	{
		return new Game(name, contentDirectoryPath);
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

		var worldCreator = WorldCreator.fromWorldCreate
		(
			() => WorldGame.fromName(this.name)
		);

		var universe = Universe.fromNameTicksPerSecondMediaFilePathsAndWorldCreator
		(
			"Untitled",
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
