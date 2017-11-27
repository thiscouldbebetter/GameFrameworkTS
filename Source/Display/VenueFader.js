
function VenueFader
(
	venueToFadeTo,
	venueToFadeFrom,
	millisecondsPerFade
)
{
	this.millisecondsPerFade = millisecondsPerFade;
	if (this.millisecondsPerFade == null)
	{
		this.millisecondsPerFade = 250;
	}

	this.venuesToFadeFromAndTo =
	[
		venueToFadeFrom,
		venueToFadeTo
	];

	if (venueToFadeFrom == venueToFadeTo)
	{
		this.venueIndexCurrent = 1;
		this.millisecondsPerFade *= 2;
	}
	else
	{
		this.venueIndexCurrent = 0;
	}
}

{
	VenueFader.prototype.initialize = function(universe)
	{
		var venueToFadeTo = this.venueToFadeTo();
		if (venueToFadeTo.initialize != null)
		{
			venueToFadeTo.initialize(universe);
		}
	}

	VenueFader.prototype.updateForTimerTick = function(universe)
	{
		var venueCurrent = this.venueCurrent();

		venueCurrent.draw(universe);

		var now = new Date();

		if (this.timeFadeStarted == null)
		{
			this.timeFadeStarted = now;
		}

		var millisecondsSinceFadeStarted = now - this.timeFadeStarted;

		var fractionOfFadeCompleted =
			millisecondsSinceFadeStarted
			/ this.millisecondsPerFade;

		var alphaOfFadeColor;

		if (this.venueIndexCurrent == 0)
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				this.venueIndexCurrent++;
				this.timeFadeStarted = null;

				var venueToFadeTo = this.venuesToFadeFromAndTo[1];
				if (venueToFadeTo.draw == null)
				{
					universe.venueNext = venueToFadeTo;
				}

			}
			alphaOfFadeColor = fractionOfFadeCompleted;
		}
		else // this.venueIndexCurrent == 1
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				universe.venueNext = venueCurrent;
			}

			alphaOfFadeColor = 1 - fractionOfFadeCompleted;
		}

		alphaOfFadeColor *= alphaOfFadeColor;

		var display = universe.display;

		display.drawRectangle
		(
			new Coords(0, 0),
			display.sizeDefault, // Scaled automatically.
			"rgba(0, 0, 0, " + alphaOfFadeColor + ")", // colorFill
			null // colorBorder
		);
	}

	VenueFader.prototype.venueToFadeTo = function()
	{
		return this.venuesToFadeFromAndTo[1];
	}

	VenueFader.prototype.venueCurrent = function()
	{
		return this.venuesToFadeFromAndTo[this.venueIndexCurrent];
	}
}
