
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

	static fromNameAndRunThen
	(
		name: string,
		runThen: ( testComplete: (testCompleted: Test) => void ) => void
	): Test
	{
		return new Test(name, runThen);
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
