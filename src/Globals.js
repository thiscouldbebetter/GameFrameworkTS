
function Globals()
{}
{
	// instance

	Globals.Instance = new Globals();

	// instance methods

	Globals.prototype.handleEventTimerTick = function()
	{
		this.universe.updateForTimerTick();
	}

	Globals.prototype.initialize = function
	(
		programName,
		timerTicksPerSecond, 
		viewSize, 
		universe,
		sounds,
		videos
	)
	{
		this.programName = programName;
		this.timerTicksPerSecond = timerTicksPerSecond;
		
		this.serializer = new Serializer
		([
			Coords,
			DateTime,
			Profile,
			World,
			Universe
		]);
		this.display = new Display(viewSize, 10, "Gray", "White");
		this.inputHelper = new InputHelper();
		this.profileHelper = new ProfileHelper();
		this.soundHelper = new SoundHelper(sounds);
		this.videoHelper = new VideoHelper(videos);

		this.universe = universe;

		var divMain = document.createElement("div");
		divMain.style.position = "absolute";
		divMain.style.left = "50%";
		divMain.style.top = "50%";
		divMain.style.marginTop = 0 - viewSize.x / 2;
		divMain.style.marginLeft = 0 - viewSize.y / 2;
		document.body.appendChild(divMain);
		this.divMain = divMain;

		this.display.initialize();
		this.inputHelper.initialize();
		this.universe.initialize();

		var millisecondsPerTimerTick = Math.floor(1000 / this.timerTicksPerSecond);

		this.timer = setInterval
		(
			this.handleEventTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}

	Globals.prototype.reset = function()
	{
		this.soundHelper.reset();
	}
}
