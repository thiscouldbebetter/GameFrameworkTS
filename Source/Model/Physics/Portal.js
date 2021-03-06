"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Portal {
            constructor(destinationPlaceName, destinationEntityName, velocityToApply) {
                this.destinationPlaceName = destinationPlaceName;
                this.destinationEntityName = destinationEntityName;
                this.velocityToApply = velocityToApply;
            }
            use(uwpe) {
                var universe = uwpe.universe;
                var entityPortal = uwpe.entity2;
                var entityPortalCollidable = entityPortal.collidable();
                entityPortalCollidable.ticksUntilCanCollide = 40; // hack
                var portal = entityPortal.portal();
                var venueCurrent = universe.venueCurrent;
                var messageBoxSize = universe.display.sizeDefault();
                var messageText = GameFramework.DataBinding.fromContext("Portal to: " + portal.destinationPlaceName);
                var acknowledge = () => {
                    portal.transport(uwpe);
                    universe.venueNext = GameFramework.VenueFader.fromVenueTo(venueCurrent);
                };
                var venueMessage = new GameFramework.VenueMessage(messageText, acknowledge, venueCurrent, // venuePrev
                messageBoxSize, true // showMessageOnly
                );
                universe.venueNext = venueMessage;
            }
            transport(uwpe) {
                var world = uwpe.world;
                var placeToDepart = uwpe.place;
                var entityToTransport = uwpe.entity;
                var destinationPlace = world.placesByName.get(this.destinationPlaceName);
                destinationPlace.initialize(uwpe);
                var destinationEntity = destinationPlace.entitiesByName.get(this.destinationEntityName);
                var destinationCollidable = destinationEntity.collidable();
                if (destinationCollidable != null) {
                    destinationCollidable.ticksUntilCanCollide = 50; // hack
                }
                var destinationPos = destinationEntity.locatable().loc.pos;
                var entityToTransportLoc = entityToTransport.locatable().loc;
                var entityToTransportPos = entityToTransportLoc.pos;
                world.placeNext = destinationPlace;
                entityToTransportPos.overwriteWith(destinationPos);
                entityToTransport.collidable().entitiesAlreadyCollidedWith.push(destinationEntity);
                if (this.velocityToApply != null) {
                    entityToTransportLoc.vel.overwriteWith(this.velocityToApply);
                }
                placeToDepart.entityToRemoveAdd(entityToTransport);
                destinationPlace.entityToSpawnAdd(entityToTransport);
            }
            clone() {
                return new Portal(this.destinationPlaceName, this.destinationEntityName, this.velocityToApply == null ? null : this.velocityToApply.clone());
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Portal = Portal;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
