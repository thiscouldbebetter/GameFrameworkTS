
class GameDemo
{
	contentDirectoryPath: string;

	constructor(contentDirectoryPath: string)
	{
		this.contentDirectoryPath = contentDirectoryPath;
	}

	main(): void
	{
		var ticksPerSecond = 20;
		var mediaFilePaths = this.mediaFilePathsBuild();
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

	mediaFilePathsBuild(): string[]
	{
		var contentDirectoryPath = this.contentDirectoryPath;

		var fontDirectoryPath = contentDirectoryPath + "Fonts/";
		var imageDirectoryPath = contentDirectoryPath + "Images/";
		var imageTitlesDirectoryPath = imageDirectoryPath + "Titles/";
		var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
		var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
		var textStringDirectoryPath = contentDirectoryPath + "Text/";
		var videoDirectoryPath = contentDirectoryPath + "Video/";

		var mediaFilePaths =
		[
			imageTitlesDirectoryPath + "Opening.png",
			imageTitlesDirectoryPath + "Producer.png",
			imageTitlesDirectoryPath + "Title.png",

			imageDirectoryPath + "Anvil.svg",
			imageDirectoryPath + "Car.png",
			imageDirectoryPath + "Friendly.png",
			imageDirectoryPath + "Grass.svg",
			imageDirectoryPath + "Grain.svg",
			imageDirectoryPath + "Pillow.svg",
			imageDirectoryPath + "Terrain-Sand.png",
			imageDirectoryPath + "Zap.svg",

			soundEffectDirectoryPath + "Sound.wav",
			soundEffectDirectoryPath + "Clang.wav",

			soundMusicDirectoryPath + "Music.mp3",
			soundMusicDirectoryPath + "Producer.mp3",
			soundMusicDirectoryPath + "Title.mp3",

			videoDirectoryPath + "Movie.webm",

			fontDirectoryPath + "Font.ttf",

			textStringDirectoryPath + "Conversation.json",
			textStringDirectoryPath + "Conversation_psv.txt",

			textStringDirectoryPath + "Instructions.txt",
		];

		return mediaFilePaths;
	}
}
