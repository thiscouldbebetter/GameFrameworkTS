
function ControlSelect
(
	name,
	pos,
	size,
	valueSelected,
	options,
	bindingForOptionValues,
	bindingForOptionText,
	fontHeightInPixels
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this._valueSelected = valueSelected;
	this._options = options;
	this.bindingForOptionValues = bindingForOptionValues;
	this.bindingForOptionText = bindingForOptionText;
	this.fontHeightInPixels = fontHeightInPixels;

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

	this.isHighlighted = false;

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
	this.sizeHalf = this.size.clone().half();
}

{
	ControlSelect.prototype.actionHandle = function(actionNameToHandle)
	{
		// This is somewhat counterintuitive.
		if (actionNameToHandle == "ControlDecrement")
		{
			this.optionSelectedNextInDirection(1);
		}
		else if
		(
			actionNameToHandle == "ControlIncrement"
			|| actionNameToHandle == "ControlConfirm"
		)
		{
			this.optionSelectedNextInDirection(-1);
		}
	}

	ControlSelect.prototype.focusGain = function()
	{
			this.isHighlighted = true;
	}

	ControlSelect.prototype.focusLose = function()
	{
			this.isHighlighted = false;
	}

	ControlSelect.prototype.isEnabled = function()
	{
		// todo
		return true;
	}

	ControlSelect.prototype.optionSelected = function()
	{
		var returnValue = null;

		if (this.indexOfOptionSelected != null)
		{
			var optionAsObject = this.options()[this.indexOfOptionSelected];

			var optionValue = this.bindingForOptionValues.contextSet
			(
				optionAsObject
			).get();

			var optionText = this.bindingForOptionText.contextSet
			(
				optionAsObject
			).get();

			returnValue = new ControlSelectOption
			(
				optionValue,
				optionText
			);
		};

		return returnValue;
	}

	ControlSelect.prototype.optionSelectedNextInDirection = function(direction)
	{
		var options = this.options();

		this.indexOfOptionSelected =
		(
			this.indexOfOptionSelected + direction
		).wrapToRangeMinMax
		(
			0, options.length
		);

		var optionSelected = this.optionSelected();

		if (this._valueSelected != null && this._valueSelected.constructor.name == "DataBinding")
		{
			this._valueSelected.set(optionSelected.value);
		}
		else
		{
			this._valueSelected = optionSelected.value;
		}
	}

	ControlSelect.prototype.options = function()
	{
		return (this._options.get == null ? this._options : this._options.get() );
	}

	ControlSelect.prototype.mouseClick = function(clickPos)
	{
		this.optionSelectedNextInDirection(1);
		return true; // wasClickHandled
	}

	ControlSelect.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	ControlSelect.prototype.valueSelected = function()
	{
		return (this._valueSelected == null ? null : (this._valueSelected.get == null ? this._valueSelected : this._valueSelected.get() ) );
	}

	// drawable

	ControlSelect.prototype.draw = function(universe, display, drawLoc)
	{
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder,
			this.isHighlighted // areColorsReversed
		)

		drawPos.add(this.sizeHalf);

		var optionSelected = this.optionSelected();
		var text = (optionSelected == null ? "-" : optionSelected.text);

		display.drawText
		(
			text,
			this.fontHeightInPixels,
			drawPos,
			style.colorBorder,
			style.colorFill,
			this.isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	}

}
