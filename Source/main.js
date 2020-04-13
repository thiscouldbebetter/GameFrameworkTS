function main()
{
	// It may be necessary to clear local storage to prevent errors on
	// deserialization of existing saved items after the schema changes.
	// localStorage.clear();

	var mediaLibrary = MediaLibrary.fromFileNames
	(
		"../Content/",
		[ "Title.png", ],
		[ "Sound.wav" ],
		[ "Music.mp3" ],
		[ "Movie.webm" ],
		[ "Font.ttf" ],
		[ "Conversation.json", "Instructions.txt" ]
	);

	var displaySizesAvailable =
	[
		new Coords(400, 300, 1),
		new Coords(640, 480, 1),
		new Coords(800, 600, 1),
		new Coords(1200, 900, 1),
		// Wrap.
		new Coords(200, 150, 1),
	];


	var display = new Display
	(
		displaySizesAvailable,
		"Font", // fontName
		10, // fontHeightInPixels
		"Gray", "White" // colorFore, colorBack
	);

	var timerHelper = new TimerHelper(20);

	var universe = Universe.new
	(
		"Game Framework Demo Game", "0.0.0-20200209-1750", timerHelper, display, mediaLibrary, null
	);
	universe.initialize
	(
		function() { universe.start(); }
	);
}
