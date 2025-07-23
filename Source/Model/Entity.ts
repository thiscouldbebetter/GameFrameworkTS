
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

		this.propertiesByName =
			new Map<string, any>
			(
				this.properties.map
				(
					x => [x.propertyName(), x]
				)
			);
	}

	static fromNameAndProperties
	(
		name: string,
		properties: EntityPropertyBase[]
	): Entity
	{
		return new Entity(name, properties);
	}

	static fromNameAndProperty(name: string, property: EntityPropertyBase): Entity
	{
		return new Entity(name, [ property ] );
	}

	static fromProperty(property: EntityPropertyBase): Entity
	{
		return new Entity(null, [ property ] );
	}

	finalize(uwpe: UniverseWorldPlaceEntities): Entity
	{
		uwpe.entitySet(this);
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
		uwpe.entitySet(this);
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
		var propertyName = propertyToAdd.propertyName();
		this.propertiesByName.set
		(
			propertyName, propertyToAdd
		);
		if (place != null)
		{
			var placeEntities = place.entitiesAll();
			if (placeEntities.indexOf(this) >= 0)
			{
				var propertyName = propertyToAdd.propertyName();
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
		uwpe.entitySet(this);

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
}

}
