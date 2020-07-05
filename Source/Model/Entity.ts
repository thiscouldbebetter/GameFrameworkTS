
class Entity
{
	name: string;
	properties: any;
	propertiesByName: any;

	constructor(name, properties)
	{
		this.name = name;
		this.properties = properties;

		this.propertiesByName = {};
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyName = property.constructor.name;
			this.propertiesByName[propertyName] = property;
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
			propertiesCloned.push(propertyCloned);
		}
		var returnValue = new Entity
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	};

	// Convenience methods for properties.

	actor() { return this.propertiesByName[Actor.name]; }

	camera() { return this.propertiesByName[Camera.name]; }

	collidable() { return this.propertiesByName[Collidable.name]; }

	constrainable() { return this.propertiesByName[Constrainable.name]; }

	controllable() { return this.propertiesByName[Controllable.name]; }

	damager() { return this.propertiesByName[Damager.name]; }

	device() { return this.propertiesByName[Device.name]; }

	drawable() { return this.propertiesByName[Drawable.name]; }

	ephemeral() { return this.propertiesByName[Ephemeral.name]; }

	equipmentUser() { return this.propertiesByName[EquipmentUser.name]; }

	item() { return this.propertiesByName[Item.name]; }

	itemContainer() { return this.propertiesByName[ItemContainer.name]; }

	itemCrafter() { return this.propertiesByName[ItemCrafter.name]; }

	itemHolder() { return this.propertiesByName[ItemHolder.name]; }

	itemStore() { return this.propertiesByName[ItemStore.name]; }

	killable() { return this.propertiesByName[Killable.name]; }

	locatable() { return this.propertiesByName[Locatable.name]; }

	movable() { return this.propertiesByName[Movable.name]; }

	playable() { return this.propertiesByName[Playable.name]; }

	portal() { return this.propertiesByName[Portal.name]; }

	skillLearner() { return this.propertiesByName[SkillLearner.name]; }

	talker() { return this.propertiesByName[Talker.name]; }
}
