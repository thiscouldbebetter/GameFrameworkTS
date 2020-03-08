
function Test()
{
	// Static class.
}
{
	Test.assertExpectedEqualToActual = function(expected, actual, message)
	{
		if (expected != actual)
		{
			if (message == null)
			{
				message = "Expected: '" + expected + "', Actual: '" + actual + "'.";
			}

			console.log("Error running test: " + message);
			console.trace();

			throw message;
		}
	};

	Test.runTestsInFixture = function(testFixture)
	{
		var testFixtureName = testFixture.constructor.name;

		for (var testName in testFixture)
		{
			var testToRun = testFixture[testName];
			if (testToRun.constructor.name == Function.name)
			{
				try
				{
					testToRun.call(testFixture);
				}
				catch (ex)
				{
					console.log("Test failed: " + testFixtureName + "." + testName + ".");
					throw ex;
				}
			}
		}

		console.log("All tests in test fixture " + testFixtureName + " passed.");
	};

	Test.runTestsInFixtures = function(testFixtures)
	{
		for (var i = 0; i < testFixtures.length; i++)
		{
			var testFixture = testFixtures[i];
			Test.runTestsInFixture(testFixture);
		}
	};
}
