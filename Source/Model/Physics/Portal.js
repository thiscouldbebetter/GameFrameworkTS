
class Portal
{
	constructor(destinationPlaceName, destinationEntityName, clearsVelocity)
	{
		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
		this.clearsVelocity = clearsVelocity || true;
	}

	use(universe, world, placeToDepart, entityToTransport)
	{
		var destinationPlace = world.places[this.destinationPlaceName];
		destinationPlace.initialize(universe, world);
		var destinationEntity = destinationPlace.entities[this.destinationEntityName];
		var destinationPos = destinationEntity.locatable.loc.pos;

		var entityToTransportLoc = entityToTransport.locatable.loc;
		var entityToTransportPos = entityToTransportLoc.pos;

		world.placeNext = destinationPlace;
		entityToTransportPos.overwriteWith(destinationPos);
		entityToTransport.collidable.entitiesAlreadyCollidedWith.push(destinationEntity);

		if (this.clearsVelocity)
		{
			entityToTransportLoc.vel.clear();
		}

		placeToDepart.entitiesToRemove.push(entityToTransport);
		destinationPlace.entitiesToSpawn.push(entityToTransport);
	};
}
