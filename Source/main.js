function main()
{
	//localStorage.clear();

	var contentPath = "../Content/";
	var imagePath = contentPath + "Images/";
	var audioPath = contentPath + "Audio/";
	var effectsPath = audioPath + "Effects/";
	var musicPath = audioPath + "Music/";
	var videoPath = contentPath + "Video/";
	var fontsPath = contentPath + "Fonts/";
	var textPath = contentPath + "Text/";

	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image("Title", imagePath + "Title.png"),
		],
		// sounds
		[
			new Sound("Sound", effectsPath + "Sound.wav", false),
			new Sound("Music", musicPath + "Music.mp3", true),
		],
		// videos
		[
			new Video("Movie", videoPath + "Movie.webm"),
		],
		// fonts
		[
			new Font("Font", fontsPath + "Font.ttf"),
		],
		// textStrings
		[
			new TextString("Conversation", textPath + "Conversation.json"),
			new TextString("Instructions", textPath + "Instructions.txt"),
		]
	);

	var displaySizeInPixelsDefault = new Coords(400, 300, 1);

	var display = new Display
	(
		// sizesAvailable
		[
			displaySizeInPixelsDefault,
			displaySizeInPixelsDefault.clone().half(),
			displaySizeInPixelsDefault.clone().multiplyScalar(2),
		],
		"Font", // fontName
		10, // fontHeightInPixels
		"Gray", "White" // colorFore, colorBack
	);

	var timerHelper = new TimerHelper(20);

	var universe = Universe.new
	(
		"Cursor_Quest", timerHelper, display, mediaLibrary, null
	);
	universe.initialize();
}
