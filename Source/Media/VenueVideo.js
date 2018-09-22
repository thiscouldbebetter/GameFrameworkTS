
function VenueVideo(videoName, venueNext)
{
	this.videoName = videoName;
	this.venueNext = venueNext;

	this.hasVideoBeenStarted = false;

	this.inputToActionMappings =
	[
		new InputToActionMapping("Escape", "VideoSkip", true),
		new InputToActionMapping("Gamepad0Button0", "VideoSkip", true),
	].addLookups("inputName");
}

{
	VenueVideo.prototype.draw = function()
	{
		// do nothing
	}

	VenueVideo.prototype.updateForTimerTick = function(universe)
	{
		if (this.video == null)
		{
			universe.display.hide(universe);
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
						var inputToActionMapping = this.inputToActionMappings[inputPressed.name];
						if (inputToActionMapping != null)
						{
							inputPressed.isActive = false;
							var actionName = inputToActionMapping.actionName;
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
				this.video.stop(universe);
			}
		}

		if (this.video.isFinished == true)
		{
			var display = universe.display;
			display.drawBackground("Black", "Black");
			display.show(universe);
			universe.venueNext = new VenueFader(this.venueNext, this);
		}
	}
}
