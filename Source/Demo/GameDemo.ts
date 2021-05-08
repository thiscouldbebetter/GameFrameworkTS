
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

		var mediaLibrary = MediaLibrary.fromFilePaths(mediaFilePaths);

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
			"Font", // fontName
			10, // fontHeightInPixels
			Color.byName("Gray"),
			Color.byName("White"), // colorFore, colorBack
			null
		);

		var timerHelper = new TimerHelper(20);

		var controlBuilder = ControlBuilder.default();

		var universe = Universe.create
		(
			"Game Framework Demo Game",
			"0.0.0-20210406-1530", // version
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			WorldDemo.create
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
		var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
		var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
		var textStringDirectoryPath = contentDirectoryPath + "Text/";
		var videoDirectoryPath = contentDirectoryPath + "Video/";

		var mediaFilePaths =
		[
			imageDirectoryPath + "Opening.png",
			imageDirectoryPath + "Producer.png",
			imageDirectoryPath + "Title.png",

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
			textStringDirectoryPath + "Instructions.txt",
		];

		return mediaFilePaths;
	}
}
