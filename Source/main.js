function main()
{
	//localStorage.clear();

	var mediaLibrary = new MediaLibrary.fromFileNames
	(
		"../Content/",
		[ "Title.png", ],
		[ "Sound.wav" ],
		[ "Music.mp3" ],
		[ "Movie.webm" ],
		[ "Font.ttf" ],
		[ "Conversation.json", "Instructions.txt" ]
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
