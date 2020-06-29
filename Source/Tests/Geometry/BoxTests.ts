function BoxTests()
{
	// Test class.
}
{
	BoxTests.prototype.overlapsWith = function()
	{
		var box0 = new Box().fromMinAndMax(new Coords(19, 22, 0), new Coords(29, 35, 1));
		var box1 = new Box().fromMinAndMax(new Coords(14, 15, 0), new Coords(25, 24, 1));
		var doBoxOverlap = box0.overlapsWith(box1);
		if (doBoxOverlap == false)
		{
			throw "Failed!";
		}
	};
}
