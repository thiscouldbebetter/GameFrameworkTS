
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
	VenueVideo.prototype.updateForTimerTick = function()
	{
		if (this.video == null)
		{
			Globals.Instance.display.hide();
			this.video = Globals.Instance.videoHelper.videos[this.videoName];
			this.video.play();
		}

		var hasUserSkippedVideo = false;
		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			hasUserSkippedVideo = true;
		}
		else 
		{
			var inputsActive = inputHelper.inputsActive;
			for (var i = 0; i < inputsActive.length; i++)
			{
				var inputActive = inputsActive[i];
				var inputToActionMapping = this.inputToActionMappings[inputActive];
				if (inputToActionMapping != null)
				{
					inputHelper.inputInactivate(inputActive);
					var actionName = inputToActionMapping.actionName;
					if (actionName == "VideoSkip")
					{
						hasUserSkippedVideo = true;
					}
				}
			}
		}
		
		if (hasUserSkippedVideo == true)
		{
			this.video.stop();
			var display = Globals.Instance.display;
			display.clear("Black");
			display.show();
			var universe = Globals.Instance.universe;
			universe.venueNext = this.venueNext;
		}
	}
}
