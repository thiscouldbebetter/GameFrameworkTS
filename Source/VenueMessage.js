
function VenueMessage(messageToShow, venueNext)
{
	this.messageToShow = messageToShow;
	this.venueNext = venueNext;
	
	this.venueControls = new VenueControls
	(
		Globals.Instance.controlBuilder.message
		(
			Globals.Instance.display.sizeInPixels,
			this.messageToShow,
			// acknowledge
			function()
			{
				Globals.Instance.universe.venueNext = venueNext;
			}
		)
	);
}

{
	VenueMessage.prototype.draw = function()
	{
		this.venueControls.draw();
	}
	
	VenueMessage.prototype.updateForTimerTick = function(world)
	{
		this.venueControls.updateForTimerTick();
	}
}
