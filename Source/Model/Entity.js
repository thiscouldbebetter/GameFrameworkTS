
function Entity(name, properties)
{
	this.name = name;
	this.properties = properties;

	for (var i = 0; i < this.properties.length; i++)
	{
		var property = this.properties[i];
		var propertyName = property.constructor.name;
		propertyName = propertyName.substr(0, 1).toLowerCase() + propertyName.substr(1);
		this[propertyName] = property;
	}
}
