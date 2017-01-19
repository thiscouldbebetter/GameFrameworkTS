
function VenueFileUpload(venueNext)
{
	this.venueNext = venueNext;
}

{
	// venue
	
	VenueFileUpload.prototype.finalize = function()
	{
		Globals.Instance.divMain.removeChild(this.domElement);		
		
		var display = Globals.Instance.display;
		display.clear("Black");
		display.show();
	}	
	
	VenueFileUpload.prototype.initialize = function()
	{
		var display = Globals.Instance.display;
		display.hide();
		
		var divFileUpload = document.createElement("div");
		divFileUpload.style = 
			"border:1px solid;width:" + display.sizeInPixels.x 
			+ ";height:" + display.sizeInPixels.y;

		var labelInstructions = document.createElement("label");
		labelInstructions.innerHTML = "Choose a file and click Load."
		divFileUpload.appendChild(labelInstructions);
			
		var inputFileUpload = document.createElement("input");
		inputFileUpload.type = "file";
		var divInputFileUpload = document.createElement("div");
		divInputFileUpload.appendChild(inputFileUpload);
		divFileUpload.appendChild(divInputFileUpload);

		var buttonLoad = document.createElement("button");
		buttonLoad.innerHTML = "Load";
		buttonLoad.onclick = this.buttonLoad_Clicked.bind(this);
		
		var buttonCancel = document.createElement("button");
		buttonCancel.innerHTML = "Cancel";
		buttonCancel.onclick = this.buttonCancel_Clicked.bind(this);
		
		var divButtons = document.createElement("div");
		divButtons.appendChild(buttonLoad);
		divButtons.appendChild(buttonCancel);
		divFileUpload.appendChild(divButtons);

		
		Globals.Instance.divMain.appendChild(divFileUpload);
		
		this.domElement = divFileUpload;
	}
	
	VenueFileUpload.prototype.updateForTimerTick = function()
	{
		var inputHelper = Globals.Instance.inputHelper;
		// todo - Check actions instead of inputs.
		if (inputHelper.inputsActive["Escape"] != null) 
		{
			Globals.Instance.universe.venueNext = this.venueNext;		
		}
	}
	
	// events
	
	VenueFileUpload.prototype.buttonCancel_Clicked = function(event)
	{
		Globals.Instance.universe.venueNext = this.venueNext;		
	}	
	
	VenueFileUpload.prototype.buttonLoad_Clicked = function(event)
	{
		var inputFileUpload = this.domElement.getElementsByTagName("input")[0];
		var fileToLoad = inputFileUpload.files[0];
		if (fileToLoad != null)
		{
			Globals.Instance.universe.venueNext = this.venueNext;
		}
	}
}
