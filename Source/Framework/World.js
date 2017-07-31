// This class, as implemented, is only a demonstration. 
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the World.new() method.

function World(name, cursorPos)
{
	this.name = name;
	this.cursorPos = cursorPos;
	
	this.cursorSize = new Coords(10, 10);
}
{
	// constants


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
	
	World.prototype.dateCreated = function () 
	{ 
		if (this._dateCreated == null)
		{
			this._dateCreated = DateTime.now();	
		}
		return this._dateCreated; 
	}

	World.prototype.dateSaved = function () 
	{ 
		if (this._dateSaved == null)
		{
			this._dateSaved = this._dateCreated;
		}
		return this._dateSaved; 
	}

	World.prototype.draw = function()
	{
		var display = Globals.Instance.display;

		display.clear();
		display.drawRectangle
		(
			this.cursorPos,
			this.cursorSize,
			display.colorBack, display.colorFore
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

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			if (inputActive == "Escape") // todo - Use actionName instead of inputName.
			{
				var universe = Globals.Instance.universe;
				var venueNext = new VenueControls
				(
					new ControlBuilder().configure
					(
						Globals.Instance.display.sizeInPixels
					)
				);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
			}
		}
	}
}
