
class SampleTests extends TestFixture
{
	constructor()
	{
		super(SampleTests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.alwaysPass
		];

		return returnValues;
	}

	alwaysPass(): void
	{
		var expected = "todo";
		var actual = "todo";
		Assert.areStringsEqual(expected, actual);
	}
}
