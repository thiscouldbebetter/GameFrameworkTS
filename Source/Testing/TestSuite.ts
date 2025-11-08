namespace ThisCouldBeBetter.GameFramework
{

export class TestSuite
{
	name: string;
	testFixtures: TestFixture[];

	constructor(name: string, testFixtures: TestFixture[])
	{
		this.name = name;
		this.testFixtures = testFixtures;
	}

	static fromNameAndTestFixtures(name: string, testFixtures: TestFixture[] ): TestSuite
	{
		return new TestSuite(name, testFixtures);
	}

	static fromTestFixtures(testFixtures: TestFixture[] ): TestSuite
	{
		return new TestSuite(TestSuite.name, testFixtures);
	}

	runThen(testSuiteComplete: (testSuiteCompleted: TestSuite) => void): void
	{
		this.write
		(
			"Running test suite '" + this.name + "', containing "
			+ this.testFixtures.length + " test fixtures."
		);

		var testFixturesCount = this.testFixtures.length;
		var testFixturesCompletedCount = 0;

		var testSuite = this;

		this.testFixtures.forEach
		(
			testFixture =>
			{
				testFixture.runThen
				(
					(testFixtureCompleted: TestFixture) =>
					{
						this.write("Test fixture '" + testFixture.name + "' completed.");
						testFixturesCompletedCount++;
						if (testFixturesCompletedCount >= testFixturesCount)
						{
							this.write
							(
								"All " + this.testFixtures.length
								+ " test fixtures in suite '" + this.name + "' have been run."
							);

							testSuiteComplete(testSuite);
						}
					}
				);
			}
		);
	}

	toDomElement(): HTMLDivElement
	{
		var d = document;

		var testSuiteAsDomElement = d.createElement("div");

		var nameAsDomElement = d.createElement("h1");
		nameAsDomElement.innerHTML = TestSuite.name + " " + this.name;
		testSuiteAsDomElement.appendChild(nameAsDomElement);

		var divTestFixtures = d.createElement("div");
		this.testFixtures.forEach
		(
			x => divTestFixtures.appendChild(x.toDomElement() )
		);
		testSuiteAsDomElement.appendChild(divTestFixtures);

		return testSuiteAsDomElement;
	}

	write(messageToWrite: string): void
	{
		console.log(messageToWrite);
	}
}

}
