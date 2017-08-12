
function DataBinding(context, bindingExpression)
{
	this.context = context;
	this.bindingExpression = bindingExpression;
}

{
	DataBinding.get = function(context, bindingExpression)
	{
		var returnValue = context;

		if (bindingExpression != null)
		{
			returnValue = returnValue[bindingExpression];
		}

		return returnValue;
	}

	// instance methods

	DataBinding.prototype.get = function()
	{
		return DataBinding.get(this.context, this.bindingExpression);
	}

	DataBinding.prototype.set = function(valueToSet)
	{
		// hack
		this.context[this.bindingExpression] = valueToSet;
	}
}
