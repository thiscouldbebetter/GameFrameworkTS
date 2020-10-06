
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

	propertyByName(name: string)
	{
		return this.propertiesByName.get(name);
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

	actor(): Actor { return this.propertyByName(Actor.name) as Actor; }
	animatable(): Animatable { return this.propertyByName(Animatable.name) as Animatable; }
	boundable(): Boundable { return this.propertyByName(Boundable.name) as Boundable; }
	camera(): Camera { return this.propertyByName(Camera.name) as Camera; }
	collidable(): Collidable { return this.propertyByName(Collidable.name) as Collidable; }
	constrainable(): Constrainable { return this.propertyByName(Constrainable.name) as Constrainable; }
	controllable(): Controllable { return this.propertyByName(Controllable.name) as Controllable; }
	damager(): Damager { return this.propertyByName(Damager.name) as Damager; }
	device(): Device { return this.propertyByName(Device.name) as Device; }
	drawable(): Drawable { return this.propertyByName(Drawable.name) as Drawable; }
	drawableCamera(): DrawableCamera { return this.propertyByName(DrawableCamera.name) as DrawableCamera; }
	effectable() : Effectable { return this.propertyByName(Effectable.name) as Effectable; }
	ephemeral(): Ephemeral { return this.propertyByName(Ephemeral.name) as Ephemeral; }
	equipmentUser(): EquipmentUser { return this.propertyByName(EquipmentUser.name) as EquipmentUser; }
	equippable(): Equippable { return this.propertyByName(Equippable.name) as Equippable; }
	enemy(): Enemy { return this.propertyByName(Enemy.name) as Enemy; }
	forceField(): ForceField { return this.propertyByName(ForceField.name) as ForceField; }
	item(): Item { return this.propertyByName(Item.name) as Item; }
	itemContainer(): ItemContainer { return this.propertyByName(ItemContainer.name) as ItemContainer; }
	itemCrafter(): ItemCrafter { return this.propertyByName(ItemCrafter.name) as ItemCrafter; }
	itemDefn(): ItemDefn { return this.propertyByName(ItemDefn.name) as ItemDefn; }
	itemHolder(): ItemHolder { return this.propertyByName(ItemHolder.name) as ItemHolder; }
	itemStore(): ItemStore { return this.propertyByName(ItemStore.name) as ItemStore; }
	journalKeeper(): JournalKeeper { return this.propertyByName(JournalKeeper.name) as JournalKeeper; }
	killable(): Killable { return this.propertyByName(Killable.name) as Killable; }
	loadable(): Loadable { return this.propertyByName(Loadable.name) as Loadable; }
	locatable(): Locatable { return this.propertyByName(Locatable.name) as Locatable; }
	movable(): Movable { return this.propertyByName(Movable.name) as Movable; }
	obstacle(): Obstacle { return this.propertyByName(Obstacle.name) as Obstacle; }
	phased(): Phased { return this.propertyByName(Phased.name) as Phased; }
	recurrent(): Recurrent { return this.propertyByName(Recurrent.name) as Recurrent; }
	perceptible(): Perceptible { return this.propertyByName(Perceptible.name) as Perceptible; }
	perceptor(): Perceptor { return this.propertyByName(Perceptor.name) as Perceptor; }
	playable(): Playable { return this.propertyByName(Playable.name) as Playable; }
	portal(): Portal { return this.propertyByName(Portal.name) as Portal; }
	selector(): Selector { return this.propertyByName(Selector.name) as Selector; }
	skillLearner(): SkillLearner { return this.propertyByName(SkillLearner.name) as SkillLearner; }
	starvable(): Starvable { return this.propertyByName(Starvable.name) as Starvable; }
	talker(): Talker { return this.propertyByName(Talker.name) as Talker; }
	tirable(): Tirable { return this.propertyByName(Tirable.name) as Tirable; }
	traversable(): Traversable { return this.propertyByName(Traversable.name) as Traversable; }
	usable(): Usable { return this.propertyByName(Usable.name) as Usable; }
}
