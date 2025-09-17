
namespace ThisCouldBeBetter.GameFramework
{

export class TestFixture
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	tests(): ( (callback: () => void) => void)[]
	{
		return null;
	}

	run(): void
	{
		var tests = this.tests();
		var testCount = tests.length;

		this.writeInfo
		(
			"Test fixture '" + this.name
			+ "', containing " + testCount + " tests, running."
		);

		var testsPassedCount = 0;
		tests.forEach(test =>
		{
			try
			{
				test.call
				(
					this,
					() => 
					{
						// Do nothing.
					}
				);
				testsPassedCount++;
			}
			catch (ex)
			{
				this.writeError("Test failed: " + test.name + ".");
				this.writeError(ex.stack);
			}
		});

		var testsFailedCount = tests.length - testsPassedCount;

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

		var testFixture = this;

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
						test.call
						(
							testFixture,
							() =>
							{
								var labelStatusId = "labelStatus" + test.name;;
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
