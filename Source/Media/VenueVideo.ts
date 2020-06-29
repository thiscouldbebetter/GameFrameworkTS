
class VenueVideo
{
	constructor(videoName, venueNext)
	{
		this.videoName = videoName;
		this.venueNext = venueNext;

		this.hasVideoBeenStarted = false;

		var inputNames = Input.Names();
		this.actionToInputsMappings =
		[
			new ActionToInputsMapping("VideoSkip", [ inputNames.Escape, inputNames.GamepadButton0 + "0"], true),
		];

		this.actionToInputsMappings.addLookupsMultiple(x => x.inputNames);
	}

	draw()
	{
		// do nothing
	};

	updateForTimerTick(universe)
	{
		if (this.video == null)
		{
			universe.platformHelper.platformableHide(universe.display);
			this.video = universe.videoHelper.videos[this.videoName];
			this.video.play(universe);
		}

		if (this.video.isFinished == false)
		{
			var shouldVideoBeStopped = false;

			var inputHelper = universe.inputHelper;
			if (inputHelper.isMouseClicked())
			{
				inputHelper.isMouseClicked(false);
				shouldVideoBeStopped = true;
			}
			else
			{
				var inputsPressed = inputHelper.inputsPressed;
				for (var i = 0; i < inputsPressed.length; i++)
				{
					var inputPressed = inputsPressed[i];
					if (inputPressed.isActive)
					{
						var actionToInputsMapping = this.actionToInputsMappings[inputPressed.name];
						if (actionToInputsMapping != null)
						{
							inputPressed.isActive = false;
							var actionName = actionToInputsMapping.actionName;
							if (actionName == "VideoSkip")
							{
								shouldVideoBeStopped = true;
							}
						}
					}
				}
			}

			if (shouldVideoBeStopped)
			{
				this.video.stop(universe.platformHelper);
			}
		}

		if (this.video.isFinished)
		{
			var display = universe.display;
			display.drawBackground("Black", "Black");
			universe.platformHelper.platformableShow(display);
			universe.venueNext = new VenueFader(this.venueNext, this);
		}
	};
}
