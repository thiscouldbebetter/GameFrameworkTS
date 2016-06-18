
function World(name, cursorPos)
{
	this.name = name;
	this.cursorPos = cursorPos;
	this.dateCreated = DateTime.now();
	this.dateSaved = this.dateCreated;
}
{
	// constants

	World.CursorSize = new Coords(10, 10);

	// static methods

	World.new = function()
	{
		var now = DateTime.now();
		var nowAsString = now.toStringTimestamp();

		var returnValue = new World
		(
			"World-" + nowAsString, 
			new Coords(10, 10)
		);
		return returnValue;
	}

	// instance methods

	World.prototype.draw = function()
	{
		var displayHelper = Globals.Instance.displayHelper;

		displayHelper.clear();
		displayHelper.drawRectangle
		(
			this.cursorPos,
			World.CursorSize,
			"Gray", "White"
		);
	}

	World.prototype.updateForTimerTick = function()
	{				
		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			var mouseClickPos = inputHelper.mouseClickPos;
			this.cursorPos.overwriteWith(mouseClickPos);
			Globals.Instance.soundHelper.soundWithNamePlayAsEffect("Sound");
		}

		if (inputHelper.keyCodePressed == 27) // escape
		{
			var universe = Globals.Instance.universe;
			var venueNext = new VenueControls
			(
				ControlBuilder.configure()
			);
			venueNext = new VenueFader(venueNext);
			universe.venueNext = venueNext;
		}
	}
}
