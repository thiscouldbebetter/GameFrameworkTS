
function VenueControls(controlRoot)
{
	this.controlRoot = controlRoot;
}

{
	VenueControls.prototype.draw = function()
	{
		Globals.Instance.display.clear();
		this.controlRoot.draw();
	}

	VenueControls.prototype.updateForTimerTick = function()
	{
		this.draw();

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			var mouseClickPos = inputHelper.mouseClickPos;
			this.controlRoot.mouseClick(mouseClickPos);

			inputHelper.isMouseClicked = false;
		}
		else if (inputHelper.inputsActive.length > 0)
		{
			var inputsActive = inputHelper.inputsActive;

			for (var i = 0; i < inputsActive.length; i++)
			{
				var inputActive = inputsActive[i];
				this.controlRoot.inputHandle(inputActive);
				inputHelper.inputInactivate(inputActive);
			}
		}

		if (inputHelper.hasMouseMoved == true)
		{
			var mouseMovePos = inputHelper.mouseMovePos;
			var mouseMovePosPrev = inputHelper.mouseMovePosPrev;

			this.controlRoot.mouseMove
			(
				mouseMovePos, mouseMovePosPrev
			);
		}
	}
}
