
function VenueMessage(messageToShow, acknowledge)
{
	this.messageToShow = messageToShow;
	this.acknowledge = acknowledge;
}
{
	VenueMessage.prototype.draw = function(universe)
	{
		if (this.venueControls == null)
		{
			this.venueControls = new VenueControls
			(
				universe.controlBuilder.message
				(
					universe,
					universe.display.sizeInPixels,
					this.messageToShow,
					// acknowledge
					function(universe)
					{
						this.acknowledge(universe)
					}.bind(this)
				)
			);
		}

		this.venueControls.draw(universe);
	}

	VenueMessage.prototype.updateForTimerTick = function(universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
