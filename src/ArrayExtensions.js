function ArrayExtensions()
{
	// extension class
}
{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			var key = item[keyName];
			this[key] = item;
		}
	}
}
