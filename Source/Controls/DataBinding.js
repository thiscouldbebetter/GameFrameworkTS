
function DataBinding(context, bindingExpression)
{
	this.context = context;
	this.bindingExpression = bindingExpression;
}

{
	DataBinding.prototype.get = function(universe)
	{
		var returnValue = this.context;

		if (this.bindingExpression != null)
		{
			var bindingExpressionParts = this.bindingExpression.split(".");
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
					bindingExpressionPart = bindingExpressionPart.substr
					(
						0, bindingExpressionPart.length - "()".length
					);
					if (returnValue[bindingExpressionPart] == null)
					{
						returnValue = null;
					}
					else
					{
						returnValue = returnValue[bindingExpressionPart](this.context, universe);
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

	DataBinding.prototype.set = function(valueToSet, universe)
	{
		var context = this.context;

		if (this.bindingExpression != null)
		{
			var bindingExpressionParts = this.bindingExpression.split(".");
			for (var i = 0; i < bindingExpressionParts.length - 1; i++)
			{
				var bindingExpressionPart = bindingExpressionParts[i];
				context = context[bindingExpressionPart];
			}
			var bindingExpressionPart = bindingExpressionParts[bindingExpressionParts.length - 1];
			if (bindingExpressionPart.endsWith("()") == true)
			{
				bindingExpressionPart = bindingExpressionPart.substr
				(
					0, bindingExpressionPart.length - "()".length
				);
				if (context[bindingExpressionPart] == null)
				{
					returnValue = null;
				}
				else
				{
					returnValue = context[bindingExpressionPart](this.context, universe, valueToSet);
				}
			}
			else
			{
				context[bindingExpressionPart] = valueToSet;
			}
		}
	}
}
