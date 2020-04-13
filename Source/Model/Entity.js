
class Entity
{
	constructor(name, properties)
	{
		this.name = name;
		this.properties = properties;

		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyName = property.constructor.name.lowercaseFirstCharacter();
			this[propertyName] = property;
		}
	}

	initialize(universe, world, place)
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

	// Cloneable.

	clone()
	{
		var nameCloned = this.name; // + IDHelper.Instance().idNext();
		var propertiesCloned = [];
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyCloned = (property.clone == null ? property : property.clone());
			propertiesCloned.add(propertyCloned);
		}
		var returnValue = new Entity
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	};
}
