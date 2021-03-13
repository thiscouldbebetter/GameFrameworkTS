
namespace ThisCouldBeBetter.GameFramework
{

export class ControlContainerTransparent extends ControlBase
{
	containerInner: ControlContainer;

	constructor(containerInner: ControlContainer)
	{
		super
		(
			containerInner.name, containerInner.pos, containerInner.size,
			containerInner.fontHeightInPixels
		);
		this.containerInner = containerInner;
	}

	// instance methods

	actionToInputsMappings()
	{
		return this.containerInner.actionToInputsMappings();
	}

	childWithFocus()
	{
		return this.containerInner.childWithFocus();
	}

	childWithFocusNextInDirection(direction: number)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	}

	childrenAtPosAddToList
	(
		posToCheck: Coords, listToAddTo: ControlBase[], addFirstChildOnly: boolean
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		return this.containerInner.actionHandle(actionNameToHandle, universe);
	}

	isEnabled()
	{
		return true; // todo
	}

	mouseClick(mouseClickPos: Coords)
	{
		var childrenContainingPos = this.containerInner.childrenAtPosAddToList
		(
			mouseClickPos,
			ArrayHelper.clear(this.containerInner.childrenContainingPos),
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
	}

	mouseMove(mouseMovePos: Coords)
	{
		this.containerInner.mouseMove(mouseMovePos);
	}

	scalePosAndSize(scaleFactor: Coords)
	{
		return this.containerInner.scalePosAndSize(scaleFactor);
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle)
	{
		if (this.isVisible() == false)
		{
			return;
		}

		drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
		var drawPos = this.containerInner._drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		style = style || this.style(universe);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack,
			Color.systemColorGet(style.colorBorder), null
		);

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc, style);
		}
	}
}

}
