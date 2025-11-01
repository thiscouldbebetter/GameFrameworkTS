
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
		this.universeSet(universe);
		this.worldSet(world || (universe == null ? null : universe.world) );
		this.placeSet(place || (universe == null ? null : (universe.world == null ? null : universe.world.placeCurrent) ) );
		this.entitySet(entity);
		this.entity2Set(entity2);
	}

	static create(): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(null, null, null, null, null);
	}

	static fromEntity(entity: Entity): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(null, null, null, entity, null);
	}

	static fromUniverse(universe: Universe): UniverseWorldPlaceEntities
	{
		return UniverseWorldPlaceEntities.fromUniverseAndWorld(universe, universe.world);
	}

	static fromUniverseAndWorld
	(
		universe: Universe, world: World
	): UniverseWorldPlaceEntities
	{
		var place =
			world == null
			? null
			: world.placeCurrent;
		return UniverseWorldPlaceEntities.fromUniverseWorldAndPlace(universe, world, place);
	}

	static fromUniverseWorldAndPlace
	(
		universe: Universe, world: World, place: Place
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, world, place, null, null);
	}

	static fromUniverseWorldPlaceAndEntities
	(
		universe: Universe, world: World, place: Place, entity: Entity, entity2: Entity
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, world, place, entity, entity2);
	}

	static fromUniverseWorldPlaceAndEntity
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(universe, world, place, entity, null);
	}

	static fromWorldAndPlace
	(
		world: World, place: Place
	): UniverseWorldPlaceEntities
	{
		return new UniverseWorldPlaceEntities(null, world, place, null, null);
	}

	clear(): UniverseWorldPlaceEntities
	{
		this.universeSet(null);
		this.worldSet(null);
		this.placeSet(null);
		this.entitySet(null);
		this.entity2Set(null);
		return this;
	}

	entitiesSet(entity: Entity, entity2: Entity): UniverseWorldPlaceEntities
	{
		this.entitySet(entity);
		this.entity2Set(entity2);
		return this;
	}

	entitiesSwap(): UniverseWorldPlaceEntities
	{
		var temp = this.entity;
		this.entitySet(this.entity2);
		this.entity2Set(temp);
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
		this.universeSet(universe);
		this.worldSet(world);
		this.placeSet(place);
		this.entitySet(entity);
		this.entity2Set(entity2);
		return this;
	}

	placeSet(value: Place): UniverseWorldPlaceEntities
	{
		this.place = value;
		return this;
	}

	universeSet(value: Universe): UniverseWorldPlaceEntities
	{
		this.universe = value;
		return this;
	}

	worldSet(value: World): UniverseWorldPlaceEntities
	{
		this.world = value;
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
		this.universeSet(other.universe);
		this.worldSet(other.world);
		this.placeSet(other.place);
		this.entitySet(other.entity);
		this.entity2Set(other.entity2);
		return this;
	}

}

}
