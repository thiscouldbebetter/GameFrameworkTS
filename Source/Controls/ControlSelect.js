
function ControlSelect
(
	name,
	pos,
	size,
	valueSelected,
	options,
	bindingExpressionForOptionValues,
	bindingExpressionForOptionText,
	fontHeightInPixels
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this._valueSelected = valueSelected;
	this._options = options;
	this.bindingExpressionForOptionValues = bindingExpressionForOptionValues;
	this.bindingExpressionForOptionText = bindingExpressionForOptionText;
	this.fontHeightInPixels = fontHeightInPixels;

	this.indexOfOptionSelected = null;
	var valueSelected = this.valueSelected();
	var options = this.options();
	for (var i = 0; i < options.length; i++)
	{
		var option = options[i];
		var optionValue = DataBinding.get
		(
			option,
			this.bindingExpressionForOptionValues
		);

		if (optionValue == valueSelected)
		{
			this.indexOfOptionSelected = i;
			break;
		}
	}

	this.isHighlighted = false;
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

	ControlSelect.prototype.optionSelected = function()
	{
		var returnValue = null;

		if (this.indexOfOptionSelected != null)
		{
			var optionAsObject = this.options()[this.indexOfOptionSelected];

			var optionValue = DataBinding.get
			(
				optionAsObject,
				this.bindingExpressionForOptionValues
			);
			var optionText = DataBinding.get
			(
				optionAsObject,
				this.bindingExpressionForOptionText
			);

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

		this.indexOfOptionSelected = NumberHelper.wrapValueToRangeMinMax
		(
			this.indexOfOptionSelected + direction, 0, options.length
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
	}

	ControlSelect.prototype.style = function()
	{
		return Globals.Instance.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	ControlSelect.prototype.valueSelected = function()
	{
		return (this._valueSelected.get == null ? this._valueSelected : this._valueSelected.get() );
	}

	// drawable

	ControlSelect.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);

		var style = this.style();

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder,
			this.isHighlighted // areColorsReversed
		)

		drawPos.add(this.size.clone().divideScalar(2));

		var text = this.optionSelected().text;

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
