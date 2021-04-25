"use strict";
class CameraTests extends TestFixture {
    constructor() {
        super(CameraTests.name);
        this._camera = Camera.default();
    }
    tests() {
        var tests = [
            this.clipPlanes,
            this.coordsTransformViewToWorld,
            this.coordsTransformWorldToView,
            this.drawEntitiesInView,
            this.entitiesInViewSort,
            this.toEntity,
            this.finalize,
            this.initialize,
            this.updateForTimerTick,
        ];
        return tests;
    }
    clipPlanes() {
        var cameraClipPlanes = this._camera.clipPlanes();
        Assert.isNotNull(cameraClipPlanes);
        Assert.areEqual(4, cameraClipPlanes.length);
    }
    coordsTransformViewToWorld() {
        var viewCoords = Coords.fromXY(0, 0);
        var ignoreZFalse = false;
        var worldCoords = this._camera.coordsTransformViewToWorld(viewCoords, ignoreZFalse);
        var worldCoordsExpected = new Coords(0, -200, -300); // todo
        Assert.areEqual(worldCoordsExpected, worldCoords);
    }
    coordsTransformWorldToView() {
        var worldCoords = new Coords(0, 0, 0);
        var viewCoords = this._camera.coordsTransformWorldToView(worldCoords);
        var viewCoordsExpected = new Coords(200, 300, 0); // todo
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
        var entityNear = new Entity("EntityNear", [Locatable.fromPos(new Coords(0, 0, 0))]);
        var entityFar = new Entity("EntityFar", [Locatable.fromPos(new Coords(0, 0, 100))]);
        var entitiesToSort = [entityNear, entityFar];
        var entitiesSorted = this._camera.entitiesInViewSort(ArrayHelper.clone(entitiesToSort));
        Assert.areEqual(entitiesToSort.length, entitiesSorted.length);
        // todo - No sorting yet.
        Assert.isTrue(ArrayHelper.areEqual(entitiesToSort, entitiesSorted));
    }
    toEntity() {
        var cameraAsEntity = this._camera.toEntity();
        Assert.areEqual(Camera.name, cameraAsEntity.name);
        Assert.isNotNull(cameraAsEntity.camera());
    }
    // EntityProperty.
    finalize() {
        this._camera.finalize(null, null, null, null);
    }
    initialize() {
        this._camera.initialize(null, null, null, null);
    }
    updateForTimerTick() {
        this._camera.updateForTimerTick(null, null, null, null);
    }
}
