
namespace ThisCouldBeBetter.GameFramework
{

export class VenueInputCapture implements Venue
{
	venueToReturnTo: Venue;
	functionToPassInputCapturedTo: (inputCaptured: Input) => void;

	isFirstTime: boolean;

	constructor
	(
		venueToReturnTo: Venue,
		functionToPassInputCapturedTo: (inputCaptured: Input) => void
	)
	{
		this.venueToReturnTo = venueToReturnTo;
		this.functionToPassInputCapturedTo = functionToPassInputCapturedTo;

		this.isFirstTime = true;
	}

	draw(universe: Universe): void
	{
		// Do nothing.
	}

	finalize(universe: Universe): void {}

	initialize(universe: Universe): void {}

	updateForTimerTick(universe: Universe): void
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
	}
}

}
