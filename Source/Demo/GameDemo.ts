
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

		var title = (a: string) => imageTitlesDirectoryPath + a;
		var effect = (a: string) => soundEffectDirectoryPath + a;
		var image = (a: string) => imageDirectoryPath + a;
		var music = (a: string) => soundMusicDirectoryPath + a;
		var video = (a: string) => videoDirectoryPath + a;
		var font = (a: string) => fontDirectoryPath + a;
		var text = (a: string) => textStringDirectoryPath + a;

		var mediaFilePaths =
		[
			title("Opening.png"),
			title("Producer.png"),
			title("Title.png"),

			image("Anvil.svg"),
			image("Car.png"),
			image("Friendly.png"),
			image("Grass.svg"),
			image("Grain.svg"),
			image("Pillow.svg"),
			image("Terrain-Sand.png"),
			image("Zap.svg"),

			effect("Sound.wav"),
			effect("Clang.wav"),

			music("_Default.mp3"),
			music("Producer.mp3"),
			music("Title.mp3"),

			video("Movie.webm"),

			font("Font.ttf"),

			text("Conversation.json"),
			text("Conversation_psv.txt"),
			text("Instructions.txt"),
		];

		return mediaFilePaths;
	}
}
