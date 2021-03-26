"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Camera extends GameFramework.EntityProperty {
            constructor(viewSize, focalLength, loc) {
                super();
                this.viewSize = viewSize;
                this.focalLength = focalLength;
                this.loc = loc;
                this.viewSizeHalf = this.viewSize.clone().clearZ().half();
                var viewColliderSize = this.viewSize.clone();
                viewColliderSize.z = Number.POSITIVE_INFINITY;
                this.viewCollider = new GameFramework.Box(this.loc.pos, viewColliderSize);
                this.entitiesInView = [];
                this._posSaved = GameFramework.Coords.create();
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
            drawEntitiesInView(universe, world, place, display) {
                this.entitiesInView.length = 0;
                this.loc.pos.round(); // hack - To prevent lines between map tiles.
                var collisionHelper = universe.collisionHelper;
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
                            this.entitiesInView.push(entity);
                        }
                        entityPos.overwriteWith(this._posSaved);
                    }
                }
                display.drawBackground("Black", "Black");
                this.entitiesSortByZThenY(this.entitiesInView);
                for (var i = 0; i < this.entitiesInView.length; i++) {
                    var entity = this.entitiesInView[i];
                    var visual = entity.drawable().visual;
                    var entityPos = entity.locatable().loc.pos;
                    this._posSaved.overwriteWith(entityPos);
                    this.coordsTransformWorldToView(entityPos);
                    visual.draw(universe, world, place, entity, display);
                    entityPos.overwriteWith(this._posSaved);
                }
            }
            entitiesSortByZThenY(entitiesToSort) {
                entitiesToSort.sort((a, b) => {
                    var aPos = a.locatable().loc.pos;
                    var bPos = b.locatable().loc.pos;
                    var returnValue;
                    if (aPos.z != bPos.z) {
                        returnValue = bPos.z - aPos.z;
                    }
                    else {
                        returnValue = aPos.y - bPos.y;
                    }
                    return returnValue;
                });
                return entitiesToSort;
            }
            updateForTimerTick() {
                // Do nothing.  Rendering is done in Place.draw().
            }
        }
        GameFramework.Camera = Camera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
