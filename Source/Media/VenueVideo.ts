
namespace ThisCouldBeBetter.GameFramework
{

export class VenueVideo implements Venue
{
	videoName: string;
	venueNext: Venue;

	actionToInputsMappings: ActionToInputsMapping[];
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;
	hasVideoBeenStarted: boolean;
	video: Video;

	constructor(videoName: string, venueNext: Venue)
	{
		this.videoName = videoName;
		this.venueNext = venueNext;

		this.hasVideoBeenStarted = false;

		var inputs = Input.Instances();
		var controlActionNames = ControlActionNames.Instances();
		this.actionToInputsMappings =
		[
			ActionToInputsMapping.fromActionNameAndInputNames
			(
				controlActionNames.ControlCancel,
				[
					inputs.Escape.name,
					inputs.GamepadButton0.name + "0"
				]
			),
		];

		this.actionToInputsMappingsByInputName =
			ArrayHelper.addLookupsMultiple
			(
				this.actionToInputsMappings,
				(x: ActionToInputsMapping) => x.inputNames
			);
	}

	static fromVideoNameAndVenueNext(videoName: string, venueNext: Venue): VenueVideo
	{
		return new VenueVideo(videoName, venueNext);
	}

	draw(): void
	{
		// do nothing
	}

	finalize(universe: Universe): void {}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe): void {}

	initializeIsComplete(): boolean { return true; }

	updateForTimerTick(universe: Universe): void
	{
		if (this.video == null)
		{
			universe.platformHelper.platformableHide(universe.display);
			this.video = universe.videoHelper.videosByName.get(this.videoName);
			this.video.play(universe);
		}

		if (this.video.isFinished == false)
		{
			var shouldVideoBeStopped = false;

			var inputHelper = universe.inputHelper;
			if (inputHelper.isMouseClicked())
			{
				inputHelper.mouseClickedSet(false);
				shouldVideoBeStopped = true;
			}
			else
			{
				var controlActionNames = ControlActionNames.Instances();
				var inputsPressed = inputHelper.inputsPressed;
				for (var i = 0; i < inputsPressed.length; i++)
				{
					var inputPressed = inputsPressed[i];
					if (inputPressed.isActive)
					{
						var actionToInputsMapping =
							this.actionToInputsMappingsByInputName.get(inputPressed.name);

						if (actionToInputsMapping != null)
						{
							inputPressed.isActive = false;
							var actionName = actionToInputsMapping.actionName;
							if (actionName == controlActionNames.ControlCancel)
							{
								shouldVideoBeStopped = true;
							}
						}
					}
				}
			}

			if (shouldVideoBeStopped)
			{
				this.video.stop(universe.platformHelper);
			}
		}

		if (this.video.isFinished)
		{
			var display = universe.display;
			var colorBlack = Color.Instances().Black;
			display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);
			universe.platformHelper.platformableShow(display);
			universe.venueTransitionTo(this.venueNext);
		}
	}
}

}
