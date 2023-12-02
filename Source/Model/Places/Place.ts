
namespace ThisCouldBeBetter.GameFramework
{

export interface Place extends Namable, Equatable<Place>
{
	camera(): Entity;
	defn(world: World): PlaceDefn;
	draw(universe: Universe, world: World, display: Display): void;
	drawables(): Entity[];
	entitiesAll(): Entity[];
	entitiesByPropertyName(propertyName: string): Entity[];
	entitiesRemove(): void;
	entitiesToRemoveAdd(entitiesToRemove: Entity[]): void;
	entitiesToSpawnAdd(entitiesToSpawn: Entity[]): void;
	entitiesSpawn(uwpe: UniverseWorldPlaceEntities): void;
	entityById(entityId: number): Entity;
	entityByName(entityName: string): Entity;
	entityRemove(entity: Entity): void;
	entitySpawn(uwpe: UniverseWorldPlaceEntities): void;
	entitySpawn2(universe: Universe, world: World, entity: Entity): void;
	entityToRemoveAdd(entityToRemove: Entity): void;
	entityToSpawnAdd(entityToSpawn: Entity): void;
	finalize(uwpe: UniverseWorldPlaceEntities): void;
	initialize(uwpe: UniverseWorldPlaceEntities): void;
	placeParent(world: World): Place;
	placesAncestors(world: World, placesInAncestry: Place[]): Place[];
	size(): Coords;
	toControl(universe: Universe, world: World): ControlBase;
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void;
}

}
