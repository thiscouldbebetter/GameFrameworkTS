
class Entity
{
	name: string;
	properties: any[];
	propertiesByName: Map<string, any>;

	constructor(name: string, properties: any[])
	{
		this.name = name;
		this.properties = properties;

		this.propertiesByName = new Map<string, any>();
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyName = property.constructor.name;
			this.propertiesByName.set(propertyName, property);
		}
	}

	initialize(universe: Universe, world: World, place: Place)
	{
		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			if (property.initialize != null)
			{
				property.initialize(universe, world, place, this);
			}
		}
	};

	propertyAdd(propertyToAdd: any)
	{
		this.properties.push(propertyToAdd);
		this.propertiesByName.set(propertyToAdd.constructor.name, propertyToAdd);
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

	actor(): Actor { return this.propertiesByName.get(Actor.name); }

	boundable(): Boundable { return this.propertiesByName.get(Boundable.name); }

	camera(): Camera { return this.propertiesByName.get(Camera.name); }

	collidable(): Collidable { return this.propertiesByName.get(Collidable.name); }

	constrainable(): Constrainable { return this.propertiesByName.get(Constrainable.name); }

	controllable(): Controllable { return this.propertiesByName.get(Controllable.name); }

	damager(): Damager { return this.propertiesByName.get(Damager.name); }

	device(): Device { return this.propertiesByName.get(Device.name); }

	drawable(): Drawable { return this.propertiesByName.get(Drawable.name); }

	ephemeral(): Ephemeral { return this.propertiesByName.get(Ephemeral.name); }

	equipmentUser(): EquipmentUser { return this.propertiesByName.get(EquipmentUser.name); }

	equippable(): Equippable { return this.propertiesByName.get(Equippable.name); }

	hidable(): Hidable { return this.propertiesByName.get(Hidable.name); }

	item(): Item { return this.propertiesByName.get(Item.name); }

	itemContainer(): ItemContainer { return this.propertiesByName.get(ItemContainer.name); }

	itemCrafter(): ItemCrafter { return this.propertiesByName.get(ItemCrafter.name); }

	itemDefn(): ItemDefn { return this.propertiesByName.get(ItemDefn.name); }

	itemHolder(): ItemHolder { return this.propertiesByName.get(ItemHolder.name); }

	itemStore(): ItemStore { return this.propertiesByName.get(ItemStore.name); }

	killable(): Killable { return this.propertiesByName.get(Killable.name); }

	locatable(): Locatable { return this.propertiesByName.get(Locatable.name); }

	movable(): Movable { return this.propertiesByName.get(Movable.name); }

	recurrent(): Recurrent { return this.propertiesByName.get(Recurrent.name); }

	playable(): Playable { return this.propertiesByName.get(Playable.name); }

	portal(): Portal { return this.propertiesByName.get(Portal.name); }

	skillLearner(): SkillLearner { return this.propertiesByName.get(SkillLearner.name); }

	talker(): Talker { return this.propertiesByName.get(Talker.name); }

	usable(): Usable { return this.propertiesByName.get(Usable.name); }
}
