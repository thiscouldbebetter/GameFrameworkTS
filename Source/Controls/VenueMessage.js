
function VenueMessage(messageToShow, acknowledge, venuePrev, sizeInPixels)
{
	this.messageToShow = messageToShow;
	this.acknowledge = acknowledge;
	this.venuePrev = venuePrev;
	this._sizeInPixels = sizeInPixels;
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
			var controlMessage = universe.controlBuilder.message
			(
				universe,
				this.sizeInPixels(universe),
				this.messageToShow,
				this.acknowledge //.bind(this, universe)
			);

			var venuesToLayer =
			[
				new VenueControls(controlMessage)
			];

			if (this.venuePrev != null)
			{
				venuesToLayer.insertElementAt(this.venuePrev, 0);
			}

			this._venueInner = new VenueLayered(venuesToLayer);
		}

		return this._venueInner;
	};
}
