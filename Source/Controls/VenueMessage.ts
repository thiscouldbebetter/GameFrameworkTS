
class VenueMessage
{
	messageToShow: string;
	acknowledge: any;
	venuePrev: any;
	_sizeInPixels: Coords;
	showMessageOnly: boolean;

	_venueInner: any;

	constructor(messageToShow, acknowledge, venuePrev, sizeInPixels, showMessageOnly)
	{
		this.messageToShow = messageToShow;
		this.acknowledge = acknowledge;
		this.venuePrev = venuePrev;
		this._sizeInPixels = sizeInPixels;
		this.showMessageOnly = showMessageOnly || false;
	}

	// instance methods

	draw(universe)
	{
		this.venueInner(universe).draw(universe);
	};

	sizeInPixels(universe)
	{
		return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
	};

	updateForTimerTick(universe)
	{
		this.venueInner(universe).updateForTimerTick(universe);
	};

	venueInner(universe)
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

			this._venueInner = new VenueLayered(venuesToLayer, null);
		}

		return this._venueInner;
	};
}
