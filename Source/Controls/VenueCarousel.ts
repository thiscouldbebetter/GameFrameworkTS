
namespace ThisCouldBeBetter.GameFramework
{

export class VenueCarousel implements Venue
{
	name: string;
	loopsBackToSlideFirstAfterLast: boolean;
	secondsPerSlideMax: number;
	inputToAdvanceToNextSlide: Input;
	inputToSkipToEndOfSlideshow: Input;
	venuesForSlides: Venue[];
	_done: (u: Universe) => void;

	slideCurrentIndex: number;
	timeSlideCurrentStartedAt: Date;

	constructor
	(
		name: string,
		loopsBackToSlideFirstAfterLast: boolean,
		secondsPerSlideMax: number,
		inputToAdvanceToNextSlide: Input,
		inputToSkipToEndOfSlideshow: Input,
		venuesForSlides: Venue[],
		done: (u: Universe) => void
	)
	{
		this.name = name;
		this.loopsBackToSlideFirstAfterLast = loopsBackToSlideFirstAfterLast;
		this.secondsPerSlideMax = secondsPerSlideMax;
		this.inputToAdvanceToNextSlide =
			inputToAdvanceToNextSlide || Input.Instances().Enter;
		this.inputToSkipToEndOfSlideshow =
			inputToSkipToEndOfSlideshow || Input.Instances().Escape;
		this.venuesForSlides = venuesForSlides;
		this._done = done;

		this.slideCurrentIndex = 0;
		this.timeSlideCurrentStartedAt = new Date();
	}

	static fromNameLoopSecondsInputsAdvanceAndSkipSlidesAndDone
	(
		name: string,
		loopsBackToSlideFirstAfterLast: boolean,
		secondsPerSlideMax: number,
		inputToAdvanceToNextSlide: Input,
		inputToSkipToEndOfSlideshow: Input,
		venuesForSlides: Venue[],
		done: (u: Universe) => void
	): VenueCarousel
	{
		return new VenueCarousel
		(
			name,
			loopsBackToSlideFirstAfterLast,
			secondsPerSlideMax,
			inputToAdvanceToNextSlide,
			inputToSkipToEndOfSlideshow,
			venuesForSlides,
			done
		);
	}

	static fromSecondsVenuesForSlidesAndDoneLooping
	(
		secondsPerSlide: number,
		venuesForSlides: Venue[],
		done: (u: Universe) => void
	): VenueCarousel
	{
		var inputs = Input.Instances();

		return new VenueCarousel
		(
			VenueCarousel.name,
			true, // loopsBackToSlideFirstAfterLast,
			secondsPerSlide,
			inputs.Enter, // inputToAdvanceToNextSlide,
			inputs.Escape, // inputToSkipToEndOfSlideshow,
			venuesForSlides,
			done
		);
	}

	advanceToSlideNext(universe: Universe): void
	{
		var slideVenueCurrent = this.slideVenueCurrent();
		slideVenueCurrent.finalize(universe);

		var slideNextIndex = this.slideCurrentIndex + 1;

		if (slideNextIndex >= this.venuesForSlides.length)
		{
			slideNextIndex = 0;

			if (this.loopsBackToSlideFirstAfterLast == false)
			{
				this.done(universe);
			}
		}

		this.slideCurrentIndex = slideNextIndex;
		this.timeSlideCurrentStartedAt = new Date();

		var slideVenueCurrent = this.slideVenueCurrent();
		slideVenueCurrent.initialize(universe);
	}

	done(universe: Universe): void
	{
		if (this._done != null)
		{
			this._done.call(this, universe);
		}
	}

	slideVenueCurrent(): Venue
	{
		var slideVenue = this.venuesForSlides[this.slideCurrentIndex];
		return slideVenue;
	}

	skipToEndOfSlideshow(universe: Universe): void
	{
		this._done(universe);
	}

	// Venue.

	draw(universe: Universe): void
	{
		var slideVenueCurrent = this.slideVenueCurrent();
		slideVenueCurrent.draw(universe);
	}

	finalize(universe: Universe): void {}
	finalizeIsComplete(): boolean { return true; }
	initialize(universe: Universe): void {}
	initializeIsComplete(universe: Universe): boolean { return true; }

