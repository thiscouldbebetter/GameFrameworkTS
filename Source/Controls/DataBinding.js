
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
			var bindingExpressionParts = bindingExpression.split(".");
			for (var i = 0; i < bindingExpressionParts.length; i++)
			{
				// hack
				if (returnValue == null)
				{
					break;
				}

				var bindingExpressionPart = bindingExpressionParts[i];
				if (bindingExpressionPart.endsWith("()") == true)
				{
					bindingExpressionPart = bindingExpressionPart.substr(0, bindingExpressionPart.length - "()".length);
					if (returnValue[bindingExpressionPart] == null)
					{
						returnValue = null; 
					}
					else
					{
						returnValue = returnValue[bindingExpressionPart]();
					}
				}
				else
				{
					returnValue = returnValue[bindingExpressionPart];
				}
			}
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
