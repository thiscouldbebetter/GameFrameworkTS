
class SampleTests extends TestFixture
{
	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			alwaysPass
		];

		return returnValues;
	}

	alwaysPass(): void
	{
		var expected = "todo";
		var actual = "todo";
		Assert.areEqual(expected, actual);
	}
}
