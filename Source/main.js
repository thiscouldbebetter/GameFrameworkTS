function main()
{
	//localStorage.clear();

	var mediaLibrary = new MediaLibrary
	(
		// images
		[
			new Image("Title", "../Media/Title.png"),
		],
		// sounds
		[
			new Sound("Sound", "../Media/Sound.wav", false),
			new Sound("Music", "../Media/Music.mp3", true),
		],
		// videos
		[
			new Video("Movie", "../Media/Movie.webm"),
		],
		// fonts
		[
			new Font("Font", "../Media/Font.ttf")
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
