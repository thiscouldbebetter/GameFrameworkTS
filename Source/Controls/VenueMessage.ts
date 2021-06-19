
namespace ThisCouldBeBetter.GameFramework
{

export class VenueMessage implements Venue
{
	messageToShow: DataBinding<any, string>;
	acknowledge: ()=>void;
	venuePrev: Venue;
	_sizeInPixels: Coords;
	showMessageOnly: boolean;

	_venueInner: Venue;

	constructor
	(
		messageToShow: DataBinding<any, string>,
		acknowledge: ()=>void,
		venuePrev: Venue,
		sizeInPixels: Coords,
		showMessageOnly: boolean
	)
	{
		this.messageToShow = messageToShow;
		this.acknowledge = acknowledge;
		this.venuePrev = venuePrev;
		this._sizeInPixels = sizeInPixels;
		this.showMessageOnly = showMessageOnly || false;
	}

	static fromMessage(message: DataBinding<any,string>)
	{
		return VenueMessage.fromMessageAndAcknowledge(message, null);
	}

	static fromMessageAndAcknowledge
	(
		messageToShow: DataBinding<any, string>, acknowledge: any
	)
	{
		return new VenueMessage(messageToShow, acknowledge, null, null, null);
	}

	static fromText(message: string)
	{
		return VenueMessage.fromMessage(DataBinding.fromContext(message));
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

			venuesToLayer.push(controlMessage.toVenue());

			this._venueInner = new VenueLayered(venuesToLayer, null);
		}

		return this._venueInner;
	}
}

}
