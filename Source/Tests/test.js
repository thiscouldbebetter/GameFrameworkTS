
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

		var wedgeForQuadrant1 = new Wedge(new Coords(0, 0, 0), 0, .25);
		var wedgeForQuadrant2 = new Wedge(new Coords(0, 0, 0), .25, .5);

		var shellAtOrigin = new Shell(new Sphere(new Coords(0, 0, 0), 1), .5);
		var shellFarFromOrigin = new Shell(new Sphere(new Coords(100, 100, 100), 1), .5);

		var sphereSmallAtOrigin = new Sphere(new Coords(0, 0, 0), .5);
		var sphereLargeAtOrigin = new Sphere(new Coords(0, 0, 0), 2);
		var sphereInQuadrant1 = new Sphere(new Coords(1, 1, 0), .5);
		var sphereInQuadrant2 = new Sphere(new Coords(-1, 1, 0), .5);
		var sphereInQuadrant3 = new Sphere(new Coords(-1, -1, 0), .5);
		var sphereInQuadrant4 = new Sphere(new Coords(1, -1, 0), .5);
		var sphereFarFromOrigin = new Sphere(new Coords(100, 100, 100), 1);

		var doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant1, sphereSmallAtOrigin);
		if (doCollide == false)
		{
			return false;
		}

		var doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant1, sphereInQuadrant1);
		if (doCollide == false)
		{
			return false;
		}

		var doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant2, sphereInQuadrant2);
		if (doCollide == false)
		{
			return false;
		}

		var doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant1, sphereInQuadrant2);
		if (doCollide == true)
		{
			return false;
		}

		doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant1, sphereInQuadrant3);
		if (doCollide == true)
		{
			return false;
		}
		
		var doCollide = collisionHelper.doCollidersCollide(wedgeForQuadrant1, sphereInQuadrant4);
		if (doCollide == true)
		{
			return false;
		}
		
		var doCollide = collisionHelper.doCollidersCollide(shellAtOrigin, sphereSmallAtOrigin);
		if (doCollide == true)
		{
			return false;
		}

		var doCollide = collisionHelper.doCollidersCollide(shellAtOrigin, sphereLargeAtOrigin);
		if (doCollide == false)
		{
			return false;
		}
		
		var doCollide = collisionHelper.doCollidersCollide(shellAtOrigin, sphereFarFromOrigin);
		if (doCollide == true)
		{
			return false;
		}
		
		var doCollide = collisionHelper.doCollidersCollide(shellFarFromOrigin, sphereFarFromOrigin);
		if (doCollide == false)
		{
			return false;
		}
		
		return true;
	}
);