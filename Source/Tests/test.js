
function test()
{
	var testAlwaysPass = new Test
	(
		"Always Pass",
		function() { return true; }
	);

	var testAlwaysFail = new Test
	(
		"Always Fail",
		function() { return false; }
	);

	var tests =
	[
		testAlwaysPass,
		//testAlwaysFail,
		testCollisions,
	];

	new TestFixture(tests).runTests();
}

// classes

function TestFixture(tests)
{
	this.tests = tests;
}
{
	// methods

	TestFixture.prototype.runTests = function()
	{
		var testsFailed = [];

		for (var i = 0; i < this.tests.length; i++)
		{
			var testToRun = this.tests[i];
			var testResult = testToRun.run();
			if (testResult != true)
			{
				testsFailed.push(testToRun);
			}
		}

		if (testsFailed.length == 0)
		{
			document.write("All tests passed!")
		}
		else
		{
			document.write("Failed tests:");
			for (var i = 0; i < testsFailed.length; i++)
			{
				var testFailed = testsFailed[i];
				document.write(testFailed.name);
			}
		}
	}
}

function Test(name, run)
{
	this.name = name;
	this.run = run;
}

// tests

var testCollisions = new Test
(
	"Collision",
	function()
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
		if (doCollide == false)
		{
			return false;
		}

		var collider0 = meshCubeUnitInPositiveOctant;
		var collider1 = sphereUnitAtOrigin;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		if (doCollide == false)
		{
			return false;
		}

		var collider0 = meshCubeUnitInNegativeOctant;
		var collider1 = sphereUnitInPositiveOctant;
		var doCollide = collisionHelper.doCollidersCollide(collider0, collider1);
		if (doCollide == true)
		{
			return false;
		}

		return true;
	}
);
