
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

// No tests yet.