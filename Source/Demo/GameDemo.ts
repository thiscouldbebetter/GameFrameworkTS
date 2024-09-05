
class GameDemo
{
	contentDirectoryPath: string;

	constructor(contentDirectoryPath: string)
	{
		this.contentDirectoryPath = contentDirectoryPath;
	}

	main(): void
	{
		// It may be necessary to clear local storage to prevent errors on
		// deserialization of existing saved items after the schema changes.
		// localStorage.clear();

		var mediaFilePaths = this.mediaFilePathsBuild();

		var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);

		var displaySizesAvailable =
		[
			new Coords(400, 300, 1),
			new Coords(640, 480, 1),
			new Coords(800, 600, 1),
			new Coords(1200, 900, 1),
			// Wrap.
			new Coords(200, 150, 1),
		];

		var display = new Display2D
		(
			displaySizesAvailable,
			new FontNameAndHeight("Font", 10),
			Color.byName("Gray"),
			Color.byName("White"), // colorFore, colorBack
			null
		);

		var timerHelper = new TimerHelper(20);

		var controlBuilder = ControlBuilder.fromStyles
		([
			ControlStyle.Instances().Rounded,
			ControlStyle.Instances().Dark
		]);

		var version = _BuildRecord.version();

		var universe = Universe.create
		(
			"Game Framework Demo Game",
			version,
			timerHelper,
			display,
			null, // soundHelper
			mediaLibrary,
			controlBuilder,
			WorldCreator.fromWorldCreate(WorldDemo.create)
		);
		universe.initialize
		(
			() => universe.start()
		);
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
			// textStringDirectoryPath + "Conversation.json.txtpng", // Turns out text read from images is subject to CORS too.
			textStringDirectoryPath + "Conversation_psv.txt",

			textStringDirectoryPath + "Instructions.txt",
		];

		return mediaFilePaths;
	}
}
