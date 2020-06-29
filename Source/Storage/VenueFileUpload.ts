
class VenueFileUpload
{
	constructor(venueNextIfFileSpecified, venueNextIfCancelled)
	{
		this.venueNextIfFileSpecified = venueNextIfFileSpecified;
		this.venueNextIfCancelled = venueNextIfCancelled;

		var inputNames = Input.Names();
		this.actionToInputsMappings =
		[
			new ActionToInputsMapping(ControlActionNames.ControlCancel, [ inputNames.Escape, inputNames.GamepadButton0 + "0"], true),
		];

		this.actionToInputsMappings.addLookupsMultiple(x => x.inputNames);
	}

	// venue

	finalize(universe)
	{
		var platformHelper = universe.platformHelper;
		platformHelper.platformableRemove(this);
		var display = universe.display;
		display.drawBackground("Black");
		platformHelper.platformableShow(display);
	};

	initialize(universe)
	{
		var display = universe.display;

		universe.platformHelper.platformableHide(display);

		var divFileUpload = document.createElement("div");
		divFileUpload.style =
			"border:1px solid;width:" + display.sizeInPixels.x
			+ ";height:" + display.sizeInPixels.y;

		var labelInstructions = document.createElement("label");
		labelInstructions.innerHTML =
			"Choose a file and click Load."
			+ "  Due to web browser security features,"
			+ " a mouse or keyboard will likely be necessary.";
		divFileUpload.appendChild(labelInstructions);

		var inputFileUpload = document.createElement("input");
		inputFileUpload.type = "file";
		var divInputFileUpload = document.createElement("div");
		divInputFileUpload.appendChild(inputFileUpload);
		divFileUpload.appendChild(divInputFileUpload);

		var buttonLoad = document.createElement("button");
		buttonLoad.innerHTML = "Load";
		buttonLoad.onclick = this.buttonLoad_Clicked.bind(this, universe);

		var buttonCancel = document.createElement("button");
		buttonCancel.innerHTML = "Cancel";
		buttonCancel.onclick = this.buttonCancel_Clicked.bind(this, universe);

		var divButtons = document.createElement("div");
		divButtons.appendChild(buttonLoad);
		divButtons.appendChild(buttonCancel);
		divFileUpload.appendChild(divButtons);

		this.domElement = divFileUpload;

		universe.platformHelper.platformableAdd(this);

		inputFileUpload.focus();
	};

	updateForTimerTick(universe)
	{
		var inputHelper = universe.inputHelper;
		var inputsPressed = inputHelper.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive == true)
			{
				var actionToInputsMapping = this.actionToInputsMappings[inputPressed.name];
				if (actionToInputsMapping != null)
				{
					inputPressed.isActive = false;
					var actionName = actionToInputsMapping.actionName;
					if (actionName == ControlActionNames.Instances().ControlCancel)
					{
						universe.venueNext = this.venueNextIfCancelled;
					}
				}
			}
		}
	};

	// events

	buttonCancel_Clicked(universe, event)
	{
		universe.venueNext = this.venueNextIfCancelled;
	};

	buttonLoad_Clicked(universe, event)
	{
		var inputFileUpload = this.domElement.getElementsByTagName("input")[0];
		var fileToLoad = inputFileUpload.files[0];
		if (fileToLoad != null)
		{
			universe.venueNext = this.venueNextIfFileSpecified;
		}
	};

	// platformable

	toDomElement()
	{
		return this.domElement;
	};
}
