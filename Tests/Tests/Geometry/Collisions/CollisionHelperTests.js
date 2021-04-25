"use strict";
class CollisionHelperTests extends TestFixture {
    constructor() {
        super(CollisionHelperTests.name);
        var mockEnvironment = new MockEnvironment();
        var universe = mockEnvironment.universe;
        this._collisionHelper = universe.collisionHelper;
    }
    tests() {
        var tests = [
            this.collisionActiveClosest,
            this.collisionOfEntities,
            this.collisionOfColliders,
            /*
            // todo - These tests not yet implemented.

            this.collisionsOfEntitiesCollidableInSets,
            this.doEntitiesCollide,
            this.doCollidersCollide,
            this.doesColliderContainOther,

            // Shapes.

            // collideEntitiesXAndY

            this.collideEntitiesBackUp,
            this.collideEntitiesBlock,
            this.collideEntitiesBounce,
            this.collideEntitiesBlockOrBounce,
            this.collideEntitiesSeparate,

            // collisionOfXAndY

            this.collisionOfBoxAndBox,
            this.collisionOfBoxAndBoxRotated,
            this.collisionOfBoxAndMapLocated,
            this.collisionOfBoxAndMesh,
            this.collisionOfBoxAndSphere,
            this.collisionOfBoxRotatedAndBox,
            this.collisionOfBoxRotatedAndBoxRotated,
            this.collisionOfBoxRotatedAndMapLocated,
            this.collisionOfBoxRotatedAndSphere,
            this.collisionOfEdgeAndEdge,
            this.collisionOfEdgeAndFace,
            this.collisionsOfEdgeAndMesh,
            this.collisionOfEdgeAndPlane,
            this.collisionOfHemispaceAndBox,
            this.collisionOfHemispaceAndSphere,
            this.collisionOfMapLocatedAndBox,
            this.collisionOfMapLocatedAndBoxRotated,
            this.collisionOfMapLocatedAndMapLocated,
            this.collisionOfMapLocatedAndSphere,
            this.collisionOfMeshAndBox,
            this.collisionOfMeshAndSphere,
            this.collisionOfShapeAndShapeGroupAll,
            this.collisionOfShapeAndShapeInverse,
            this.collisionOfShapeGroupAllAndShape,
            this.collisionOfShapeInverseAndShape,
            this.collisionOfSphereAndBox,
            this.collisionOfSphereAndBoxRotated,
            this.collisionOfSphereAndMapLocated,
            this.collisionOfSphereAndMesh,
            this.collisionOfSpheres,

            // doXAndYCollide

            this.doBoxAndBoxCollide,
            this.doBoxAndBoxRotatedCollide,
            this.doBoxAndCylinderCollide,
            this.doBoxAndHemispaceCollide,
            this.doBoxAndMapLocatedCollide,
            this.doBoxAndMeshCollide,
            this.doBoxAndShapeInverseCollide,
            this.doBoxAndShapeGroupAllCollide,
            this.doBoxAndSphereCollide,
            this.doBoxRotatedAndBoxCollide,
            this.doBoxRotatedAndBoxRotatedCollide,
            this.doBoxRotatedAndMapLocatedCollide,
            this.doBoxRotatedAndSphereCollide,
            this.doCylinderAndCylinderCollide,
            this.doEdgeAndFaceCollide,
            this.doEdgeAndHemispaceCollide,
            this.doEdgeAndMeshCollide,
            this.doEdgeAndPlaneCollide,
            this.doHemispaceAndBoxCollide,
            this.doHemispaceAndSphereCollide,
            this.doMeshAndBoxCollide,
            this.doMeshAndMeshCollide,
            this.doMeshAndShapeInverseCollide,
            this.doMapLocatedAndBoxCollide,
            this.doMapLocatedAndBoxRotatedCollide,
            this.doMapLocatedAndMapLocatedCollide,
            this.doMapLocatedAndSphereCollide,
            this.doMeshAndSphereCollide,
            this.doSphereAndBoxCollide,
            this.doSphereAndMapLocatedCollide,
            this.doSphereAndMeshCollide,
            this.doSphereAndBoxRotatedCollide,
            this.doSphereAndShapeContainerCollide,
            this.doSphereAndShapeGroupAllCollide,
            this.doSphereAndShapeGroupAnyCollide,
            this.doSphereAndShapeInverseCollide,
            this.doSphereAndSphereCollide,

            // boolean combinations

            this.doShapeGroupAllAndBoxCollide,
            this.doShapeGroupAllAndShapeCollide,
            this.doShapeGroupAllAndMeshCollide,
            this.doShapeGroupAnyAndBoxCollide,
            this.doShapeGroupAnyAndShapeCollide,
            this.doShapeContainerAndShapeCollide,
            this.doShapeContainerAndBoxCollide,
            this.doShapeInverseAndMeshCollide,
            this.doShapeInverseAndShapeCollide,
            this.doShapeGroupAllAndSphereCollide,
            this.doBoxAndShapeGroupAnyCollide,
            this.doShapeContainerAndSphereCollide,
            this.doShapeGroupAnyAndSphereCollide,
            this.doShapeInverseAndBoxCollide,
            this.doShapeInverseAndSphereCollide,

            // contains

            this.doesBoxContainBox,
            this.doesBoxContainHemispace,
            this.doesBoxContainSphere,
            this.doesHemispaceContainBox,
            this.doesHemispaceContainSphere,
            this.doesSphereContainBox,
            this.doesSphereContainHemispace,
            this.doesSphereContainSphere

            */
        ];
        return tests;
    }
    collisionActiveClosest() {
        var posNear = Coords.fromXY(1, 0);
        var posMidrange = Coords.fromXY(2, 0);
        var posFar = Coords.fromXY(3, 0);
        var collisionNear = Collision.fromPosAndDistance(posNear, posNear.x);
        var collisionMidrange = Collision.fromPosAndDistance(posMidrange, posMidrange.x);
        var collisionFar = Collision.fromPosAndDistance(posFar, posFar.x);
        var collisionsToCheck = [collisionNear, collisionMidrange, collisionFar];
        collisionsToCheck.forEach(x => x.isActive = true);
        var collisionActiveClosest = this._collisionHelper.collisionActiveClosest(collisionsToCheck);
        Assert.areEqual(collisionNear, collisionActiveClosest);
    }
    collisionOfEntities() {
        var colliderRadius = 10;
        var collider = new Sphere(Coords.create(), colliderRadius);
        var entity0 = new Entity("Entity0", [
            Collidable.fromCollider(collider),
            Locatable.fromPos(Coords.create())
        ]);
        var entity1Pos = Coords.create();
        var entity1 = new Entity("Entity1", [
            Collidable.fromCollider(collider),
            Locatable.fromPos(entity1Pos)
        ]);
        var collision = this._collisionHelper.collisionOfEntities(entity0, entity1, Collision.create());
        Assert.areEqual(entity1Pos, collision.pos);
    }
    collisionOfColliders() {
        var colliderRadius = 10;
        var collider0 = new Sphere(Coords.create(), colliderRadius);
        var collider1 = new Sphere(Coords.create(), colliderRadius);
        var collision = this._collisionHelper.collisionOfColliders(collider0, collider1, Collision.create());
        Assert.areEqual(collider0.center, collision.pos);
    }
    collisionsOfEntitiesCollidableInSets() {
        // todo
        // entitiesCollidable0: Entity[], entitiesCollidable1: Entity[]
    }
    doEntitiesCollide() {
        // todo
        // entity0: Entity, entity1: Entity
    }
    doCollidersCollide() {
        // todo
        // collider0: any, collider1: any
    }
    doesColliderContainOther() {
        // todo
        // collider0: any, collider1: any
    }
    // Shapes.
    // collideEntitiesXAndY
    collideEntitiesBackUp() {
        // todo
        // entity0: Entity, entity1: Entity
    }
    collideEntitiesBlock() {
        // todo
        // entity0: Entity, entity1: Entity
    }
    collideEntitiesBounce() {
        // todo
        // entity0: Entity, entity1: Entity
    }
    collideEntitiesBlockOrBounce() {
        // todo
        // entity0: Entity, entity1: Entity, coefficientOfRestitution: number
    }
    collideEntitiesSeparate() {
        // todo
        // entity0: Entity, entity1: Entity
    }
    // collisionOfXAndY
    collisionOfBoxAndBox() {
        // todo
        // box1: Box, box2: Box, collision: Collision
    }
    collisionOfBoxAndBoxRotated() {
        // todo
        // box: Box, boxRotated: BoxRotated, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfBoxAndMapLocated() {
        // todo
        // box: Box, mapLocated: MapLocated, collision: Collision
    }
    collisionOfBoxAndMesh() {
        // todo
        // box: Box, mesh: Mesh, collision: Collision
    }
    collisionOfBoxAndSphere() {
        // todo
        // box: Box, sphere: Sphere, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfBoxRotatedAndBox() {
        // todo
        // boxRotated: BoxRotated, box: Box, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfBoxRotatedAndBoxRotated() {
        // todo
        // boxRotated0: BoxRotated, boxRotated1: BoxRotated, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfBoxRotatedAndMapLocated() {
        // todo
        // boxRotated: BoxRotated, mapLocated: MapLocated, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfBoxRotatedAndSphere() {
        // todo
        // boxRotated: BoxRotated, sphere: Sphere, collision: Collision, shouldCalculatePos: boolean
    }
    collisionOfEdgeAndEdge() {
        // todo
        // edge0: Edge, edge1: Edge, collision: Collision
    }
    collisionOfEdgeAndFace() {
        // todo
        // edge: Edge, face: Face, collision: Collision
    }
    collisionsOfEdgeAndMesh() {
        // todo
        // edge: Edge, mesh: Mesh, collisions: Collision[], stopAfterFirst: boolean
    }
    collisionOfEdgeAndPlane() {
        // todo
        // edge: Edge, plane: Plane, collision: Collision): Collision
    }
    collisionOfHemispaceAndBox() {
        // todo
        // hemispace: Hemispace, box: Box, collision: Collision): Collision
    }
    collisionOfHemispaceAndSphere() {
        // todo
        // hemispace: Hemispace, sphere: Sphere, collision: Collision
    }
    collisionOfMapLocatedAndBox() {
        // todo
        // mapLocated: MapLocated, box: Box, collision: Collision
    }
    collisionOfMapLocatedAndBoxRotated() {
        // todo
        /*
        mapLocated: MapLocated, boxRotated: BoxRotated,
        collision: Collision, shouldCalculateCollisionPos: boolean
        */
    }
    collisionOfMapLocatedAndMapLocated() {
        // todo
        // mapLocated0: MapLocated, mapLocated1: MapLocated, collision: Collision
    }
    collisionOfMapLocatedAndSphere() {
        // todo
        // mapLocated: MapLocated, sphere: Sphere, collision: Collision
    }
    collisionOfMeshAndBox() {
        // todo
        // mesh: Mesh, box: Box, collision: Collision): Collision
    }
    collisionOfMeshAndSphere() {
        // todo
        // mesh: Mesh, sphere: Sphere, collision: Collision): Collision
    }
    collisionOfShapeAndShapeGroupAll() {
        // todo
        // shape: ShapeBase, shapeGroupAll: ShapeGroupAll, collisionOut: Collision): Collision
    }
    collisionOfShapeAndShapeInverse() {
        // todo
        // shape: ShapeBase, shapeInverse: ShapeInverse, collisionOut: Collision): Collision
    }
    collisionOfShapeGroupAllAndShape() {
        // todo
        // shapeGroupAll: ShapeGroupAll, shape: any, collisionOut: Collision): Collision
    }
    collisionOfShapeInverseAndShape() {
        // todo
        // shapeInverse: ShapeInverse, shape: any, collisionOut: Collision): Collision
    }
    collisionOfSphereAndBox() {
        // todo
        // sphere: Sphere, box: Box, collision: Collision, shouldCalculatePos: boolean): Collision
    }
    collisionOfSphereAndBoxRotated() {
        // todo
        // sphere: Sphere, boxRotated: BoxRotated, collision: Collision, shouldCalculatePos: boolean): Collision
    }
    collisionOfSphereAndMapLocated() {
        // todo
        // sphere: Sphere, mapLocated: MapLocated, collision: Collision): Collision
    }
    collisionOfSphereAndMesh() {
        // todo
        // sphere: Sphere, mesh: Mesh, collision: Collision): Collision
    }
    collisionOfSpheres() {
        // todo
        // sphere0: Sphere, sphere1: Sphere, collision: Collision): Collision
    }
    // doXAndYCollide
    doBoxAndBoxCollide() {
        // todo
        // box0: Box, box1: Box): boolean
    }
    doBoxAndBoxRotatedCollide() {
        // todo
        // box: Box, boxRotated: BoxRotated): boolean
    }
    doBoxAndCylinderCollide() {
        // todo
        // box: Box, cylinder: Cylinder): boolean
    }
    doBoxAndHemispaceCollide() {
        // todo
        // box: Box, hemispace: Hemispace): boolean
    }
    doBoxAndMapLocatedCollide() {
        // todo
        // box: Box, mapLocated: MapLocated): boolean
    }
    doBoxAndMeshCollide() {
        // todo - box: Box, mesh: Mesh): boolean
    }
    doBoxAndShapeInverseCollide() {
        // todo - box: Box, shapeInverse: ShapeInverse): boolean
    }
    doBoxAndShapeGroupAllCollide() {
        // todo - box: Box, shapeGroupAll: ShapeGroupAll): boolean
    }
    doBoxAndSphereCollide() {
        // todo - box: Box, sphere: Sphere): boolean
    }
    doBoxRotatedAndBoxCollide() {
        // todo - boxRotated: BoxRotated, box: Box): boolean
    }
    doBoxRotatedAndBoxRotatedCollide() {
        // todo - boxRotated0: BoxRotated, boxRotated1: BoxRotated): boolean
    }
    doBoxRotatedAndMapLocatedCollide() {
        // todo - boxRotated: BoxRotated, mapLocated: MapLocated): boolean
    }
    doBoxRotatedAndSphereCollide() {
        // todo - boxRotated: BoxRotated, sphere: Sphere): boolean
    }
    doCylinderAndCylinderCollide() {
        // todo - cylinder0: Cylinder, cylinder1: Cylinder): boolean
    }
    doEdgeAndFaceCollide() {
        // todo - edge: Edge, face: Face, collision: Collision): boolean
    }
    doEdgeAndHemispaceCollide() {
        // todo - edge: Edge, hemispace: Hemispace): boolean
    }
    doEdgeAndMeshCollide() {
        // todo - edge: Edge, mesh: Mesh): boolean
    }
    doEdgeAndPlaneCollide() {
        // todo - edge: Edge, plane: Plane): boolean
    }
    doHemispaceAndBoxCollide() {
        // todo - hemispace: Hemispace, box: Box): boolean
    }
    doHemispaceAndSphereCollide() {
        // todo - hemispace: Hemispace, sphere: Sphere): boolean
    }
    doMeshAndBoxCollide() {
        // todo - mesh: Mesh, box: Box): boolean
    }
    doMeshAndMeshCollide() {
        // todo - mesh0: Mesh, mesh1: Mesh): boolean
    }
    doMeshAndShapeInverseCollide() {
        // todo - mesh: Mesh, inverse: ShapeInverse): boolean
    }
    doMapLocatedAndBoxCollide() {
        // todo - mapLocated: MapLocated, box: Box): boolean
    }
    doMapLocatedAndBoxRotatedCollide() {
        // todo - mapLocated: MapLocated, boxRotated: BoxRotated): boolean
    }
    doMapLocatedAndMapLocatedCollide() {
        // todo - mapLocated0: MapLocated, mapLocated1: MapLocated): boolean
    }
    doMapLocatedAndSphereCollide() {
        // todo - mapLocated: MapLocated, sphere: Sphere): boolean
    }
    doMeshAndSphereCollide() {
        // todo - mesh: Mesh, sphere: Sphere): boolean
    }
    doSphereAndBoxCollide() {
        // todo - sphere: Sphere, box: Box): boolean
    }
    doSphereAndMapLocatedCollide() {
        // todo - sphere: Sphere, mapLocated: MapLocated): boolean
    }
    doSphereAndMeshCollide() {
        // todo - sphere: Sphere, mesh: Mesh): boolean
    }
    doSphereAndBoxRotatedCollide() {
        // todo - sphere: Sphere, boxRotated: BoxRotated): boolean
    }
    doSphereAndShapeContainerCollide() {
        // todo - sphere: Sphere, shapeContainer: ShapeContainer): boolean
    }
    doSphereAndShapeGroupAllCollide() {
        // todo - sphere: Sphere, shapeGroupAll: ShapeGroupAll): boolean
    }
    doSphereAndShapeGroupAnyCollide() {
        // todo - sphere: Sphere, shapeGroupAny: ShapeGroupAny): boolean
    }
    doSphereAndShapeInverseCollide() {
        // todo - sphere: Sphere, shapeInverse: ShapeInverse): boolean
    }
    doSphereAndSphereCollide() {
        // todo - sphere0: Sphere, sphere1: Sphere): boolean
    }
    // boolean combinations
    doShapeGroupAllAndBoxCollide() {
        // todo - groupAll: ShapeGroupAll, shapeOther: ShapeBase): boolean
    }
    doShapeGroupAllAndShapeCollide() {
        // todo - groupAll: ShapeGroupAll, shapeOther: ShapeBase): boolean
    }
    doShapeGroupAllAndMeshCollide() {
        // todo - groupAll: ShapeGroupAll, mesh: Mesh): boolean
    }
    doShapeGroupAnyAndBoxCollide() {
        // todo - groupAny: ShapeGroupAny, box: Box): boolean
    }
    doShapeGroupAnyAndShapeCollide() {
        // todo - groupAny: ShapeGroupAny, shapeOther: ShapeBase): boolean
    }
    doShapeContainerAndShapeCollide() {
        // todo - container: ShapeContainer, shapeOther: ShapeBase): boolean
    }
    doShapeContainerAndBoxCollide() {
        // todo - container: ShapeContainer, box: Box): boolean
    }
    doShapeInverseAndMeshCollide() {
        // todo - inverse: ShapeInverse, mesh: Mesh): boolean
    }
    doShapeInverseAndShapeCollide() {
        // todo - inverse: ShapeInverse, shapeOther: ShapeBase): boolean
    }
    doShapeGroupAllAndSphereCollide() {
        // todo - group: ShapeGroupAll, shape: ShapeBase): boolean
    }
    doBoxAndShapeGroupAnyCollide() {
        // todo - box: Box, group: ShapeGroupAny): boolean
    }
    doShapeContainerAndSphereCollide() {
        // todo - container: ShapeContainer, sphere: Sphere): boolean
    }
    doShapeGroupAnyAndSphereCollide() {
        // todo - group: ShapeGroupAny, sphere: Sphere): boolean
    }
    doShapeInverseAndBoxCollide() {
        // todo - inverse: ShapeInverse, box: Box): boolean
    }
    doShapeInverseAndSphereCollide() {
        // todo - inverse: ShapeInverse, sphere: Sphere): boolean
    }
    // contains
    doesBoxContainBox() {
        // todo - box0: Box, box1: Box): boolean
    }
    doesBoxContainHemispace() {
        // todo - box: Box, hemispace: Hemispace
    }
    doesBoxContainSphere() {
        // todo - box: Box, sphere: Sphere): boolean
    }
    doesHemispaceContainBox() {
        // todo - hemispace: Hemispace, box: Box): boolean
    }
    doesHemispaceContainSphere() {
        // todo - hemispace: Hemispace, sphere: Sphere): boolean
    }
    doesSphereContainBox() {
        // todo - sphere: Sphere, box: Box): boolean
    }
    doesSphereContainHemispace() {
        // todo - sphere: Sphere, hemispace: Hemispace): boolean
    }
    doesSphereContainSphere() {
        // todo - sphere0: Sphere, sphere1: Sphere): boolean
    }
}
