
function VenueVideo(videoName, venueNext)
{
	this.videoName = videoName;
	this.venueNext = venueNext;

	this.hasVideoBeenStarted = false;

	this.actionToInputsMappings =
	[
		new ActionToInputsMapping("VideoSkip", ["Escape", "Gamepad0Button0"], true),
	];

	ActionToInputsMapping.addLookupsByInputName(this.actionToInputsMappings);
}

{
	VenueVideo.prototype.draw = function()
	{
		// do nothing
	};

	VenueVideo.prototype.updateForTimerTick = function(universe)
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
			if (inputHelper.isMouseClicked() == true)
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
					if (inputPressed.isActive == true)
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

			if (shouldVideoBeStopped == true)
			{
				this.video.stop(universe.platformHelper);
			}
		}

		if (this.video.isFinished == true)
		{
			var display = universe.display;
			display.drawBackground("Black", "Black");
			universe.platformHelper.platformableShow(display);
			universe.venueNext = new VenueFader(this.venueNext, this);
		}
	};
}
