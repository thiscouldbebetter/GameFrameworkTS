
class Portal
{
	destinationPlaceName: string;
	destinationEntityName: string;
	clearsVelocity: boolean;

	constructor(destinationPlaceName: string, destinationEntityName: string, clearsVelocity: boolean)
	{
		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
		this.clearsVelocity = clearsVelocity || true;
	}

	use(universe: Universe, world: World, placeToDepart: Place, entityToTransport: Entity)
	{
		var destinationPlace = world.placesByName.get(this.destinationPlaceName);
		destinationPlace.initialize(universe, world);
		var destinationEntity = destinationPlace.entitiesByName.get(this.destinationEntityName);
		var destinationPos = destinationEntity.locatable().loc.pos;

		var entityToTransportLoc = entityToTransport.locatable().loc;
		var entityToTransportPos = entityToTransportLoc.pos;

		world.placeNext = destinationPlace;
		entityToTransportPos.overwriteWith(destinationPos);
		entityToTransport.collidable().entitiesAlreadyCollidedWith.push(destinationEntity);

		if (this.clearsVelocity)
		{
			entityToTransportLoc.vel.clear();
		}

		placeToDepart.entitiesToRemove.push(entityToTransport);
		destinationPlace.entitiesToSpawn.push(entityToTransport);
	}

	clone()
	{
		return new Portal
		(
			this.destinationPlaceName,
			this.destinationEntityName,
			this.clearsVelocity
		);
	}
}