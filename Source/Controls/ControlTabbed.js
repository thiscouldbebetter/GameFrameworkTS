
class ControlTabbed
{
	constructor(name, pos, size, children, fontHeightInPixels)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.children = children.addLookupsByName();

		this.childSelectedIndex = 0;
		this.isChildSelectedActive = false;

		fontHeightInPixels = fontHeightInPixels || 10;
		var marginSize = fontHeightInPixels;
		var buttonSize = new Coords(50, fontHeightInPixels * 2);
		var buttonsForChildren = [];

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];

			child.pos.y += marginSize + buttonSize.y;

			var childName = child.name;
			var button = new ControlButton
			(
				"button" + childName,
				new Coords(marginSize + buttonSize.x * i, marginSize), // pos
				buttonSize.clone(),
				childName, // text
				fontHeightInPixels,
				true, // hasBorder
				true, // isEnabled
				function click()
				{
					alert("todo");
				}
			);
			buttonsForChildren.push(button);
		}
		this.buttonsForChildren = buttonsForChildren;

		// Temporary variables.
		this._drawPos = new Coords();
		this._drawLoc = new Location(this._drawPos);
		this._mouseClickPos = new Coords();
		this._mouseMovePos = new Coords();
	}

	// instance methods

	isEnabled()
	{
		return true;
	};

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	// actions

	actionHandle(actionNameToHandle, universe)
	{
		var wasActionHandled = false;

		var childSelected = this.childSelected();

		var controlActionNames = ControlActionNames.Instances();

		if (this.isChildSelectedActive)
		{
			if (actionNameToHandle == controlActionNames.ControlCancel)
			{
				this.isChildSelectedActive = false;
				childSelected.focusLose();
				wasActionHandled = true;
			}
			else if (childSelected.actionHandle != null)
			{
				wasActionHandled = childSelected.actionHandle(actionNameToHandle, universe);
			}
		}
		else
		{
			wasActionHandled = true;

			if (actionNameToHandle == controlActionNames.ControlConfirm)
			{
				this.isChildSelectedActive = true;
				childSelected.focusGain();
			}
			else if
			(
				actionNameToHandle == controlActionNames.ControlPrev
				|| actionNameToHandle == controlActionNames.ControlNext
			)
			{
				var direction = (actionNameToHandle == controlActionNames.ControlPrev ? -1 : 1);
				childSelected.focusLose();
				childSelected = this.childSelectNextInDirection(direction);
			}
		}

		return wasActionHandled;
	};

	childSelected()
	{
		return (this.childSelectedIndex == null ? null : this.children[this.childSelectedIndex] );
	};

	childSelectNextInDirection(direction)
	{
		var childIndexOriginal = this.childSelectedIndex;

		while (true)
		{
			this.childSelectedIndex += direction;

			var isChildNextInRange = this.childSelectedIndex.isInRangeMinMax
			(
				0, this.children.length - 1
			);

			if (isChildNextInRange == false)
			{
				this.childSelectedIndex = this.childSelectedIndex.wrapToRangeMax(this.children.length);
			}

			var child = this.children[this.childSelectedIndex];
			if
			(
				child.focusGain != null
				&& ( child.isEnabled == null || child.isEnabled() )
			)
			{
				break;
			}

		} // end while (true)

		var returnValue = this.childSelected();

		return returnValue;
	};

	childrenAtPosAddToList
	(
		posToCheck,
		listToAddTo,
		addFirstChildOnly
	)
	{
		posToCheck = this._posToCheck.overwriteWith(posToCheck).clearZ();

		for (var i = this.children.length - 1; i >= 0; i--)
		{
			var child = this.children[i];

			var doesChildContainPos = posToCheck.isInRangeMinMax
			(
				child.pos,
				this._childMax.overwriteWith(child.pos).add(child.size)
			);

			if (doesChildContainPos)
			{
				listToAddTo.push(child);
				if (addFirstChildOnly)
				{
					break;
				}
			}
		}

		return listToAddTo;
	};

	focusGain()
	{
		this.childSelectedIndex = null;
		var childSelected = this.childSelectNextInDirection(1);
		if (childSelected != null)
		{
			childSelected.focusGain();
		}
	};

	focusLose()
	{
		var childSelected = this.childSelected();
		if (childSelected != null)
		{
			childSelected.focusLose();
			this.childSelectedIndex = null;
		}
	};

	mouseClick(mouseClickPos)
	{
		var mouseClickPos = this._mouseClickPos.overwriteWith
		(
			mouseClickPos
		).subtract
		(
			this.pos
		);

		var wasClickHandled = false;
		var child = this.childSelected();
		if (child.mouseClick != null)
		{
			var wasClickHandledByChild = child.mouseClick(mouseClickPos);
			if (wasClickHandledByChild)
			{
				wasClickHandled = true;
			}
		}

		return wasClickHandled;
	};

	mouseMove(mouseMovePos)
	{
		var mouseMovePos = this._mouseMovePos.overwriteWith
		(
			mouseMovePos
		).subtract
		(
			this.pos
		);

		var wasMoveHandled = false;
		var child = this.childSelected();
		if (child.mouseMove != null)
		{
			var wasMoveHandledByChild = child.mouseMove(mouseMovePos);
			if (wasMoveHandledByChild)
			{
				wasMoveHandled = true;
			}
		}

		return wasMoveHandled;
	};

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if (child.scalePosAndSize == null)
			{
				child.pos.multiply(scaleFactor);
				child.size.multiply(scaleFactor);
				if (child.fontHeightInPixels != null)
				{
					child.fontHeightInPixels *= scaleFactor.y;
				}
			}
			else
			{
				child.scalePosAndSize(scaleFactor);
			}
		}

		return this;
	};

	toVenue()
	{
		return new VenueFader(new VenueControls(this));
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorBackground, style.colorBorder
		);

		var buttons = this.buttonsForChildren;
		for (var i = 0; i < buttons.length; i++)
		{
			var button = buttons[i];
			button.isHighlighted = (i == this.childSelectedIndex);
			button.draw(universe, display, drawLoc);
		};

		var child = this.childSelected();
		child.draw(universe, display, drawLoc);
	};
}
