
namespace ThisCouldBeBetter.GameFramework
{

export class UniverseWorldPlaceEntities
{
	universe: Universe;
	world: World;
	place: Place;
	entity: Entity; // Usually the entity acting.
	entity2: Entity; // Usually the entity acted upon.

	constructor
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		entity2: Entity
	)
	{
		this.universe = universe;
		this.world = world;
		this.place = place;
		this.entity = entity;
		this.entity2 = entity2;
	}

	static create(): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(null, null, null, null, null);
	}

	static fromUniverse(universe: Universe): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, null, null, null, null);
	}

	static fromUniverseAndWorld
	(
		universe: Universe, world: World
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, world, null, null, null);
	}

	static fromUniverseWorldAndPlace
	(
		universe: Universe, world: World, place: Place
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, world, place, null, null);
	}

	entitiesSet(entity: Entity, entity2: Entity): UniverseWorldPlaceEntities
	{
		this.entity = entity;
		this.entity2 = entity2;
		return this;
	}

	entitiesSwap(): UniverseWorldPlaceEntities
	{
		var temp = this.entity;
		this.entity = this.entity2;
		this.entity2 = temp;
		return this;
	}

	entitySet(value: Entity): UniverseWorldPlaceEntities
	{
		this.entity = value;
		return this;
	}

	entity2Set(value: Entity): UniverseWorldPlaceEntities
	{
		this.entity2 = value;
		return this;
	}

	fieldsSet
	(
		universe: Universe, world: World, place: Place,
		entity: Entity, entity2: Entity
	): UniverseWorldPlaceEntities
	{
		this.universe = universe;
		this.world = world;
		this.place = place;
		this.entity = entity;
		this.entity2 = entity2;
		return this;
	}

	placeSet(value: Place): UniverseWorldPlaceEntities
	{
		this.place = value;
		return this;
	}

	// Clonable.

	clone(): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities
		(
			this.universe, this.world, this.place, this.entity, this.entity2
		);
	}

	overwriteWith(other: UniverseWorldPlaceEntities): UniverseWorldPlaceEntities
	{
		this.universe = other.universe;
		this.world = other.world;
		this.place = other.place;
		this.entity = other.entity;
		this.entity2 = other.entity2;
		return this;
	}

}

}
