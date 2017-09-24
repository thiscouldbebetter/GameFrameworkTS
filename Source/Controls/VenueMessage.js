
function VenueMessage(messageToShow, acknowledge)
{
	this.messageToShow = messageToShow;
	this.acknowledge = acknowledge;
}
{
	VenueMessage.prototype.draw = function()
	{
		if (this.venueControls == null)
		{
			this.venueControls = new VenueControls
			(
				Globals.Instance.controlBuilder.message
				(
					Globals.Instance.display.sizeInPixels,
					this.messageToShow,
					// acknowledge
					function()
					{
						this.acknowledge()
					}.bind(this)
				)
			);
		}

		this.venueControls.draw();
	}

	VenueMessage.prototype.updateForTimerTick = function(world)
	{
		this.venueControls.updateForTimerTick();
	}
}
