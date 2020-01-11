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

	Array.prototype.addLookups = function(getKeyForElement)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var key = getKeyForElement(element);
			this[key] = element;
		}
		return this;
	};

	Array.prototype.addLookupsByName = function()
	{
		return this.addLookups( function(x) { return x.name; } );
	};

	Array.prototype.addLookupsMultiple = function(getKeysForElement)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var keys = getKeysForElement(element);
			for (var k = 0; k < keys.length; k++)
			{
				var key = keys[k];
				this[key] = element;
			}
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

	Array.prototype.clearLookups = function()
	{
		var arrayWithNoLookups = [];
		for (var fieldName in this)
		{
			var shouldDelete =
				isNaN(fieldName)
				&& (arrayWithNoLookups[fieldName] == null)
				&& (arrayWithNoLookups.hasOwnProperty(fieldName) == false);

			if (shouldDelete)
			{
				delete this[fieldName];
			}
		}
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

	Array.prototype.concatenateAll = function()
	{
		var childrenConcatenated = [];

		for (var i = 0; i < this.length; i++)
		{
			var childArray = this[i];
			childrenConcatenated = childrenConcatenated.concat(childArray);
		}

		return childrenConcatenated;
	};

	Array.prototype.contains = function(elementToFind)
	{
		return (this.indexOf(elementToFind) >= 0);
	};

	Array.prototype.equals = function(other)
	{
		var areEqualSoFar;

		if (this.length != other.length)
		{
			areEqualSoFar = false;
		}
		else
		{
			for (var i = 0; i < this.length; i++)
			{
				areEqualSoFar = this[i].equals(other[i]);
				if (areEqualSoFar == false)
				{
					break;
				}
			}
		}

		return areEqualSoFar;
	};

	Array.prototype.insertElementAfterOther = function(elementToInsert, other)
	{
		var index = this.indexOf(other);
		if (index >= 0)
		{
			this.splice(index + 1, 0, elementToInsert);
		}
		else
		{
			this.push(elementToInsert);
		}
		return this;
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

	Array.prototype.random = function(randomizer)
	{
		return this[ Math.floor(randomizer.getNextRandom() * this.length) ];
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

	Array.prototype.select = function(getPropertyForElement)
	{
		var returnValues = [];
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var elementProperty = getPropertyForElement(element);
			returnValues.push(elementProperty);
		}
		return returnValues;
	};

	Array.prototype.sortByProperty = function(getPropertyForElement)
	{
		return this.sort
		(
			function (a, b)
			{
				var returnValue;
				var propertyA = getPropertyForElement(a);
				var propertyB = getPropertyForElement(b);
				if (propertyA.constructor.name == "".constructor.name)
				{
					returnValue = propertyA.localeCompare(propertyB);
				}
				else if (isNaN(parseFloat(propertyA)) == false)
				{
					returnValue = propertyA - propertyB;
				}
				return returnValue;
			}
		);
	};
}
