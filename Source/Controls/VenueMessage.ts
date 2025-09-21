
namespace ThisCouldBeBetter.GameFramework
{

export class VenueMessage<TContext> implements Venue
{
	messageToShow: DataBinding<TContext, string>;
	_acknowledge: (uwpe: UniverseWorldPlaceEntities) => void;
	venuePrev: Venue;
	_sizeInPixels: Coords;
	showMessageOnly: boolean;
	secondsToShow: number;

	_venueInner: Venue;

	constructor
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		venuePrev: Venue,
		sizeInPixels: Coords,
		showMessageOnly: boolean,
		secondsToShow: number
	)
	{
		this.messageToShow = messageToShow;
		this._acknowledge = acknowledge;
		this.venuePrev = venuePrev;
		this._sizeInPixels = sizeInPixels;
		this.showMessageOnly = showMessageOnly || false;
		this.secondsToShow = secondsToShow;
	}

	static fromMessage<TContext>
	(
		message: DataBinding<TContext, string>
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAndAcknowledge(message, null);
	}

	static fromMessageAcknowledgeAndSize<TContext>
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		sizeInPixels: Coords
	): VenueMessage<TContext>
	{
		return new VenueMessage<TContext>
		(
			messageToShow,
			acknowledge,
			null, // venuePrev
			sizeInPixels,
			null, // showMessageOnly
			null // secondsToShow
		);
	}

	static fromMessageAcknowledgeAndVenuePrev<TContext>
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		venuePrev: Venue
	): VenueMessage<TContext>
	{
		return new VenueMessage<TContext>
		(
			messageToShow, acknowledge, venuePrev,
			null, null, null
		);
	}

	static fromMessageAndAcknowledge<TContext>
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void
	): VenueMessage<TContext>
	{
		return new VenueMessage<TContext>(messageToShow, acknowledge, null, null, null, null);
	}

	static fromMessageAcknowledgeVenuePrevSizeAndShowMessageOnly<TContext>
	(
		messageToShow: DataBinding<TContext, string>,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		venuePrev: Venue,
		sizeInPixels: Coords,
		showMessageOnly: boolean
	) : VenueMessage<TContext>
	{
		return new VenueMessage
		(
			messageToShow, acknowledge, venuePrev, sizeInPixels, showMessageOnly,
			null // secondsToShow
		);
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
		text: string,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAndAcknowledge
		(
			DataBinding.fromGet( (c: TContext) => text ),
			acknowledge
		);
	}

	static fromTextAndAcknowledgeNoButtons<TContext>
	(
		text: string,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAndAcknowledge
		(
			DataBinding.fromGet( (c: TContext) => text ),
			acknowledge
		).showMessageOnlySet(true);
	}

	static fromTextNoButtons<TContext>(text: string): VenueMessage<TContext>
	{
		return VenueMessage.fromMessage<TContext>
		(
			DataBinding.fromGet( (c: TContext) => text )
		).showMessageOnlySet(true);
	}

	static fromTextAcknowledgeAndSize<TContext>
	(
		text: string,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		sizeInPixels: Coords
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAcknowledgeAndSize
		(
			DataBinding.fromGet( (c: TContext) => text ),
			acknowledge,
			sizeInPixels
		);
	}

	static fromTextAcknowledgeAndVenuePrev<TContext>
	(
		text: string,
		acknowledge: (uwpe: UniverseWorldPlaceEntities) => void,
		venuePrev: Venue
	): VenueMessage<TContext>
	{
		return VenueMessage.fromMessageAcknowledgeAndVenuePrev
		(
			DataBinding.fromGet( (c: TContext) => text ),
			acknowledge,
			venuePrev
		);
	}

	// instance methods

	acknowledge(uwpe: UniverseWorldPlaceEntities): void
	{
		this._acknowledge(uwpe);

		// If this happens, any .venueNextSet() call
		// in the _acknowledge will be ignored.
		// var universe = uwpe.universe;
		// universe.venuePrevJumpTo();
	}

	draw(universe: Universe): void
	{
		this.venueInner(universe).draw(universe);
	}

	finalize(universe: Universe): void
	{
		this._venueInner.finalize(universe);
	}

	finalizeIsComplete(): boolean
	{
		return this._venueInner.finalizeIsComplete();
	}

	initialize(universe: Universe): void
	{
		var venueInner = this.venueInner(universe);
		venueInner.initialize(universe);
	}

	initializeIsComplete(universe: Universe): boolean
	{
		var venueInner = this.venueInner(universe);
		return venueInner.initializeIsComplete(universe);
	}

	updateForTimerTick(universe: Universe): void
	{
		var venueInner = this.venueInner(universe);
		venueInner.updateForTimerTick(universe);
	}

	secondsToShowSet(value: number): VenueMessage<TContext>
	{
		this.secondsToShow = value;
		return this;
	}

	showMessageOnlySet(value: boolean): VenueMessage<TContext>
	{
		this.showMessageOnly = value;
		return this;
	}

	sizeInPixels(universe: Universe): Coords
	{
		if (this._sizeInPixels == null)
		{
			this._sizeInPixels = universe.display.sizeDefault().clone();
		}

		return this._sizeInPixels;
	}

	venueInner(universe: Universe): Venue
	{
		if (this._venueInner == null)
		{
			var sizeInPixels = this.sizeInPixels(universe);

			var fontNameAndHeight = FontNameAndHeight.default();

			var controlMessage = universe.controlBuilder.message
			(
				universe,
				sizeInPixels,
				this.messageToShow,
				this.acknowledge.bind(this),
				this.showMessageOnly,
				fontNameAndHeight,
				this.secondsToShow
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
