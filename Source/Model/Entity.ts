
namespace ThisCouldBeBetter.GameFramework
{

export class Entity implements Clonable<Entity>
{
	id: number;
	name: string;
	properties: EntityPropertyBase[];
	propertiesByName: Map<string, EntityPropertyBase>;

	constructor(name: string, properties: EntityPropertyBase[])
	{
		this.id = IDHelper.Instance().idNext();
		this.name = name || "_" + this.id;
		this.properties = properties;

		this.propertiesByName = new Map<string, any>();
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyName = property.constructor.name;
			this.propertiesByName.set(propertyName, property);
		}
	}

	static fromProperty(property: EntityPropertyBase): Entity
	{
		return new Entity(null, [ property ] );
	}

	finalize(uwpe: UniverseWorldPlaceEntities): Entity
	{
		uwpe.entity = this;
		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			if (property.finalize != null)
			{
				property.finalize(uwpe);
			}
		}
		return this;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): Entity
	{
		uwpe.entity = this;
		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			if (property.initialize != null)
			{
				property.initialize(uwpe);
			}
		}
		return this;
	}

	nameSet(nameToSet: string): Entity
	{
		this.name = nameToSet;
		return this;
	}

	propertyAdd(propertyToAdd: EntityPropertyBase): Entity
	{
		return this.propertyAddForPlace(propertyToAdd, null);
	}

	propertyAddForPlace
	(
		propertyToAdd: EntityPropertyBase, place: Place
	): Entity
	{
		this.properties.push(propertyToAdd);
		this.propertiesByName.set
		(
			propertyToAdd.constructor.name, propertyToAdd
		);
		if (place != null)
		{
			var placeEntities = place.entitiesAll();
			if (placeEntities.indexOf(this) >= 0)
			{
				var propertyName = propertyToAdd.constructor.name;
				var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
				entitiesWithProperty.push(this);
			}
		}
		return this;
	}

	propertyByName(name: string): EntityPropertyBase
	{
		return this.propertiesByName.get(name);
	}

	propertyRemoveForPlace
	(
		propertyToRemove: EntityPropertyBase, place: Place
	): Entity
	{
		ArrayHelper.remove(this.properties, propertyToRemove);
		this.propertiesByName.delete(propertyToRemove.constructor.name);
		if (place != null)
		{
			var propertyName = propertyToRemove.constructor.name;
			var entitiesWithProperty = place.entitiesByPropertyName(propertyName);
			ArrayHelper.remove(entitiesWithProperty, this);
		}
		return this;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): Entity
	{
		uwpe.entity = this;

		var entityProperties = this.properties;
		for (var p = 0; p < entityProperties.length; p++)
		{
			var property = entityProperties[p];
			if (property.updateForTimerTick != null)
			{
				property.updateForTimerTick(uwpe);
			}
		}
		return this;
	}

	// Cloneable.

	clone(): Entity
	{
		var nameCloned = this.name; // + IDHelper.Instance().idNext();
		var propertiesCloned = new Array<EntityPropertyBase>();
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyAsAny = property as any;
			var propertyCloned =
			(
				propertyAsAny.clone == null ?
				propertyAsAny : propertyAsAny.clone()
			) as EntityPropertyBase;
			propertiesCloned.push(propertyCloned);
		}
		var returnValue = new Entity
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	}

	overwriteWith(other: Entity): Entity
	{
		throw new Error("Not yet implemented!");
	}

	// Equatable.

	equals(other: Entity): boolean
	{
		var areAllPropertiesEqual =
			ArrayHelper.areEqual(this.properties, other.properties);

		var areEntitiesEqual =
			(this.name == other.name && areAllPropertiesEqual);

		return areEntitiesEqual;
	}

	// Convenience methods for properties.

	actor(): Actor { return this.propertyByName(Actor.name) as Actor; }
	animatable(): Animatable2 { return this.propertyByName(Animatable2.name) as Animatable2; }
	audible(): Audible { return this.propertyByName(Audible.name) as Audible; }
	boundable(): BoundableBase { return this.propertyByName(Boundable.name) as BoundableBase; }
	camera(): Camera { return this.propertyByName(Camera.name) as Camera; }
	collidable(): Collidable { return this.propertyByName(Collidable.name) as Collidable; }
	constrainable(): Constrainable { return this.propertyByName(Constrainable.name) as Constrainable; }
	controllable(): Controllable { return this.propertyByName(Controllable.name) as Controllable; }
	damager(): Damager { return this.propertyByName(Damager.name) as Damager; }
	device(): Device { return this.propertyByName(Device.name) as Device; }
	drawable(): Drawable { return this.propertyByName(Drawable.name) as Drawable; }
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
	loadable(): LoadableProperty { return this.propertyByName(LoadableProperty.name) as LoadableProperty; }
	locatable(): Locatable { return this.propertyByName(Locatable.name) as Locatable; }
	movable(): Movable { return this.propertyByName(Movable.name) as Movable; }
	namable(): NamableProperty { return this.propertyByName(NamableProperty.name) as NamableProperty; }
	obstacle(): Obstacle { return this.propertyByName(Obstacle.name) as Obstacle; }
	phased(): Phased { return this.propertyByName(Phased.name) as Phased; }
	recurrent(): Recurrent { return this.propertyByName(Recurrent.name) as Recurrent; }
	perceptible(): Perceptible { return this.propertyByName(Perceptible.name) as Perceptible; }
	perceptor(): Perceptor { return this.propertyByName(Perceptor.name) as Perceptor; }
	playable(): Playable { return this.propertyByName(Playable.name) as Playable; }
	portal(): Portal { return this.propertyByName(Portal.name) as Portal; }
	projectileGenerator(): ProjectileGenerator { return this.propertyByName(ProjectileGenerator.name) as ProjectileGenerator; }
	selectable(): Selectable { return this.propertyByName(Selectable.name) as Selectable; }
	selector(): Selector { return this.propertyByName(Selector.name) as Selector; }
	skillLearner(): SkillLearner { return this.propertyByName(SkillLearner.name) as SkillLearner; }
	starvable(): Starvable { return this.propertyByName(Starvable.name) as Starvable; }
	talker(): Talker { return this.propertyByName(Talker.name) as Talker; }
	tirable(): Tirable { return this.propertyByName(Tirable.name) as Tirable; }
	traversable(): Traversable { return this.propertyByName(Traversable.name) as Traversable; }
	usable(): Usable { return this.propertyByName(Usable.name) as Usable; }
}

}
