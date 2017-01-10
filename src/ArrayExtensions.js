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
	
	Array.prototype.remove = function(elementToRemove)
	{
		var indexToRemoveAt = this.indexOf(elementToRemove);
		if (indexToRemoveAt >= 0)
		{
			this.splice(indexToRemoveAt, 1);
		}
		return this;
	}

}
