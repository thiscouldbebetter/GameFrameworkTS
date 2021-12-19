
namespace ThisCouldBeBetter.GameFramework
{

export class VenueMessage<TContext> implements Venue
{
	messageToShow: DataBinding<TContext, string>;
	acknowledge: () => void;
	venuePrev: Venue;
	_sizeInPixels: Coords;
	showMessageOnly: boolean;

	_venueInner: Venue;

	constructor
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: () => void,
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

	static fromMessage<TContext>
	(
		message: DataBinding<TContext, string>
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAndAcknowledge(message, null);
	}

	static fromMessageAndAcknowledge<TContext>
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: () => void
	): VenueMessage<TContext>
	{
		return new VenueMessage<TContext>(messageToShow, acknowledge, null, null, null);
	}

	static fromText<TContext>(text: string): VenueMessage<TContext>
	{
		return VenueMessage.fromMessage<TContext>
		(
			DataBinding.fromGet( (c: TContext) => text )
		);
	}

	static fromTextAndAcknowledge<TContext>
	(
		text: string, acknowledge: () => void
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAndAcknowledge
		(
			DataBinding.fromGet( (c: TContext) => text ),
			acknowledge
		);
	}

	// instance methods

	draw(universe: Universe): void
	{
		this.venueInner(universe).draw(universe);
	}

	finalize(universe: Universe): void {}

	initialize(universe: Universe): void {}

	updateForTimerTick(universe: Universe): void
	{
		this.venueInner(universe).updateForTimerTick(universe);
	}

	sizeInPixels(universe: Universe): Coords
	{
		if (this._sizeInPixels == null)
		{
			this._sizeInPixels = universe.display.sizeInPixels.clone();
		}

		return this._sizeInPixels;
	}

	venueInner(universe: Universe): Venue
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
