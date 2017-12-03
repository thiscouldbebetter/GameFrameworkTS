
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
			}
			catch (ex)
			{
				document.write("Test failed: " + this.name + "." + testToRun.name + "<br />");
				throw ex;
			}
		}

		document.write("All tests in test fixture " + this.name + " passed.<br />");
	}
}
