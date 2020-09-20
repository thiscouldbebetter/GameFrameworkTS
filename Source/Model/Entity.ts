
class Entity
{
	name: string;
	properties: EntityProperty[];
	propertiesByName: Map<string, EntityProperty>;

	constructor(name: string, properties: EntityProperty[])
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

	finalize(universe: Universe, world: World, place: Place)
	{
		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			if (property.finalize != null)
			{
				property.finalize(universe, world, place, this);
			}
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
	}

	propertyAddForPlace(propertyToAdd: EntityProperty, place: Place)
	{
		this.properties.push(propertyToAdd);
		this.propertiesByName.set(propertyToAdd.constructor.name, propertyToAdd);
		if (place != null)
		{
			var propertyName = propertyToAdd.constructor.name;
			var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
			entitiesWithProperty.push(this);
		}
	}

	propertyRemoveForPlace(propertyToRemove: EntityProperty, place: Place)
	{
		ArrayHelper.remove(this.properties, propertyToRemove);
		this.propertiesByName.delete(propertyToRemove.constructor.name);
		if (place != null)
		{
			var propertyName = propertyToRemove.constructor.name;
			var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
			ArrayHelper.remove(entitiesWithProperty, this);
		}
	}

	// Cloneable.

	clone()
	{
		var nameCloned = this.name; // + IDHelper.Instance().idNext();
		var propertiesCloned = [];
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyAsAny = property as any;
			var propertyCloned = (propertyAsAny.clone == null ? propertyAsAny : propertyAsAny.clone()) as EntityProperty;
			propertiesCloned.push(propertyCloned);
		}
		var returnValue = new Entity
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	}

	// Convenience methods for properties.

	actor(): Actor { return this.propertiesByName.get(Actor.name) as Actor; }

	boundable(): Boundable { return this.propertiesByName.get(Boundable.name) as Boundable; }

	camera(): Camera { return this.propertiesByName.get(Camera.name) as Camera; }

	collidable(): Collidable { return this.propertiesByName.get(Collidable.name) as Collidable; }

	constrainable(): Constrainable { return this.propertiesByName.get(Constrainable.name) as Constrainable; }

	controllable(): Controllable { return this.propertiesByName.get(Controllable.name) as Controllable; }

	damager(): Damager { return this.propertiesByName.get(Damager.name) as Damager; }

	device(): Device { return this.propertiesByName.get(Device.name) as Device; }

	drawable(): Drawable { return this.propertiesByName.get(Drawable.name) as Drawable; }

	drawableCamera(): DrawableCamera { return this.propertiesByName.get(DrawableCamera.name) as DrawableCamera; }

	effectable() : Effectable { return this.propertiesByName.get(Effectable.name) as Effectable; }

	ephemeral(): Ephemeral { return this.propertiesByName.get(Ephemeral.name) as Ephemeral; }

	equipmentUser(): EquipmentUser { return this.propertiesByName.get(EquipmentUser.name) as EquipmentUser; }

	equippable(): Equippable { return this.propertiesByName.get(Equippable.name) as Equippable; }

	enemy(): Enemy { return this.propertiesByName.get(Enemy.name) as Enemy; }

	forceField(): ForceField { return this.propertiesByName.get(ForceField.name) as ForceField; }

	item(): Item { return this.propertiesByName.get(Item.name) as Item; }

	itemContainer(): ItemContainer { return this.propertiesByName.get(ItemContainer.name) as ItemContainer; }

	itemCrafter(): ItemCrafter { return this.propertiesByName.get(ItemCrafter.name) as ItemCrafter; }

	itemDefn(): ItemDefn { return this.propertiesByName.get(ItemDefn.name) as ItemDefn; }

	itemHolder(): ItemHolder { return this.propertiesByName.get(ItemHolder.name) as ItemHolder; }

	itemStore(): ItemStore { return this.propertiesByName.get(ItemStore.name) as ItemStore; }

	journalKeeper(): JournalKeeper { return this.propertiesByName.get(JournalKeeper.name) as JournalKeeper; }

	killable(): Killable { return this.propertiesByName.get(Killable.name) as Killable; }

	loadable(): Loadable { return this.propertiesByName.get(Loadable.name) as Loadable; }

	locatable(): Locatable { return this.propertiesByName.get(Locatable.name) as Locatable; }

	movable(): Movable { return this.propertiesByName.get(Movable.name) as Movable; }

	obstacle(): Obstacle { return this.propertiesByName.get(Obstacle.name) as Obstacle; }

	phased(): Phased { return this.propertiesByName.get(Phased.name) as Phased; }

	recurrent(): Recurrent { return this.propertiesByName.get(Recurrent.name) as Recurrent; }

	perceptible(): Perceptible { return this.propertiesByName.get(Perceptible.name) as Perceptible; }

	perceptor(): Perceptor { return this.propertiesByName.get(Perceptor.name) as Perceptor; }

	playable(): Playable { return this.propertiesByName.get(Playable.name) as Playable; }

	portal(): Portal { return this.propertiesByName.get(Portal.name) as Portal; }

	selector(): Selector { return this.propertiesByName.get(Selector.name) as Selector; }

	skillLearner(): SkillLearner { return this.propertiesByName.get(SkillLearner.name) as SkillLearner; }

	starvable(): Starvable { return this.propertiesByName.get(Starvable.name) as Starvable; }

	talker(): Talker { return this.propertiesByName.get(Talker.name) as Talker; }

	tirable(): Tirable { return this.propertiesByName.get(Tirable.name) as Tirable; }

	traversable(): Traversable { return this.propertiesByName.get(Traversable.name) as Traversable; }

	usable(): Usable { return this.propertiesByName.get(Usable.name) as Usable; }
}
