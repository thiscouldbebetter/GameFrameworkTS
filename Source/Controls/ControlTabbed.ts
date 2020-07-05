
class ControlTabbed
{
	name: string;
	pos: Coords;
	size: Coords;
	children: any;
	childrenByName: any;
	fontHeightInPixels: number;
	cancel: any;

	buttonsForChildren: any;
	childSelectedIndex: number;
	isChildSelectedActive: boolean;
	styleName: string;

	_childMax: Coords;
	_childrenContainingPos: any;
	_drawPos: Coords;
	_drawLoc: Disposition;
	_mouseClickPos: Coords;
	_mouseMovePos: Coords;
	_posToCheck: Coords;

	constructor(name, pos, size, children, fontHeightInPixels, cancel)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.children = children;
		this.childrenByName = ArrayHelper.addLookupsByName(this.children);
		this.cancel = cancel;

		this.childSelectedIndex = 0;
		this.isChildSelectedActive = false;

		fontHeightInPixels = fontHeightInPixels || 10;

		var marginSize = fontHeightInPixels;
		var buttonSize = new Coords(50, fontHeightInPixels * 2, 0);
		var buttonsForChildren = [];

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];

			child.pos.y += marginSize + buttonSize.y;

			var childName = child.name;
			var button = new ControlButton
			(
				"button" + childName,
				new Coords(marginSize + buttonSize.x * i, marginSize, 0), // pos
				buttonSize.clone(),
				childName, // text
				fontHeightInPixels,
				true, // hasBorder
				true, // isEnabled
				(b) => this.childSelectedIndex = buttonsForChildren.indexOf(b), // hack
				null, null
			);
			button.context = button; // hack
			buttonsForChildren.push(button);
		}

		if (this.cancel != null)
		{
			this.children.push(null);
			var button = new ControlButton
			(
				"buttonCancel",
				new Coords(this.size.x - marginSize - buttonSize.x, marginSize, 0), // pos
				buttonSize.clone(),
				"Done", // text
				fontHeightInPixels,
				true, // hasBorder
				true, // isEnabled
				this.cancel, // click
				null, null
			);
			buttonsForChildren.push(button);
		}

		this.buttonsForChildren = buttonsForChildren;

		// Temporary variables.
		this._childMax = new Coords(0, 0, 0);
		this._childrenContainingPos = [];
		this._drawPos = new Coords(0, 0, 0);
		this._drawLoc = new Disposition(this._drawPos, null, null);
		this._mouseClickPos = new Coords(0, 0, 0);
		this._mouseMovePos = new Coords(0, 0, 0);
		this._posToCheck = new Coords(0, 0, 0);
	}

	// instance methods

	isEnabled()
	{
		return true;
	};

	style(universe)
	{
		return universe.controlBuilder.stylesByName[this.styleName == null ? "Default" : this.styleName];
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
				if (childSelected == null)
				{
					this.cancel();
				}
				else
				{
					this.isChildSelectedActive = true;
					childSelected.focusGain();
				}
			}
			else if
			(
				actionNameToHandle == controlActionNames.ControlPrev
				|| actionNameToHandle == controlActionNames.ControlNext
			)
			{
				var direction = (actionNameToHandle == controlActionNames.ControlPrev ? -1 : 1);
				if (childSelected != null)
				{
					childSelected.focusLose();
				}
				childSelected = this.childSelectNextInDirection(direction);
			}
			else if (actionNameToHandle == controlActionNames.ControlCancel)
			{
				if (this.cancel != null)
				{
					this.cancel();
				}
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

			var isChildNextInRange = NumberHelper.isInRangeMinMax
			(
				this.childSelectedIndex, 0, this.children.length - 1
			);

			if (isChildNextInRange == false)
			{
				this.childSelectedIndex = NumberHelper.wrapToRangeMax
				(
					this.childSelectedIndex,
					this.children.length
				);
			}

			var child = this.children[this.childSelectedIndex];
			if (child == null)
			{
				break;
			}
			else if
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

		var childGroups = [ this.children, this.buttonsForChildren ];
		for (var g = 0; g < childGroups.length; g++)
		{
			var children = childGroups[g];
			for (var i = children.length - 1; i >= 0; i--)
			{
				var child = children[i];
				if (child != null)
				{
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
							g = childGroups.length;
							break;
						}
					}
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

	mouseClick(mouseClickPos: Coords)
	{
		var mouseClickPos = this._mouseClickPos.overwriteWith
		(
			mouseClickPos
		).subtract
		(
			this.pos
		);

		var wasClickHandled = false;

		if (this.isChildSelectedActive)
		{
			var child = this.childSelected();
			if (child.mouseClick != null)
			{
				var wasClickHandledByChild = child.mouseClick(mouseClickPos);
				if (wasClickHandledByChild)
				{
					wasClickHandled = true;
				}
			}
		}
		else
		{
			var childrenContainingPos = this.childrenAtPosAddToList
			(
				mouseClickPos,
				ArrayHelper.clear(this._childrenContainingPos),
				true // addFirstChildOnly
			);
			var child = childrenContainingPos[0];
			if (child != null)
			{
				if (child.mouseClick != null)
				{
					var wasClickHandledByChild = child.mouseClick(mouseClickPos);
					if (wasClickHandledByChild)
					{
						wasClickHandled = true;
					}
				}
			}
		}

		return wasClickHandled;
	};

	mouseMove(mouseMovePos: Coords)
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
		if (child != null)
		{
			if (child.mouseMove != null)
			{
				var wasMoveHandledByChild = child.mouseMove(mouseMovePos);
				if (wasMoveHandledByChild)
				{
					wasMoveHandled = true;
				}
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
		return new VenueFader(new VenueControls(this), null, null, null);
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
		if (child != null)
		{
			child.draw(universe, display, drawLoc);
		}
	};
}
