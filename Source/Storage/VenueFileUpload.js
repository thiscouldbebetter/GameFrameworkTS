
function VenueFileUpload(venueNextIfFileSpecified, venueNextIfCancelled)
{
	this.venueNextIfFileSpecified = venueNextIfFileSpecified;
	this.venueNextIfCancelled = venueNextIfCancelled;

	this.inputToActionMappings =
	[
		new InputToActionMapping("Escape", "ControlCancel", true),
		new InputToActionMapping("Gamepad0Button0", "ControlCancel", true),
	].addLookups("inputName");
}

{
	// venue

	VenueFileUpload.prototype.finalize = function(universe)
	{
		universe.platformHelper.domElementRemove(this.domElement);

		var display = universe.display;
		display.clear("Black");
		display.show(universe);
	}

	VenueFileUpload.prototype.initialize = function(universe)
	{
		var display = universe.display;
		display.hide(universe);

		var divFileUpload = document.createElement("div");
		divFileUpload.style =
			"border:1px solid;width:" + display.sizeInPixels.x
			+ ";height:" + display.sizeInPixels.y;

		var labelInstructions = document.createElement("label");
		labelInstructions.innerHTML =
			"Choose a file and click Load."
			+ "  Due to web browser security features,"
			+ " a mouse or keyboard will likely be necessary."
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

		universe.platformHelper.domElementAdd(divFileUpload);

		inputFileUpload.focus();

		this.domElement = divFileUpload;
	}

	VenueFileUpload.prototype.updateForTimerTick = function(universe)
	{
		var inputHelper = universe.inputHelper;
		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			var inputToActionMapping = this.inputToActionMappings[inputActive];
			if (inputToActionMapping != null)
			{
				inputHelper.inputInactivate(inputActive);
				var actionName = inputToActionMapping.actionName;
				if (actionName == "ControlCancel")
				{
					universe.venueNext = this.venueNextIfCancelled;
				}
			}
		}
	}

	// events

	VenueFileUpload.prototype.buttonCancel_Clicked = function(universe, event)
	{
		universe.venueNext = this.venueNextIfCancelled;
	}

	VenueFileUpload.prototype.buttonLoad_Clicked = function(universe, event)
	{
		var inputFileUpload = this.domElement.getElementsByTagName("input")[0];
		var fileToLoad = inputFileUpload.files[0];
		if (fileToLoad != null)
		{
			universe.venueNext = this.venueNextIfFileSpecified;
		}
	}
}
