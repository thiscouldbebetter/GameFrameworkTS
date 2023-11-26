
namespace ThisCouldBeBetter.GameFramework
{

export class ControlBase
{
	fontNameAndHeight: FontNameAndHeight
	name: string;
	parent: ControlBase;
	pos: Coords;
	size: Coords;

	_isVisible: boolean;
	styleName: string;

	isHighlighted: boolean;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		fontNameAndHeight: FontNameAndHeight
	)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.fontNameAndHeight =
			fontNameAndHeight == null ? null : fontNameAndHeight.clone(); // hack

		this._isVisible = true;
		this.styleName = null;

		this.isHighlighted = false;
	}

	// Setters.

	fontNameAndHeightSet(value: FontNameAndHeight): ControlBase
	{
		this.fontNameAndHeight.overwriteWith(value);
		return this;
	}

	posSet(value: Coords): ControlBase
	{
		this.pos.overwriteWith(value);
		return this;
	}

	sizeSet(value: Coords): ControlBase
	{
		this.size.overwriteWith(value);
		return this;
	}

	// Events.

	actionHandle(actionName: string, universe: Universe): boolean { return false; }
	focusGain(): void { this.isHighlighted = true; }
	focusLose(): void { this.isHighlighted = false; }
	mouseClick(x: Coords): boolean { return false; }
	mouseEnter(): void { this.isHighlighted = true; }
	mouseExit(): void { this.isHighlighted = false; }
	mouseMove(x: Coords): boolean { return false; }

	// Other methods.

	actionToInputsMappings(): ActionToInputsMapping[] { return new Array<ActionToInputsMapping>(); }
	childWithFocus(): ControlBase { return null; }
	draw(u: Universe, d: Display, drawLoc: Disposition, style: ControlStyle): void {}
	isEnabled(): boolean { return true; }
	isVisible(): boolean { return this._isVisible; }
	scalePosAndSize(scaleFactors: Coords): ControlBase
	{
		this.pos.multiply(scaleFactors);
		this.size.multiply(scaleFactors);
		if (this.fontNameAndHeight != null)
		{
			this.fontNameAndHeight.heightInPixels *= scaleFactors.y;
		}
		return this;
	}
	style(universe: Universe)
	{
		var returnValue =
		(
			this.styleName == null
			? universe.controlBuilder.styleDefault()
			: universe.controlBuilder.styleByName(this.styleName)
		);
		return returnValue;
	}
	toVenue(): VenueControls { return VenueControls.fromControl(this); }

}

}
