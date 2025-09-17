
class ArcTests extends TestFixture
{
	_arcDefault: Arc;

	constructor()
	{
		super(ArcTests.name);

		this._arcDefault = Arc.default();
	}

	tests(): ( ()=>void )[]
	{
		var tests =
		[
			this.collider,

			this.clone,
			this.overwriteWith,

			this.coordsGroupToTransform,

			this.normalAtPos,
			this.surfacePointNearPos,
			this.toBoxAxisAligned,

			this.transform
		];

		return tests;
	}

	// Tests.

	collider(): void
	{
		var collider = this._arcDefault.collider();
		var colliderTypeName = collider.constructor.name;
		Assert.areStringsEqual(ShapeGroupAll.name, colliderTypeName);
	}

	// Clonable.

	clone(): void
	{
		var arcToClone = this._arcDefault;
		var arcCloned = arcToClone.clone();
		var areArcsEqual = arcCloned.equals(arcToClone);
		Assert.isTrue(areArcsEqual);
	}

	equals(): void
	{
		Assert.areEqual(this._arcDefault, this._arcDefault);
	}

	overwriteWith(): void
	{
		var arc0 = this._arcDefault;

		var arc1Center = new Coords(1, 0, 0);
		var arc1 = Arc.fromShellAndWedge
		(
			new Shell(Sphere.fromRadiusAndCenter(1.1, arc1Center), .99),
			new Wedge(arc1Center, new Coords(0, 1, 0), .123)
		);

		Assert.areNotEqual(arc0, arc1);

		arc1.overwriteWith(arc0);

		Assert.areEqual(arc0, arc1);
	}

	// transformable

	coordsGroupToTransform(): void
	{
		var arc = Arc.default();
		var arcCenter = arc.center();
		var coordsGroup = arc.coordsGroupToTransform();
		Assert.isTrue(coordsGroup[0] ==  arcCenter)
	}

	// ShapeBase.

	normalAtPos(): void // posToCheck: Coords, normalOut: Coords): Coords
	{
		var arc = this._arcDefault;
		var posToCheck = new Coords(1, 0, 0);

		var normalAtPos = arc.normalAtPos(posToCheck, Coords.create());

		var normalAtPosExpected = new Coords(1, 0, 0);
		Assert.isTrue(normalAtPosExpected.equals(normalAtPos) );
	}

	surfacePointNearPos(): void // posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		var arc = this._arcDefault;
		var posToCheck = new Coords(1, 0, 0);

		var surfacePointNearPos =
			arc.surfacePointNearPos(posToCheck, Coords.create());

		var surfacePointNearPosExpected = new Coords(1, 0, 0);
		Assert.isTrue(surfacePointNearPosExpected.equals(surfacePointNearPos) );
	}

	toBoxAxisAligned(): void
	{
		var arc = this._arcDefault;

		var arcAsBox = arc.toBoxAxisAligned(BoxAxisAligned.create());

		var arcAsBoxExpected =
			BoxAxisAligned.fromCenterAndSize(Coords.create(), new Coords(2, 2, 2) );
		Assert.isTrue(arcAsBoxExpected.equals(arcAsBox) );
	}

	// Transformable.

	transform(): void
	{
		var arc = Arc.default();

		var transformToApply = new Transform_Translate(Coords.create());
		Assert.throwsError
		(
			() => arc.transform(transformToApply)
		);
	}

}
