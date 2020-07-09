
interface Control
{
	fontHeightInPixels: number
	name: string;
	parent: Control;
	pos: Coords;
	size: Coords;

	actionHandle(actionName: string, universe: Universe): boolean;
	actionToInputsMappings(): ActionToInputsMapping[];
	childWithFocus(): Control;
	draw(u: Universe, d: Display, drawLoc: Disposition): void;
	focusGain(): void;
	focusLose(): void;
	isEnabled(): boolean; // todo - Rename to "canReceiveFocus()"?
	mouseClick(x: Coords): boolean;
	mouseEnter(): void;
	mouseExit(): void;
	mouseMove(x: Coords): void;
	scalePosAndSize(x: Coords): void;
}
