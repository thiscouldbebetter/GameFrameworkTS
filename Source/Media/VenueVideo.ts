
class VenueVideo implements Venue
{
	videoName: string;
	venueNext: any;

	actionToInputsMappings: ActionToInputsMapping[];
	actionToInputsMappingsByInputName: any;
	hasVideoBeenStarted: boolean;
	video: Video;

	constructor(videoName: string, venueNext: Venue)
	{
		this.videoName = videoName;
		this.venueNext = venueNext;

		this.hasVideoBeenStarted = false;

		var inputNames = Input.Names();
		this.actionToInputsMappings =
		[
			new ActionToInputsMapping("VideoSkip", [ inputNames.Escape, inputNames.GamepadButton0 + "0"], true),
		];

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, (x: ActionToInputsMapping) => x.inputNames
		);
	}

	draw()
	{
		// do nothing
	};

	finalize(universe: Universe) {}
	initialize(universe: Universe) {}

	updateForTimerTick(universe: Universe)
	{
		if (this.video == null)
		{
			universe.platformHelper.platformableHide(universe.display);
			this.video = universe.videoHelper.videosByName[this.videoName];
			this.video.play(universe);
		}

		if (this.video.isFinished == false)
		{
			var shouldVideoBeStopped = false;

			var inputHelper = universe.inputHelper;
			if (inputHelper.isMouseClicked(null))
			{
				inputHelper.isMouseClicked(false);
				shouldVideoBeStopped = true;
			}
			else
			{
				var inputsPressed = inputHelper.inputsPressed;
				for (var i = 0; i < inputsPressed.length; i++)
				{
					var inputPressed = inputsPressed[i];
					if (inputPressed.isActive)
					{
						var actionToInputsMapping = this.actionToInputsMappingsByInputName[inputPressed.name];
						if (actionToInputsMapping != null)
						{
							inputPressed.isActive = false;
							var actionName = actionToInputsMapping.actionName;
							if (actionName == "VideoSkip")
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
			display.drawBackground("Black", "Black");
			universe.platformHelper.platformableShow(display);
			universe.venueNext = new VenueFader(this.venueNext, this, null, null);
		}
	};
}
