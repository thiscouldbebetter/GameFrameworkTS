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
                this.viewCollider =
                    GameFramework.BoxAxisAligned.fromSize(viewColliderSize);
                this.entitiesInView = new Array();
                this._displayToRestore = null;
                this._posSaved = GameFramework.Coords.create();
            }
            static default() {
                return Camera.fromEntitiesInViewSort(null);
            }
            static fromEntitiesInViewSort(entitiesInViewSort) {
                return new Camera(GameFramework.Coords.fromXYZ(400, 300, 1000), // viewSize
                150, // focalLength
                GameFramework.Disposition.fromPosAndOri(GameFramework.Coords.fromXYZ(0, 0, -150), GameFramework.Orientation.Instances().ForwardZDownY.clone()), entitiesInViewSort);
            }
            static fromViewSizeAndDisposition(viewSize, disp) {
                return new Camera(viewSize, null, // focalLength
                disp, null // entitiesInViewSort
                );
            }
            static entityFromPlace(place) {
                return place.entitiesByPropertyName(Camera.name)[0];
            }
            static of(entity) {
                return entity.propertyByName(Camera.name);
            }
            clipPlanes() {
                if (this._clipPlanes == null) {
                    this._clipPlanes =
                        [
                            GameFramework.Plane.create(),
                            GameFramework.Plane.create(),
                            GameFramework.Plane.create(),
                            GameFramework.Plane.create(),
                        ];
                }
                var cameraLoc = this.loc;
                var cameraOrientation = cameraLoc.orientation;
                var cameraPos = cameraLoc.pos;
                var centerOfViewPlane = cameraPos
                    .clone()
                    .add(cameraOrientation.forward
                    .clone()
                    .multiplyScalar(this.focalLength));
                var cornerOffsetRight = cameraOrientation.right
                    .clone()
                    .multiplyScalar(this.viewSizeHalf.x);
                var cornerOffsetDown = cameraOrientation.down
                    .clone()
                    .multiplyScalar(this.viewSizeHalf.y);
                var cameraViewCorners = [
                    centerOfViewPlane
                        .clone()
                        .add(cornerOffsetRight)
                        .add(cornerOffsetDown),
                    centerOfViewPlane
                        .clone()
                        .subtract(cornerOffsetRight)
                        .add(cornerOffsetDown),
                    centerOfViewPlane
                        .clone()
                        .subtract(cornerOffsetRight)
                        .subtract(cornerOffsetDown),
                    centerOfViewPlane
                        .clone()
                        .add(cornerOffsetRight)
                        .subtract(cornerOffsetDown),
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
            constraintContainInBoxForPlaceSizeAndWrapped(placeSize, placeIsWrappedHorizontally) {
                var viewSizeHalf = this.viewSizeHalf;
                var min = placeIsWrappedHorizontally
                    ? GameFramework.Coords.fromXY(0, viewSizeHalf.y) // todo
                    : viewSizeHalf.clone();
                var max = placeIsWrappedHorizontally
                    ? GameFramework.Coords.fromXY(placeSize.x, viewSizeHalf.y)
                    : placeSize.clone().subtract(viewSizeHalf);
                var box = GameFramework.BoxAxisAligned.fromMinAndMax(min, max);
                var constraintContainInBox = GameFramework.Constraint_ContainInBox.fromBox(box);
                return constraintContainInBox;
            }
            constraintContainInBoxForPlaceSizeNotWrapped(placeSize) {
                return this.constraintContainInBoxForPlaceSizeAndWrapped(placeSize, false);
            }
            constraintContainInBoxForPlaceSizeWrapped(placeSize) {
                return this.constraintContainInBoxForPlaceSizeAndWrapped(placeSize, true);
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
                        viewCoords
                            .multiplyScalar(this.focalLength)
                            .divideScalar(viewCoordsZ);
                        viewCoords.z = viewCoordsZ;
                    }
                }
                viewCoords.add(this.viewSizeHalf);
                return viewCoords;
            }
            drawEntitiesInView(uwpe, cameraEntity, display) {
                var universe = uwpe.universe;
                this.loc.pos.round(); // hack - To prevent lines between map tiles.
                this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView(uwpe, cameraEntity, universe.collisionHelper, this.entitiesInView);
                this._displayToRestore = universe.display;
                universe.display = display;
                this.drawEntitiesInView_2_Draw(uwpe, this.entitiesInView);
                universe.display = this._displayToRestore;
            }
            drawEntitiesInView_1_FindEntitiesInView(uwpe, cameraEntity, collisionHelper, entitiesInView) {
                var place = uwpe.place;
                var collisionTracker = GameFramework.CollisionTrackerBase.fromPlace(uwpe);
                collisionTracker.entityReset(cameraEntity);
                var cameraCollidable = GameFramework.Collidable.of(cameraEntity);
                cameraCollidable.entitiesAlreadyCollidedWithClear();
                var collisions = collisionTracker.entityCollidableAddAndFindCollisions(uwpe, cameraEntity, collisionHelper, [] // collisions
                );
                var entitiesCollidedWith = collisions.map(x => x.entitiesColliding[1]);
                var entitiesInView = entitiesCollidedWith
                    .filter(x => GameFramework.Drawable.of(x) != null);
                entitiesInView =
                    entitiesInView
                        .filter((x, i) => entitiesInView.indexOf(x) == i); // Distinct.
                // Now draw the Drawables that aren't also Collidables.
                var drawablesAll = GameFramework.Drawable.entitiesFromPlace(place);
                var drawablesUncollidable = drawablesAll.filter(x => GameFramework.Collidable.of(x) == null);
                entitiesInView.push(...drawablesUncollidable);
                return entitiesInView;
            }
            drawEntitiesInView_2_Draw(uwpe, entitiesInView) {
                this.entitiesInViewSort(entitiesInView);
                for (var i = 0; i < entitiesInView.length; i++) {
                    var entity = entitiesInView[i];
                    uwpe.entitySet(entity);
                    var drawable = GameFramework.Drawable.of(entity);
                    var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                    this._posSaved.overwriteWith(entityPos);
                    this.coordsTransformWorldToView(entityPos);
                    drawable.draw(uwpe);
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
            static entitiesSortByRenderingOrderThenZThenY(entitiesToSort) {
                entitiesToSort.sort((a, b) => {
                    var aRenderingOrder = GameFramework.Drawable.of(a).renderingOrder;
                    var bRenderingOrder = GameFramework.Drawable.of(b).renderingOrder;
                    if (aRenderingOrder != bRenderingOrder) {
                        returnValue = bRenderingOrder - aRenderingOrder;
                    }
                    else {
                        var aPos = GameFramework.Locatable.of(a).loc.pos;
                        var bPos = GameFramework.Locatable.of(b).loc.pos;
                        var returnValue;
                        if (aPos.z != bPos.z) {
                            returnValue = bPos.z - aPos.z;
                        }
                        else {
                            returnValue = aPos.y - bPos.y;
                        }
                    }
                    return returnValue;
                });
                return entitiesToSort;
            }
            toEntityFollowingEntityWithName(targetEntityName) {
                var boundable = new GameFramework.Boundable(this.viewCollider);
                var collidable = GameFramework.Collidable
                    .fromCollider(this.viewCollider)
                    .canCollideAgainWithoutSeparatingSet(true);
                var constrainable = this.toEntityFollowingEntityWithName_Constrainable(targetEntityName);
                var locatable = GameFramework.Locatable.fromDisp(this.loc);
                var movable = GameFramework.Movable.default();
                var entity = GameFramework.Entity.fromNameAndProperties(Camera.name, [
                    boundable,
                    this,
                    collidable,
                    constrainable,
                    locatable,
                    movable
                ]);
                return entity;
            }
            toEntityFollowingEntityWithName_Constrainable(targetEntityName) {
                var displacementToTargetEntity = this.loc.orientation.forward.clone().invert();
                var constraintMultiple = GameFramework.Constraint_Multiple.fromChildren([
                    GameFramework.Constraint_AttachToEntityWithName.
                        fromTargetEntityName(targetEntityName),
                    GameFramework.Constraint_Transform.fromTransform(GameFramework.Transform_Translate.fromDisplacement(displacementToTargetEntity)),
                    GameFramework.Constraint_OrientTowardEntityWithName
                        .fromTargetEntityName(targetEntityName),
                ]);
                var constrainable = GameFramework.Constrainable.fromConstraint(constraintMultiple);
                return constrainable;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Camera.name; }
            updateForTimerTick(uwpe) {
                // Do nothing.  Rendering is done in Place.draw().
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Camera = Camera;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
