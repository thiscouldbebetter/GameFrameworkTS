
class TestFixture
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	tests(): ( ()=>void )[]
	{
		return null;
	}

	run()
	{
		var tests = this.tests();
		var testCount = tests.length;

		document.write
		(
			"Test fixture '" + this.name
			+ "', containing " + testCount + " tests, running.<br />"
		);

		var testsPassedCount = 0;
		tests.forEach(test =>
		{
			try
			{
				test.call(this);
				testsPassedCount++;
			}
			catch (ex)
			{
				document.write("Test failed: " + test.name + "<br /><br />");
				document.write
				(
					ex.stack + "<br />"
					+ "<br /><br />"
				);
			}
		});

		var testsFailedCount = tests.length - testsPassedCount;

		document.write
		(
			"All "
			+ tests.length
			+ " tests in fixture '" + this.name + "' complete.  "
			+ testsPassedCount
			+ " passed, "
			+ testsFailedCount
			+ " failed.<br /><br />"
		);

	}
}
