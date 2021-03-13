
namespace ThisCouldBeBetter.GameFramework
{

export class VenueMessage implements Venue
{
	messageToShow: DataBinding<any, string>;
	acknowledge: any;
	venuePrev: any;
	_sizeInPixels: Coords;
	showMessageOnly: boolean;

	_venueInner: any;

	constructor
	(
		messageToShow: DataBinding<any, string>, acknowledge: any, venuePrev: Venue,
		sizeInPixels: Coords, showMessageOnly: boolean
	)
	{
		this.messageToShow = messageToShow;
		this.acknowledge = acknowledge;
		this.venuePrev = venuePrev;
		this._sizeInPixels = sizeInPixels;
		this.showMessageOnly = showMessageOnly || false;
	}

	static fromText(message: string)
	{
		return new VenueMessage(new DataBinding(message, null, null), null, null, null, null);
	}

	// instance methods

	draw(universe: Universe)
	{
		this.venueInner(universe).draw(universe);
	}

	finalize(universe: Universe) {}

	initialize(universe: Universe) {}

	updateForTimerTick(universe: Universe)
	{
		this.venueInner(universe).updateForTimerTick(universe);
	}

	sizeInPixels(universe: Universe)
	{
		return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
	}

	venueInner(universe: Universe)
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

			venuesToLayer.push(new VenueControls(controlMessage, false));

			this._venueInner = new VenueLayered(venuesToLayer, null);
		}

		return this._venueInner;
	}
}

}
