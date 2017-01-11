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

	var universe0 = Universe.new(null);
	
	var sounds = 
	[
		new Sound("Sound", "Sound.wav", false),
		new Sound("Music", "Music.mp3", true),
	];
	
	var videos =
	[
		new Video("Movie", "Movie.webm"),
	];

	Globals.prototype.initialize
	(
		"Cursor Quest",
		20, // timerTicksPerSecond
		display,
		universe0,
		sounds,
		videos
	);
}
