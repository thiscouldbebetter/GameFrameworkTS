function main()
{
	//localStorage.clear(); 

	var viewSize = new Coords(200, 150);

	var universe0 = Universe.new(null);

	Globals.prototype.initialize
	(
		"Cursor Quest",
		50, // millisecondsPerTimerTick
		viewSize,
		universe0,
		// sounds
		[
			new Sound("Sound", "Sound.wav", false),
			new Sound("Music", "Music.mp3", true),
		],
		// videos
		[
			new Video("Movie", "Movie.webm"),
		]
	);
}
