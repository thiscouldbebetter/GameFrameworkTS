
namespace ThisCouldBeBetter.GameFramework
{

export class ControlContainerTransparent extends ControlBase
{
	containerInner: ControlContainer;

	constructor(containerInner: ControlContainer)
	{
		super
		(
			containerInner.name,
			containerInner.pos,
			containerInner.size,
			containerInner.fontNameAndHeight
		);
		this.containerInner = containerInner;
	}

	static fromContainer(containerInner: ControlContainer): ControlContainerTransparent
	{
		return new ControlContainerTransparent(containerInner);
	}

	// instance methods

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		return this.containerInner.actionHandle(actionNameToHandle, universe);
	}

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return this.containerInner.actionToInputsMappings();
	}

	childAdd(childToAdd: ControlBase): void
	{
		this.containerInner.childAdd(childToAdd);
	}

	childWithFocus(): ControlBase
	{
		return this.containerInner.childWithFocus();
	}

	childFocusNextInDirection(direction: number): ControlBase
	{
		return this.containerInner.childFocusNextInDirection(direction);
	}

	childrenAtPosAddToList
	(
		posToCheck: Coords, listToAddTo: ControlBase[], addFirstChildOnly: boolean
	): ControlBase[]
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	}

	finalize(universe: Universe): void
	{
		this.containerInner.finalize(universe);
	}

	focusGain(): void
	{
		this.containerInner.focusGain();
	}

	focusLose(): void
	{
		this.containerInner.focusLose();
	}

	initialize(universe: Universe): void
	{
		this.containerInner.initialize(universe);
	}

	isEnabled(): boolean
	{
		return this.containerInner.isEnabled();
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		return this.containerInner.mouseClick(mouseClickPos);
	}

	mouseMove(mouseMovePos: Coords): boolean
	{
		return this.containerInner.mouseMove(mouseMovePos);
	}

	scalePosAndSize(scaleFactor: Coords): ControlBase
	{
		return this.containerInner.scalePosAndSize(scaleFactor);
	}

	// drawable

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		if (this.isVisible() == false)
		{
			return;
		}

		drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
		this.containerInner._drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		style = style || this.style(universe);

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc, style);
		}
	}
}

}
