
namespace ThisCouldBeBetter.GameFramework
{

export class Portal extends EntityPropertyBase<Portal>
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
		super();

		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
		this.velocityToApply = velocityToApply || Coords.zeroes();
	}

	static create(): Portal
	{
		return new Portal(null, null, null);
	}

	static of(entity: Entity): Portal
	{
		return entity.propertyByName(Portal.name) as Portal;
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityPortal = uwpe.entity2;

		var entityPortalCollidable = Collidable.of(entityPortal);
		entityPortalCollidable.ticksUntilCanCollide = 40; // hack

		var portal = Portal.of(entityPortal);
		var venueCurrent = universe.venueCurrent();
		var messageBoxSize = universe.display.sizeDefault();
		var messageText =
			DataBinding.fromContext("Portal to: " + portal.destinationPlaceName);

		var acknowledge = () =>
		{
			portal.transport(uwpe);
			universe.venueTransitionTo(venueCurrent);
		};

		var venueMessage = new VenueMessage
		(
			messageText,
			acknowledge,
			venueCurrent, // venuePrev
			messageBoxSize,
			true // showMessageOnly
		);
		universe.venueTransitionTo(venueMessage);
	}

	transport(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var placeToDepart = uwpe.place;
		var entityToTransport = uwpe.entity;

		var destinationPlace = world.placeGetByName(this.destinationPlaceName);
		destinationPlace.initialize(uwpe);
		var destinationEntity =
			destinationPlace.entityByName(this.destinationEntityName);
		var destinationCollidable = Collidable.of(destinationEntity);
		if (destinationCollidable != null)
		{
			destinationCollidable.ticksUntilCanCollide = 50; // hack
		}
		var destinationPos = Locatable.of(destinationEntity).loc.pos;

		var entityToTransportLoc = Locatable.of(entityToTransport).loc;
		var entityToTransportPos = entityToTransportLoc.pos;

		world.placeNextSet(destinationPlace);
		entityToTransportPos.overwriteWith(destinationPos);
		var collidable = Collidable.of(entityToTransport);
		collidable.entityAlreadyCollidedWithAddIfNotPresent(destinationEntity);

		if (this.velocityToApply != null)
		{
			entityToTransportLoc.vel.overwriteWith(this.velocityToApply);
		}

		placeToDepart.entityToRemoveAdd(entityToTransport);
		destinationPlace.entityToSpawnAdd(entityToTransport);
	}

	// Clonable.

	clone(): Portal
	{
		return new Portal
		(
			this.destinationPlaceName,
			this.destinationEntityName,
			this.velocityToApply == null ? null : this.velocityToApply.clone()
		);
	}

	overwriteWith(other: Portal): Portal { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Portal.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Portal): boolean { return false; } // todo

}

}
