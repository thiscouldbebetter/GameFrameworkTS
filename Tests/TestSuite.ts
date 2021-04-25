
class TestSuite
{
	testFixtures: TestFixture[];

	constructor(testFixtures: TestFixture[])
	{
		this.testFixtures = testFixtures;
	}

	run(): void
	{
		document.write
		(
			"Running test suite containing "
			+ this.testFixtures.length + " test fixtures.<br />"
		);

		this.testFixtures.forEach(testFixture =>
		{
			testFixture.run();
		});

		document.write("All test fixtures in suite have been run.<br />");
	}
}
