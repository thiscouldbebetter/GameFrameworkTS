
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

	if (venueToFadeFrom == null)
	{
		venueToFadeFrom = Globals.Instance.universe.venueCurrent;
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
	VenueFader.prototype.updateForTimerTick = function()
	{
		var venueCurrent = this.venuesToFadeFromAndTo[this.venueIndexCurrent];

		venueCurrent.draw();

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
					Globals.Instance.universe.venueNext = venueToFadeTo;
				}

			}
			alphaOfFadeColor = fractionOfFadeCompleted;
		}
		else // this.venueIndexCurrent == 1
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				Globals.Instance.universe.venueNext = venueCurrent;
			}

			alphaOfFadeColor = 1 - fractionOfFadeCompleted;
		}

		alphaOfFadeColor *= alphaOfFadeColor;

		var display = Globals.Instance.display;

		display.drawRectangle
		(
			new Coords(0, 0), 
			display.viewSize, 
			"rgba(0, 0, 0, " + alphaOfFadeColor + ")", // colorFill
			null // colorBorder
		);
	}
}
