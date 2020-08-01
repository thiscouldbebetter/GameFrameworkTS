"use strict";
class Portal {
    constructor(destinationPlaceName, destinationEntityName, clearsVelocity) {
        this.destinationPlaceName = destinationPlaceName;
        this.destinationEntityName = destinationEntityName;
        this.clearsVelocity = clearsVelocity || true;
    }
    use(universe, world, placeToDepart, entityToTransport, entityPortal) {
        entityPortal.collidable().ticksUntilCanCollide = 50; // hack
        var portal = entityPortal.portal();
        var venueCurrent = universe.venueCurrent;
        var messageBoxSize = universe.display.sizeDefault();
        var venueMessage = new VenueMessage(new DataBinding("Portal to:" + portal.destinationPlaceName, null, null), (universe) => // acknowledge
         {
            portal.transport(universe, universe.world, universe.world.placeCurrent, entityToTransport, entityPortal);
            universe.venueNext = new VenueFader(venueCurrent, null, null, null);
        }, venueCurrent, // venuePrev
        messageBoxSize, true // showMessageOnly
        );
        universe.venueNext = venueMessage;
    }
    transport(universe, world, placeToDepart, entityToTransport, entityPortal) {
        var destinationPlace = world.placesByName.get(this.destinationPlaceName);
        destinationPlace.initialize(universe, world);
        var destinationEntity = destinationPlace.entitiesByName.get(this.destinationEntityName);
        var destinationPos = destinationEntity.locatable().loc.pos;
        var entityToTransportLoc = entityToTransport.locatable().loc;
        var entityToTransportPos = entityToTransportLoc.pos;
        world.placeNext = destinationPlace;
        entityToTransportPos.overwriteWith(destinationPos);
        entityToTransport.collidable().entitiesAlreadyCollidedWith.push(destinationEntity);
        if (this.clearsVelocity) {
            entityToTransportLoc.vel.clear();
        }
        placeToDepart.entitiesToRemove.push(entityToTransport);
        destinationPlace.entitiesToSpawn.push(entityToTransport);
    }
    clone() {
        return new Portal(this.destinationPlaceName, this.destinationEntityName, this.clearsVelocity);
    }
}
