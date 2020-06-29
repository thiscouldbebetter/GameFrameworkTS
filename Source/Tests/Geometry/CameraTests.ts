function CameraTests()
{
	// Test fixture.
}
{
	CameraTests.prototype.projection = function()
	{
		var camera = new Camera
		(
			new Coords(100, 100, 1), // viewSize
			100, // focalLength
			new Location
			(
				new Coords(0, 0, -100),
				new Orientation
				(
					new Coords(0, 0, 1),
					new Coords(0, 1, 0)
				)
			)
		);

		var worldCoordsGroupToTransform = 
		[
			new Coords(0, 0, 0), // origin

			new Coords(1, 0, 0),
			new Coords(0, 1, 0),
			new Coords(0, 0, 1),

			new Coords(-1, 0, 0),
			new Coords(0, -1, 0),
			new Coords(0, 0, -1),

			new Coords(1, 2, 3),
		];

		for (var i = 0; i < worldCoordsGroupToTransform.length; i++)
		{
			var worldCoordsBefore = worldCoordsGroupToTransform[i];
			var viewCoords = camera.coordsTransformWorldToView
			(
				worldCoordsBefore.clone()
			);
			var worldCoordsAfter = camera.coordsTransformViewToWorld
			(
				viewCoords
			);
			worldCoordsAfter.round();

			var areBeforeAndAfterEqual = worldCoordsAfter.equals(worldCoordsBefore);
			var beforeAndAfterAsStrings = 
				"Before:" + worldCoordsBefore.toString()
				+ ", After:" + worldCoordsAfter.toString();
			Test.assertExpectedEqualToActual(true, areBeforeAndAfterEqual, beforeAndAfterAsStrings);
		}
	};
}
