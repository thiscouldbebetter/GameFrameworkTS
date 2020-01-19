function CollisionHelperTests()
{
	this.collisionHelper = new CollisionHelper();
}
{
	CollisionHelperTests.prototype.boxesAndSpheres = function()
	{
		var collisionHelper = this.collisionHelper;

		var boxUnitAtOrigin = new Box(new Coords(0, 0, 0), new Coords(2, 2, 2));
		var sphereUnitAtOrigin = new Sphere(new Coords(0, 0, 0), 1);
		var sphereUnitAtZ2 = new Sphere(new Coords(0, 0, 2), 1);
		var sphereUnitAtZ3 = new Sphere(new Coords(0, 0, 3), 1);
		var sphereUnitAtXYZ2 = new Sphere(new Coords(2, 2, 2), 1);
		var sphereUnitAtXYZ1Point5 = new Sphere(new Coords(1, 1, 1).multiplyScalar(1.5), 1);
		var sphereUnitAtXYZ1Point6 = new Sphere(new Coords(1, 1, 1).multiplyScalar(1.6), 1);

		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide);

		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtZ2);
		Test.assertExpectedEqualToActual(true, doCollide); // Touching.

		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtZ3);
		Test.assertExpectedEqualToActual(false, doCollide);

		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtXYZ2);
		Test.assertExpectedEqualToActual(false, doCollide);

		// Extents overlap in all dimensions, but corner of box outside sphere.
		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtXYZ1Point6);
		Test.assertExpectedEqualToActual(false, doCollide);

		// Corner of box just inside sphere.
		var doCollide = collisionHelper.doBoxAndSphereCollide(boxUnitAtOrigin, sphereUnitAtXYZ1Point5);
		Test.assertExpectedEqualToActual(true, doCollide);
	};

	CollisionHelperTests.prototype.cubesAndSpheres = function()
	{
		var collisionHelper = this.collisionHelper;

		var meshCubeUnitCenteredAtOrigin = Mesh.cubeUnit();
		var meshCubeUnitInPositiveOctant = Mesh.cubeUnit().transform
		(
			new Transform_Translate(new Coords(1, 1, 1))
		);
		var meshCubeUnitInNegativeOctant = Mesh.cubeUnit().transform
		(
			new Transform_Translate(new Coords(-1, -1, -1))
		);
		var meshCubeUnitRotatedAtOrigin = Mesh.cubeUnit().transform
		(
			new Transform_Orient
			(
				new Orientation
				(
					new Coords(1, 1, 1).normalize(),
					new Coords(0, 0, 1)
				)
			)
		);
		var sphereUnitAtOrigin = new Sphere(new Coords(0, 0, 0), 1);
		var sphereUnitInPositiveOctant = new Sphere(new Coords(1, 1, 1), 1);

		var collider0 = meshCubeUnitCenteredAtOrigin;
		var collider1 = sphereUnitAtOrigin;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		Test.assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInPositiveOctant;
		var collider1 = sphereUnitAtOrigin;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		Test.assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInNegativeOctant;
		var collider1 = sphereUnitInPositiveOctant;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		Test.assertExpectedEqualToActual(false, doCollide);
	};

	CollisionHelperTests.prototype.edgesAndFaces = function()
	{
		var collisionHelper = this.collisionHelper;

		var edgeZAxisUnit = new Edge([new Coords(0, 0, -1), new Coords(0, 0, 1)]);
		var edgeZAxisUnitReversed = new Edge([new Coords(0, 0, 1), new Coords(0, 0, -1)]);
		var edgeZAxis1To0 = new Edge([new Coords(0, 0, 1), new Coords(0, 0, 0)]);
		var edgeZAxis2To0 = new Edge([new Coords(0, 0, 2), new Coords(0, 0, 0)]);
		var edgeZAxis2To1 = new Edge([new Coords(0, 0, 2), new Coords(0, 0, 1)]);

		var edgeMinusZwardUnitAtX2 = new Edge([new Coords(2, 0, 1), new Coords(2, 0, -1)]);

		var faceSquareUnitZwardAtOrigin = new Face
		([
			new Coords(-1, -1, 0), new Coords(1, -1, 0), new Coords(1, 1, 0), new Coords(-1, 1, 0)
		]);

		var faceSquareUnitZwardAtZ1 = new Face
		([
			new Coords(-1, -1, 1), new Coords(1, -1, 1), new Coords(1, 1, 1), new Coords(-1, 1, 1)
		]);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxisUnit, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide); // Edge direction does not oppose face normal.

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxisUnitReversed, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxis1To0, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide); // Touching.

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxis2To0, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide); // Touching.

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxis2To0, faceSquareUnitZwardAtZ1);
		Test.assertExpectedEqualToActual(true, doCollide);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeZAxis2To1, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeMinusZwardUnitAtX2, faceSquareUnitZwardAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);

		var edgeFromWild = new Edge
		([
			new Coords(17, 164, -1),
			new Coords(18, 169, -1),
		]);

		var faceFromWild = new Face
		([
			new Coords(10, 165, -10),
			new Coords(70, 165, -10),
			new Coords(70, 165, 0),
			new Coords(10, 165, 0),
		]);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeFromWild, faceFromWild);
		Test.assertExpectedEqualToActual(true, doCollide);

		var edgeFromWild = new Edge
		([
			new Coords(0, 231, -1),
			new Coords(0, 225.6, -1),
		]);

		var faceFromWild = new Face
		([
			new Coords(10, 230, -10),
			new Coords(-10, 230, -10),
			new Coords(-10, 230, 0),
			new Coords(10, 230, 0),
		]);

		var doCollide = collisionHelper.doEdgeAndFaceCollide(edgeFromWild, faceFromWild);
		Test.assertExpectedEqualToActual(true, doCollide);
	};

	CollisionHelperTests.prototype.spheresAndShells = function()
	{
		var collisionHelper = this.collisionHelper;

		var sphereUnitAtOrigin = new Sphere
		(
			new Coords(0, 0, 0), // center
			1, // radius
		);

		var sphereUnitAtX2 = new Sphere
		(
			new Coords(2, 0, 0), // center
			1, // radius
		);

		var shell2To3AtOrigin = new Shell
		(
			new Sphere
			(
				new Coords(0, 0, 0), // center
				3 // radius
			),
			2 // radiusInner
		);

		var doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, shell2To3AtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, shell2To3AtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnFirst = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(1, 0, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnFirst);
		Test.assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnFirst);
		Test.assertExpectedEqualToActual(true, doCollide);

		var arc2To3HalfTurnFirstAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnFirst);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnFirstAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnFirstAtOrigin);
		Test.assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnSecond = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(0, 1, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnSecond);
		Test.assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnSecond);
		Test.assertExpectedEqualToActual(false, doCollide);

		var arc2To3HalfTurnSecondAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnSecond);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnSecondAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnSecondAtOrigin);
		Test.assertExpectedEqualToActual(false, doCollide);
	};
}
