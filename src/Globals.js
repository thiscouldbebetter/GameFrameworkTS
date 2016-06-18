
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
		millisecondsPerTimerTick, 
		viewSize, 
		universe,
		sounds,
		videos
	)
	{
		this.programName = programName;
		
		this.serializer = new Serializer
		([
			Coords,
			DateTime,
			Profile,
			World,
			Universe
		]);
		this.displayHelper = new DisplayHelper(viewSize, 10);
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

		this.displayHelper.initialize();
		this.inputHelper.initialize();
		this.universe.initialize();

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
