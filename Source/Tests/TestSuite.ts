namespace ThisCouldBeBetter.GameFramework
{

export class TestSuite
{
	testFixtures: TestFixture[];

	constructor(testFixtures: TestFixture[])
	{
		this.testFixtures = testFixtures;
	}

	run(): void
	{
		this.write
		(
			"Running test suite containing "
			+ this.testFixtures.length + " test fixtures.<br /><br />"
		);

		this.testFixtures.forEach(testFixture =>
		{
			testFixture.run();
		});

		this.write
		(
			"All " + this.testFixtures.length
			+ " test fixtures in suite have been run.<br />"
		);
	}

	write(messageToWrite: string): void
	{
		var d = document;
		var messageAsDomElement = d.createElement("span");
		messageAsDomElement.innerHTML = messageToWrite;
		d.body.appendChild(messageAsDomElement);
	}
}

}
