
function ControlSelect
(
	name, 
	pos, 
	size, 
	dataBindingForValueSelected,
	dataBindingForOptions,
	bindingExpressionForOptionValues,
	bindingExpressionForOptionText,
	fontHeightInPixels
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForValueSelected = dataBindingForValueSelected;
	this.dataBindingForOptions = dataBindingForOptions;
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

		this.dataBindingForValueSelected.set(optionSelected.value);
	}

	ControlSelect.prototype.options = function()
	{
		return this.dataBindingForOptions.get();
	}

	ControlSelect.prototype.mouseClick = function(clickPos)
	{
		this.optionSelectedNextInDirection(1);
	}

	ControlSelect.prototype.valueSelected = function()
	{
		return this.dataBindingForValueSelected.get();
	}
	
	// drawable
	
	ControlSelect.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);

		display.drawRectangle
		(
			drawPos, this.size, 
			display.colorBack, display.colorFore,
			this.isHighlighted // areColorsReversed
		)

		var text = this.optionSelected().text;

		var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
		var textSize = new Coords(textWidth, display.fontHeightInPixels);
		var textMargin = this.size.clone().subtract(textSize).divideScalar(2); 
		drawPos.add(textMargin);

		display.drawText
		(
			text, 
			this.fontHeightInPixels,
			drawPos, 
			display.colorFore, display.colorBack, 
			this.isHighlighted
		);
	}

}
