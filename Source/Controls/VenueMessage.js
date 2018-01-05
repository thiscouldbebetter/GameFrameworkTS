
function VenueMessage(messageToShow, venueNext, venuePrev, sizeInPixels)
{
	this.messageToShow = messageToShow;
	this.venueNext = venueNext;
	this.venuePrev = venuePrev;
	this._sizeInPixels = sizeInPixels;
}
{
	// instance methods

	VenueMessage.prototype.acknowledge = function(universe)
	{
		universe.venueNext = new VenueFader(this.venueNext, this.venueInner());
	}

	VenueMessage.prototype.draw = function(universe)
	{
		this.venueInner(universe).draw(universe);
	}

	VenueMessage.prototype.sizeInPixels = function(universe)
	{
		return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
	}

	VenueMessage.prototype.updateForTimerTick = function(universe)
	{
		this.venueInner(universe).updateForTimerTick(universe);
	}

	VenueMessage.prototype.venueInner = function(universe)
	{
		if (this._venueInner == null)
		{
			this._venueInner = new VenueLayered
			([
				this.venuePrev,
				new VenueControls
				(
					universe.controlBuilder.message
					(
						universe,
						this.sizeInPixels(universe),
						this.messageToShow,
						this.acknowledge.bind(this, universe)
					)
				)
			]);
		}
		return this._venueInner;
	}
}
