
namespace ThisCouldBeBetter.GameFramework
{

export class Portal implements EntityProperty
{
	destinationPlaceName: string;
	destinationEntityName: string;
	velocityToApply: Coords;

	constructor
	(
		destinationPlaceName: string, destinationEntityName: string,
		velocityToApply: Coords
	)
	{
		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
		this.velocityToApply = velocityToApply;
	}

	use
	(
		universe: Universe, world: World, placeToDepart: Place,
		entityToTransport: Entity, entityPortal: Entity
	): void
	{
		var entityPortalCollidable = entityPortal.collidable();
		entityPortalCollidable.ticksUntilCanCollide = 40; // hack

		var portal = entityPortal.portal();
		var venueCurrent = universe.venueCurrent;
		var messageBoxSize = universe.display.sizeDefault();
		var venueMessage = new VenueMessage
		(
			DataBinding.fromContext("Portal to: " + portal.destinationPlaceName),
			(universe: Universe) => // acknowledge
			{
				portal.transport
				(
					universe, universe.world, universe.world.placeCurrent,
					entityToTransport, entityPortal
				);
				universe.venueNext = VenueFader.fromVenueTo(venueCurrent);
			},
			venueCurrent, // venuePrev
			messageBoxSize,
			true // showMessageOnly
		);
		universe.venueNext = venueMessage;
	}

	transport
	(
		universe: Universe, world: World, placeToDepart: Place,
		entityToTransport: Entity, entityPortal: Entity
	): void
	{
		var destinationPlace = world.placesByName.get(this.destinationPlaceName);
		destinationPlace.initialize(universe, world);
		var destinationEntity = destinationPlace.entitiesByName.get(this.destinationEntityName);
		var destinationCollidable = destinationEntity.collidable();
		if (destinationCollidable != null)
		{
			destinationCollidable.ticksUntilCanCollide = 50; // hack
		}
		var destinationPos = destinationEntity.locatable().loc.pos;

		var entityToTransportLoc = entityToTransport.locatable().loc;
		var entityToTransportPos = entityToTransportLoc.pos;

		world.placeNext = destinationPlace;
		entityToTransportPos.overwriteWith(destinationPos);
		entityToTransport.collidable().entitiesAlreadyCollidedWith.push(destinationEntity);

		if (this.velocityToApply != null)
		{
			entityToTransportLoc.vel.overwriteWith(this.velocityToApply);
		}

		placeToDepart.entityToRemoveAdd(entityToTransport);
		destinationPlace.entityToSpawnAdd(entityToTransport);
	}

	clone(): Portal
	{
		return new Portal
		(
			this.destinationPlaceName,
			this.destinationEntityName,
			this.velocityToApply == null ? null : this.velocityToApply.clone()
		);
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
