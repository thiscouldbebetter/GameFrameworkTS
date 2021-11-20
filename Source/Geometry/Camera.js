"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Camera {
            constructor(viewSize, focalLength, loc, entitiesInViewSort) {
                this.viewSize = viewSize;
                this.focalLength = focalLength;
                this.loc = loc;
                this._entitiesInViewSort = entitiesInViewSort;
                this.viewSizeHalf = this.viewSize.clone().clearZ().half();
                var viewColliderSize = this.viewSize.clone();
                viewColliderSize.z = Number.POSITIVE_INFINITY;
                this.viewCollider = new GameFramework.Box(this.loc.pos, viewColliderSize);
                this.entitiesInView = new Array();
                this._posSaved = GameFramework.Coords.create();
            }
            static default() {
                return new Camera(new GameFramework.Coords(400, 300, 1000), // viewSize
                150, // focalLength
                GameFramework.Disposition.fromPos(new GameFramework.Coords(0, 0, -150)), null // entitiesInViewSort
                );
            }
            clipPlanes() {
                if (this._clipPlanes == null) {
                    this._clipPlanes =
                        [
                            new GameFramework.Plane(GameFramework.Coords.create(), 0),
                            new GameFramework.Plane(GameFramework.Coords.create(), 0),
                            new GameFramework.Plane(GameFramework.Coords.create(), 0),
                            new GameFramework.Plane(GameFramework.Coords.create(), 0),
                        ];
                }
                var cameraLoc = this.loc;
                var cameraOrientation = cameraLoc.orientation;
                var cameraPos = cameraLoc.pos;
                var centerOfViewPlane = cameraPos.clone().add(cameraOrientation.forward.clone().multiplyScalar(this.focalLength));
                var cornerOffsetRight = cameraOrientation.right.clone().multiplyScalar(this.viewSizeHalf.x);
                var cornerOffsetDown = cameraOrientation.down.clone().multiplyScalar(this.viewSizeHalf.y);
                var cameraViewCorners = [
                    centerOfViewPlane.clone().add(cornerOffsetRight).add(cornerOffsetDown),
                    centerOfViewPlane.clone().subtract(cornerOffsetRight).add(cornerOffsetDown),
                    centerOfViewPlane.clone().subtract(cornerOffsetRight).subtract(cornerOffsetDown),
                    centerOfViewPlane.clone().add(cornerOffsetRight).subtract(cornerOffsetDown),
                ];
                var numberOfCorners = cameraViewCorners.length;
                for (var i = 0; i < numberOfCorners; i++) {
                    var iNext = i + 1;
                    if (iNext >= numberOfCorners) {
                        iNext = 0;
                    }
                    var clipPlane = this._clipPlanes[i];
                    var cameraViewCorner = cameraViewCorners[i];
                    var cameraViewCornerNext = cameraViewCorners[iNext];
                    clipPlane.fromPoints(cameraPos, cameraViewCorner, cameraViewCornerNext);
                }
                return this._clipPlanes;
            }
            coordsTransformViewToWorld(viewCoords, ignoreZ) {
                var cameraLoc = this.loc;
                if (ignoreZ) {
                    viewCoords.z = this.focalLength;
                }
                var worldCoords = viewCoords.subtract(this.viewSizeHalf);
                cameraLoc.orientation.unprojectCoordsRDF(worldCoords);
                worldCoords.add(cameraLoc.pos);
                return worldCoords;
            }
            coordsTransformWorldToView(worldCoords) {
                var cameraPos = this.loc.pos;
                var cameraOrientation = this.loc.orientation;
                var viewCoords = worldCoords.subtract(cameraPos);
                cameraOrientation.projectCoordsRDF(viewCoords);
                if (this.focalLength != null) {
                    var viewCoordsZ = viewCoords.z;
                    if (viewCoordsZ != 0) {
                        viewCoords.multiplyScalar(this.focalLength).divideScalar(viewCoordsZ);
                        viewCoords.z = viewCoordsZ;
                    }
                }
                viewCoords.add(this.viewSizeHalf);
                return viewCoords;
            }
            drawEntitiesInView(uwpe, cameraEntity, display) {
                var universe = uwpe.universe;
                var place = uwpe.place;
                this.loc.pos.round(); // hack - To prevent lines between map tiles.
                this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView(place, cameraEntity, universe.collisionHelper, this.entitiesInView);
                this.drawEntitiesInView_2_Draw(uwpe, display, this.entitiesInView);
            }
            drawEntitiesInView_1_FindEntitiesInView(place, cameraEntity, collisionHelper, entitiesInView) {
                var collisionTracker = place.collisionTracker();
                if (collisionTracker == null) {
                    entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView_WithoutTracker(place, collisionHelper, entitiesInView);
                }
                else {
                    entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView_WithTracker(place, cameraEntity, collisionHelper, entitiesInView, collisionTracker);
                }
                return entitiesInView;
            }
            drawEntitiesInView_1_FindEntitiesInView_WithTracker(place, cameraEntity, collisionHelper, entitiesInView, collisionTracker) {
                var cameraCollidable = cameraEntity.collidable();
                //cameraCollidable.isDisabled = false;
                cameraCollidable.entitiesAlreadyCollidedWith.length = 0;
                var collisions = collisionTracker.entityCollidableAddAndFindCollisions(cameraEntity, collisionHelper, new Array());
                var entitiesCollidedWith = collisions.map(x => x.entitiesColliding[1]);
                var entitiesInView = entitiesCollidedWith.filter(x => x.drawable() != null);
                //cameraCollidable.isDisabled = true;
                var drawablesAll = place.drawables();
                var drawablesUnboundable = drawablesAll.filter(x => x.boundable() == null);
                entitiesInView.push(...drawablesUnboundable);
                return entitiesInView;
            }
            drawEntitiesInView_1_FindEntitiesInView_WithoutTracker(place, collisionHelper, entitiesInView) {
                entitiesInView.length = 0;
                var placeEntitiesDrawable = place.drawables();
                for (var i = 0; i < placeEntitiesDrawable.length; i++) {
                    var entity = placeEntitiesDrawable[i];
                    var drawable = entity.drawable();
                    if (drawable.isVisible) {
                        var entityPos = entity.locatable().loc.pos;
                        this._posSaved.overwriteWith(entityPos);
                        this.coordsTransformWorldToView(entityPos);
                        var isEntityInView = false;
                        var boundable = entity.boundable();
                        if (boundable == null) // todo
                         {
                            isEntityInView = true;
                        }
                        else {
                            var entityCollider = boundable.bounds;
                            isEntityInView = collisionHelper.doCollidersCollide(entityCollider, this.viewCollider);
                        }
                        if (isEntityInView) {
                            entitiesInView.push(entity);
                        }
                        entityPos.overwriteWith(this._posSaved);
                    }
                }
                return entitiesInView;
            }
            drawEntitiesInView_2_Draw(uwpe, display, entitiesInView) {
                this.entitiesInViewSort(entitiesInView);
                for (var i = 0; i < entitiesInView.length; i++) {
                    var entity = entitiesInView[i];
                    uwpe.entity = entity;
                    var visual = entity.drawable().visual;
                    var entityPos = entity.locatable().loc.pos;
                    this._posSaved.overwriteWith(entityPos);
                    this.coordsTransformWorldToView(entityPos);
                    visual.draw(uwpe, display);
                    entityPos.overwriteWith(this._posSaved);
                }
            }
            entitiesInViewSort(entitiesToSort) {
                var entitiesSorted = null;
                if (this._entitiesInViewSort == null) {
                    entitiesSorted = entitiesToSort;
                }
                else {
                    entitiesSorted = this._entitiesInViewSort(entitiesToSort);
                }
                return entitiesSorted;
            }
            toEntity() {
                return new GameFramework.Entity(Camera.name, [this]);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                // Do nothing.  Rendering is done in Place.draw().
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Camera = Camera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
