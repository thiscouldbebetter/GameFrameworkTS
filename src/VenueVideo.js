
function VenueVideo(videoName, venueNext)
{
	this.videoName = videoName;
	this.venueNext = venueNext;

	this.hasVideoBeenStarted = false;
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

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			this.video.stop();
		}

		if (this.video.isFinished == true)
		{
			var display = Globals.Instance.display;
			display.clear("Black");
			display.show();
			var universe = Globals.Instance.universe;
			universe.venueNext = this.venueNext;
		}
	}
}
