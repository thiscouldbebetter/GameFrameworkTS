"use strict";
class CameraTests extends TestFixture {
    constructor() {
        super(CameraTests.name);
        this._camera = Camera.default();
    }
    tests() {
        var testRuns = [
            this.coordsTransformViewToWorld,
            this.coordsTransformWorldToView,
            this.drawEntitiesInView,
            this.entitiesInViewSort,
            this.toEntity,
            this.finalize,
            this.initialize,
            this.updateForTimerTick,
        ];
        var tests = testRuns.map(x => Test.fromRun(x));
        return tests;
    }
    coordsTransformViewToWorld() {
        var viewCoords = Coords.fromXY(0, 0);
        var ignoreZFalse = false;
        var worldCoords = this._camera.coordsTransformViewToWorld(viewCoords, ignoreZFalse);
        var worldCoordsExpected = 
        // new Coords(0, -200, -300); // todo
        new Coords(-200, -150, -150);
        Assert.areEqual(worldCoordsExpected, worldCoords);
    }
    coordsTransformWorldToView() {
        var worldCoords = Coords.zeroes();
        var viewCoords = this._camera.coordsTransformWorldToView(worldCoords);
        var viewCoordsExpected = new Coords(200, 150, 150); // todo
        Assert.areEqual(viewCoordsExpected, viewCoords);
    }
    drawEntitiesInView() {
        /*
        universe: Universe, world: World, place: Place,
        cameraEntity: Entity, display: Display
        */
        Assert.isTrue(true); // todo
    }
    entitiesInViewSort() {
        var entityNear = new Entity("EntityNear", [Locatable.fromPos(Coords.zeroes())]);
        var entityFar = new Entity("EntityFar", [Locatable.fromPos(new Coords(0, 0, 100))]);
        var entitiesToSort = [entityNear, entityFar];
        var entitiesSorted = this._camera.entitiesInViewSort(ArrayHelper.clone(entitiesToSort));
        Assert.areNumbersEqual(entitiesToSort.length, entitiesSorted.length);
        // todo - No sorting yet.
        Assert.isTrue(ArrayHelper.areEqual(entitiesToSort, entitiesSorted));
    }
    toEntity() {
        var cameraAsEntity = Entity.fromProperty(this._camera);
        Assert.areStringsEqual(Camera.name, cameraAsEntity.name);
        Assert.isNotNull(Camera.of(cameraAsEntity));
    }
    // EntityProperty.
    finalize() {
        this._camera.finalize(null);
    }
    initialize() {
        this._camera.initialize(null);
    }
    updateForTimerTick() {
        this._camera.updateForTimerTick(null);
    }
}
