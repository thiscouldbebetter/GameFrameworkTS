
function Entity(name, properties)
{
	this.properties = [];
	this.nameAndPropertiesAdd(name, properties);
}

{
	Entity.prototype.initialize = function(universe, world, place)
	{
		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			var propertyName = property.constructor.name;
			if (property.initialize != null)
			{
				property.initialize(universe, world, place, this);
			}
		}
	};

	Entity.prototype.nameAndPropertiesAdd = function(name, propertiesToAdd)
	{
		this.name = name;
		for (var i = 0; i < propertiesToAdd.length; i++)
		{
			var property = propertiesToAdd[i];
			this.properties.push(property);
			var propertyName = property.constructor.name.lowercaseFirstCharacter();
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
		var nameCloned = this.name; // + IDHelper.Instance().idNext();
		var returnValue = new Entity
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	};
}
