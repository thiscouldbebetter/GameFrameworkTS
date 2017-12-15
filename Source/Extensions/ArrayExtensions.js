function ArrayExtensions()
{
	// extension class
}
{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var key = element[keyName];
			this[key] = element;
		}
		return this;
	}

	Array.prototype.append = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			this.push(element);
		}
		return this;
	}

	Array.prototype.clear = function()
	{
		this.length = 0;
		return this;
	}

	Array.prototype.clone = function()
	{
		var returnValue = [];

		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			var itemClone = item.clone();
			returnValue.push(itemClone);
		}

		return returnValue;
	}

	Array.prototype.contains = function(elementToFind)
	{
		return (this.indexOf(elementToFind) >= 0);
	}

	Array.prototype.elementProperties = function(propertyName)
	{
		var returnValues = [];
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var elementProperty = element[propertyName];
			returnValues.push(elementProperty);
		}
		return returnValues;
	}

	Array.prototype.insertElementAt = function(element, index)
	{
		this.splice(index, 0, element);
		return this;
	}

	Array.prototype.prepend = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			this.splice(0, 0, element);
		}
		return this;
	}

	Array.prototype.remove = function(elementToRemove)
	{
		var indexToRemoveAt = this.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			this.splice(indexToRemoveAt, 1);
		}
		return this;
	}

	Array.prototype.removeAt = function(index)
	{
		this.splice(index, 1);
		return this;
	}
}
