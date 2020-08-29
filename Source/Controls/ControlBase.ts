
class ControlBase
{
	fontHeightInPixels: number
	name: string;
	parent: ControlBase;
	pos: Coords;
	size: Coords;

	isHighlighted: boolean;

	constructor(name: string, pos: Coords, size: Coords, fontHeightInPixels: number)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.fontHeightInPixels = fontHeightInPixels;

		this.isHighlighted = false;
	}

	actionHandle(actionName: string, universe: Universe): boolean { return false; }
	actionToInputsMappings(): ActionToInputsMapping[] { return new Array<ActionToInputsMapping>(); }
	childWithFocus(): ControlBase { return null; }
	draw(u: Universe, d: Display, drawLoc: Disposition): void {}
	focusGain(): void { this.isHighlighted = true; }
	focusLose(): void { this.isHighlighted = false; }
	isEnabled(): boolean { return true; }
	mouseClick(x: Coords): boolean { return false; }
	mouseEnter(): void { this.isHighlighted = true; }
	mouseExit(): void { this.isHighlighted = false; }
	mouseMove(x: Coords): void {}
	scalePosAndSize(x: Coords): void {}
	style(universe: Universe)
	{
		return universe.controlStyle; // todo
	}
}
