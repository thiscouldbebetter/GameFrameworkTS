"use strict";
class ArcTests extends TestFixture {
    constructor() {
        super(ArcTests.name);
        this._arcDefault = Arc.default();
    }
    tests() {
        var tests = [
            this.collider,
            this.clone,
            this.overwriteWith,
            this.coordsGroupToTranslate,
            this.locate,
            this.normalAtPos,
            this.surfacePointNearPos,
            this.toBox,
            this.transform
        ];
        return tests;
    }
    // Tests.
    collider() {
        var collider = this._arcDefault.collider();
        var colliderTypeName = collider.constructor.name;
        Assert.areStringsEqual(ShapeGroupAll.name, colliderTypeName);
    }
    // Clonable.
    clone() {
        var arcToClone = this._arcDefault;
        var arcCloned = arcToClone.clone();
        var areArcsEqual = arcCloned.equals(arcToClone);
        Assert.isTrue(areArcsEqual);
    }
    equals() {
        Assert.areEqual(this._arcDefault, this._arcDefault);
    }
    overwriteWith() {
        var arc0 = this._arcDefault;
        var arc1Center = new Coords(1, 0, 0);
        var arc1 = Arc.fromShellAndWedge(new Shell(new Sphere(arc1Center, 1.1), .99), new Wedge(arc1Center, new Coords(0, 1, 0), .123));
        Assert.areNotEqual(arc0, arc1);
        arc1.overwriteWith(arc0);
        Assert.areEqual(arc0, arc1);
    }
    // transformable
    coordsGroupToTranslate() {
        var arc = Arc.default();
        var arcCenter = arc.center();
        var coordsGroup = arc.coordsGroupToTranslate();
        Assert.isTrue(coordsGroup[0] == arcCenter);
    }
    // ShapeBase.
    locate() {
        var arc = Arc.default();
        var arcCenter = arc.center();
        var posToLocateAt = Coords.create().randomize(null);
        Assert.isFalse(arcCenter.equals(posToLocateAt));
        var locToApply = Disposition.fromPos(posToLocateAt);
        arc.locate(locToApply);
        Assert.isTrue(arcCenter.equals(posToLocateAt));
    }
    normalAtPos() {
        var arc = this._arcDefault;
        var posToCheck = new Coords(1, 0, 0);
        var normalAtPos = arc.normalAtPos(posToCheck, Coords.create());
        var normalAtPosExpected = new Coords(1, 0, 0);
        Assert.isTrue(normalAtPosExpected.equals(normalAtPos));
    }
    surfacePointNearPos() {
        var arc = this._arcDefault;
        var posToCheck = new Coords(1, 0, 0);
        var surfacePointNearPos = arc.surfacePointNearPos(posToCheck, Coords.create());
        var surfacePointNearPosExpected = new Coords(1, 0, 0);
        Assert.isTrue(surfacePointNearPosExpected.equals(surfacePointNearPos));
    }
    toBox() {
        var arc = this._arcDefault;
        var arcAsBox = arc.toBox(Box.create());
        var arcAsBoxExpected = Box.fromCenterAndSize(Coords.create(), new Coords(2, 2, 2));
        Assert.isTrue(arcAsBoxExpected.equals(arcAsBox));
    }
    // Transformable.
    transform() {
        var arc = Arc.default();
        var transformToApply = new Transform_Translate(Coords.create());
        Assert.throwsError(() => arc.transform(transformToApply));
    }
}
