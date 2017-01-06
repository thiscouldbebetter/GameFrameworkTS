
function ControlSelect
(
	name, 
	pos, 
	size, 
	dataBindingForValueSelected,
	dataBindingForOptions,
	bindingExpressionForOptionValues,
	bindingExpressionForOptionText
)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForValueSelected = dataBindingForValueSelected;
	this.dataBindingForOptions = dataBindingForOptions;
	this.bindingExpressionForOptionValues = bindingExpressionForOptionValues;
	this.bindingExpressionForOptionText = bindingExpressionForOptionText;

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
	ControlSelect.prototype.focusGain = function()
	{
			this.isHighlighted = true;
	}
	
	ControlSelect.prototype.focusLose = function()
	{
			this.isHighlighted = false;
	}
	
	ControlSelect.prototype.inputHandle = function(inputToHandle)
	{
		if (inputToHandle == "ArrowDown")
		{
			this.optionSelectedNextInDirection(-1);			
		}
		else if (inputToHandle == "ArrowUp" || inputToHandle == "Enter")
		{
			this.optionSelectedNextInDirection(1);
		}
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
	
	ControlSelect.prototype.draw = function()
	{
		var control = this;
		var display = Globals.Instance.display;
		
		var pos = control.pos;
		var size = control.size;

		display.drawRectangle
		(
			pos, size, 
			display.colorBack, display.colorFore,
			control.isHighlighted // areColorsReversed
		)

		var text = control.optionSelected().text;

		var textWidth = display.graphics.measureText(text).width;
		var textSize = new Coords(textWidth, display.fontHeightInPixels);
		var textMargin = size.clone().subtract(textSize).divideScalar(2); 
		var drawPos = pos.clone().add(textMargin);

		display.drawText
		(
			text, 
			drawPos, 
			display.colorFore, display.colorBack, control.isHighlighted
		);
	}

}
