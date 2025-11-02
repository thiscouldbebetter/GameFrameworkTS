
namespace ThisCouldBeBetter.GameFramework
{

export class TestFixture
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	tests(): Test[]
	{
		return null;
	}

	runThen
	(
		testFixtureComplete: (testFixtureCompleted: TestFixture) => void
	): void
	{
		var tests = this.tests();
		var testsCount = tests.length;

		this.writeInfo
		(
			"Test fixture '" + this.name
			+ "', containing " + testsCount + " tests, running."
		);

		var testsCompletedCount = 0;
		var testsPassedCount = 0;
		var testsFailedCount = 0;

		var testFixture = this;

		tests.forEach(test =>
		{
			try
			{
				test.runThen
				(
					(testCompleted: Test) =>
					{
						testsCompletedCount++;
						testsPassedCount++;

						if (testsCompletedCount >= testsCount)
						{
							var results = 
								"All tests in fixture '" + this.name + "' complete.  "
								+ testsPassedCount + "/" + tests.length
								+ " passed. ";

							this.writeInfo(results);

							if (testsFailedCount > 0)
							{
								var results =
									testsFailedCount
									+ " tests failed!"

								this.writeError(results);
							}

							testFixtureComplete(testFixture);
						}
					}
				);
			}
			catch (ex)
			{
				testsCompletedCount++;
				testsFailedCount++;

				testFixture.writeError("Test failed: " + test.name + ".");
				testFixture.writeError(ex.stack);
			}
		});
	}

	toDomElement(): HTMLDivElement
	{
		var d = document;
		var testFixtureAsDomElement = d.createElement("div");

		var nameAsDomElement = d.createElement("h2");
		nameAsDomElement.innerHTML = TestFixture.name + " " + this.name;
		testFixtureAsDomElement.appendChild(nameAsDomElement);

		var headingTestsInFixture = d.createElement("h3");
		headingTestsInFixture.innerHTML = "Tests in Fixture:";
		testFixtureAsDomElement.appendChild(headingTestsInFixture);

		var divTests = d.createElement("div");

		var tests = this.tests();
		tests.forEach
		(
			test =>
			{
				var testName = test.name;

				var divTest = d.createElement("div");

				var labelName = d.createElement("label");
				labelName.innerHTML = testName;
				divTest.appendChild(labelName);

				var labelStatus = d.createElement("label");
				labelStatus.id = "labelStatus" + testName;
				labelStatus.innerHTML = "";

				var buttonRun = d.createElement("button");
				buttonRun.onclick =	() =>
				{
					try
					{
						labelStatus.innerHTML = "Running.";
						test.runThen
						(
							(testCompleted: Test) =>
							{
								var labelStatusId = "labelStatus" + testCompleted.name;;
								var labelStatus = document.getElementById(labelStatusId);
								labelStatus.innerHTML = "Completed.";
							}
						);
					}
					catch (err)
					{
						var errAsString = err.message + "<br />" + err.stack;
						labelStatus.innerHTML = "Failed: " + errAsString;
					}
				};
				buttonRun.innerHTML = "Run";
				divTest.appendChild(buttonRun);

				divTest.appendChild(labelStatus);

				divTests.appendChild(divTest);
			}
		)
		testFixtureAsDomElement.appendChild(divTests);

		return testFixtureAsDomElement;
	}

	writeMessageInColor(messageToWrite: string, color: string): void
	{
		console.log("%c" + messageToWrite, "color: " + color);
	}

	writeError(messageToWrite: string): void
	{
		this.writeMessageInColor(messageToWrite, "Red");
	}

	writeInfo(messageToWrite: string): void
	{
		this.writeMessageInColor(messageToWrite, "Black");
	}

}

}
