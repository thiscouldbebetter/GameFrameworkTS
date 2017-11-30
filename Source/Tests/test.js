
function assertExpectedEqualToActual(expected, actual, message)
{
	if (expected != actual)
	{
		if (message == null)
		{
			message = "Expected: '" + expected + "', Actual: '" + actual + "'.";
		}
		throw message;
	}
}

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
		try
		{
			testFixture.runTests();
		}
		catch (ex)
		{
			document.write("Test failed:" + ex);
		}
	}
}

// classes

function Test(name, run)
{
	this.name = name;
	this.run = run;
}

function TestFixture(name, tests)
{
	this.name = name;
	this.tests = tests;
}
{
	// methods

	TestFixture.prototype.runTests = function()
	{
		var testRecords = [];
		var numberOfTestsFailed = 0;

		for (var i = 0; i < this.tests.length; i++)
		{
			var testToRun = this.tests[i];
			try
			{
				testToRun.run();
				var testRecord = new TestRecord(testToRun, true);
				testRecords.push(testRecord);
			}
			catch (ex)
			{
				var testRecord = new TestRecord(testToRun, false, ex);
				testRecords.push(testRecord);
				numberOfTestsFailed++;
			}
		}

		if (numberOfTestsFailed == 0)
		{
			document.write("All tests in fixture passed!<br />")
		}
		else
		{
			document.write("Failed tests:<br />");
			for (var i = 0; i < testRecords.length; i++)
			{
				var testRecord = testRecords[i];
				if (testRecord.passed == false)
				{
					document.write(testRecord.toString() + "<br />");
				}
			}
		}
	}
}

function TestRecord(test, passed, message)
{
	this.test = test;
	this.passed = passed;
	this.message = message;
}
{
	TestRecord.prototype.toString = function()
	{
		var returnValue =
			this.test.name + " " 
			+ (this.passed ? "passed." : ("FAILED: " + this.message) );

		return returnValue;
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
		assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInPositiveOctant;
		var collider1 = sphereUnitAtOrigin;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		assertExpectedEqualToActual(true, doCollide);

		var collider0 = meshCubeUnitInNegativeOctant;
		var collider1 = sphereUnitInPositiveOctant;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		assertExpectedEqualToActual(false, doCollide);
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
		assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, shell2To3AtOrigin);
		assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnFirst = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(1, 0, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnFirst);
		assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnFirst);
		assertExpectedEqualToActual(true, doCollide);

		var arc2To3HalfTurnFirstAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnFirst);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnFirstAtOrigin);
		assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnFirstAtOrigin);
		assertExpectedEqualToActual(true, doCollide);

		var wedgeHalfTurnSecond = new Wedge(shell2To3AtOrigin.sphereOuter.center, new Coords(0, 1, 0), .5);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, wedgeHalfTurnSecond);
		assertExpectedEqualToActual(true, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, wedgeHalfTurnSecond);
		assertExpectedEqualToActual(true, doCollide);

		var arc2To3HalfTurnSecondAtOrigin = new Arc(shell2To3AtOrigin, wedgeHalfTurnSecond);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtOrigin, arc2To3HalfTurnSecondAtOrigin);
		assertExpectedEqualToActual(false, doCollide);

		doCollide = collisionHelper.doCollidersCollide(sphereUnitAtX2, arc2To3HalfTurnSecondAtOrigin);
		assertExpectedEqualToActual(true, doCollide);

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
					new Coords(1, 0, 0)
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
				viewCoords.clone()
			).round();

			var areBeforeAndAfterEqual = worldCoordsAfter.equals(worldCoordsBefore);
			var beforeAndAfterAsStrings = 
				"Before:" + worldCoordsBefore.toString()
				+ ", After:" + worldCoordsAfter.toString();
			assertExpectedEqualToActual(true, areBeforeAndAfterEqual, beforeAndAfterAsStrings);
		}
	}
)