function BoundsTests()
{
	// Test class.
}
{
	BoundsTests.prototype.overlapsWith = function()
	{
		var bounds0 = Bounds.fromMinAndMax(new Coords(19, 22, 0), new Coords(29, 35, 1));
		var bounds1 = Bounds.fromMinAndMax(new Coords(14, 15, 0), new Coords(25, 24, 1));
		var doBoundsOverlap = bounds0.overlapsWith(bounds1);
		if (doBoundsOverlap == false)
		{
			throw "Failed!";
		}
	}
}
