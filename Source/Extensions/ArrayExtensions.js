function ArrayExtensions()
{
	// extension class
}
{
	Array.prototype.add = function(element)
	{
		this.push(element);
		return this;
	};

	Array.prototype.addMany = function(elements)
	{
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i];
			this.push(element);
		}
		return this;
	};

	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var key = element[keyName];
			this[key] = element;
		}
		return this;
	};

	Array.prototype.append = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			this.push(element);
		}
		return this;
	};

	Array.prototype.clear = function()
	{
		this.length = 0;
		return this;
	};

	Array.prototype.clone = function()
	{
		var returnValue = [];

		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var elementCloned = element.clone();
			returnValue.push(elementCloned);
		}

		return returnValue;
	};

	Array.prototype.contains = function(elementToFind)
	{
		return (this.indexOf(elementToFind) >= 0);
	};

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
	};

	Array.prototype.insertElementAt = function(element, index)
	{
		this.splice(index, 0, element);
		return this;
	};

	Array.prototype.overwriteWith = function(other)
	{
		for (var i = 0; i < this.length; i++)
		{
			var elementThis = this[i];
			var elementOther = other[i];
			if (elementThis.overwriteWith == null)
			{
				this[i] = elementOther;
			}
			else
			{
				elementThis.overwriteWith(elementOther);
			}
		}

		return this;
	};

	Array.prototype.prepend = function(other)
	{
		for (var i = 0; i < other.length; i++)
		{
			var element = other[i];
			this.splice(0, 0, element);
		}
		return this;
	};

	Array.prototype.random = function()
	{
		return this[ Math.floor(Math.random() * this.length) ];
	};

	Array.prototype.remove = function(elementToRemove)
	{
		var indexToRemoveAt = this.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			this.splice(indexToRemoveAt, 1);
		}
		return this;
	};

	Array.prototype.removeAt = function(index)
	{
		this.splice(index, 1);
		return this;
	};

	Array.prototype.sortByProperty = function(propertyName)
	{
		return this.sort
		(
			function (a, b)
			{
				return a[propertyName] - b[propertyName];
			}
		);
	};
}
