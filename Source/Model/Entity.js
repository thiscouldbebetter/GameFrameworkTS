
function Entity(name, properties)
{
	this.properties = [];
	this.nameAndPropertiesAdd(name, properties);
}

{
	Entity.prototype.nameAndPropertiesAdd = function(name, propertiesToAdd)
	{
		this.name = name;
		for (var i = 0; i < propertiesToAdd.length; i++)
		{
			var property = propertiesToAdd[i];
			this.properties.push(property);
			var propertyName = property.constructor.name;
			this[propertyName] = property;
		}
		return this;
	};

	// Cloneable.

	Entity.prototype.clone = function()
	{
		var propertiesCloned = [];
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyCloned = (property.clone == null ? property : property.clone());
			propertiesCloned.add(propertyCloned);
		}
		var returnValue = new Entity
		(
			this.name + IDHelper.Instance().idNext(), propertiesCloned
		);
		return returnValue;
	};
}
