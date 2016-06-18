
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
}

{
	ControlSelect.prototype.draw = function()
	{
		Globals.Instance.displayHelper.drawControlSelect(this);
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

	ControlSelect.prototype.options = function()
	{
		return this.dataBindingForOptions.get();
	}

	ControlSelect.prototype.mouseClick = function(clickPos)
	{
		this.indexOfOptionSelected++;

		var options = this.options();

		if (this.indexOfOptionSelected >= options.length)
		{
			this.indexOfOptionSelected = 0;
		}	

		var optionSelected = this.optionSelected();

		this.dataBindingForValueSelected.set(optionSelected.value);
	}

	ControlSelect.prototype.valueSelected = function()
	{
		return this.dataBindingForValueSelected.get();
	}
}
