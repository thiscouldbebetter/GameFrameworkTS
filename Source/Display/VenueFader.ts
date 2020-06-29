
class VenueFader
{
	constructor(venueToFadeTo, venueToFadeFrom, backgroundColor, millisecondsPerFade)
	{
		this.venuesToFadeFromAndTo =
		[
			venueToFadeFrom, venueToFadeTo
		];

		this.millisecondsPerFade = (millisecondsPerFade == null ? 250 : millisecondsPerFade);

		if (venueToFadeFrom == venueToFadeTo)
		{
			this.venueIndexCurrent = 1;
			this.millisecondsPerFade *= 2;
		}
		else
		{
			this.venueIndexCurrent = 0;
		}

		this.backgroundColor =
			(backgroundColor == null ? Color.Instances().Black : backgroundColor);
	}

	initialize(universe)
	{
		var venueToFadeTo = this.venueToFadeTo();
		if (venueToFadeTo.initialize != null)
		{
			venueToFadeTo.initialize(universe);
		}
	};

	updateForTimerTick(universe)
	{
		this.draw(universe);

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
				universe.venueNext = this.venueCurrent();
			}

			alphaOfFadeColor = 1 - fractionOfFadeCompleted;
		}

		alphaOfFadeColor *= alphaOfFadeColor;
		var fadeColor = this.backgroundColor.clone().alphaSet(alphaOfFadeColor * this.backgroundColor.alpha());

		var display = universe.display;
		display.drawRectangle
		(
			new Coords(0, 0),
			display.sizeDefault(), // Scaled automatically.
			fadeColor.systemColor()
		);
	};

	venueToFadeTo()
	{
		return this.venuesToFadeFromAndTo[1];
	};

	venueCurrent()
	{
		return this.venuesToFadeFromAndTo[this.venueIndexCurrent];
	};

	draw(universe)
	{
		var venueCurrent = this.venueCurrent();
		if (venueCurrent != null)
		{
			venueCurrent.draw(universe);
		}
	};
}
