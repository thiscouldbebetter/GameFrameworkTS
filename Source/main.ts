function main()
{
	// It may be necessary to clear local storage to prevent errors on
	// deserialization of existing saved items after the schema changes.
	// localStorage.clear();

	var mediaFilePaths = mediaFilePathsBuild();

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
		"Gray", "White", // colorFore, colorBack
		null
	);

	var timerHelper = new TimerHelper(20);

	var controlStyle = ControlStyle.Instances().Default;

	var universe = Universe.create
	(
		"Game Framework Demo Game",
		"0.0.0-20200815-0515", // version
		timerHelper,
		display,
		mediaLibrary,
		controlStyle,
		null
	);
	universe.initialize
	(
		function() { universe.start(); }
	);
}

function mediaFilePathsBuild()
{
	var contentDirectoryPath = "../Content/";

	var fontDirectoryPath = contentDirectoryPath + "Fonts/";
	var imageDirectoryPath = contentDirectoryPath + "Images/";
	var soundEffectDirectoryPath = contentDirectoryPath + "Audio/Effects/";
	var soundMusicDirectoryPath = contentDirectoryPath + "Audio/Music/";
	var textStringDirectoryPath = contentDirectoryPath + "Text/";
	var videoDirectoryPath = contentDirectoryPath + "Video/";

	var mediaFilePaths =
	[
		imageDirectoryPath + "Anvil.svg",
		imageDirectoryPath + "Friendly.png",
		imageDirectoryPath + "Grass.svg",
		imageDirectoryPath + "Title.png",

		imageDirectoryPath + "Car/00.png",
		imageDirectoryPath + "Car/01.png",
		imageDirectoryPath + "Car/02.png",
		imageDirectoryPath + "Car/03.png",
		imageDirectoryPath + "Car/04.png",
		imageDirectoryPath + "Car/05.png",
		imageDirectoryPath + "Car/06.png",
		imageDirectoryPath + "Car/07.png",
		imageDirectoryPath + "Car/08.png",
		imageDirectoryPath + "Car/09.png",
		imageDirectoryPath + "Car/10.png",
		imageDirectoryPath + "Car/11.png",
		imageDirectoryPath + "Car/12.png",
		imageDirectoryPath + "Car/13.png",
		imageDirectoryPath + "Car/14.png",
		imageDirectoryPath + "Car/15.png",
		imageDirectoryPath + "Car/16.png",
		imageDirectoryPath + "Car/17.png",
		imageDirectoryPath + "Car/18.png",
		imageDirectoryPath + "Car/19.png",
		imageDirectoryPath + "Car/20.png",
		imageDirectoryPath + "Car/21.png",
		imageDirectoryPath + "Car/22.png",
		imageDirectoryPath + "Car/23.png",
		imageDirectoryPath + "Car/24.png",
		imageDirectoryPath + "Car/25.png",
		imageDirectoryPath + "Car/26.png",
		imageDirectoryPath + "Car/27.png",
		imageDirectoryPath + "Car/28.png",
		imageDirectoryPath + "Car/29.png",
		imageDirectoryPath + "Car/30.png",
		imageDirectoryPath + "Car/31.png",

		soundEffectDirectoryPath + "Sound.wav",
		soundEffectDirectoryPath + "Clang.wav",

		soundMusicDirectoryPath + "Music.mp3",

		videoDirectoryPath + "Movie.webm",

		fontDirectoryPath + "Font.ttf",

		textStringDirectoryPath + "Conversation.json",
		textStringDirectoryPath + "Instructions.txt",
	];

	return mediaFilePaths
}
