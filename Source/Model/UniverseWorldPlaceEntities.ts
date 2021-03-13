
namespace ThisCouldBeBetter.GameFramework
{

export class UniverseWorldPlaceEntities
{
	universe: Universe;
	world: World;
	place: Place;
	entity: Entity;
	entity2: Entity;

	constructor
	(
		universe: Universe, world: World, place: Place,
		entity: Entity, entity2: Entity
	)
	{
		this.universe = universe;
		this.world = world;
		this.place = place;
		this.entity = entity;
		this.entity2 = entity2;
	}

	static create()
	{
		return new UniverseWorldPlaceEntities(null, null, null, null, null);
	}

	fieldsSet
	(
		universe: Universe, world: World, place: Place,
		entity: Entity, entity2: Entity
	)
	{
		this.universe = universe;
		this.world = world;
		this.place = place;
		this.entity = entity;
		this.entity2 = entity2;
		return this;
	}
}

}
