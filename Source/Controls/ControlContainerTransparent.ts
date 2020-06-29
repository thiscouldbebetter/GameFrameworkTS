
class ControlContainerTransparent
{
	constructor(containerInner)
	{
		this.containerInner = containerInner;
	}

	// instance methods

	actionToInputsMappings()
	{
		return this.containerInner.actionToInputsMappings();
	};

	childWithFocus()
	{
		return this.containerInner.childWithFocus();
	};

	childWithFocusNextInDirection(direction)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	};

	childrenAtPosAddToList
	(
		posToCheck, listToAddTo, addFirstChildOnly
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	};

	actionHandle(actionNameToHandle, universe)
	{
		return this.containerInner.actionHandle(actionNameToHandle, universe);
	};

	mouseClick(mouseClickPos)
	{
		var childrenContainingPos = this.containerInner.childrenAtPosAddToList
		(
			mouseClickPos,
			this.containerInner.childrenContainingPos.clear(),
			true // addFirstChildOnly
		);

		var wasClickHandled = false;
		if (childrenContainingPos.length > 0)
		{
			var child = childrenContainingPos[0];
			if (child.mouseClick != null)
			{
				var wasClickHandledByChild = child.mouseClick(mouseClickPos);
				if (wasClickHandledByChild)
				{
					wasClickHandled = true;
				}
			}
		}

		return wasClickHandled;
	};

	mouseMove(mouseMovePos)
	{
		this.containerInner.mouseMove(mouseMovePos);
	};

	scalePosAndSize(scaleFactor)
	{
		return this.containerInner.scalePosAndSize(scaleFactor);
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
		var drawPos = this.containerInner._drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack,
			display.colorFore
		);

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc);
		}
	};
}
