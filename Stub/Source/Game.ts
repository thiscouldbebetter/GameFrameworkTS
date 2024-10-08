
class Game
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

		var mediaLibrary = MediaLibrary.fromFilePaths("../Content/", mediaFilePaths);

		var displaySizesAvailable =
		[
			new Coords(400, 300, 1),
			new Coords(640, 480, 1),
			new Coords(800, 600, 1),
			new Coords(1200, 900, 1),
			// Wrap.
			new Coords(200, 150, 1),
		];

		var colors = Color.Instances();

		var display = new Display2D
		(
			displaySizesAvailable,
			"Font", // fontName
			10, // fontHeightInPixels
			colors.Gray, colors.White, // colorFore, colorBack
			null
		);

		var timerHelper = new TimerHelper(20);

		var controlBuilder = ControlBuilder.default();

		var worldCreator = WorldCreator.fromWorldCreate
		(
			() => new WorldGame()
		);

		var universe = Universe.create
		(
			"Game",
			null, // version
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			worldCreator
		);
		universe.initialize
		(
			() => { universe.start(); }
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

			soundEffectDirectoryPath + "Sound.wav",

			soundMusicDirectoryPath + "Music.mp3",
			soundMusicDirectoryPath + "Producer.mp3",
			soundMusicDirectoryPath + "Title.mp3",

			videoDirectoryPath + "Movie.webm",

			fontDirectoryPath + "Font.ttf",

			textStringDirectoryPath + "Instructions.txt",
		];

		return mediaFilePaths;
	}
}
