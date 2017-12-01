
function ControlContainerTransparent(containerInner)
{
	this.containerInner = containerInner;
}

{
	// instance methods

	ControlContainerTransparent.prototype.childWithFocus = function()
	{
		return this.containerInner.childWithFocus();
	}

	ControlContainerTransparent.prototype.childWithFocusNextInDirection = function(direction)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	}

	ControlContainerTransparent.prototype.childrenAtPosAddToList = function
	(
		posToCheck,
		listToAddTo,
		addFirstChildOnly
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	}

	ControlContainerTransparent.prototype.actionHandle = function(universe, actionNameToHandle)
	{
		if (actionNameToHandle == "MouseClick")
		{
			var inputHelper = universe.inputHelper;

			var mouseClickPos = this.containerInner.mouseClickPos.overwriteWith
			(
				inputHelper.mouseClickPos
			).divide
			(
				universe.display.scaleFactor
			);

			this.mouseClick(universe, mouseClickPos);

			if (this.containerInner.childrenContainingPos.length > 0)
			{
				inputHelper.inputRemove(actionNameToHandle);
			}
		}
		else
		{
			this.containerInner.actionHandle(universe, actionNameToHandle);
		}
	}

	ControlContainerTransparent.prototype.mouseClick = function(universe, mouseClickPos)
	{
		var inputHelper = universe.inputHelper;

		var childrenContainingPos = this.containerInner.childrenAtPosAddToList
		(
			mouseClickPos,
			this.containerInner.childrenContainingPos.clear(),
			true // addFirstChildOnly
		);

		if (childrenContainingPos.length > 0)
		{
			var child = childrenContainingPos[0];
			if (child.mouseClick != null)
			{
				child.mouseClick(universe, mouseClickPos);
			}
		}
	}

	ControlContainerTransparent.prototype.mouseMove = function(mouseMovePos)
	{
		this.containerInner.mouseMove(mouseMovePos);
	}

	// drawable

	ControlContainerTransparent.prototype.draw = function(universe, display, drawLoc)
	{
		drawLoc = this.containerInner.drawLoc.overwriteWith(drawLoc);
		var drawPos = this.containerInner.drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack, 
			display.colorFore
		)

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.drawLoc.overwriteWith(drawLoc);
			child.draw(universe, display, child.drawLoc);
		}
	}
}
