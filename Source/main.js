function main()
{
	//localStorage.clear();

	var displaySizeInPixels = new Coords(400, 300);

	var display = new Display
	(
		displaySizeInPixels,
		10, // fontHeightInPixels
		"Gray", "White" // colorFore, colorBack
	);

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
		]
	);

	var universe0 = Universe.new(null);

	Globals.prototype.initialize
	(
		"Cursor Quest",
		20, // timerTicksPerSecond
		display,
		mediaLibrary,
		universe0
	);
}
