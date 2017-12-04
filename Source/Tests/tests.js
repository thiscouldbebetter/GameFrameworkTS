
function test()
{
	var testAlwaysPass = new Test
	(
		"Always Pass",
		function() { }
	);

	var testAlwaysFail = new Test
	(
		"Always Fail",
		function() { throw "This test always fails!"; }
	);

	var testFixturesToRun = 
	[
		new TestFixture
		(
			"Camera",
			[
				testCameraProjection,
			]
		),
		new TestFixture
		(
			"Collisions",
			[
				testCollisionsOfCubesAndSpheres,
				testCollisionsOfSpheresAndShells,
			]
		),
	];

	for (var i = 0; i < testFixturesToRun.length; i++)
	{
		var testFixture = testFixturesToRun[i];
		testFixture.runTests();
	}
}

// tests

var testCollisionsOfCubesAndSpheres = new Test
(
	"CollisionsOfCubesAndSpheres",
	function run()
	{
		var collisionHelper = new CollisionHelper();

		var meshCubeUnitCenteredAtOrigin = Mesh.cubeUnit();
		var meshCubeUnitInPositiveOctant = Mesh.cubeUnit().transform
		(
			new TransformTranslate(new Coords(1, 1, 1))
		);
		var meshCubeUnitInNegativeOctant = Mesh.cubeUnit().transform
		(
			new TransformTranslate(new Coords(-1, -1, -1))
		);
		var meshCubeUnitRotatedAtOrigin = Mesh.cubeUnit().transform
		(
			new TransformOrient
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
		this.assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInPositiveOctant;
		var collider1 = sphereUnitAtOrigin;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		this.assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInNegativeOctant;
		var collider1 = sphereUnitInPositiveOctant;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		this.assertExpectedEqualToActual(false, doCollide);
	}
);

var testCollisionsOfSpheresAndShells = new Test
(
	"CollisionsOfSpheresAndShells",
	function run()
	{
		var collisionHelper = new CollisionHelper();

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
		this.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, shell2To3AtOrigin);
		this.assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnFirst = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(1, 0, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnFirst);
		this.assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnFirst);
		this.assertExpectedEqualToActual(true, doCollide);

		var arc2To3HalfTurnFirstAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnFirst);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnFirstAtOrigin);
		this.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnFirstAtOrigin);
		this.assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnSecond = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(0, 1, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnSecond);
		this.assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnSecond);
		this.assertExpectedEqualToActual(true, doCollide);

		var arc2To3HalfTurnSecondAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnSecond);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnSecondAtOrigin);
		this.assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnSecondAtOrigin);
		this.assertExpectedEqualToActual(true, doCollide);

	}
);

var testCameraProjection = new Test
(
	"CameraProjection",
	function run()
	{
		var camera = new Camera
		(
			new Coords(100, 100, 1), // viewSize
			100, // focalLength
			new Location
			(
				new Coords(0, 0, -100),
				new Orientation
				(
					new Coords(0, 0, 1),
					new Coords(0, 1, 0)
				)
			)
		);

		var worldCoordsGroupToTransform = 
		[
			new Coords(0, 0, 0), // origin

			new Coords(1, 0, 0),
			new Coords(0, 1, 0),
			new Coords(0, 0, 1),

			new Coords(-1, 0, 0),
			new Coords(0, -1, 0),
			new Coords(0, 0, -1),

			new Coords(1, 2, 3),
		];

		for (var i = 0; i < worldCoordsGroupToTransform.length; i++)
		{
			var worldCoordsBefore = worldCoordsGroupToTransform[i];
			var viewCoords = camera.coordsTransformWorldToView
			(
				worldCoordsBefore.clone()
			);
			var worldCoordsAfter = camera.coordsTransformViewToWorld
			(
				viewCoords
			)
			worldCoordsAfter.round();

			var areBeforeAndAfterEqual = worldCoordsAfter.equals(worldCoordsBefore);
			var beforeAndAfterAsStrings = 
				"Before:" + worldCoordsBefore.toString()
				+ ", After:" + worldCoordsAfter.toString();
			this.assertExpectedEqualToActual(true, areBeforeAndAfterEqual, beforeAndAfterAsStrings);
		}
	}
)