	updateForTimerTick(universe: Universe): void
	{
		var slideVenueCurrent = this.slideVenueCurrent();
		slideVenueCurrent.updateForTimerTick(universe);

		var now = new Date();
		var millisecondsSinceSlideCurrentStarted =
			now.getTime() - this.timeSlideCurrentStartedAt.getTime();
		var secondsSinceSlideCurrentStarted =
			millisecondsSinceSlideCurrentStarted / 1000;

		if (secondsSinceSlideCurrentStarted > this.secondsPerSlideMax)
		{
			this.advanceToSlideNext(universe);
		}
		else
		{
			var inputTracker = universe.inputTracker;
			var inputsActive = inputTracker.inputsActive();

			for (var i = 0; i < inputsActive.length; i++)
			{
				var inputActive = inputsActive[i];

				if (inputActive == this.inputToAdvanceToNextSlide)
				{
					this.advanceToSlideNext(universe);
				}
				else if (inputActive == this.inputToSkipToEndOfSlideshow)
				{
					this.skipToEndOfSlideshow(universe);
				}
			}
		}
	}

	/*
	static fromImageNamesAndMessagePairs
	(
		universe: Universe,
		size: Coords,
		secondsPerSlide: number,
		venueAfterSlideshow: Venue,
		imageNamesAndMessagePairsForSlides: string[][]
	): VenueCarousel
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var visualsForSlides =
			this.visualsForSlides(universe, size, imageNamesAndMessagePairsForSlides);

		var venuesForSlides = this.visualsForSlidesToVenues
		(
			universe,
			size,
			secondsPerSlide,
			venueAfterSlideshow,
			visualsForSlides
		);

		var slideshow = new VenueCarousel(VenueCarousel.name, venueAfterSlideshow, venuesForSlides);

		return slideshow;
	}

	static visualsForSlidesToVenues
	(
		universe: Universe,
		size: Coords,
		secondsPerSlide: number,
		venueAfterSlideshow: Venue,
		visualsForSlides: Visual[]
	): Venue[]
	{
		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var zeroes = Coords.Instances().Zeroes;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			controlBuilder._scaleMultiplier
				.overwriteWith(size)
				.divide(controlBuilder.sizeBase);

		var venuesForSlides: Venue[] = [];

		var skipToEndOfSlideshow = () =>
		{
			universe.venueTransitionTo(venueAfterSlideshow);
		};

		var controlsForSlideImagesAndTexts =
			this.controlsForSlideImagesAndTexts(universe, visualsForSlides);

		for (var i = 0; i < controlsForSlideImagesAndTexts.length; i++)
		{
			var controlForSlideImageAndText =
				controlsForSlideImagesAndTexts[i];

			var advanceToSlideNext =
				() => console.log("todo - advance to next slide");

			var buttonNext = ControlButton.fromPosSizeTextFontClick
			(
				Coords.fromXY(75, 120), // pos
				Coords.fromXY(50, 40), // size
				"Next",
				controlBuilder.fontBase,
				advanceToSlideNext
			);

			var controlActionNames = ControlActionNames.Instances();
			var actions =
			[
				Action.fromNameAndPerform(controlActionNames.ControlCancel, skipToEndOfSlideshow),
				Action.fromNameAndPerform(controlActionNames.ControlConfirm, advanceToSlideNext)
			];

			var containerSlide =
				ControlContainer.fromNamePosSizeChildrenAndActions
				(
					"containerSlide_" + i,
					zeroes,
					sizeBase.clone(),
					[
						controlForSlideImageAndText,
						buttonNext
					],
					actions
				);

			if (secondsPerSlide != null)
			{
				var controlTimer = ControlTimer.fromNameSecondsToWaitAndElapsed
				(
					"Advance to Next Slide Automatically",
					secondsPerSlide,
					advanceToSlideNext
				);

				containerSlide.childAdd(controlTimer)
			}

			containerSlide.scalePosAndSize(scaleMultiplier);

			var slideAsVenue = containerSlide.toVenue();

			venuesForSlides.push(slideAsVenue);
		}

		return venuesForSlides;
	}
	*/


}

}