
namespace ThisCouldBeBetter.GameFramework
{

export class VenueFileUpload implements Venue
{
	venueNextIfFileSpecified: Venue;
	venueNextIfCancelled: Venue;
	actionToInputsMappings: ActionToInputsMapping[];
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;

	domElement: HTMLElement;

	constructor(venueNextIfFileSpecified: Venue, venueNextIfCancelled: Venue)
	{
		this.venueNextIfFileSpecified = venueNextIfFileSpecified;
		this.venueNextIfCancelled = venueNextIfCancelled;

		var inputs = Input.Instances();
		var controlActionNames = ControlActionNames.Instances();

		this.actionToInputsMappings =
		[
			new ActionToInputsMapping
			(
				controlActionNames.ControlCancel,
				[
					inputs.Escape.name,
					inputs.GamepadButton0.name + "0"
				],
				true
			),
		];

		this.actionToInputsMappingsByInputName =
			ArrayHelper.addLookupsMultiple
			(
				this.actionToInputsMappings,
				(x: ActionToInputsMapping) => x.inputNames
			);
	}

	// venue

	draw(universe: Universe): void {}

	finalize(universe: Universe): void
	{
		var platformHelper = universe.platformHelper;
		platformHelper.platformableRemove(this);
		var display = universe.display;
		var colorBlack = Color.Instances().Black;
		display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);
		platformHelper.platformableShow(display);
	}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe): void
	{
		var display = universe.display;

		universe.platformHelper.platformableHide(display);

		if (this.domElement == null)
		{
			var d = document;

			var divFileUpload = d.createElement("div");

			/*
			// todo - Style is read-only?
			divFileUpload.style =
				"border:1px solid;width:" + display.sizeInPixels.x
				+ ";height:" + display.sizeInPixels.y;
			*/

			var labelInstructions = d.createElement("label");
			labelInstructions.innerHTML =
				"Choose a file and click Load."
				+ "  Due to web browser security features,"
				+ " a mouse or keyboard will likely be necessary.";
			divFileUpload.appendChild(labelInstructions);

			var inputFileUpload = d.createElement("input");
			inputFileUpload.type = "file";
			var divInputFileUpload = d.createElement("div");
			divInputFileUpload.appendChild(inputFileUpload);
			divFileUpload.appendChild(divInputFileUpload);

			var buttonLoad = d.createElement("button");
			buttonLoad.innerHTML = "Load";
			buttonLoad.onclick = this.buttonLoad_Clicked.bind(this, universe);

			var buttonCancel = d.createElement("button");
			buttonCancel.innerHTML = "Cancel";
			buttonCancel.onclick = this.buttonCancel_Clicked.bind(this, universe);

			var divButtons = d.createElement("div");
			divButtons.appendChild(buttonLoad);
			divButtons.appendChild(buttonCancel);
			divFileUpload.appendChild(divButtons);

			this.domElement = divFileUpload;

			universe.platformHelper.platformableAdd(this);

			inputFileUpload.focus();
		}
	}

	initializeIsComplete(): boolean { return true; }

	updateForTimerTick(universe: Universe): void
	{
		var inputHelper = universe.inputHelper;
		var inputsPressed = inputHelper.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive == true)
			{
				var actionToInputsMapping =
					this.actionToInputsMappingsByInputName.get(inputPressed.name);
				if (actionToInputsMapping != null)
				{
					inputPressed.isActive = false;
					var actionName = actionToInputsMapping.actionName;
					if (actionName == ControlActionNames.Instances().ControlCancel)
					{
						universe.venueTransitionTo(this.venueNextIfCancelled);
					}
				}
			}
		}
	}

	// events

	buttonCancel_Clicked(universe: Universe, event: Event): void
	{
		universe.venueTransitionTo(this.venueNextIfCancelled);
	}

	buttonLoad_Clicked(universe: Universe, event: Event): void
	{
		var inputFileUpload = this.domElement.getElementsByTagName("input")[0];
		var fileToLoad = inputFileUpload.files[0];
		if (fileToLoad != null)
		{
			universe.venueTransitionTo(this.venueNextIfFileSpecified);
		}
	}

	// platformable

	toDomElement(): HTMLElement
	{
		return this.domElement;
	}
}

}
