
namespace ThisCouldBeBetter.GameFramework
{

export class ControlTabbed extends ControlBase
{
	tabButtonSize: Coords;
	childrenForTabs: ControlBase[];
	childrenForTabsByName: Map<string,ControlBase>;
	cancel: (u: Universe) => void;

	buttonsForChildren: ControlButton[];
	childSelectedIndex: number;
	childrenContainingPos: ControlBase[];
	childrenContainingPosPrev: ControlBase[];
	isChildSelectedActive: boolean;

	_childMax: Coords;
	_drawPos: Coords;
	_drawLoc: Disposition;
	_mouseClickPos: Coords;
	_mouseMovePos: Coords;
	_posToCheck: Coords;

	constructor
	(
		name: string, pos: Coords, size: Coords, tabButtonSize: Coords,
		childrenForTabs: ControlBase[], fontHeightInPixels: number,
		cancel: (u: Universe) => void
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.tabButtonSize = tabButtonSize;
		this.childrenForTabs = childrenForTabs;
		this.childrenForTabsByName =
			ArrayHelper.addLookupsByName(this.childrenForTabs);
		this.cancel = cancel;

		this.childSelectedIndex = 0;
		this.childrenContainingPos = new Array<ControlBase>();
		this.childrenContainingPosPrev = new Array<ControlBase>();
		this.isChildSelectedActive = false;

		var marginSize = this.fontHeightInPixels;
		var tabPaneHeight = marginSize + this.tabButtonSize.y;
		var buttonsForChildren = new Array<ControlButton>();

		var buttonForTabClick = (b: ControlButton) => // click
		{
			buttonsForChildren.forEach(x => x.isHighlighted = false);
			var buttonIndex = buttonsForChildren.indexOf(b); // hack
			this.childSelectedIndex = buttonIndex;
			this.isChildSelectedActive = true;
			b.isHighlighted = true;
		}

		for (var i = 0; i < this.childrenForTabs.length; i++)
		{
			var child = this.childrenForTabs[i];

			child.pos.y += tabPaneHeight;

			var childName = child.name;

			var buttonPos = Coords.fromXY
			(
				marginSize + this.tabButtonSize.x * i, marginSize
			);

			var button = ControlButton.from8
			(
				"button" + childName,
				buttonPos,
				this.tabButtonSize.clone(),
				childName, // text
				this.fontHeightInPixels,
				true, // hasBorder
				true, // isEnabled
				buttonForTabClick
			);
			button.context = button; // hack
			buttonsForChildren.push(button);
		}

		if (this.cancel != null)
		{
			this.childrenForTabs.push(null);
			var button = ControlButton.from8
			(
				"buttonCancel",
				Coords.fromXY(this.size.x - marginSize - this.tabButtonSize.x, marginSize), // pos
				this.tabButtonSize.clone(),
				"Done", // text
				this.fontHeightInPixels,
				true, // hasBorder
				true, // isEnabled
				this.cancel // click
			);
			buttonsForChildren.push(button);
		}

		this.buttonsForChildren = buttonsForChildren;

		this.buttonsForChildren[0].isHighlighted = true;

		// Temporary variables.
		this._childMax = Coords.create();
		this._drawPos = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._mouseClickPos = Coords.create();
		this._mouseMovePos = Coords.create();
		this._posToCheck = Coords.create();
	}

	// instance methods

