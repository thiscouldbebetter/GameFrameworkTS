
namespace ThisCouldBeBetter.GameFramework
{

export class Debug
{
	static doNothing(): void
	{
		// A call to this provides something to set a breakpoint on
		// when doing "var todo = 'todo';" causes the compiler to complain,
		// and console.log() would kill performance.
	}
}

export class DebuggingModeNames
{
	static SkipOpening: string = "SkipOpening";
}

}
