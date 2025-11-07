
namespace ThisCouldBeBetter.GameFramework
{

export class Test
{
	name: string;
	runThen: ( testComplete: (testCompleted: Test) => void ) => void;

	constructor
	(
		name: string,
		runThen: ( testComplete: (testCompleted: Test) => void ) => void
	)
	{
		this.name = name;
		this.runThen = runThen;
	}

	static fromName(name: string): Test
	{
		return new Test(name, null);
	}

	static fromRun
	(
		run: () => void
	)
	{
		var name = run.name; // todo
		var test = Test.fromName(name);
		test.runThenSet
		(
			( testComplete: (testCompleted: Test) => void ) =>
			{
				testComplete(test);
			}
		);
		return test;
	}

	static fromNameAndRunThen
	(
		name: string,
		runThen: ( testComplete: (testCompleted: Test) => void ) => void
	): Test
	{
		return new Test(name, runThen);
	}

	runThenSet(value: ( testComplete: (testCompleted: Test) => void ) => void): Test
	{
		this.runThen = value;
		return this;
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
