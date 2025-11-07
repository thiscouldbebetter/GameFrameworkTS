
class TestRunner
{
	run(): void
	{
		var testSuite = new TestSuite
		(
			"TestsAll",

			[
				// Controls.
				new ControlBuilderTests(),

				// Geometry.
				new CameraTests(),

				// Geometry - Collisions.
				new CollidableTests(),
				new CollisionHelperTests(),

				// Geometry - Constraints.
				new ConstraintTests(),

				// Geometry - Shapes.
				new ArcTests(),
				new BoxAxisAlignedTests(),

				// Storage - CompressorLZW.
				new CompressorLZWTests()
			]
		);

		testSuite.runThen
		(
			(testSuiteCompleted: TestSuite) =>
			{
				console.log("Done.");
			}
		)

	}
}