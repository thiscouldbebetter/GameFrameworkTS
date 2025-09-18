
class TestRunner
{
	run(): void
	{
		var testSuite = new TestSuite
		(
			"TestsAll",

			[
				new SampleTests()
			]
		);

		testSuite.run();
	}
}