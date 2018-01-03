
function DataBinding(context, bindingExpression, argumentLookup)
{
	this.context = context;
	this.bindingExpression = bindingExpression;
	this.argumentLookup = argumentLookup;
}

{
	DataBinding.prototype.get = function()
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
				var indexOfOpenParenthesis = bindingExpressionPart.indexOf("(");
				if (indexOfOpenParenthesis != -1)
				{
					var functionName = bindingExpressionPart.substr
					(
						0, indexOfOpenParenthesis
					);

					if (returnValue[functionName] == null)
					{
						returnValue = null;
					}
					else
					{
						var indexOfCloseParenthesis = bindingExpressionPart.indexOf(")");
						var argumentNamesAsString = bindingExpressionPart.substring // Not "substr".
						(
							indexOfOpenParenthesis + 1, indexOfCloseParenthesis
						);

						var argumentNames = 
							argumentNamesAsString.split(" ").join("").split(",");
						var argumentValues = [];

						for (var a = 0; a < argumentNames.length; a++)
						{
							var argumentName = argumentNames[a];
							if (argumentName.length > 0)
							{
								var argumentValue = this.argumentLookup[argumentName];
								argumentValues.push(argumentValue);
							}
						}

						returnValue = returnValue[functionName].apply
						(
							returnValue, argumentValues
						);
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

	DataBinding.prototype.set = function(valueToSet)
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
					returnValue = context[bindingExpressionPart](this.context, valueToSet);
				}
			}
			else
			{
				context[bindingExpressionPart] = valueToSet;
			}
		}
	}
}
