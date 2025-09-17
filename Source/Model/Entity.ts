
namespace ThisCouldBeBetter.GameFramework
{

export class Entity implements Clonable<Entity>
{
	id: number;
	name: string;
	properties: EntityProperty[];
	propertiesByName: Map<string, EntityProperty>;

	constructor(name: string, properties: EntityProperty[])
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
		properties: EntityProperty[]
	): Entity
	{
		return new Entity(name, properties);
	}

	static fromNameAndProperty(name: string, property: EntityProperty): Entity
	{
		return new Entity(name, [ property ] );
	}

	static fromProperty(property: EntityProperty): Entity
	{
		return new Entity(property.propertyName(), [ property ] );
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

	propertiesClear(): Entity
	{
		this.properties.length = 0;
		this.propertiesByName.clear();
		return this;
	}

	propertyAdd(propertyToAdd: EntityProperty): Entity
	{
		return this.propertyAddForPlace(propertyToAdd, null);
	}

	propertyAddForPlace
	(
		propertyToAdd: EntityProperty, place: Place
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

	propertyByName(name: string): EntityProperty
	{
		return this.propertiesByName.get(name);
	}

	propertyRemoveForPlace
	(
		propertyToRemove: EntityProperty, place: Place
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

	propertyWithNameRemoveForPlace(propertyToRemoveName: string, place: Place): Entity
	{
		var propertyToRemove = this.propertyByName(propertyToRemoveName);
		this.propertyRemoveForPlace(propertyToRemove, place);
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
		var propertiesCloned = new Array<EntityProperty>();
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyAsAny = property as any;
			var propertyCloned =
			(
				propertyAsAny.clone == null ?
				propertyAsAny : propertyAsAny.clone()
			) as EntityProperty;
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
		var areAllPropertiesEqualSoFar = true;

		var thisProperties = this.properties;
		for (var i = 0; i < thisProperties.length; i++)
		{
			var thisProperty = thisProperties[i] as EntityProperty;
			var propertyName = thisProperty.propertyName();
			var otherProperty = other.propertyByName(propertyName) as EntityProperty;
			var propertiesAreEqual = thisProperty.equals(otherProperty);
			if (propertiesAreEqual == false)
			{
				areAllPropertiesEqualSoFar = false;
				break;
			}
		}

		var areEntitiesEqual =
			(this.name == other.name && areAllPropertiesEqualSoFar);

		return areEntitiesEqual;
	}
}

}
