
function VenueInputCapture(venueToReturnTo, functionToPassInputCapturedTo)
{
	this.venueToReturnTo = venueToReturnTo;
	this.functionToPassInputCapturedTo = functionToPassInputCapturedTo;

	this.isFirstTime = true;
}
{
	VenueInputCapture.prototype.draw = function(universe)
	{
		// Do nothing.
	};

	VenueInputCapture.prototype.updateForTimerTick = function(universe)
	{
		var inputHelper = universe.inputHelper;

		if (this.isFirstTime)
		{
			this.isFirstTime = false;
			inputHelper.inputsRemoveAll();
		}
		else
		{
			var inputsPressed = inputHelper.inputsPressed;
			for (var i = 0; i < inputsPressed.length; i++)
			{
				var inputPressed = inputsPressed[i];
				if (inputPressed.name.startsWith("Mouse") == false)
				{
					if (inputPressed.isActive)
					{
						this.functionToPassInputCapturedTo(inputPressed);
						universe.venueNext = this.venueToReturnTo;
					}
				}
			}
		}
	};
}
