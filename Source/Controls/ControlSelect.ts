
class ControlSelect extends ControlBase
{
	_valueSelected: any;
	_options: any;
	bindingForOptionValues: DataBinding<any, any>;
	bindingForOptionText: DataBinding<any, string>;

	indexOfOptionSelected: number;
	styleName: string;

	_drawPos: Coords;
	_sizeHalf: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		valueSelected: any,
		options: any,
		bindingForOptionValues: DataBinding<any, any>,
		bindingForOptionText: DataBinding<any, string>,
		fontHeightInPixels: number
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this._valueSelected = valueSelected;
		this._options = options;
		this.bindingForOptionValues = bindingForOptionValues;
		this.bindingForOptionText = bindingForOptionText;

		this.indexOfOptionSelected = null;
		var valueSelected = this.valueSelected();
		var options = this.options();
		for (var i = 0; i < options.length; i++)
		{
			var option = options[i];
			var optionValue = this.bindingForOptionValues.contextSet
			(
				option
			).get();

			if (optionValue == valueSelected)
			{
				this.indexOfOptionSelected = i;
				break;
			}
		}

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
		this._sizeHalf = new Coords(0, 0, 0);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.optionSelectedNextInDirection(-1);
		}
		else if
		(
			actionNameToHandle == controlActionNames.ControlIncrement
			|| actionNameToHandle == controlActionNames.ControlConfirm
		)
		{
			this.optionSelectedNextInDirection(1);
		}
		return true; // wasActionHandled
	}

	mouseClick(clickPos: Coords)
	{
		this.optionSelectedNextInDirection(1);
		return true; // wasClickHandled
	}

	optionSelected()
	{
		var optionSelected =
		(
			this.indexOfOptionSelected == null
			? null
			: this.options()[this.indexOfOptionSelected]
		);
		return optionSelected;
	}

	optionSelectedNextInDirection(direction: number)
	{
		var options = this.options();

		this.indexOfOptionSelected = NumberHelper.wrapToRangeMinMax
		(
			this.indexOfOptionSelected + direction, 0, options.length
		);

		var optionSelected = this.optionSelected();
		var valueToSelect =
		(
			optionSelected == null
			? null
			: this.bindingForOptionValues.contextSet(optionSelected).get()
		);

		if (this._valueSelected != null && this._valueSelected.constructor.name == DataBinding.name)
		{
			this._valueSelected.set(valueToSelect);
		}
		else
		{
			this._valueSelected = valueToSelect;
		}
	}

	options()
	{
		return (this._options.get == null ? this._options : this._options.get() );
	}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	valueSelected()
	{
		var returnValue =
		(
			this._valueSelected == null
			? null
			: (this._valueSelected.get == null ? this._valueSelected : this._valueSelected.get() )
		);

		return returnValue;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			Color.systemColorGet(style.colorFill),
			Color.systemColorGet(style.colorBorder),
			this.isHighlighted // areColorsReversed
		);

		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());

		var optionSelected = this.optionSelected();
		var text =
		(
			optionSelected == null
			? "-"
			: this.bindingForOptionText.contextSet(optionSelected).get()
		);

		display.drawText
		(
			text,
			this.fontHeightInPixels,
			drawPos,
			Color.systemColorGet(style.colorBorder),
			Color.systemColorGet(style.colorFill),
			this.isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	}
}
