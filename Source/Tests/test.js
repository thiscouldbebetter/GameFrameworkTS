
function Test(name, run)
{
	this.name = name;
	this.run = run.bind(this);
}
{
	Test.prototype.assertExpectedEqualToActual = function(expected, actual, message)
	{
		if (expected != actual)
		{
			if (message == null)
			{
				message = "Expected: '" + expected + "', Actual: '" + actual + "'.";
			}
			throw message;
		}
	}
}