	// actions

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
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
					this.cancel(universe);
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
					this.cancel(universe);
				}
			}
		}

		return wasActionHandled;
	}

	childSelected(): ControlBase
	{
		var returnValue =
		(
			this.childSelectedIndex == null
			? null
			: this.childrenForTabs[this.childSelectedIndex]
		);
		return returnValue;
	}

	childSelectNextInDirection(direction: number): ControlBase
	{
		while (true)
		{
			this.childSelectedIndex += direction;

			var isChildNextInRange = NumberHelper.isInRangeMinMax
			(
				this.childSelectedIndex, 0, this.childrenForTabs.length - 1
			);

			if (isChildNextInRange == false)
			{
				this.childSelectedIndex = NumberHelper.wrapToRangeMax
				(
					this.childSelectedIndex,
					this.childrenForTabs.length
				);
			}

			this.buttonsForChildren.forEach(x => x.isHighlighted = false);
			var buttonForChild = this.buttonsForChildren[this.childSelectedIndex];
			buttonForChild.isHighlighted = true;

			var child = this.childrenForTabs[this.childSelectedIndex];
			if (child == null)
			{
				break;
			}
			else if
			(
				child.focusGain != null && child.isEnabled()
			)
			{
				break;
			}

		} // end while (true)

		var returnValue = this.childSelected();

		return returnValue;
	}

	childWithFocus(): ControlBase
	{
		return this.childSelected();
	}

	childrenAtPosAddToList
	(
		posToCheck: Coords, listToAddTo: ControlBase[], addFirstChildOnly: boolean
	): ControlBase[]
	{
		posToCheck = this._posToCheck.overwriteWith(posToCheck).clearZ();

		var childrenActive = [];
		childrenActive.push(...this.buttonsForChildren);
		var childSelectedAsContainer = this.childSelected() as ControlContainer;
		if (childSelectedAsContainer != null)
		{
			childrenActive.push(childSelectedAsContainer);
		}

		for (var i = childrenActive.length - 1; i >= 0; i--)
		{
			var child = childrenActive[i];
			if (child != null)
			{
				var childMax =
					this._childMax.overwriteWith(child.pos).add(child.size);
				var doesChildContainPos =
					posToCheck.isInRangeMinMax(child.pos, childMax);

				if (doesChildContainPos)
				{
					listToAddTo.push(child);
					if (addFirstChildOnly)
					{
						break;
					}
				}
			}
		}

		return listToAddTo;
	}

	focusGain(): void
	{
		this.childSelectedIndex = null;
		var childSelected = this.childSelectNextInDirection(1);
		if (childSelected != null)
		{
			childSelected.focusGain();
		}
	}

	focusLose(): void
	{
		var childSelected = this.childSelected();
		if (childSelected != null)
		{
			childSelected.focusLose();
			this.childSelectedIndex = null;
		}
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		var mouseClickPos = this._mouseClickPos.overwriteWith
		(
			mouseClickPos
		).subtract
		(
			this.pos
		);

		var wasClickHandled = false;

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseClickPos,
			ArrayHelper.clear(this.childrenContainingPos),
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

		return wasClickHandled;
	}

	mouseEnter(): void {}
	mouseExit(): void {}

	mouseMove(mouseMovePos: Coords): boolean
	{
		var mouseMovePos = this._mouseMovePos.overwriteWith
		(
			mouseMovePos
		).subtract
		(
			this.pos
		);

		var wasMoveHandled = false;

		var temp = this.childrenContainingPosPrev;
		this.childrenContainingPosPrev = this.childrenContainingPos;
		this.childrenContainingPos = temp;

		mouseMovePos =
			this._mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseMovePos,
			ArrayHelper.clear(this.childrenContainingPos),
			true // addFirstChildOnly
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];

			if (child.mouseMove != null)
			{
				child.mouseMove(mouseMovePos);
			}
			if (this.childrenContainingPosPrev.indexOf(child) == -1)
			{
				if (child.mouseEnter != null)
				{
					child.mouseEnter();
				}
			}
		}

		for (var i = 0; i < this.childrenContainingPosPrev.length; i++)
		{
			var child = this.childrenContainingPosPrev[i];
			if (childrenContainingPos.indexOf(child) == -1)
			{
				if (child.mouseExit != null)
				{
					child.mouseExit();
				}
			}
		}

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
	}

	scalePosAndSize(scaleFactor: Coords): ControlTabbed
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);

		for (var i = 0; i < this.childrenForTabs.length; i++)
		{
			var child = this.childrenForTabs[i];
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
	}

	// drawable

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle
	): void
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorBackground,
			style.colorBorder,
			null
		);

		var buttons = this.buttonsForChildren;
		for (var i = 0; i < buttons.length; i++)
		{
			var button = buttons[i];
			if (i == this.childSelectedIndex)
			{
				button.isHighlighted = true;
			}
			button.draw(universe, display, drawLoc, style);
		}

		var child = this.childSelected();
		if (child != null)
		{
			child.draw(universe, display, drawLoc, style);
		}
	}
}

}
