
function Entity(name, properties)
{
	this.name = name;
	this.properties = properties;

	for (var i = 0; i < this.properties.length; i++)
	{
		var property = this.properties[i];
		var propertyName = property.constructor.name;
		this[propertyName] = property;
	}
}

{
	Entity.prototype.clone = function()
	{
		var propertiesCloned = [];
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyCloned = (property.clone == null ? property : property.clone());
			propertiesCloned.add(propertyCloned);
		}
		var returnValue = new Entity(this.name + ".1", propertiesCloned);
		return returnValue;
	};
}
