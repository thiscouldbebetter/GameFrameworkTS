"use strict";
class CollidableTests extends TestFixture {
    constructor() {
        super(CollidableTests.name);
    }
    tests() {
        var testRuns = [
            this.create,
            this.default,
            this.fromCollider,
            this.fromColliderAndCollideEntities,
            this.canCollideAgainWithoutSeparatingSet,
            this.canCollideWithTypeOfEntity,
            this.entitiesThatMustSeparateBeforeCollidingAgainCollideOnlyOncePerTouch
        ];
        var tests = testRuns.map(x => Test.fromRun(x));
        return tests;
    }
    // Tests.
    // Static methods.
    create() {
        var collidable = Collidable.create();
        Assert.isNotNull(collidable);
    }
    default() {
        var collidable = Collidable.default();
        Assert.isNotNull(collidable);
    }
    fromCollider() {
        var collider = Sphere.default();
        var collidable = Collidable.fromCollider(collider);
        Assert.isNotNull(collidable);
    }
    fromColliderAndCollideEntities() {
        var collider = Sphere.default();
        var collideEntities = (uwpe, c) => { };
        var collidable = Collidable.fromColliderAndCollideEntities(collider, collideEntities);
        Assert.isNotNull(collidable);
    }
    // Instance mehods.
    canCollideAgainWithoutSeparatingSet() {
        var collidable = Collidable.create();
        Assert.isFalse(collidable.canCollideAgainWithoutSeparating);
        collidable.canCollideAgainWithoutSeparatingSet(true);
        Assert.isTrue(collidable.canCollideAgainWithoutSeparating);
    }
    canCollideWithTypeOfEntity() {
        var collider = Sphere.default();
        var collidable = new Collidable(false, // canCollideAgainWithoutSeparating
        false, // exempt
        null, // ticksToWaitBetweenCollisions
        collider, [Collidable.name], // entityPropertyNamesToCollideWith
        null // collideEntitiesForUniverseWorldPlaceEntitiesAndCollision:
        );
        var entityCollidable = new Entity("one", [Collidable.default()]);
        var entityDrawable = new Entity("two", [Drawable.default()]);
        var canCollideWithCollidables = collidable.canCollideWithTypeOfEntity(entityCollidable);
        Assert.isTrue(canCollideWithCollidables);
        var canCollideWithDrawables = collidable.canCollideWithTypeOfEntity(entityDrawable);
        Assert.isFalse(canCollideWithDrawables);
    }
    // More instance methods to do.
    // Integration tests.
    entitiesThatMustSeparateBeforeCollidingAgainCollideOnlyOncePerTouch() {
        var placeDefn = PlaceDefn.fromPropertyNamesToProcess([Boundable.name, Collidable.name]);
        var place = PlaceBase.fromPlaceDefn(placeDefn); // 1000x1000.
        var collidable0 = Collidable.fromCollider(Sphere.default());
        var collidable1 = Collidable.fromCollider(Sphere.default());
        var collisionCount0 = 0;
        var collisionCount1 = 0;
        collidable0.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionSet((uwpe, collision) => {
            collisionCount0++;
        });
        collidable1.collideEntitiesForUniverseWorldPlaceEntitiesAndCollisionSet((uwpe, collision) => {
            collisionCount1++;
        });
        var entity0 = new Entity("zero", [
            Boundable.fromCollidable(collidable0),
            collidable0,
            Locatable.fromPos(Coords.fromXY(500, 500)),
            Movable.default()
        ]);
        var entity1 = new Entity("one", [
            Boundable.fromCollidable(collidable1),
            collidable1,
            Locatable.fromPos(Coords.fromXY(750, 750)),
            Movable.default()
        ]);
        place.entityToSpawnAdd(entity0);
        place.entityToSpawnAdd(entity1);
        var world = World.fromPlaceWithDefn(place, placeDefn);
        var universe = Universe.fromWorld(world);
        var uwpe = UniverseWorldPlaceEntities.fromUniverseWorldAndPlace(universe, world, place);
        place.initialize(uwpe);
        // After initialization, the entities shouldn't be colliding,
        // and shouldn't have collided in the past.
        var wereEntitiesAlreadyColliding = Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isFalse(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(0, collisionCount0);
        Assert.areNumbersEqual(0, collisionCount1);
        // After the first tick, they still shouldn't be colliding, or have collided,
        // because they're not touching each other.
        place.updateForTimerTick(uwpe);
        wereEntitiesAlreadyColliding =
            Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isFalse(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(0, collisionCount0);
        Assert.areNumbersEqual(0, collisionCount1);
        // Now move entity1 on top of entity0's position,
        // so that they now touch.
        var entity0Loc = Locatable.of(entity0).loc;
        var entity1Loc = Locatable.of(entity1).loc;
        entity1Loc.overwriteWith(entity0Loc);
        // After the first tick of touching,
        // there should have been exactly one collision response 
        // and they should be registered as already colliding.
        place.updateForTimerTick(uwpe);
        wereEntitiesAlreadyColliding =
            Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isTrue(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(1, collisionCount0);
        Assert.areNumbersEqual(1, collisionCount1);
        // After a second tick of touching, however,
        // there shouldn't be a second collision response,
        // because they're set to have to separate before they can collide again.
        place.updateForTimerTick(uwpe);
        wereEntitiesAlreadyColliding =
            Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isTrue(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(1, collisionCount0);
        Assert.areNumbersEqual(1, collisionCount1);
        // Now move entity1 away from entity0, so they no longer touch.
        entity1Loc.pos.addXY(100, 100);
        // After a tick of separation, they should no longer be registered as colliding,
        // and there still shouldn't be any additional collision responses.
        place.updateForTimerTick(uwpe);
        var wereEntitiesAlreadyColliding = Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isFalse(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(1, collisionCount0);
        Assert.areNumbersEqual(1, collisionCount1);
        // Now move entity1 BACK on top of entity0's position,
        // so that they now touch again.
        entity1Loc.overwriteWith(entity0Loc);
        // After another tick of touching,
        // There should have been one additional collision response,
        // and they should again be registered as already colliding.
        place.updateForTimerTick(uwpe);
        wereEntitiesAlreadyColliding =
            Collidable.wereEntitiesAlreadyColliding(entity0, entity1);
        Assert.isTrue(wereEntitiesAlreadyColliding);
        Assert.areNumbersEqual(2, collisionCount0);
        Assert.areNumbersEqual(2, collisionCount1);
    }
}
