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
                return Camera.fromEntitiesInViewSort(null);
            }
            static fromEntitiesInViewSort(entitiesInViewSort) {
                return new Camera(new GameFramework.Coords(400, 300, 1000), // viewSize
                150, // focalLength
                GameFramework.Disposition.fromPosAndOrientation(new GameFramework.Coords(0, 0, -150), GameFramework.Orientation.Instances().ForwardZDownY.clone()), entitiesInViewSort);
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
                this.loc.pos.round(); // hack - To prevent lines between map tiles.
                this.entitiesInView = this.drawEntitiesInView_1_FindEntitiesInView(uwpe, cameraEntity, universe.collisionHelper, this.entitiesInView);
                this.drawEntitiesInView_2_Draw(uwpe, display, this.entitiesInView);
            }
            drawEntitiesInView_1_FindEntitiesInView(uwpe, cameraEntity, collisionHelper, entitiesInView) {
                var world = uwpe.world;
                var place = uwpe.place;
                var collisionTracker = place.collisionTracker(world);
                collisionTracker.entityReset(cameraEntity);
                var cameraCollidable = cameraEntity.collidable();
                //cameraCollidable.isDisabled = false;
                cameraCollidable.entitiesAlreadyCollidedWith.length = 0;
                var collisions = collisionTracker.entityCollidableAddAndFindCollisions(cameraEntity, collisionHelper, new Array());
                var entitiesCollidedWith = collisions.map(x => x.entitiesColliding[1]);
                var entitiesInView = entitiesCollidedWith.filter(x => x.drawable() != null);
                entitiesInView =
                    entitiesInView.filter((x, i) => entitiesInView.indexOf(x) == i); // Distinct.
                //cameraCollidable.isDisabled = true;
                // Now draw the unboundables.
                var drawablesAll = place.drawables();
                var drawablesUnboundable = drawablesAll.filter(x => x.boundable() == null);
                entitiesInView.push(...drawablesUnboundable);
                return entitiesInView;
            }
            /*
            drawEntitiesInView_1_FindEntitiesInView_WithoutTracker
            (
                place: Place, collisionHelper: CollisionHelper, entitiesInView: Entity[]
            ): Entity[]
            {
                entitiesInView.length = 0;
        
                var placeEntitiesDrawable = place.drawables();
        
                for (var i = 0; i < placeEntitiesDrawable.length; i++)
                {
                    var entity = placeEntitiesDrawable[i];
                    var drawable = entity.drawable();
                    if (drawable.isVisible)
                    {
                        var entityPos = entity.locatable().loc.pos;
                        this._posSaved.overwriteWith(entityPos);
        
                        this.coordsTransformWorldToView(entityPos);
        
                        var isEntityInView = false;
                        var boundable = entity.boundable();
                        if (boundable == null) // todo
                        {
                            isEntityInView = true;
                        }
                        else
                        {
                            var entityCollider = boundable.bounds;
                            isEntityInView = collisionHelper.doCollidersCollide
                            (
                                entityCollider, this.viewCollider
                            );
                        }
        
                        if (isEntityInView)
                        {
                            entitiesInView.push(entity);
                        }
        
                        entityPos.overwriteWith(this._posSaved);
                    }
                }
        
                return entitiesInView;
            }
            */
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
            static entitiesSortByRenderingOrderThenZThenY(entitiesToSort) {
                entitiesToSort.sort((a, b) => {
                    var aRenderingOrder = a.drawable().renderingOrder;
                    var bRenderingOrder = b.drawable().renderingOrder;
                    if (aRenderingOrder != bRenderingOrder) {
                        returnValue = bRenderingOrder - aRenderingOrder;
                    }
                    else {
                        var aPos = a.locatable().loc.pos;
                        var bPos = b.locatable().loc.pos;
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
            toEntity() {
                /*
        
                // todo -
                // This isn't used to find entities in camera view,
                // but if it was it would need to include a Collidable property.
        
                return new Entity
                (
                    Camera.name,
                    [
                        this,
                        new Constrainable([]),
                        new Locatable(this.loc),
                    ]
                );
                */
                var cameraBoundable = new GameFramework.Boundable(this.viewCollider);
                var cameraCollidable = GameFramework.Collidable
                    .fromCollider(this.viewCollider)
                    .canCollideAgainWithoutSeparatingSet(true);
                var cameraConstrainable = new GameFramework.Constrainable([
                    new GameFramework.Constraint_AttachToEntityWithName("Player"),
                    //new Constraint_ContainInBox(cameraPosBox)
                ]);
                var cameraEntity = new GameFramework.Entity(Camera.name, [
                    this,
                    cameraBoundable,
                    cameraCollidable,
                    cameraConstrainable,
                    new GameFramework.Locatable(this.loc),
                    GameFramework.Movable.default()
                ]);
                return cameraEntity;
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
