
function VenueMessage(messageToShow, acknowledge, venuePrev, sizeInPixels, showMessageOnly)
{
	this.messageToShow = messageToShow;
	this.acknowledge = acknowledge;
	this.venuePrev = venuePrev;
	this._sizeInPixels = sizeInPixels;
	this.showMessageOnly = showMessageOnly;
}
{
	// instance methods

	VenueMessage.prototype.draw = function(universe)
	{
		this.venueInner(universe).draw(universe);
	};

	VenueMessage.prototype.sizeInPixels = function(universe)
	{
		return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
	};

	VenueMessage.prototype.updateForTimerTick = function(universe)
	{
		this.venueInner(universe).updateForTimerTick(universe);
	};

	VenueMessage.prototype.venueInner = function(universe)
	{
		if (this._venueInner == null)
		{
			var sizeInPixels = this.sizeInPixels(universe);

			var controlMessage = universe.controlBuilder.message
			(
				universe,
				sizeInPixels,
				this.messageToShow,
				this.acknowledge,
				this.showMessageOnly
			);

			var venuesToLayer = [];

			if (this.venuePrev != null)
			{
				venuesToLayer.push(this.venuePrev);
			}

			venuesToLayer.push(new VenueControls(controlMessage));

			this._venueInner = new VenueLayered(venuesToLayer);
		}

		return this._venueInner;
	};
}
